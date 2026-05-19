<<<<<<< HEAD
import React, { useEffect, useMemo, useState, useCallback, useRef } from "react";
import { Box, IconButton, Typography, useMediaQuery } from "@mui/material";
import { ArrowBackIos, KeyboardArrowLeft, KeyboardArrowRight } from "@mui/icons-material";
import { useLocation, useNavigate, useParams } from "react-router-dom";
import LandingButton from "../../../components/LandingButton/LandingButton";
import { USER_ROUTES } from "../../../constant/route";
import { safeSetLocalStorage, safeSetSessionStorage } from "../../../lib/storage";
import { saveSlidesToScopes } from "../../../lib/slidesScope";
import { saveSubscriptionPreviewPayload } from "../../../lib/subscriptionPreview";
import { toJpeg, toPng } from "html-to-image";
import { isIosTouchDevice } from "../../../lib/platform";
import { renderTemplateSlideToCanvasWithStats } from "../../../lib/templateSlideCanvas";
import {
  buildGoogleFontsUrls,
  ensureGoogleFontsLoaded,
  getGoogleFontEmbedCss,
  loadGoogleFontsOnce,
} from "../../../constant/googleFonts";

/* ---------- Types ---------- */
type Slide = { id: number; label: string; elements: any[] };

type ArtboardConfig = {
  mmWidth: number;
  mmHeight: number;
  slideLabels?: string[];
};

type NavState = {
  slides?: Slide[];
  config?: ArtboardConfig;
  canvasPx?: { w: number; h: number };
  slideIndex?: number;
  category?: string;
  previewKey?: string;

  // ✅ from TempletEditor (new)
  capturedSlides?: string[];
  mugImage?: string;
};

const TRANSPARENT_PIXEL =
  "data:image/png;base64,iVBORw0KGgoAAAANSUhEUgAAAAEAAAABCAQAAAC1HAwCAAAAC0lEQVR4nGNgYAAAAAMAASsJTYQAAAAASUVORK5CYII=";

const blobToDataUrl = (blob: Blob): Promise<string> =>
  new Promise((resolve, reject) => {
    const fr = new FileReader();
    fr.onload = () => resolve(String(fr.result || ""));
    fr.onerror = reject;
    fr.readAsDataURL(blob);
  });

const toDataUrlSafe = async (src: string): Promise<string> => {
  if (!src || src.startsWith("data:")) return src;
  try {
    const absolute =
      src.startsWith("/") && typeof window !== "undefined" ? `${window.location.origin}${src}` : src;
    const resp = await fetch(absolute, { mode: "cors" });
    if (!resp.ok) return src;
    return await blobToDataUrl(await resp.blob());
  } catch {
    return src;
  }
};

/* ---------- Helpers ---------- */
async function toJpegDataUrl(
  inputDataUrl: string,
  quality = 0.78,
  maxDim = 1600
): Promise<string> {
  if (!inputDataUrl) return "";
  if (inputDataUrl.startsWith("data:image/jpeg")) return inputDataUrl;

  return await new Promise<string>((resolve) => {
    const img = new Image();
    img.crossOrigin = "anonymous";
    img.decoding = "async";
    img.src = inputDataUrl;

    img.onload = () => {
      const nw = img.naturalWidth || 1;
      const nh = img.naturalHeight || 1;

      // ✅ downscale to avoid huge localStorage payload
      const scale = Math.min(1, maxDim / Math.max(nw, nh));
      const w = Math.max(1, Math.round(nw * scale));
      const h = Math.max(1, Math.round(nh * scale));

      const canvas = document.createElement("canvas");
      canvas.width = w;
      canvas.height = h;
      const ctx = canvas.getContext("2d");

      if (!ctx) return resolve(inputDataUrl);

      // white background for jpeg
      ctx.fillStyle = "#fff";
      ctx.fillRect(0, 0, w, h);
      ctx.drawImage(img, 0, 0, w, h);

      try {
        resolve(canvas.toDataURL("image/jpeg", quality));
      } catch {
        resolve(inputDataUrl);
      }
    };

    img.onerror = () => resolve(inputDataUrl);
  });
}
void toJpegDataUrl;

const normalizeFontFamily = (value?: string | null) => {
  const raw = String(value ?? "").trim();
  if (!raw) return "";
  const quoted = raw.match(/['"]([^'"]+)['"]/);
  if (quoted?.[1]) return quoted[1].trim();
  const first = raw.split(",")[0]?.trim() ?? "";
  return first.replace(/^['"]|['"]$/g, "").trim();
};

const resolveTextFontFamily = (entry: any) =>
  normalizeFontFamily(
    entry?.fontFamily ??
      entry?.font_family ??
      entry?.["font-family"] ??
      entry?.fontFamily1 ??
      entry?.fontFamily2 ??
      entry?.fontFamily3 ??
      entry?.fontFamily4 ??
      entry?.style?.fontFamily ??
      entry?.style?.font_family ??
      entry?.style?.["font-family"] ??
      "",
  );

const firstDefinedValue = (...values: any[]) => {
  for (const value of values) {
    if (value === 0 || value === false) return value;
    if (typeof value === "string") {
      if (value.trim()) return value;
      continue;
    }
    if (value != null) return value;
  }
  return undefined;
};

const resolveTextWeight = (entry: any): string | number => {
  const raw = firstDefinedValue(
    entry?.fontWeight,
    entry?.font_weight,
    entry?.["font-weight"],
    entry?.style?.fontWeight,
    entry?.style?.font_weight,
    entry?.style?.["font-weight"],
  );
  if (typeof raw === "number" && Number.isFinite(raw) && raw > 0) return raw;
  if (typeof raw === "string") {
    const trimmed = raw.trim();
    if (!trimmed) return entry?.bold ? 700 : 400;
    const weight = Number(trimmed);
    if (Number.isFinite(weight) && weight > 0) return weight;
    return trimmed;
  }
  return entry?.bold ? 700 : 400;
};

const resolveTextStyle = (entry: any): string => {
  const raw = firstDefinedValue(
    entry?.fontStyle,
    entry?.font_style,
    entry?.["font-style"],
    entry?.style?.fontStyle,
    entry?.style?.font_style,
    entry?.style?.["font-style"],
  );
  if (typeof raw === "string") return raw.trim() || (entry?.italic ? "italic" : "normal");
  return entry?.italic ? "italic" : "normal";
};

const resolveTextDecoration = (entry: any): string => {
  const raw = firstDefinedValue(
    entry?.textDecoration,
    entry?.text_decoration,
    entry?.["text-decoration"],
    entry?.style?.textDecoration,
    entry?.style?.text_decoration,
    entry?.style?.["text-decoration"],
  );
  if (typeof raw === "string") return raw.trim() || "none";
  if (entry?.underline) return "underline";
  return "none";
};

const resolveTextColor = (entry: any): string =>
  String(firstDefinedValue(entry?.color, entry?.fill, entry?.style?.color, entry?.style?.fill, "#111111"));

const resolveTextRotation = (entry: any): number =>
  Number(firstDefinedValue(entry?.rotation, entry?.rotate, entry?.style?.rotation, entry?.style?.rotate, 0)) || 0;

const resolveTextCurve = (entry: any): number =>
  Number(firstDefinedValue(entry?.curve, entry?.arc, entry?.style?.curve, entry?.style?.arc, 0)) || 0;

const collectFontsFromSlides = (slides: Slide[]) => {
  const fonts = new Set<string>();
  slides.forEach((sl) => {
    (sl.elements ?? []).forEach((el: any) => {
      if (String(el?.type ?? "").toLowerCase() !== "text") return;
      const fam = resolveTextFontFamily(el);
      if (!fam) return;
      const lower = fam.toLowerCase();
      if (["serif", "sans-serif", "monospace", "cursive", "fantasy", "system-ui"].includes(lower)) return;
      fonts.add(fam);
    });
  });
  return Array.from(fonts);
};

const GENERIC_FONT_FAMILIES = new Set([
  "serif",
  "sans-serif",
  "monospace",
  "cursive",
  "fantasy",
  "system-ui",
]);

const waitForNextPaint = () =>
  new Promise<void>((resolve) => {
    requestAnimationFrame(() => {
      requestAnimationFrame(() => resolve());
    });
  });


const CategoriesWisePreview: React.FC = () => {
  const { state } = useLocation() as { state?: NavState };
  const { productId } = useParams<{ productId: string }>();
  const navigate = useNavigate();
  const isMobile = useMediaQuery("(max-width:450px)");
  const isIosWebKit = useMemo(() => isIosTouchDevice(), []);
  const isSafariWebKitBrowser = useMemo(() => {
    if (typeof navigator === "undefined") return false;
    const ua = navigator.userAgent || "";
    const isSafari = /Safari/i.test(ua);
    const isOtherEngine =
      /Chrome|CriOS|Chromium|FxiOS|Firefox|EdgiOS|EdgA|OPiOS|OPR|Android/i.test(ua);
    return isSafari && !isOtherEngine;
  }, []);

  const config = state?.config;
  const category = state?.category ?? "";
  const isTransparentCaptureCategory =
    /sticker|bag|tote|clothing|clothes|apparel|notebook/i.test(String(category ?? ""));
  const start = state?.slideIndex ?? 0;
  const slides = useMemo<Slide[]>(() => {
    if (state?.slides?.length) return state.slides;
    try {
      const storedKey = sessionStorage.getItem("templ_preview_key") || "";
      const expectedPrefix = productId ? `${productId}::` : "";
      const stateKey = state?.previewKey || "";
      const keyMatches = stateKey
        ? storedKey === stateKey
        : expectedPrefix
        ? storedKey.startsWith(expectedPrefix)
        : Boolean(storedKey);
      if (!keyMatches) {
        try {
          sessionStorage.removeItem("templ_preview_slides");
          sessionStorage.removeItem("capturedSlides");
          sessionStorage.removeItem("capturedSlidesKey");
          sessionStorage.removeItem("templ_preview_key");
        } catch {}
        return [];
      }
      const stored = sessionStorage.getItem("templ_preview_slides");
      if (stored) return JSON.parse(stored);
    } catch {}
    return [];
  }, [state, productId]);

  const captureKey = useMemo(() => {
    const ids = slides.map((s) => String(s?.id ?? "")).join(",");
    const pid = productId ?? "state";
    return `${pid}::${String(category ?? "")}::${slides.length}::${ids}`;
  }, [category, slides, productId]);
  const slidesScopeKeys = useMemo(
    () => [`preview:${captureKey}`],
    [captureKey],
  );

  // Change to (sessionStorage se fallback bhi add kar sakte ho)
  const captured = useMemo(() => {
    // Priority 1: route state se
    if (state?.capturedSlides?.length) return state.capturedSlides;

    // Priority 2: sessionStorage se
    try {
      const storedKey = sessionStorage.getItem("templ_preview_key") || "";
      const expectedPrefix = productId ? `${productId}::` : "";
      const stateKey = state?.previewKey || "";
      const keyMatches = stateKey
        ? storedKey === stateKey
        : expectedPrefix
        ? storedKey.startsWith(expectedPrefix)
        : Boolean(storedKey);
      if (!keyMatches) return [];
      const storedCaptureKey = sessionStorage.getItem("capturedSlidesKey") || "";
      if (storedCaptureKey && storedCaptureKey !== captureKey) return [];
      const stored = sessionStorage.getItem("capturedSlides");
      if (stored) return JSON.parse(stored);
    } catch { }

    // Fallback to single mug image
    if (state?.mugImage) return [state.mugImage];

    return [];
  }, [state]);

  const [active, setActive] = useState(start);
  const [captureSupportEnabled, setCaptureSupportEnabled] = useState(false);
  const visibleSlidesForFonts = useMemo(() => {
    const current = slides[active];
    return current ? [current] : slides.slice(0, 1);
  }, [active, slides]);

  // Ensure template fonts are loaded so text positioning matches admin editor
  useEffect(() => {
    const fontSlides = captureSupportEnabled ? slides : visibleSlidesForFonts;
    if (!fontSlides.length) return;
    const fonts = collectFontsFromSlides(fontSlides);
    if (!fonts.length) return;
    loadGoogleFontsOnce(buildGoogleFontsUrls(fonts));
  }, [captureSupportEnabled, slides, visibleSlidesForFonts]);

  // book animation
  const [flipDir, setFlipDir] = useState<"next" | "prev">("next");
  const [flipping, setFlipping] = useState(false);

  const hasCaptured = (captured?.length || 0) > 0;
  const slideCount = Math.max(1, hasCaptured ? captured.length : slides.length);
  const [previewScale, setPreviewScale] = useState(1);
  const baseW = Number((config as any)?.fitCanvas?.width ?? config?.mmWidth ?? 1);
  const baseH = Number((config as any)?.fitCanvas?.height ?? config?.mmHeight ?? 1);
  const scaledW = Math.max(1, Math.round(baseW * previewScale));
  const scaledH = Math.max(1, Math.round(baseH * previewScale));

  useEffect(() => {
    const update = () => {
      const vw = typeof window !== "undefined" ? window.innerWidth : 1200;
      const vh = typeof window !== "undefined" ? window.innerHeight : 800;
      const maxW = vw * (isMobile ? 0.92 : 0.8);
      const maxH = vh * 0.72;
      const scale = Math.min(1, maxW / baseW, maxH / baseH);
      setPreviewScale(Number.isFinite(scale) && scale > 0 ? scale : 1);
    };
    update();
    window.addEventListener("resize", update);
    return () => {
      window.removeEventListener("resize", update);
    };
  }, [baseW, baseH, isMobile]);

  // ✅ current/next imgs
  const currentImg = hasCaptured ? captured?.[active] || "" : "";
  const nextIndex = flipDir === "next" ? Math.min(active + 1, slideCount - 1) : Math.max(active - 1, 0);
  const nextImg = hasCaptured ? captured?.[nextIndex] || currentImg : "";
  const currentSlide = !hasCaptured ? slides?.[active] : null;
  const nextSlide = !hasCaptured ? slides?.[nextIndex] : null;

  const renderSlide = useCallback((slide?: Slide) => {
    if (!slide) return null;
    const ordered = [...(slide.elements || [])].sort((a, b) => {
      const zA = Number(a?.zIndex ?? 1) + (a?.type === "text" ? 100000 : 0);
      const zB = Number(b?.zIndex ?? 1) + (b?.type === "text" ? 100000 : 0);
      return zA - zB;
    });
    return (
      <Box sx={{ position: "relative", width: "100%", height: "100%", overflow: "hidden" }}>
        {ordered.map((el: any) => {
          const baseStyle: any = {
            position: "absolute",
            left: el.x,
            top: el.y,
            width: el.width,
            height: el.height,
            zIndex: el.zIndex ?? 1,
          };

          if (el.type === "image") {
            return (
              <Box
                key={el.id}
                component="img"
                src={el.src}
                alt=""
                sx={{ ...baseStyle, objectFit: "cover", display: "block" }}
              />
            );
          }

          if (el.type === "sticker") {
            return (
              <Box
                key={el.id}
                component="img"
                src={el.src}
                alt=""
                sx={{ ...baseStyle, objectFit: "contain", display: "block" }}
              />
            );
          }

          if (el.type === "text") {
            const align = el.align ?? "center";
            const justify =
              align === "left" ? "flex-start" : align === "right" ? "flex-end" : "center";
            const rotation = resolveTextRotation(el);
            const safeRotation = Number.isFinite(rotation) ? rotation : 0;
            const curveRaw = resolveTextCurve(el);
            const curve = Number.isFinite(curveRaw)
              ? Math.max(-200, Math.min(200, curveRaw))
              : 0;
            const hasCurve = Math.abs(curve) > 0.5;
            const safeW = Math.max(1, Number(el?.width ?? 1));
            const safeH = Math.max(1, Number(el?.height ?? 1));
            const curvePx = (curve / 100) * (safeH / 2);
            const midY = safeH / 2;
            const textAnchor = align === "left" ? "start" : align === "right" ? "end" : "middle";
            const startOffset = align === "left" ? "0%" : align === "right" ? "100%" : "50%";
            const curveId = `preview-curve-${slide?.id ?? "s"}-${el?.id ?? "t"}`;
            const lineHeight = Math.max(1, Number(el?.lineHeight ?? el?.line_height ?? 1.16));
            const fontFamily = resolveTextFontFamily(el) || "Arial";
            const fontWeight = resolveTextWeight(el);
            const fontStyle = resolveTextStyle(el);
            const textDecoration = resolveTextDecoration(el);
            const textColor = resolveTextColor(el);
            return (
              <Box
                key={el.id}
                sx={{
                  ...baseStyle,
                  display: "flex",
                  alignItems: "center",
                  justifyContent: justify,
                  textAlign: align,
                  transform: safeRotation ? `rotate(${safeRotation}deg)` : "none",
                  transformOrigin: "center",
                  fontWeight,
                  fontStyle,
                  fontSize: el.fontSize,
                  fontFamily,
                  color: textColor,
                  textDecoration,
                  whiteSpace: "pre-wrap",
                  overflowWrap: "break-word",
                  wordBreak: "break-word",
                  lineHeight: String(lineHeight),
                  overflow: "visible",
                }}
              >
                {hasCurve ? (
                  <Box
                    component="svg"
                    viewBox={`0 0 ${safeW} ${safeH}`}
                    sx={{ width: "100%", height: "100%", overflow: "visible", display: "block" }}
                  >
                    <defs>
                      <path
                        id={curveId}
                        d={`M 0 ${midY} Q ${safeW / 2} ${midY - curvePx} ${safeW} ${midY}`}
                      />
                    </defs>
                    <text
                      fill={textColor}
                      fontFamily={fontFamily}
                      fontSize={Number(el?.fontSize ?? 20)}
                      fontWeight={fontWeight}
                      fontStyle={fontStyle}
                      textDecoration={textDecoration}
                      textAnchor={textAnchor}
                      dominantBaseline="middle"
                      direction="ltr"
                      unicodeBidi="plaintext"
                    >
                      <textPath
                        href={`#${curveId}`}
                        startOffset={startOffset}
                        style={{
                          fill: textColor,
                          fontFamily,
                          fontSize: Number(el?.fontSize ?? 20),
                          fontWeight,
                          fontStyle,
                          textDecoration,
                        }}
                      >
                        {String(el?.text ?? "")}
                      </textPath>
                    </text>
                  </Box>
                ) : (
                  String(el?.text ?? "")
                )}
              </Box>
            );
          }

          return null;
        })}
      </Box>
    );
  }, []);

  const slideNodeRefs = useRef<Record<number, HTMLDivElement | null>>({});
  const setSlideNodeRef = (i: number) => (el: HTMLDivElement | null) => {
    slideNodeRefs.current[i] = el;
  };
  const prefetchedSlidesRef = useRef<string[] | null>(null);
  const prefetchPromiseRef = useRef<Promise<string[]> | null>(null);
  const prefetchOnce = useRef(false);
  const captureFontEmbedCssCacheRef = useRef<Map<string, Promise<string>>>(new Map());
  const shouldPrefetchCapturedSlides = slides.length > 0 && slides.length <= 4;

  useEffect(() => {
    slideNodeRefs.current = {};
    setCaptureSupportEnabled(false);
  }, [captureKey]);

  const resolveCaptureFontEmbedCss = useCallback(async (slidesToCapture: Slide[]) => {
    const normalizedFonts = Array.from(
      new Set(
        collectFontsFromSlides(slidesToCapture)
          .map((font) => normalizeFontFamily(font))
          .filter((font) => font && !GENERIC_FONT_FAMILIES.has(font.toLowerCase())),
      ),
    ).sort();
    if (!normalizedFonts.length) return "";

    const cacheKey = normalizedFonts.join("|");
    const cached = captureFontEmbedCssCacheRef.current.get(cacheKey);
    if (cached) return await cached;

    const promise = getGoogleFontEmbedCss(normalizedFonts).catch(() => "");
    captureFontEmbedCssCacheRef.current.set(cacheKey, promise);
    return await promise;
  }, []);

  const ensureCaptureSupportReady = useCallback(async () => {
    if (!slides.length) return;
    if (!captureSupportEnabled) {
      setCaptureSupportEnabled(true);
    }
    await waitForNextPaint();
    if (Object.keys(slideNodeRefs.current).length < slides.length) {
      await waitForNextPaint();
    }
    const fonts = collectFontsFromSlides(slides);
    if (fonts.length) {
      await ensureGoogleFontsLoaded(buildGoogleFontsUrls(fonts));
    }
    if ((document as any)?.fonts?.ready) {
      try {
        await (document as any).fonts.ready;
      } catch {}
    }
  }, [captureSupportEnabled, slides]);

  const goNext = () => {
    if (active >= slideCount - 1 || flipping) return;
    setFlipDir("next");
    setFlipping(true);
    setTimeout(() => {
      setActive((p) => Math.min(p + 1, slideCount - 1));
      setFlipping(false);
    }, 360);
  };

  const goPrev = () => {
    if (active <= 0 || flipping) return;
    setFlipDir("prev");
    setFlipping(true);
    setTimeout(() => {
      setActive((p) => Math.max(p - 1, 0));
      setFlipping(false);
    }, 360);
  };

  // ✅ Download loading
  const [downloading, setDownloading] = useState(false);

  const captureSlidesFromDom = async (format: "jpeg" | "png", maxDim = 1600) => {
    const out: string[] = [];
    const fontEmbedCSS = await resolveCaptureFontEmbedCss(slides);
    for (let i = 0; i < slides.length; i++) {
      const node = slideNodeRefs.current[i];
      if (!node) continue;
      const rect = node.getBoundingClientRect();
      const maxSide = Math.max(rect.width || 0, rect.height || 0);
      const ratio = maxSide ? maxDim / maxSide : 1.5;
      const pixelRatio = Math.min(2, Math.max(0.5, ratio));
      if (format === "png") {
        const png = await toPng(node, {
          pixelRatio,
          backgroundColor: "transparent",
          cacheBust: false,
          skipFonts: !fontEmbedCSS,
          fontEmbedCSS: fontEmbedCSS || undefined,
        });
        out.push(png);
      } else {
        const jpg = await toJpeg(node, {
          quality: 0.78,
          pixelRatio,
          backgroundColor: "#ffffff",
          cacheBust: false,
          skipFonts: !fontEmbedCSS,
          fontEmbedCSS: fontEmbedCSS || undefined,
        });
        out.push(jpg);
      }
      if (i < slides.length - 1) {
        await new Promise((resolve) => setTimeout(resolve, 0));
      }
    }
    return out;
  };

  const captureSingleSlideFromDom = async (
    index: number,
    format: "jpeg" | "png",
    maxDim = 1200
  ) => {
    const node = slideNodeRefs.current[index];
    if (!node) return "";
    const fontEmbedCSS = await resolveCaptureFontEmbedCss([slides[index]].filter(Boolean) as Slide[]);
    const rect = node.getBoundingClientRect();
    const maxSide = Math.max(rect.width || 0, rect.height || 0);
    const ratio = maxSide ? maxDim / maxSide : 1.5;
    const pixelRatio = Math.min(2, Math.max(0.5, ratio));
    if (format === "png") {
      return await toPng(node, {
        pixelRatio,
        backgroundColor: "transparent",
        cacheBust: false,
        skipFonts: !fontEmbedCSS,
        fontEmbedCSS: fontEmbedCSS || undefined,
      });
    }
    return await toJpeg(node, {
      quality: 0.78,
      pixelRatio,
      backgroundColor: "#ffffff",
      cacheBust: false,
      skipFonts: !fontEmbedCSS,
      fontEmbedCSS: fontEmbedCSS || undefined,
    });
  };
  void captureSingleSlideFromDom;

  const prepareSlideForCanvas = useCallback(async (slide: Slide): Promise<Slide> => {
    const elements = await Promise.all(
      (slide?.elements ?? []).map(async (element: any) => {
        if (element?.type !== "image" && element?.type !== "sticker") return element;
        const src = String(element?.src ?? "");
        return {
          ...element,
          src: (await toDataUrlSafe(src)) || src || TRANSPARENT_PIXEL,
        };
      }),
    );

    return { ...slide, elements };
  }, []);

  const captureSlidesFromCanvasRenderer = useCallback(
    async (format: "jpeg" | "png", maxDim = 1600) => {
      const out: string[] = [];
      const fontUrls = buildGoogleFontsUrls(collectFontsFromSlides(slides));
      if (fontUrls.length) {
        loadGoogleFontsOnce(fontUrls);
        await ensureGoogleFontsLoaded(fontUrls);
      }
      if ((document as any)?.fonts?.ready) {
        try {
          await (document as any).fonts.ready;
        } catch {}
      }

      const maxSide = Math.max(baseW, baseH, 1);
      const ratio = maxSide ? maxDim / maxSide : 1.5;
      const pixelRatio = Math.min(format === "png" ? 3 : 2.5, Math.max(1, ratio));

      for (let i = 0; i < slides.length; i++) {
        const preparedSlide = await prepareSlideForCanvas(slides[i]);
        const result = await renderTemplateSlideToCanvasWithStats(preparedSlide as any, {
          width: baseW,
          height: baseH,
          pixelRatio,
          backgroundColor: format === "png" ? "transparent" : "#ffffff",
        });
        // Keep the raw slide handoff when WebKit produces a text-only partial capture.
        if (result.expectedAssets > 0 && result.drawnAssets < result.expectedAssets) {
          return [];
        }
        const canvas = result.canvas;
        out.push(format === "png" ? canvas.toDataURL("image/png") : canvas.toDataURL("image/jpeg", 0.88));
        if (i < slides.length - 1) {
          await new Promise((resolve) => setTimeout(resolve, 0));
        }
      }

      return out;
    },
    [baseH, baseW, prepareSlideForCanvas, slides],
  );

  const captureSlidesForSubscription = useCallback(
    async (format: "jpeg" | "png", maxDim = 1600) => {
      const preferCanvas = isIosWebKit || isSafariWebKitBrowser;
      if (preferCanvas) {
        const canvasFirst = await captureSlidesFromCanvasRenderer(format, maxDim);
        if (canvasFirst.length) return canvasFirst;
        return await captureSlidesFromDom(format, maxDim);
      }

      const domFirst = await captureSlidesFromDom(format, maxDim);
      if (domFirst.length) return domFirst;
      return await captureSlidesFromCanvasRenderer(format, maxDim);
    },
    [captureSlidesFromCanvasRenderer, captureSlidesFromDom, isIosWebKit, isSafariWebKitBrowser],
  );

  const readCapturedFromStorage = useCallback(() => {
    if (prefetchedSlidesRef.current?.length) {
      return prefetchedSlidesRef.current;
    }
    try {
      const storedKey = sessionStorage.getItem("capturedSlidesKey");
      if (!storedKey || storedKey !== captureKey) return [];
      const stored = sessionStorage.getItem("capturedSlides");
      if (stored) return JSON.parse(stored) as string[];
    } catch {}
    return [];
  }, [captureKey, isIosWebKit]);

  const handleDownload = async () => {
    try {
      setDownloading(true);

      const stored = readCapturedFromStorage();
      let quickList: string[] = stored.length
        ? stored
        : (captured?.length ? captured : currentImg ? [currentImg] : []).filter(Boolean);

      if (isIosWebKit && prefetchPromiseRef.current) {
        const prefetched = await prefetchPromiseRef.current.catch(() => [] as string[]);
        if (prefetched.length) quickList = prefetched;
      }

      if (!quickList.length && slides.length) {
        await ensureCaptureSupportReady();
        const format = isTransparentCaptureCategory ? "png" : "jpeg";
        const maxDim = isTransparentCaptureCategory ? 2400 : 1600;
        quickList = await captureSlidesForSubscription(format, maxDim);
        if (quickList.length) {
          prefetchedSlidesRef.current = quickList;
        }
      }

      const previewOnly = slides.length ? quickList.length < slides.length : quickList.length === 0;
      const slidesObj = Object.fromEntries(
        quickList.map((u: string, idx: number) => [`slide${idx + 1}`, u]),
      );

      (globalThis as any).__slidesCache = slidesObj;
      (globalThis as any).__rawSlidesCache = slides;
      (globalThis as any).__previewConfigCache = config ?? null;
      try {
        sessionStorage.setItem("templ_preview_key", captureKey);
        sessionStorage.setItem("templ_preview_slides", JSON.stringify(slides));
        sessionStorage.setItem("slides_preview_only", previewOnly ? "1" : "0");
        sessionStorage.setItem("rawSlidesCount", String(slides.length || quickList.length || 1));
        if (config) {
          safeSetSessionStorage("templ_preview_config", JSON.stringify(config));
        }
        if (quickList.length) {
          sessionStorage.removeItem("slides");
          void saveSlidesToScopes(slidesScopeKeys, slidesObj);
        } else {
          sessionStorage.removeItem("slides");
        }
        if (quickList.length) {
          const minimal = slidesObj?.slide1 ? JSON.stringify({ slide1: slidesObj.slide1 }) : "{}";
          safeSetLocalStorage("slides_backup", minimal, { clearOnFail: ["slides_backup"] });
        } else {
          localStorage.removeItem("slides_backup");
        }
      } catch {}

      saveSubscriptionPreviewPayload(slidesObj, captureKey);

      navigate(USER_ROUTES.SUBSCRIPTION, {
        state: {
          slides: quickList.length ? slidesObj : undefined,
          previewOnly,
          previewKey: captureKey,
        },
      });
    } catch (e) {
      console.error("Download capture failed:", e);
    } finally {
      setDownloading(false);
    }
  };

  // Prefetch captured slides in idle time to speed up download
  useEffect(() => {
    prefetchedSlidesRef.current = null;
    prefetchPromiseRef.current = null;
    prefetchOnce.current = false;
  }, [captureKey]);

  useEffect(() => {
    if (prefetchOnce.current) return;
    if (hasCaptured || !slides.length || !shouldPrefetchCapturedSlides) return;
    prefetchOnce.current = true;

    let cancelled = false;
    const run = async (): Promise<string[]> => {
      try {
        const existing = readCapturedFromStorage();
        if (existing.length) {
          prefetchedSlidesRef.current = existing;
          return existing;
        }
        if ((document as any)?.fonts?.ready) {
          try {
            await (document as any).fonts.ready;
          } catch {}
        }
        await ensureCaptureSupportReady();
        const format = isTransparentCaptureCategory ? "png" : "jpeg";
        const maxDim = isTransparentCaptureCategory ? 2400 : 1600;
        const list = await captureSlidesForSubscription(format, maxDim);
        if (cancelled || !list.length) return [];
        prefetchedSlidesRef.current = list;
        return list;
      } catch {}
      return [];
    };

    let frameId: number | null = null;
    const startPrefetch = () => {
      if (prefetchPromiseRef.current) return;
      const p = run();
      prefetchPromiseRef.current = p;
      p.catch(() => {});
    };
    frameId = window.requestAnimationFrame(() => {
      if (!cancelled) startPrefetch();
    });

    return () => {
      cancelled = true;
      if (frameId != null) {
        cancelAnimationFrame(frameId);
      }
    };
  }, [
    captureKey,
    captureSlidesForSubscription,
    ensureCaptureSupportReady,
    hasCaptured,
    isTransparentCaptureCategory,
    readCapturedFromStorage,
    shouldPrefetchCapturedSlides,
    slides.length,
  ]);

  /**
   * ✅ Dynamic box sizing (same as before)
   */
  // const [box, setBox] = useState<{ w: number; h: number } | null>(null);

  const computeBoxForImage = useCallback(
    (src: string) => {
      // if (!src) {
      //   setBox(null);
      //   return;
      // }

      const img = new Image();
      img.crossOrigin = "anonymous";
      img.decoding = "async";
      img.src = src;

      img.onload = () => {
        // const nw = img.naturalWidth || 1;
        // const nh = img.naturalHeight || 1;

        // const maxW = Math.floor(window.innerWidth * (isMobile ? 0.5 : 0.5));
        // const maxH = Math.floor(window.innerHeight * 0.5);

        // const scale = Math.min(1, maxW / nw, maxH / nh);

        // setBox({
        //   w: Math.max(1, Math.floor(nw * scale)),
        //   h: Math.max(1, Math.floor(nh * scale)),
        // });
      };

      // img.onerror = () => setBox(null);
    },
    [isMobile]
  );

  useEffect(() => {
    computeBoxForImage(currentImg);
  }, [currentImg, computeBoxForImage]);

  useEffect(() => {
    const onResize = () => computeBoxForImage(currentImg);
    window.addEventListener("resize", onResize);
    return () => window.removeEventListener("resize", onResize);
  }, [currentImg, computeBoxForImage]);

  if (!config) {
    return (
      <Box sx={{ height: "92vh", display: "grid", placeItems: "center" }}>
        <Typography>No preview data.</Typography>
      </Box>
    );
  }

  return (
    <>
      {/* Header */}
      <Box sx={{ display: "flex", justifyContent: "space-between", alignItems: "center", px: 3 }}>
        <Typography
          sx={{
            p: 2,
            display: "flex",
            alignItems: "center",
            color: "blue",
            "&:hover": { textDecoration: "underline", cursor: "pointer" },
          }}
          onClick={() => navigate(-1)}
        >
          <ArrowBackIos fontSize="small" /> exit
        </Typography>

        {/* category size + download */}
        <Box sx={{ display: "flex", alignItems: "center", gap: 2 }}>
          <Box sx={{ textAlign: "right" }}>
            <Typography sx={{ fontWeight: 700, fontSize: 14 }}>{category || "Preview"}</Typography>
          </Box>

          {/* ✅ loading passed here */}
          <LandingButton title="Download" loading={downloading} onClick={handleDownload} />
        </Box>
      </Box>

      {/* Body */}
      <Box
        sx={{
          width: "100%",
          height: "91vh",
          display: "flex",
          alignItems: "center",
          justifyContent: "center",
          bgcolor: "transparent",
          p: 2,
        }}>

        <Box
          sx={{ display: "flex", flexDirection: "column", alignItems: "center", gap: 1.5 }}>
          {/* Preview box */}
          <Box
            sx={{
              width: scaledW,
              height: scaledH,
              overflow: "hidden",
              borderRadius: 3,
              boxShadow: 3,
              perspective: "1400px",
              position: "relative",
            }}
          >
            {/* BOOK */}
            <Box sx={{ position: "absolute", inset: 0, transformStyle: "preserve-3d" }}>
              {/* CURRENT */}
              <Box
                sx={{
                  position: "absolute",
                  inset: 0,
                  backfaceVisibility: "hidden",
                  transformOrigin: flipDir === "next" ? "left center" : "right center",
                  transform:
                    flipping && flipDir === "next"
                      ? "rotateY(-180deg)"
                      : flipping && flipDir === "prev"
                        ? "rotateY(180deg)"
                        : "rotateY(0deg)",
                  transition: "transform 360ms cubic-bezier(0.22, 1, 0.36, 1)",
                }}
              >
                {hasCaptured ? (
                  <Box
                    sx={{
                      width: baseW,
                      height: baseH,
                      transform: `scale(${previewScale})`,
                      transformOrigin: "top left",
                    }}
                  >
                    <Box
                      component="img"
                      src={currentImg}
                      alt="preview"
                      sx={{ width: "100%", height: "100%", objectFit: "contain", display: "block", bgcolor: "transparent" }}
                    />
                  </Box>
                ) : (
                  <Box
                    sx={{
                      width: baseW,
                      height: baseH,
                      transform: `scale(${previewScale})`,
                      transformOrigin: "top left",
                    }}
                  >
                    {renderSlide(currentSlide ?? undefined)}
                  </Box>
                )}
              </Box>

              {/* NEXT (behind) */}
              <Box
                sx={{
                  position: "absolute",
                  inset: 0,
                  backfaceVisibility: "hidden",
                  transformOrigin: flipDir === "next" ? "left center" : "right center",
                  transform: flipDir === "next" ? "rotateY(180deg)" : "rotateY(-180deg)",
                }}
              >
                {hasCaptured ? (
                  <Box
                    sx={{
                      width: baseW,
                      height: baseH,
                      transform: `scale(${previewScale})`,
                      transformOrigin: "top left",
                    }}
                  >
                    <Box
                      component="img"
                      src={nextImg}
                      alt="next"
                      sx={{ width: "100%", height: "100%", objectFit: "contain", display: "block", bgcolor: "transparent" }}
                    />
                  </Box>
                ) : (
                  <Box
                    sx={{
                      width: baseW,
                      height: baseH,
                      transform: `scale(${previewScale})`,
                      transformOrigin: "top left",
                    }}
                  >
                    {renderSlide(nextSlide ?? undefined)}
                  </Box>
                )}
              </Box>

              {/* shadow */}
              {flipping && (
                <Box
                  sx={{
                    position: "absolute",
                    inset: 0,
                    pointerEvents: "none",
                    background:
                      flipDir === "next"
                        ? "linear-gradient(90deg, rgba(0,0,0,0.15), transparent 60%)"
                        : "linear-gradient(270deg, rgba(0,0,0,0.15), transparent 60%)",
                    opacity: 0.9,
                    transition: "opacity 360ms ease",
                  }}
                />
              )}
            </Box>
          </Box>

          {/* Pager */}
          {slideCount >= 2 && (
            <Box sx={{ display: "flex", gap: 1.5, alignItems: "center" }}>
              <IconButton
                onClick={goPrev}
                disabled={active === 0 || flipping}
                sx={{ border: `1px solid ${active === 0 ? "gray" : "#8D6DA1"}`, p: 1 }}
                aria-label="Previous"
              >
                <KeyboardArrowLeft fontSize="large" />
              </IconButton>

              <Typography sx={{ fontSize: 13, opacity: 0.8 }}>
                {active + 1} / {slideCount}
              </Typography>

              <IconButton
                onClick={goNext}
                disabled={active === slideCount - 1 || flipping}
                sx={{ border: `1px solid ${active === slideCount - 1 ? "gray" : "#8D6DA1"}`, p: 1 }}
                aria-label="Next"
              >
                <KeyboardArrowRight fontSize="large" />
              </IconButton>
            </Box>
          )}

        </Box>
      </Box>

      {/* Offscreen slides for download capture (when no pre-captured images) */}
      {captureSupportEnabled && !hasCaptured && slides.length > 0 && (
        <Box sx={{ position: "fixed", left: -10000, top: 0, opacity: 0, pointerEvents: "none" }}>
          {slides.map((sl, i) => (
            <Box
              key={sl.id ?? i}
              ref={setSlideNodeRef(i)}
              sx={{ width: config?.mmWidth ?? "auto", height: config?.mmHeight ?? "auto", position: "relative" }}
            >
              {renderSlide(sl)}
            </Box>
          ))}
        </Box>
      )}
    </>
  );
=======
import React, { useEffect, useMemo, useRef, useState } from "react";
import { Box, IconButton, Typography, useMediaQuery } from "@mui/material";
import { ArrowBackIos, KeyboardArrowLeft, KeyboardArrowRight } from "@mui/icons-material";
import { useLocation, useNavigate } from "react-router-dom";
import LandingButton from "../../../components/LandingButton/LandingButton";
import { toPng } from "html-to-image";
import { USER_ROUTES } from "../../../constant/route";

/* ---------- Types ---------- */
type BaseEl = { id: string; x: number; y: number; width: number; height: number; zIndex?: number; editable?: boolean };
type TextEl = BaseEl & {
    type: "text";
    text: string;
    bold: boolean;
    italic: boolean;
    color: string;
    fontSize: number;
    fontFamily: string;
    align?: "left" | "center" | "right";
};
type ImageEl = BaseEl & { type: "image"; src: string };
type StickerEl = BaseEl & { type: "sticker"; src: string };
type AnyEl = TextEl | ImageEl | StickerEl;
type Slide = { id: number; label: string; elements: AnyEl[] };

type ArtboardConfig = {
    mmWidth: number;
    mmHeight: number;
    slideLabels?: string[];
    maxWidth?: number;
    maxHeight?: number;
    fitCanvas?: { width: number; height: number }; // ✅ if you stored it in config
};

type NavState = {
    slides?: Slide[];
    config?: ArtboardConfig;
    canvasPx?: { w: number; h: number }; // ✅ you already pass this from editor
    slideIndex?: number;
    category?: string;

    // sometimes you might pass full templetDesign row (optional)
    templetDesign?: any;
};

/* ---------- Helpers ---------- */
const TRANSPARENT_PX =
    "data:image/png;base64,iVBORw0KGgoAAAANSUhEUgAAAAEAAAABCAQAAAC1HAwCAAAAC0lEQVR4nGNgYAAAAAMAASsJTYQAAAAASUVORK5CYII=";

async function blobToDataURL(url: string): Promise<string | null> {
    try {
        const resp = await fetch(url);
        if (!resp.ok) return null;
        const blob = await resp.blob();
        return await new Promise<string>((resolve, reject) => {
            const fr = new FileReader();
            fr.onload = () => resolve(String(fr.result));
            fr.onerror = reject;
            fr.readAsDataURL(blob);
        });
    } catch {
        return null;
    }
}

async function ensureDataUrls(slides: Slide[]): Promise<Slide[]> {
    const copy: Slide[] = JSON.parse(JSON.stringify(slides));
    await Promise.all(
        copy.flatMap((sl) =>
            sl.elements.map(async (el) => {
                if ((el.type === "image" || el.type === "sticker") && typeof (el as any).src === "string") {
                    const s = (el as ImageEl | StickerEl).src;
                    if (s?.startsWith("blob:")) {
                        const data = await blobToDataURL(s);
                        if (data) (el as ImageEl | StickerEl).src = data;
                    }
                }
            })
        )
    );
    return copy;
}

/* ---------- Slide DOM (base coords) ---------- */
const SlideView: React.FC<{ slide: Slide, captureRef?: any }> = ({ slide, captureRef }) => {
    const ordered = useMemo(
        () => [...slide.elements].sort((a, b) => (a.zIndex ?? 1) - (b.zIndex ?? 1)),
        [slide.elements]
    );

    return (
        <Box ref={captureRef} sx={{ position: "relative", width: "100%", height: "100%" }}>
            {ordered.map((el) => {
                const style = {
                    position: "absolute" as const,
                    left: el.x,
                    top: el.y,
                    width: el.width,
                    height: el.height,
                    zIndex: el.zIndex ?? 1,
                };

                if (el.type === "image") {
                    const img = el as ImageEl;
                    return (
                        <Box key={el.id} sx={style}>
                            <img
                                src={img.src}
                                alt=""
                                style={{ width: "100%", height: "100%", objectFit: "cover", display: "block" }}
                                crossOrigin="anonymous"
                                loading="eager"
                            />
                        </Box>
                    );
                }

                if (el.type === "sticker") {
                    const s = el as StickerEl;
                    return (
                        <Box
                            key={el.id}
                            component="img"
                            src={s.src}
                            alt=""
                            sx={{ ...style, objectFit: "contain", display: "block", pointerEvents: "none", userSelect: "none" }}
                        />
                    );
                }

                const t = el as TextEl;
                const align = t.align ?? "center";
                const justify =
                    align === "left" ? "flex-start" : align === "right" ? "flex-end" : "center";

                return (
                    <Box key={el.id} sx={style}>
                        <Box
                            sx={{
                                width: "100%",
                                height: "100%",
                                display: "flex",
                                alignItems: "center",
                                justifyContent: justify,
                                px: 1,
                                fontWeight: t.bold ? 700 : 400,
                                fontStyle: t.italic ? "italic" : "normal",
                                fontSize: `${t.fontSize}px`,
                                fontFamily: t.fontFamily || "inherit",
                                color: t.color,
                                // lineHeight: 1.2,
                                whiteSpace: "pre-wrap",
                                overflow: "hidden",
                                userSelect: "none",
                                textAlign: align as any,
                            }}
                        >
                            {t.text}
                        </Box>
                    </Box>
                );
            })}
        </Box>
    );
};

/* ---------- Component ---------- */
const CategoriesWisePreview: React.FC = () => {
    const { state } = useLocation() as { state?: NavState };
    const navigate = useNavigate();
    const isMobile = useMediaQuery("(max-width:480px)");

    const config = state?.config;
    const start = state?.slideIndex ?? 0;

    const initialSlides = state?.slides ?? [];
    const [slides, setSlides] = useState<Slide[]>(initialSlides);
    const [active, setActive] = useState(start);

    // book animation
    const [flipDir, setFlipDir] = useState<"next" | "prev">("next");
    const [flipping, setFlipping] = useState(false);

    useEffect(() => {
        (async () => setSlides(await ensureDataUrls(initialSlides)))();
        // eslint-disable-next-line react-hooks/exhaustive-deps
    }, []);

    if (!config || !slides.length) {
        return (
            <Box sx={{ height: "92vh", display: "grid", placeItems: "center" }}>
                <Typography>No preview data.</Typography>
            </Box>
        );
    }

    // ✅ preview viewport size
    const boxW = isMobile ? 320 : 480;
    const boxH = isMobile ? 440 : 650;

    // ✅ EXACT same logic as editor: coverScale
    // const fit = useMemo(() => coverScale(baseW, baseH, boxW, boxH), [baseW, baseH, boxW, boxH]);

    const slideCount = slides.length;

    const goNext = () => {
        if (active >= slideCount - 1 || flipping) return;
        setFlipDir("next");
        setFlipping(true);
        setTimeout(() => {
            setActive((p) => Math.min(p + 1, slideCount - 1));
            setTimeout(() => setFlipping(false), 50);
        }, 260);
    };

    const goPrev = () => {
        if (active <= 0 || flipping) return;
        setFlipDir("prev");
        setFlipping(true);
        setTimeout(() => {
            setActive((p) => Math.max(p - 1, 0));
            setTimeout(() => setFlipping(false), 50);
        }, 260);
    };

    // capture / download
    const previewRef = useRef<HTMLDivElement | null>(null);
    const [downloading, setDownloading] = useState(false);

    async function captureNode(node: HTMLElement, w: number, h: number) {
        try { await (document as any).fonts?.ready; } catch { }

        const clone = node.cloneNode(true) as HTMLElement;
        clone.querySelectorAll("img").forEach((img) => {
            img.setAttribute("crossorigin", "anonymous");
            (img as HTMLImageElement).decoding = "sync";
            (img as HTMLImageElement).loading = "eager";
        });

        const sandbox = document.createElement("div");
        sandbox.style.position = "fixed";
        sandbox.style.left = "-10000px";
        sandbox.style.top = "-10000px";
        sandbox.style.width = `${w}px`;
        sandbox.style.height = `${h}px`;
        sandbox.style.pointerEvents = "none";
        sandbox.appendChild(clone);
        document.body.appendChild(sandbox);

        clone.style.width = `${w}px`;
        clone.style.height = `${h}px`;
        clone.style.transform = "none";

        try {
            return await toPng(clone, {
                cacheBust: true,
                backgroundColor: "#ffffff",
                pixelRatio: 2,
                width: w,
                height: h,
                imagePlaceholder: TRANSPARENT_PX,
                style: { width: `${w}px`, height: `${h}px`, transform: "none" },
            });
        } finally {
            sandbox.remove();
        }
    }

    async function captureAllPreviews(): Promise<string[]> {
        const out: string[] = [];
        const CAP_W = boxW;
        const CAP_H = boxH;

        for (let i = 0; i < slideCount; i++) {
            setActive(i);
            await new Promise<void>((r) => requestAnimationFrame(() => r()));
            if (previewRef.current) out.push(await captureNode(previewRef.current, CAP_W, CAP_H));
        }
        return out;
    }

    return (
        <>
            {/* Header */}
            <Box sx={{ display: "flex", justifyContent: "space-between", alignItems: "center", px: 3 }}>
                <Typography
                    sx={{ p: 2, display: "flex", alignItems: "center", color: "blue", "&:hover": { textDecoration: "underline", cursor: "pointer" } }}
                    onClick={() => navigate(-1)}
                >
                    <ArrowBackIos fontSize="small" /> exit
                </Typography>

                <Box sx={{ display: "flex", gap: 2 }}>
                    <LandingButton title="Add to basket" variant="outlined" />
                    <LandingButton
                        title="Download"
                        loading={downloading}
                        onClick={async () => {
                            try {
                                setDownloading(true);
                                const urls = await captureAllPreviews();
                                const slidesObj = Object.fromEntries(urls.map((u, i) => [`slide${i + 1}`, u]));
                                sessionStorage.setItem("slides", JSON.stringify(slidesObj));
                                navigate(USER_ROUTES.SUBSCRIPTION);
                            } finally {
                                setDownloading(false);
                            }
                        }}
                    />
                </Box>
            </Box>

            {/* Body */}
            <Box sx={{ display: "flex", flexDirection: "column", alignItems: "center", gap: 1.5 }}>
                {/* PREVIEW BOX (same cover behavior as editor) */}
                <Box
                    // ref={previewRef}
                    sx={{
                        width: boxW,
                        height: boxH,
                        // position: "relative",
                        overflow: "hidden",
                        borderRadius: 2,
                        border: "1px solid rgba(0,0,0,0.12)",
                        // boxShadow: 3,
                        perspective: "1400px",
                    }}
                >
                    {/* Flip container */}
                    <Box
                        sx={{
                            position: "absolute",
                            inset: 0,
                            transformStyle: "preserve-3d",
                            transition: "transform 260ms ease",
                            transform:
                                !flipping
                                    ? "rotateY(0deg)"
                                    : flipDir === "next"
                                        ? "rotateY(-180deg)"
                                        : "rotateY(180deg)",
                        }}
                    >
                        {/* FRONT */}
                        <SlideView slide={slides[active]} captureRef={previewRef} />

                    </Box>
                </Box>

                {/* Pager */}
                {slideCount >= 2 && (
                    <Box sx={{ display: "flex", gap: 1.5, alignItems: "center" }}>
                        <IconButton
                            onClick={goPrev}
                            disabled={active === 0 || flipping}
                            sx={{ border: `1px solid ${active === 0 ? "gray" : "#8D6DA1"}`, p: 1 }}
                            aria-label="Previous"
                        >
                            <KeyboardArrowLeft fontSize="large" />
                        </IconButton>
                        <IconButton
                            onClick={goNext}
                            disabled={active === slideCount - 1 || flipping}
                            sx={{ border: `1px solid ${active === slideCount - 1 ? "gray" : "#8D6DA1"}`, p: 1 }}
                            aria-label="Next"
                        >
                            <KeyboardArrowRight fontSize="large" />
                        </IconButton>
                    </Box>
                )}
            </Box >
        </>
    );
>>>>>>> 8c992743900e1e9073f6cca2f5700ab2ef0bf4c0
};

export default CategoriesWisePreview;
