<<<<<<< HEAD
import { useEffect, useMemo, useRef, useState } from "react";
import { Box, CircularProgress, IconButton, Typography, useMediaQuery } from "@mui/material";
import { useTheme } from "@mui/material/styles";
import { ArrowBackIos, ArrowForwardIos } from "@mui/icons-material";
import { Swiper, SwiperSlide } from "swiper/react";
import { FreeMode, Mousewheel } from "swiper/modules";
import type { Swiper as SwiperType } from "swiper";
import { useNavigate } from "react-router-dom";
import { useQuery } from "@tanstack/react-query";
import { COLORS } from "../../constant/color";
import BasketCard from "../BasketCard/BasketCard";
import "swiper/css";
import { supabase } from "../../supabase/supabase";

type Props = { title?: string; description?: string };

const lc = (v: unknown) => String(v ?? "").trim().toLowerCase();

const normalizePoster = (v?: string) => {
  if (!v) return "";
  const s = String(v).trim();
  if (s.startsWith("data:image/")) return s;

  // raw base64 -> make DataURL
  if (/^[A-Za-z0-9+/=\s]+$/.test(s) && s.length > 200) {
    return `data:image/png;base64,${s.replace(/\s/g, "")}`;
  }

  return s;
};

type CategoryTile = { name: string; poster?: string };

async function fetchCategoriesLight(): Promise<any[]> {
  const { data, error } = await supabase
    .from("categories")
    .select("id,name,image_base64")
    .order("created_at", { ascending: false });
  if (error) throw error;
  return data ?? [];
};

const BasketSliderNoTabs = ({ title, description }: Props) => {
  const navigate = useNavigate();
  const theme = useTheme();
  const isMobile = useMediaQuery(theme.breakpoints.down("sm"));

  const [swiper, setSwiper] = useState<SwiperType | null>(null);
  const [isBeginning, setIsBeginning] = useState(true);
  const [isEnd, setIsEnd] = useState(false);
  const [activeIndex, setActiveIndex] = useState(0);
  const navItemRefs = useRef<Record<number, HTMLDivElement | null>>({});

  // ✅ Categories (includes image_base64 because select("*"))
  const { data: categories = [], isLoading: loadingCats } = useQuery({
    queryKey: ["allCategories"],
    queryFn: fetchCategoriesLight,
    staleTime: 1000 * 60 * 60,
    refetchOnWindowFocus: false,
  });

  const categoryTiles = useMemo<CategoryTile[]>(() => {
    // Prefer categories table image_base64
    const map = new Map<string, CategoryTile>();

    for (const c of categories as any[]) {
      const name = String(c?.name ?? "").trim();
      if (!name) continue;

      const key = lc(name);
      const poster =
        normalizePoster(c?.image_base64) ||
        normalizePoster(c?.image) ||
        normalizePoster(c?.img_url);

      map.set(key, { name, poster: poster || undefined });
    }
    return Array.from(map.values()).sort((a, b) => a.name.localeCompare(b.name));
  }, [categories]);

  const isLoading = loadingCats;

  const updateEdges = (s: SwiperType) => {
    setIsBeginning(s.isBeginning);
    setIsEnd(s.isEnd);
    setActiveIndex(s.realIndex ?? 0);
  };

  useEffect(() => {
    if (!isMobile) return;
    const node = navItemRefs.current[activeIndex];
    if (!node) return;
    node.scrollIntoView({ behavior: "smooth", inline: "center", block: "nearest" });
  }, [activeIndex, isMobile]);

  const goToCategory = (name: string) => {
    const n = String(name ?? "").trim();
    if (!n) return;
    navigate(`/view-all/${encodeURIComponent(n)}`, { state: { categoryName: n } });
=======
import { useEffect, useMemo, useState } from "react";
import { Box, CircularProgress, IconButton, Typography } from "@mui/material";
import { ArrowBackIos, ArrowForwardIos } from "@mui/icons-material";
import { Swiper, SwiperSlide } from "swiper/react";
import { Navigation } from "swiper/modules";
import "swiper/css";
import "swiper/css/navigation";

import LandingButton from "../LandingButton/LandingButton";
import { COLORS } from "../../constant/color";
import BasketCard from "../BasketCard/BasketCard";
import { useQuery } from "@tanstack/react-query";
import { USER_ROUTES } from "../../constant/route";
import { useNavigate } from "react-router-dom";
import { fetchAllCardsFromDB, fetchAllCategoriesFromDB, fetchAllTempletDesigns } from "../../source/source";
import useModal from "../../hooks/useModal";
import ProductPopup, { type CategoryType } from "../ProductPopup/ProductPopup";

type Props = {
  title?: string;
  description?: string;
  brandSlider?: boolean;
  saleSlide?: boolean;
  clothing?: boolean;
};

const hasSale = (v: any) => {
  if (v == null) return false;
  const s = String(v).trim();
  if (!s) return false;
  const n = Number(s.replace(/[^\d.]/g, "")); // handles "£12"
  return Number.isFinite(n) && n > 0;
};


const BasketSlider = ({ title, description, brandSlider, saleSlide, clothing }: Props) => {
  const navigate = useNavigate();
  const [activeTab, setActiveTab] = useState(0);
  const [selectedCate, setSelectedCate] = useState<CategoryType | undefined>();

  const { open: isDetailModal, openModal: openDetailModal, closeModal: closeDetailModal } = useModal();

  const { data: basketCards = [], isLoading: loadingTemplets } = useQuery({
    queryKey: ["templetDesign"],
    queryFn: fetchAllTempletDesigns,
  });

  const { data: allCards = [], isLoading: loadingCards } = useQuery({
    queryKey: ["cards"],
    queryFn: fetchAllCardsFromDB,
  });

  const { data: tabsCategories = [] } = useQuery<any[]>({
    queryKey: ["tabsCategories"],
    queryFn: fetchAllCategoriesFromDB,
    staleTime: 1000 * 60 * 60,
    gcTime: 1000 * 60 * 60,
    refetchOnWindowFocus: false,
    refetchOnReconnect: false,
  });


  const allProducts = useMemo(() => {
    return [
      ...(basketCards ?? []).map((x: any) => ({ ...x, __type: "template" })),
      ...(allCards ?? []).map((x: any) => ({ ...x, __type: "card" })),
    ];
  }, [basketCards, allCards]);

  const isLoading = loadingTemplets || loadingCards;

  // Only show clothing-related tabs when clothing === true
  const filteredTabs = useMemo(() => {
    if (!clothing) return tabsCategories;

    const whitelist = [
      "Clothing",
      "Clothes",
      "T-Shirt",
      "T Shirt",
      "Tshirt",
      "Hoodie",
      "Sweatshirt",
      "Shirt",
      "Jeans",
    ].map((s) => s.toLowerCase());

    return tabsCategories.filter((c) => {
      const name = (c?.name ?? "").toString().trim().toLowerCase();
      return whitelist.includes(name);
    });
  }, [tabsCategories, clothing]);

  // Keep activeTab in range when tabs change
  useEffect(() => {
    if (activeTab >= filteredTabs.length) setActiveTab(0);
  }, [filteredTabs, activeTab]);

  const currentCat = filteredTabs[activeTab];

  // const filteredCards = useMemo(() => {
  //   if (!basketCards || !currentCat) return [];
  //   return basketCards.filter((card: any) => {
  //     if (card.categoryId != null && currentCat.id != null) {
  //       return String(card.categoryId) === String(currentCat.id);
  //     }
  //     // fallback: match by name
  //     return (card.cardcategory || card.cardname) === currentCat.name;
  //   });
  // }, [basketCards, currentCat]);

  const filteredCards = useMemo(() => {
    if (!allProducts.length) return [];

    if (saleSlide) {
      return allProducts.filter((p: any) => hasSale(p.saleprice));
    }

    if (!currentCat) return [];
    return allProducts.filter((p: any) => {
      const cat = (p.cardcategory ?? p.category ?? "").toString();
      return cat === currentCat.name;
    });
  }, [allProducts, currentCat, saleSlide]);


  const handleOpenModal = (cate: CategoryType) => {
    setSelectedCate(cate);
    openDetailModal();
>>>>>>> 8c992743900e1e9073f6cca2f5700ab2ef0bf4c0
  };



  return (
<<<<<<< HEAD
    <Box sx={{ width: "100%", mt: { md: 6, xs: 3 } }}>
      {title && (
        <Typography sx={{ fontWeight: 700, fontSize: { md: 30, xs: 20 }, textAlign: "center" }}>
          {title}
        </Typography>
      )}
      {description && (
        <Typography
          sx={{
            mt: 1,
            fontSize: { md: 24, xs: 16 },
            textAlign: { xs: "center", md: "start" },
            opacity: 0.9,
          }}
        >
          {description}
        </Typography>
      )}

      <Box
        sx={{
          mt: 2,
          bgcolor: COLORS.black,
          borderRadius: 3,
          py: { xs: 2, md: 3 },
          px: { xs: 1.5, md: 2 },
          position: "relative",
          overflow: "hidden",
        }}
      >
        {isLoading ? (
          <Box sx={{ height: 220, display: "flex", alignItems: "center", justifyContent: "center" }}>
            <CircularProgress sx={{ color: COLORS.seconday }} />
          </Box>
        ) : (
          <>
            <Swiper
              modules={[FreeMode, Mousewheel]}
              freeMode={{ enabled: true, momentum: true }}
              grabCursor
              mousewheel={{ forceToAxis: true }}
              spaceBetween={16}
              breakpoints={{
                0: { slidesPerView: 1, spaceBetween: 12 },
                600: { slidesPerView: 3, spaceBetween: 16 },
                900: { slidesPerView: 5, spaceBetween: 24 },
                1200: { slidesPerView: 6, spaceBetween: 28 },
                1536: { slidesPerView: 7, spaceBetween: 32 },
              }}
              onSwiper={(s) => {
                setSwiper(s);
                updateEdges(s);
              }}
              onSlideChange={updateEdges}
              onReachBeginning={updateEdges}
              onReachEnd={updateEdges}
              onFromEdge={updateEdges}
              style={{ paddingBottom: isMobile ? 10 : 6 }}
            >
              {categoryTiles.map((cat) => (
                <SwiperSlide
                  key={`cat-${cat.name}`}
                  style={{
                    height: "auto",
                    display: "flex",
                    justifyContent: "center",
                  }}
                >
                  <BasketCard
                    variant="category"
                    title={cat.name}
                    category={cat.name}
                    poster={cat.poster} // ✅ image for category
                    onClickCategory={goToCategory}
                  />
                </SwiperSlide>
              ))}
            </Swiper>

            {categoryTiles.length > 0 && (
              <Box
                sx={{
                  mt: 2,
                  display: { xs: "flex", md: "none" },
                  gap: 1,
                  overflowX: "auto",
                  pb: 0.5,
                  WebkitOverflowScrolling: "touch",
                }}
              >
                {categoryTiles.map((cat, idx) => {
                  const active = idx === activeIndex;
                  return (
                    <Box
                      ref={(el) => {
                        navItemRefs.current[idx] = el as HTMLDivElement | null;
                      }}
                      key={`cat-nav-${cat.name}`}
                      onClick={() => goToCategory(cat.name)}
                      sx={{
                        flex: "0 0 auto",
                        px: 1.5,
                        py: 0.75,
                        borderRadius: 999,
                        fontSize: 13,
                        fontWeight: 600,
                        whiteSpace: "nowrap",
                        cursor: "pointer",
                        bgcolor: active ? COLORS.white : "rgba(255,255,255,0.12)",
                        color: active ? COLORS.primary : "#fff",
                        border: `1px solid ${active ? COLORS.primary : "rgba(255,255,255,0.3)"}`,
                      }}
                    >
                      {cat.name}
                    </Box>
                  );
                })}
              </Box>
            )}

            <IconButton
              onClick={() => swiper?.slidePrev()}
              disabled={isBeginning}
              sx={{
                position: "absolute",
                top: "50%",
                left: { xs: 6, md: 12 },
                transform: "translateY(-50%)",
                zIndex: 10,
                bgcolor: COLORS.white,
                border: `2px solid ${COLORS.primary}`,
                color: COLORS.primary,
                width: { xs: 34, md: 40 },
                height: { xs: 34, md: 40 },
                "&:hover": { bgcolor: "#f2f2f2" },
                "&.Mui-disabled": {
                  opacity: 0.4,
                  bgcolor: "rgba(255,255,255,0.6)",
                  borderColor: "rgba(0,0,0,0.2)",
                  color: "rgba(0,0,0,0.35)",
                },
              }}
            >
              <ArrowBackIos fontSize="small" />
            </IconButton>

            <IconButton
              onClick={() => swiper?.slideNext()}
              disabled={isEnd}
              sx={{
                position: "absolute",
                top: "50%",
                right: { xs: 6, md: 12 },
                transform: "translateY(-50%)",
                zIndex: 10,
                bgcolor: COLORS.white,
                border: `2px solid ${COLORS.primary}`,
                color: COLORS.primary,
                width: { xs: 34, md: 40 },
                height: { xs: 34, md: 40 },
                "&:hover": { bgcolor: "#f2f2f2" },
                "&.Mui-disabled": {
                  opacity: 0.4,
                  bgcolor: "rgba(255,255,255,0.6)",
                  borderColor: "rgba(0,0,0,0.2)",
                  color: "rgba(0,0,0,0.35)",
                },
              }}
            >
              <ArrowForwardIos fontSize="small" />
            </IconButton>
          </>
        )}
      </Box>
=======
    <Box sx={{ width: "100%", m: "auto", position: "relative", mt: { md: 8, sm: 8, xs: 0 }, p: { md: 0, sm: 0, xs: 2 } }}>
      {/* Header */}
      <Box sx={{ display: "flex", justifyContent: "space-between", alignItems: "center" }}>
        <Typography fontWeight={700} fontSize={{ md: "26px" }}>{title}</Typography>
        {!brandSlider && (
          <LandingButton title="Shop All" width="150px" onClick={() => navigate(USER_ROUTES.VIEW_ALL)} />
        )}
      </Box>

      {/* Tabs */}
      {!saleSlide && filteredTabs.length > 0 && (
        <Box sx={{ display: "flex", gap: "10px", alignItems: "center", flexWrap: "wrap", mt: 2 }}>
          {filteredTabs.slice(0, 6).map((tab, index) => (
            <Box
              key={tab.id ?? tab.name ?? index}
              onClick={() => setActiveTab(index)}
              sx={{
                px: { md: 3, sm: 1, xs: 1 },
                py: { md: 1, sm: 0.5, xs: 0.5 },
                border: "2px solid black",
                borderRadius: "15px",
                cursor: "pointer",
                transition: "all 0.3s ease-in-out",
                backgroundColor: activeTab === index ? COLORS.primary : "transparent",
                "&:hover": { backgroundColor: activeTab === index ? COLORS.seconday : "#f0f0f0" },
              }}
            >
              <Typography sx={{ fontSize: "14px", fontWeight: 600, color: activeTab === index ? COLORS.white : COLORS.black }}>
                {tab.name}
              </Typography>
            </Box>
          ))}
        </Box>
      )}

      {/* Slider */}
      <Box sx={{ mt: 3, position: "relative" }}>
        {isLoading ? (
          <Box sx={{ width: "100%", height: "300px", display: "flex", justifyContent: "center", alignItems: "center" }}>
            <CircularProgress sx={{ color: COLORS.seconday }} />
          </Box>
        ) : (
          <Swiper
            modules={[Navigation]}
            navigation={{ prevEl: ".swiper-button-prev", nextEl: ".swiper-button-next" }}
            spaceBetween={10}
            breakpoints={{
              0: { slidesPerView: 1 },
              600: { slidesPerView: 3 },
              760: { slidesPerView: 4 },
              1024: { slidesPerView: 5 },
              1440: { slidesPerView: 6 },
              1920: { slidesPerView: 7 },
            }}
          >
            {filteredCards.map((cate: any) => (
              <SwiperSlide key={cate.id}>
                <Box px={{ md: 1, sm: "5px", xs: "4px" }}>
                  <BasketCard
                    id={cate.id}
                    openModal={() => handleOpenModal(cate)}
                    title={cate.cardname}
                    poster={cate?.img_url || cate?.imageurl || cate?.lastpageimageurl}
                    price={cate.actualprice}
                    saleprice={cate.saleprice}
                    sales={saleSlide}
                    category={cate.cardcategory}
                  />
                </Box>
              </SwiperSlide>
            ))}
          </Swiper>
        )}

        {/* Modal */}
        {isDetailModal && selectedCate && (
          <ProductPopup
            open={isDetailModal}
            onClose={closeDetailModal}
            cate={selectedCate}
            salePrice={saleSlide}
            isTempletDesign={(selectedCate as any)?.__type === "template"}
          />
        )}

        {/* Custom Navigation Buttons */}
        <IconButton
          className="swiper-button-prev"
          sx={{
            position: "absolute",
            top: "30%",
            left: { lg: -20, md: -15, sm: -15, xs: -10 },
            transform: "translateY(-50%)",
            border: `3px solid ${COLORS.primary}`,
            color: COLORS.primary,
            bgcolor: COLORS.white,
            zIndex: 10,
            "&:hover": { backgroundColor: "lightgray" },
          }}
        >
          <ArrowBackIos />
        </IconButton>

        <IconButton
          className="swiper-button-next"
          sx={{
            position: "absolute",
            top: "30%",
            right: { lg: -20, md: -15, sm: -15, xs: -10 },
            transform: "translateY(-50%)",
            border: `3px solid ${COLORS.primary}`,
            color: COLORS.primary,
            bgcolor: COLORS.white,
            zIndex: 10,
            "&:hover": { backgroundColor: "lightgray" },
          }}
        >
          <ArrowForwardIos />
        </IconButton>
      </Box>

      <Typography sx={{ mt: 2, fontSize: "17px", fontWeight: 300 }}>{description}</Typography>
>>>>>>> 8c992743900e1e9073f6cca2f5700ab2ef0bf4c0
    </Box>
  );
};

export default BasketSliderNoTabs;
