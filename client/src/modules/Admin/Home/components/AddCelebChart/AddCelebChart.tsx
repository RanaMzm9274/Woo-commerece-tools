import { Box, Card, Typography, Stack } from "@mui/material";
import PiChart from "./PiChart";
import { useEffect, useState } from "react";
import { fetchOrderCount } from "../../../../../source/source";

<<<<<<< HEAD
type Props = {
  orderCount?: number;
};

const AddCelebChart = ({ orderCount: orderCountProp }: Props) => {
=======
const AddCelebChart = () => {
>>>>>>> 8c992743900e1e9073f6cca2f5700ab2ef0bf4c0

  const [orderCount, setOrderCount] = useState(0);

  useEffect(() => {
<<<<<<< HEAD
    if (typeof orderCountProp === "number") {
      setOrderCount(orderCountProp);
      return;
    }
=======
>>>>>>> 8c992743900e1e9073f6cca2f5700ab2ef0bf4c0
    const loadOrders = async () => {
      const count: any = await fetchOrderCount();
      setOrderCount(count);
    };
    loadOrders();
<<<<<<< HEAD
  }, [orderCountProp]);
=======
  }, []);
>>>>>>> 8c992743900e1e9073f6cca2f5700ab2ef0bf4c0

  return (
    <Card
      sx={{
        p: 2,
        width: { md: '49%', sm: '100%', xs: '100%' },
        borderRadius: 4,
<<<<<<< HEAD
        background: "#ffffff",
        border: "1px solid rgba(0,0,0,0.06)",
        boxShadow: "0 14px 30px rgba(5,10,36,0.08)",
=======
        background:
          "linear-gradient(135deg, rgba(255,255,255,0.9), rgba(238, 202, 134, 0.6))",
>>>>>>> 8c992743900e1e9073f6cca2f5700ab2ef0bf4c0
      }}
    >
      {/* Header */}
      <Stack
        direction="row"
        justifyContent="space-between"
        alignItems="center"
        mb={2}
      >
<<<<<<< HEAD
        <Typography variant="h6" fontWeight="bold" sx={{ color: "#000000" }}>
          Orders
        </Typography>
        <Typography variant="h6" fontWeight="bold" sx={{ color: "#000000" }}>
=======
        <Typography variant="h6" fontWeight="bold">
          Orders
        </Typography>
        <Typography variant="h6" fontWeight="bold">
>>>>>>> 8c992743900e1e9073f6cca2f5700ab2ef0bf4c0
          {orderCount.toLocaleString()}
        </Typography>
      </Stack>

      {/* Legend */}
      <Stack
        direction="row"
        justifyContent="space-between"
        alignItems="center"
        sx={{
          bgcolor: "#fff",
          borderRadius: 2,
          p: 1.5,
<<<<<<< HEAD
          boxShadow: "0 10px 24px rgba(5,10,36,0.08)",
=======
          boxShadow: 4,
>>>>>>> 8c992743900e1e9073f6cca2f5700ab2ef0bf4c0
          mb: 3,
        }}
      >
        {[
<<<<<<< HEAD
          { color: "#56BECC", label: "Active" },
          { color: "#8D6DA1", label: "Completed" },
          { color: "#6EBA9E", label: "Pending" },
=======
          { color: "#6C5DD3", label: "Active" },
          { color: "#F472B6", label: "Completed" },
          { color: "#0049C6", label: "Pending" },
>>>>>>> 8c992743900e1e9073f6cca2f5700ab2ef0bf4c0
        ].map((item) => (
          <Stack direction="row" alignItems="center" gap={1} key={item.label}>
            <Box
              sx={{
                width: 10,
                height: 10,
                borderRadius: "50%",
                bgcolor: item.color,
              }}
            />
<<<<<<< HEAD
            <Typography variant="caption" sx={{ color: "#000000", opacity: 0.7 }}>
=======
            <Typography variant="caption" color="text.secondary">
>>>>>>> 8c992743900e1e9073f6cca2f5700ab2ef0bf4c0
              {item.label}
            </Typography>
          </Stack>
        ))}
      </Stack>

      {/* Chart Area */}
      <Stack direction="row" justifyContent="space-between" alignItems="center">
        <Box sx={{ width: "100%", display: "flex", justifyContent: "center", alignItems: 'center', m: 'auto' }}>
          <PiChart totalOrder={orderCount.toLocaleString()} />
        </Box>
      </Stack>
    </Card>
  );
};

export default AddCelebChart;
