import { Box, Typography } from "@mui/material";
import { useSlide3 } from "../../../../../context/Slide3Context";
import QrGenerator from "../../../../../components/QR-code/Qrcode";
type AnyEl = Record<string, any>;

const safeClip = (cp?: string | null) => (cp && typeof cp === "string" ? cp : "none");
const safeFilter = (f?: string | null) => (f && typeof f === "string" ? f : "none");
const val = <T,>(v: T | undefined, d: T) => (v === undefined || v === null ? d : v);
<<<<<<< HEAD
const normalizeUrl = (value: any) => {
  if (typeof value === "string") return value.trim();
  if (value && typeof value === "object" && typeof value.url === "string") return value.url.trim();
  return "";
};
const pickSlide3Style = (entry: AnyEl, key: string, fallback: any) => {
  const candidates = [
    entry?.[`${key}3`],
    entry?.[key],
    entry?.[`${key}1`],
    entry?.[`${key}2`],
    entry?.[`${key}4`],
  ];
  for (const value of candidates) {
    if (value === 0 || value === false) return value;
    if (typeof value === "string") {
      if (value.trim()) return value;
      continue;
    }
    if (value != null) return value;
  }
  return fallback;
};
=======

>>>>>>> 8c992743900e1e9073f6cca2f5700ab2ef0bf4c0
type Slide3Props = {
  ref?: any
}
const Slide3 = (props:Slide3Props) => {
  const {
    texts3,
    oneTextValue3,
    multipleTextValue3,
    draggableImages3,
    fontColor3,
    fontFamily3,
    fontSize3,
    fontWeight3,
    selectedImg3,
    verticalAlign3,
    selectedVideoUrl3,
    qrPosition3,
    textAlign3,
    selectedLayout3,
    selectedAudioUrl3,
    qrAudioPosition3,
<<<<<<< HEAD
    showOneTextRightSideBox3,
=======
>>>>>>> 8c992743900e1e9073f6cca2f5700ab2ef0bf4c0
    textElements3,
    selectedAIimageUrl3,
    selectedStickers3,
    isAIimage3,
    aimage3,
    letterSpacing3,
    lineHeight3,
    layout3,
    // bgImage3,
    bgColor3,
  } = useSlide3();
  const {ref} = props
<<<<<<< HEAD
  const isOneTextActive = selectedLayout3 === "oneText" || showOneTextRightSideBox3;
  const videoUrl = normalizeUrl(selectedVideoUrl3);
  const audioUrl = normalizeUrl(selectedAudioUrl3);
  const qrVideoUrl = normalizeUrl(qrPosition3?.url) || videoUrl;
  const qrAudioUrl = normalizeUrl(qrAudioPosition3?.url) || audioUrl;
=======
>>>>>>> 8c992743900e1e9073f6cca2f5700ab2ef0bf4c0
  return (
    <Box
    ref={ref}
      sx={{
        position: "relative",
<<<<<<< HEAD
        width: "100%",
=======
        width: 485,
>>>>>>> 8c992743900e1e9073f6cca2f5700ab2ef0bf4c0
        height: "100%",
        overflow: "hidden",
        borderRadius: 2,
        backgroundColor:bgColor3 ?? "transparent",
        // backgroundImage: bgImage3 ? `url(${bgImage3})` : "none",
        backgroundSize: "cover",
        backgroundRepeat: "no-repeat",
        backgroundPosition: "center",
      }}
    >
      {layout3 && (
<<<<<<< HEAD
        <Box sx={{ width: "100%", height: "100%", position: "relative" }}>
=======
        <Box sx={{ width: "100%", height: "100%", position: "relative", p: 1 }}>
>>>>>>> 8c992743900e1e9073f6cca2f5700ab2ef0bf4c0
          {/* IMAGES / BG ELEMENTS */}
          {layout3?.elements
            ?.slice()
            .sort((a: AnyEl, b: AnyEl) => (val(a.zIndex, 1) - val(b.zIndex, 1)))
            .map((el: AnyEl) => (
              <Box
                key={el.id}
                sx={{
                  position: "absolute",
                  left: val(el.x, 0),
                  top: val(el.y, 0),
                  width: val(el.width, 0),
                  height: val(el.height, 0),
                  borderRadius: 1,
                  // must be visible so clipPath can show outside rectangular bounds if needed
                  overflow: "visible",
                  zIndex: val(el.zIndex, 1),
                }}
              >
                <Box
                  component="img"
                  src={el.src || undefined}
                  sx={{
                    width: "100%",
                    height: "100%",
<<<<<<< HEAD
                    objectFit: el.id === "bg-image" ? "cover" : (el.objectFit || "fill"),
=======
                    objectFit: el.objectFit || "cover",
>>>>>>> 8c992743900e1e9073f6cca2f5700ab2ef0bf4c0
                    borderRadius: 1,
                    display: "block",
                    pointerEvents: "none",
                    // visual treatments
                    filter: safeFilter(el.filter || el.cssFilter),
                    transform: `rotate(${val(el.rotation, 0)}deg)`,
                    transformOrigin: "center center",
                    // shape support
                    clipPath: safeClip(el.clipPath || el.shapePath),
                    WebkitClipPath: safeClip(el.clipPath || el.shapePath),
                    // optional blend mode / opacity
                    mixBlendMode: el.blendMode || "normal",
                    opacity: el.opacity !== undefined ? el.opacity : 1,
                  }}
                />
              </Box>
            ))}

          {/* TEXTS */}
          {layout3.textElements
            ?.slice()
            .sort((a: AnyEl, b: AnyEl) => (val(a.zIndex, 2) - val(b.zIndex, 2)))
            .map((te: AnyEl) => {
              const hAlign =
                te.textAlign === "left" ? "flex-start" : te.textAlign === "right" ? "flex-end" : "center";
              const vAlign =
                te.verticalAlign === "top" ? "flex-start" : te.verticalAlign === "bottom" ? "flex-end" : "center";

              return (
                <Box
                  key={te.id}
                  sx={{
                    position: "absolute",
                    left: val(te.x, 0),
                    top: val(te.y, 0),
                    width: val(te.width, 0),
                    height: val(te.height, 0),
                    display: "flex",
                    justifyContent: hAlign,
                    alignItems: vAlign,
                    // typography
                    color: te.color || "#000",
                    fontSize: val(te.fontSize, 16),
                    fontFamily: te.fontFamily || "Roboto, sans-serif",
                    fontWeight: te.bold ? 700 : val(te.fontWeight, 400),
                    fontStyle: te.italic ? "italic" : "normal",
                    letterSpacing: te.letterSpacing !== undefined ? te.letterSpacing : 0,
                    lineHeight: te.lineHeight !== undefined ? te.lineHeight : 1.2,
                    textTransform: te.uppercase ? "uppercase" : "none",
                    textAlign: te.textAlign || "center",
                    whiteSpace: "pre-wrap",
                    wordBreak: "break-word",
                    // transforms
                    transform: `rotate(${val(te.rotation, 0)}deg)`,
                    transformOrigin: "center center",
                    zIndex: val(te.zIndex, 2),
                    pointerEvents: "none",
                  }}
                >
                  {te.text || ""}
                </Box>
              );
            })}

          {/* STICKERS */}
          {layout3.stickers
            ?.slice()
            .sort((a: AnyEl, b: AnyEl) => (val(a.zIndex, 50) - val(b.zIndex, 50)))
            .map((st: AnyEl) => (
              <Box
                key={st.id}
                sx={{
                  position: "absolute",
                  left: val(st.x, 0),
                  top: val(st.y, 0),
                  width: val(st.width, 0),
                  height: val(st.height, 0),
                  borderRadius: 1,
                  zIndex: val(st.zIndex, 50),
                  pointerEvents: "none",
                }}
              >
                <Box
                  component="img"
                  src={st.sticker}
                  sx={{
                    width: "100%",
                    height: "100%",
                    objectFit: "contain",
                    borderRadius: 1,
                    // visual treatments
                    filter: safeFilter(st.filter || st.cssFilter),
                    transform: `rotate(${val(st.rotation, 0)}deg)`,
                    transformOrigin: "center center",
                    // shapes for sticker if provided
                    clipPath: safeClip(st.clipPath || st.shapePath),
                    WebkitClipPath: safeClip(st.clipPath || st.shapePath),
                    mixBlendMode: st.blendMode || "normal",
                    opacity: st.opacity !== undefined ? st.opacity : 1,
                  }}
                />
              </Box>
            ))}
        </Box>
      )}

<<<<<<< HEAD
      {videoUrl && (
=======
      {selectedVideoUrl3 && (
>>>>>>> 8c992743900e1e9073f6cca2f5700ab2ef0bf4c0
        <Box
          sx={{
            position: "absolute", // use absolute like Rnd
            top: qrPosition3.y,
            left: qrPosition3.x,
            width: 300,       // ✅ match the image width
            height: 200,
            display: "flex",
            justifyContent: "center",
            alignItems: "flex-end",
            textAlign: "center",
            zIndex: qrPosition3.zIndex || 1,
          }}
        >
          {/* Background Image */}
          <Box
            component="img"
            src="/assets/images/video-qr-tips.png"
            sx={{
              width: 300,       // ✅ match the image width
              height: 200,
              objectFit: "fill",
              borderRadius: "6px",
            }}
          />

          {/* QR Code */}
          <Box
            sx={{
              position: "absolute",
              top: 50,
              height: 10,
              width: 15,
              left: { md: 2, sm: 27, xs: 25 },
              borderRadius: 2,
            }}
          >
<<<<<<< HEAD
            <QrGenerator url={qrVideoUrl} size={70} />
=======
            <QrGenerator
              url={qrPosition3.url || selectedVideoUrl3}
              size={Math.min(68, 75)}
            />
>>>>>>> 8c992743900e1e9073f6cca2f5700ab2ef0bf4c0
          </Box>

          {/* Clickable Link */}
          <a
<<<<<<< HEAD
            href={videoUrl}
=======
            href={`${selectedVideoUrl3}`}
>>>>>>> 8c992743900e1e9073f6cca2f5700ab2ef0bf4c0
            target="_blank"
            rel="noopener noreferrer"
          >
            <Typography
              sx={{
                position: "absolute",
                top: 78,
                right: { md: 0, sm: 30, xs: 30 },
                zIndex: 99,
                color: "black",
                fontSize: "10px",
                width: "105px",
                cursor: "pointer",
                "&:hover": { textDecoration: "underline" },
              }}
            >
<<<<<<< HEAD
              {`${videoUrl.slice(0, 20)}.....`}
=======
              {`${selectedVideoUrl3?.slice(0, 20)}.....`}
>>>>>>> 8c992743900e1e9073f6cca2f5700ab2ef0bf4c0
            </Typography>
          </a>
        </Box>
      )}

<<<<<<< HEAD
      {audioUrl && (
=======
      {selectedAudioUrl3 && (
>>>>>>> 8c992743900e1e9073f6cca2f5700ab2ef0bf4c0
        <Box
          sx={{
            position: "absolute", // use absolute like Rnd
            top: qrAudioPosition3.y,
            left: qrAudioPosition3.x,
            width: 300,       // ✅ match the image width
            height: 200,
            display: "flex",
            justifyContent: "center",
            alignItems: "flex-end",
            textAlign: "center",
            zIndex: qrAudioPosition3.zIndex || 1,
          }}
        >
          {/* Background Image */}
          <Box
            component="img"
<<<<<<< HEAD
            src="/assets/images/audio-qr-tips.png"
=======
            src="/assets/images/video-qr-tips.png"
>>>>>>> 8c992743900e1e9073f6cca2f5700ab2ef0bf4c0
            sx={{
              width: 300,       // ✅ match the image width
              height: 200,
              objectFit: "fill",
              borderRadius: "6px",
            }}
          />

          {/* QR Code */}
          <Box
            sx={{
              position: "absolute",
              top: 50,
              height: 10,
              width: 15,
              left: { md: 2, sm: 27, xs: 25 },
              borderRadius: 2,
            }}
          >
<<<<<<< HEAD
            <QrGenerator url={qrAudioUrl} size={70} />
=======
            <QrGenerator
              url={qrAudioPosition3.url || selectedAudioUrl3}
              size={Math.min(68, 75)}
            />
>>>>>>> 8c992743900e1e9073f6cca2f5700ab2ef0bf4c0
          </Box>

          {/* Clickable Link */}
          <a
<<<<<<< HEAD
            href={audioUrl}
=======
            href={`${selectedAudioUrl3}`}
>>>>>>> 8c992743900e1e9073f6cca2f5700ab2ef0bf4c0
            target="_blank"
            rel="noopener noreferrer"
          >
            <Typography
              sx={{
                position: "absolute",
                top: 78,
                right: { md: 0, sm: 30, xs: 30 },
                zIndex: 99,
                color: "black",
                fontSize: "10px",
                width: "105px",
                cursor: "pointer",
                "&:hover": { textDecoration: "underline" },
              }}
            >
<<<<<<< HEAD
              {`${audioUrl.slice(0, 20)}.....`}
=======
              {`${selectedAudioUrl3?.slice(0, 20)}.....`}
>>>>>>> 8c992743900e1e9073f6cca2f5700ab2ef0bf4c0
            </Typography>
          </a>
        </Box>
      )}

      {/* 🖼️ Only selected images */}
      {draggableImages3
        .filter((img: any) => selectedImg3?.includes(img.id))
        // .sort((a: any, b: any) => (a.zIndex || 0) - (b.zIndex || 0))
        .map((img: any) => (
          <Box
            key={img.id}
            component="img"
            src={img.src}
            sx={{
              position: "absolute",
              width: img.width,
              height: img.height,
              left: img.x,
              top: img.y,
              transform: `rotate(${img.rotation || 0}deg)`,
              transformOrigin: "center center",
              borderRadius: 2,
              objectFit: "cover",
              zIndex: img.zIndex || 1,
              filter: img.filter
            }}
          />
        ))}

      {multipleTextValue3 &&
<<<<<<< HEAD
        texts3.map((e: any, index: number) => {
          const textAlignRaw = String(
            pickSlide3Style(e, "textAlign", e?.textAlign ?? "center")
          ).toLowerCase();
          const textAlign =
            textAlignRaw === "start"
              ? "left"
              : textAlignRaw === "end"
                ? "right"
                : textAlignRaw;
          const verticalAlign = String(
            pickSlide3Style(e, "verticalAlign", e?.verticalAlign ?? "top")
          ).toLowerCase();

          return (
            <Box
              key={index}
              sx={{
                position: "absolute",
                left: 8,
                right: 8,
                top: 8 + index * 220, // stack blocks like editor; adjust spacing
                height: 210,
                borderRadius: "6px",
                display: "flex",
                alignItems:
                  verticalAlign === "top"
                    ? "flex-start"
                    : verticalAlign === "center"
                      ? "center"
                      : "flex-end",
                justifyContent:
                  textAlign === "left"
                    ? "flex-start"
                    : textAlign === "right"
                      ? "flex-end"
                      : "center",
                p: 1,
                zIndex: 9999,
                pointerEvents: "none",
              }}
            >
              <Typography
                sx={{
                  fontSize: Number(pickSlide3Style(e, "fontSize", 16)),
                  fontWeight: pickSlide3Style(e, "fontWeight", 400),
                  color: String(pickSlide3Style(e, "fontColor", "#000")),
                  fontFamily: String(pickSlide3Style(e, "fontFamily", "Roboto, sans-serif")),
                  textAlign,
                  lineHeight: pickSlide3Style(e, "lineHeight", 1.2),
                  letterSpacing: pickSlide3Style(e, "letterSpacing", 0),
                  width: "100%",
                  whiteSpace: "pre-wrap",
                  wordBreak: "break-word",
                }}
              >
                {e.value}
              </Typography>
            </Box>
          );
        })}

      {/* 📝 Single Text Layout */}
      {isOneTextActive && (
        <Box
          sx={{
            position: "absolute",
            inset: 0,
=======
        texts3.map((e, index) => (
          <Box
            key={index}
            sx={{
              position: "relative",
              height: { md: 210, sm: "175px", xs: "175px" }, // ✅ match editable container height
              width: "100%",
              mb: 2,
              display: "flex",
              justifyContent:
                e.verticalAlign === "top"
                  ? "flex-start"
                  : e.verticalAlign === "center"
                    ? "center"
                    : "flex-end",
              alignItems: "center",
              border: "3px dashed transparent", // ✅ visually matches editable version but invisible
              borderRadius: "6px",
              p: 1,
            }}
          >
            <Typography
              sx={{
                textAlign: e.textAlign,
                fontSize: e.fontSize3,
                fontWeight: e.fontWeight3,
                color: e.fontColor3,
                fontFamily: e.fontFamily3,
                lineHeight: e.lineHeight,
                letterSpacing: e.letterSpacing,
                wordBreak: "break-word",
                whiteSpace: "pre-line",
                width: "100%",
                height: "80%",
                display: "flex",
                alignItems:
                  e.verticalAlign === "top"
                    ? "flex-start"
                    : e.verticalAlign === "bottom"
                      ? "flex-end"
                      : "center",
                justifyContent:
                  e.textAlign === "left"
                    ? "flex-start"
                    : e.textAlign === "right"
                      ? "flex-end"
                      : "center",
                m: "auto",
              }}
            >
              {e.value}
            </Typography>
          </Box>
        ))}

      {/* 📝 Single Text Layout */}
      {selectedLayout3 === "oneText" && (
        <Box
          sx={{
>>>>>>> 8c992743900e1e9073f6cca2f5700ab2ef0bf4c0
            display: "flex",
            flexDirection: "column",
            justifyContent:
              verticalAlign3 === "top"
                ? "flex-start"
                : verticalAlign3 === "center"
                  ? "center"
                  : "flex-end",
            alignItems:
              textAlign3 === "start"
                ? "flex-start"
                : textAlign3 === "center"
                  ? "center"
                  : "flex-end",
            height: "100%",
            width: "100%",
            color: fontColor3,
            lineHeight: lineHeight3,
            letterSpacing: letterSpacing3,
            fontFamily: fontFamily3,
            fontSize: fontSize3,
            fontWeight: fontWeight3,
            textAlign: textAlign3, // ✅ still needed for multiline/inline text
            whiteSpace: "pre-wrap",
            p: 1,
<<<<<<< HEAD
            zIndex: 9998,
=======
>>>>>>> 8c992743900e1e9073f6cca2f5700ab2ef0bf4c0
          }}
        >
          {oneTextValue3}
        </Box>
      )}

      {
<<<<<<< HEAD
        multipleTextValue3 || isOneTextActive ? null : (
=======
        multipleTextValue3 && selectedLayout3 === "oneText" ? null : (
>>>>>>> 8c992743900e1e9073f6cca2f5700ab2ef0bf4c0
          <>
            {textElements3 &&
              textElements3.map((e) => (
                <Typography
                  key={e.id}
                  sx={{
                    fontSize: e.fontSize,
                    color: e.fontColor,
                    fontFamily: e.fontFamily,
                    fontWeight: e.fontWeight,
                    textAlign: e.textAlign || "center",
                    position: "absolute",
                    left: e.position.x,
                    top: e.position.y,
                    width: e.size.width,
                    height: e.size.height,
                    display: "flex",
                    zIndex: e.zIndex,
                    lineHeight: e.lineHeight ?? 1.5,
                    letterSpacing: `${e.letterSpacing ?? 0}px`,
                    transform: `rotate(${e.rotation}deg)`,
                    justifyContent: e.textAlign ?? "center",
                    alignItems: e.verticalAlign ?? "top",
                    padding: "5px",
                    whiteSpace: "pre-line", // ⭐ FIX: Show line breaks
                    cursor: "text",
                  }}
                >
                  {e.value}
                </Typography>
              ))}</>
        )
      }

      {isAIimage3 && (
        <img
          src={`${selectedAIimageUrl3}`}
          alt="AIimage"
          style={{
            position: "absolute", // 👈 so it can use top/left
            left: aimage3.x, // 👈 saved x position
            top: aimage3.y, // 👈 saved y position
            width: `${aimage3.width}px`, // 👈 saved width
            height: `${aimage3.height}px`, // 👈 saved height
            objectFit: "fill",
            zIndex: 10,
            pointerEvents: "none", // 👈 prevents accidental clicking
          }}
        />
      )}

      {/* 🧷 Preview Stickers */}
      {selectedStickers3.map((sticker) => (
        <Box
          key={sticker.id}
          component="img"
          src={sticker.sticker}
          sx={{
            position: "absolute",
            left: sticker.x, // 👈 position
            top: sticker.y, // 👈 position
            width: `${sticker.width}px`, // 👈 width
            height: `${sticker.height}px`, // 👈 height
            objectFit: "contain",
            zIndex: sticker.zIndex,
            transform: `rotate(${sticker.rotation || 0}deg)`,
            pointerEvents: "none", // so it can’t be clicked
          }}
        />
      ))}
    </Box>
  );
};

export default Slide3;
