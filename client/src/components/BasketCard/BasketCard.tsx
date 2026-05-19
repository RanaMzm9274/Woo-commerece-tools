// File: src/components/BasketCard/BasketCard.tsx
import { Box, Typography } from "@mui/material";
<<<<<<< HEAD
import type { CategoryType } from "../ProductPopup/ProductPopup";
import { COLORS } from "../../constant/color";
=======
import LandingButton from "../LandingButton/LandingButton";
import type { CategoryType } from "../ProductPopup/ProductPopup";
import toast from "react-hot-toast";
import { useCartStore } from "../../stores";
>>>>>>> 8c992743900e1e9073f6cca2f5700ab2ef0bf4c0

type BasketType = {
  id?: string | number;
  title?: string;
<<<<<<< HEAD
  poster?: string;
  category?: string;
  openModal?: (item: CategoryType) => void;

  variant?: "product" | "category";
  onClickCategory?: (categoryName: string) => void;
};

const bgByCategory = (category?: string) => {
  const c = (category ?? "").toLowerCase().trim();
  if (c.includes("business card")) return COLORS.green;
  if (c.includes("candle")) return COLORS.seconday;
  if (c.includes("bag")) return COLORS.primary;
  if (c.includes("coaster")) return "#7FBF9B";
  if (c.includes("card")) return "#66B6BE";
  if (c.includes("leaflet")) return "#7FBF9B";
  if (c.includes("invite")) return "#8E68A6";
  return "#8E68A6";
};

const BasketCard = ({
  id,
  title,
  poster,
  category,
  openModal,
  variant = "product",
  onClickCategory,
}: BasketType) => {
  const label = (title || category || "Category").trim();
  const initials = label ? label.slice(0, 1).toUpperCase() : "C";

  const handleOpen = () => {
    if (variant === "category") {
      onClickCategory?.(label);
      return;
    }
    openModal?.({ id, title, img_url: poster, cardcategory: category } as any);
  };

  const hasPoster = Boolean(poster && String(poster).trim());

  return (
    <Box
      onClick={handleOpen}
      sx={{
        position: "relative",
        width: "100%",
        maxWidth: { xs: 320, sm: 300, md: 280 },
        height: { xs: 315, sm: 210, md: 230 },
        mx: "auto",
        borderRadius: 2,
        bgcolor: bgByCategory(label),
        overflow: "hidden",
        cursor: "pointer",
        border: "4px solid gray",
        boxShadow: "0 10px 18px rgba(0,0,0,0.35)",
      }}
    >
      <Box
        sx={{
          position: "absolute",
          inset: 12,
          borderRadius: 1.5,
          display: "flex",
          flexDirection: "column",
          alignItems: "center",
          justifyContent: "space-between",
          pb: 1.2,
        }}
      >
        <Box
          sx={{
            flex: 1,
            width: "100%",
            display: "flex",
            justifyContent: "center",
            mt: 0.5,
          }}
        >
          {/* ✅ NOW: category mode can also show image */}
          {(hasPoster && (variant === "product" || variant === "category")) ? (
            <Box
              component="img"
              src={poster}
              alt={label}
              sx={{
                width: "100%",
                height: "95%",
                objectFit: "cover",
                backgroundColor: variant === "category" ? "#fff" : "transparent",
                display: "block",
                borderRadius: 2,
                userSelect: "none",
                pointerEvents: "none",
              }}
            />
          ) : (
            <Box
              sx={{
                width: "78%",
                height: "88%",
                display: "grid",
                placeItems: "center",
                borderRadius: 2,
                bgcolor: "rgba(255,255,255,0.12)",
                border: "1px solid rgba(255,255,255,0.25)",
                backdropFilter: "blur(2px)",
              }}
            >
              <Typography sx={{ color: "#fff", fontWeight: 900, fontSize: 72, lineHeight: 1 }}>
                {initials}
              </Typography>
            </Box>
          )}
        </Box>

        <Typography
          sx={{
            color: "#fff",
            fontWeight: 700,
            fontSize: { xs: 14, sm: 16, md: 18 },
            textAlign: "center",
            textTransform: "capitalize",
            whiteSpace: "nowrap",
            textOverflow: "ellipsis",
            width: "100%",
            overflow: "hidden",
          }}
          title={label}
        >
          {label}
        </Typography>
      </Box>
=======
  poster: string;
  price?: string;
  saleprice?: string;
  category?: string;
  sales?: boolean;
  openModal?: (user: CategoryType) => void;
};

const BasketCard = (props: BasketType) => {
  const { poster, price, sales, id, title, category, saleprice, openModal } =
    props;

  const { addToCart } = useCartStore();

  // Store Card in the context API.
  const handleAddToCart = () => {
    addToCart({
      id: id,
      img: poster,
      title: title,
      price: price,
      category: category ? category : "default",
    });
    toast.success("Product add to store");
  };

  return (
    <Box
      component={"div"}
      sx={{
        borderRadius: 2,
        width: { md: "100%", sm: "100%", xs: "100%" },
        height: { lg: "300px", md: "300px", sm: '220px', xs: 'auto' },
        overflow: "hidden",
        cursor: "pointer",
      }}
    >
      <Box
        component={"img"}
        src={poster}
        onClick={() =>
          openModal?.({
            id,
          })
        }
        alt="backetImg"
        sx={{
          width: { md: "100%", sm: "100%", xs: "100%" },
          height: { lg: '200px', md: "200px", sm: "200px", xs: "350px" },
          objectFit: "fill",
          borderRadius: 2,
          "&:hover": { transform: "scale(1.03)" },
          transition: "transform 0.3s ease",
        }}
      />

      <Box
        sx={{
          dsiplay: "flex",
          alignItems: "center",
          justifyContent: "space-between",
        }}
      >
        <Typography sx={{ pt: 1, pb: 1, fontSize: "23px", fontWeight: 300 }}>
          {sales && (
            <span
              style={{
                fontSize: "18px",
                textDecoration: "line-through",
                color: "Gray",
                marginRight: 3,
              }}
            >
              £{price}
            </span>
          )}
          £{sales ? saleprice : price}
        </Typography>
        {/* {sales && (
          <Rating name="half-rating" defaultValue={2.5} precision={0.5} />
        )} */}
      </Box>

      <LandingButton
        title="Add To Basket"
        width="100%"
        variant="outlined"
        onClick={handleAddToCart}
      />
>>>>>>> 8c992743900e1e9073f6cca2f5700ab2ef0bf4c0
    </Box>
  );
};

export default BasketCard;
