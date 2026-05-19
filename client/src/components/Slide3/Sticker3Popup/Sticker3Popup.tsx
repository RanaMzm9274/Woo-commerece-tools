// Sticker3Popup.tsx
<<<<<<< HEAD
import { Box, TextField } from "@mui/material";
=======
import { Box } from "@mui/material";
>>>>>>> 8c992743900e1e9073f6cca2f5700ab2ef0bf4c0
import PopupWrapper from "../../PopupWrapper/PopupWrapper";
import { STICKERS_DATA } from "../../../constant/data";
import { COLORS } from "../../../constant/color";
import { useSlide3 } from "../../../context/Slide3Context";
<<<<<<< HEAD
import { useMemo, useState } from "react";
=======
>>>>>>> 8c992743900e1e9073f6cca2f5700ab2ef0bf4c0

interface Sticker3PopupProps {
  onClose: () => void;
  activeIndex?: number;
}

const Sticker3Popup = ({ onClose }: Sticker3PopupProps) => {
  const { addSticker3 } = useSlide3();

<<<<<<< HEAD
  const [search, setSearch] = useState('')

  const filteredStickers = useMemo(() => {
    const q = search.trim().toLowerCase();
    if (!q) return STICKERS_DATA;

    return STICKERS_DATA.filter((s) => {
      const name = s.name.toLowerCase();
      const path = s.sticker.toLowerCase();
      return name.includes(q) || path.includes(q);
    });
  }, [search]);

=======
>>>>>>> 8c992743900e1e9073f6cca2f5700ab2ef0bf4c0
  const handleSelectSticker = (stick: any) => {
    addSticker3(stick);
  };

  return (
    <PopupWrapper
      title="Sticker"
      onClose={onClose}
      sx={{
        width: { md: 300, sm: 300, xs: "95%" },
        height: { md: 600, sm: 600, xs: 450 },
        left: { md: "23%", sm: "0%", xs: 0 },
        mt: { md: 0, sm: 0, xs: 0 },
        zIndex: 99,
      }}
    >
      <Box
        sx={{
          mt: 2,
          display: "flex",
          flexWrap: "wrap",
<<<<<<< HEAD
          justifyContent: "flex-start",
          alignContent: "flex-start",
=======
>>>>>>> 8c992743900e1e9073f6cca2f5700ab2ef0bf4c0
          gap: 1,
          overflowY: "auto",
          "&::-webkit-scrollbar": {
            height: "6px",
            width: "5px",
          },
          "&::-webkit-scrollbar-track": {
<<<<<<< HEAD
            backgroundColor: "#f1f1f1",
=======
            backgroundColor: "#f3f3f3",
>>>>>>> 8c992743900e1e9073f6cca2f5700ab2ef0bf4c0
            borderRadius: "20px",
          },
          "&::-webkit-scrollbar-thumb": {
            backgroundColor: COLORS.primary,
            borderRadius: "20px",
          },
          height: 500,
        }}
      >
<<<<<<< HEAD
        <TextField variant="outlined" type="search" placeholder="search Icon ╰(*°▽°*)╯" value={search} fullWidth onChange={(e) => setSearch(e.target.value)} />
        {filteredStickers.map((stick) => (
          <Box
            key={stick.id}
            onClick={() => handleSelectSticker(stick)}
            sx={{
              width: { md: "80px", sm: "80px", xs: "70px" },
              height: "90px",
              borderRadius: 2,
              bgcolor: "rgba(233, 232, 232, 1)",
=======
        {STICKERS_DATA.map((stick) => (
          <Box
            key={stick.id}
            onClick={() => handleSelectSticker(stick)} // ✅ handle click
            sx={{
              width: { md: "80px", sm: "80px", xs: '70px' },
              height: "90px",
              borderRadius: 2,
              bgcolor: "rgba(233, 232, 232, 3)",
>>>>>>> 8c992743900e1e9073f6cca2f5700ab2ef0bf4c0
              display: "flex",
              justifyContent: "center",
              alignItems: "center",
              color: "white",
              userSelect: "none",
            }}
          >
            <Box
              component={"img"}
              src={stick.sticker}
              sx={{ width: "100%", height: "auto" }}
            />
          </Box>
        ))}
      </Box>
    </PopupWrapper>
  );
};

export default Sticker3Popup;
