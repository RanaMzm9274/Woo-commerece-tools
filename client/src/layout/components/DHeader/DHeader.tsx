<<<<<<< HEAD
// DHeader.tsx
=======
﻿// DHeader.tsx
>>>>>>> 8c992743900e1e9073f6cca2f5700ab2ef0bf4c0
import { Box, Typography } from "@mui/material";
import LandingButton from "../../../components/LandingButton/LandingButton";

type Props = {
  title?: string;
  exportBtn?: string;
  addBtn?: string;
  onClick?: () => void;
  onExportClick?: () => void;
};

const DHeader = (props: Props) => {
  const { title, exportBtn, addBtn, onClick, onExportClick } = props;

  return (
<<<<<<< HEAD
    <Box sx={{ display: "flex", justifyContent: "space-between", mb: 3 }}>
      <Typography sx={{ fontSize: { md: 35, sm: 27, xs: 20 } }}>{title}</Typography>

      <Box sx={{ display: "flex", gap: 1, alignItems: "center" }}>
=======
    <Box sx={{ display: "flex", justifyContent: "space-between", alignItems: { xs: "flex-start", sm: "center" }, flexDirection: { xs: "column", sm: "row" }, gap: { xs: 1.5, sm: 2 }, mb: 3 }}>
      <Typography sx={{ fontSize: { md: 35, sm: 27, xs: 20 } }}>{title}</Typography>

      <Box sx={{ display: "flex", gap: 1, alignItems: "center", width: { xs: "100%", sm: "auto" }, flexWrap: "wrap" }}>
>>>>>>> 8c992743900e1e9073f6cca2f5700ab2ef0bf4c0
        {exportBtn && (
          <LandingButton
            variant="outlined"
            title={exportBtn}
<<<<<<< HEAD
            onClick={onExportClick}   // ✅ ADD THIS
=======
            onClick={onExportClick}   // âœ… ADD THIS
>>>>>>> 8c992743900e1e9073f6cca2f5700ab2ef0bf4c0
            width="140px"
          />
        )}

        {addBtn && <LandingButton title={addBtn} onClick={onClick} width="140px" />}
      </Box>
    </Box>
  );
};

export default DHeader;
<<<<<<< HEAD
=======

>>>>>>> 8c992743900e1e9073f6cca2f5700ab2ef0bf4c0
