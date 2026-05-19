import * as React from "react";
import Box from "@mui/material/Box";
import Drawer from "@mui/material/Drawer";
import Divider from "@mui/material/Divider";
import { COLORS } from "../../constant/color";
import { Close } from "@mui/icons-material";
import { IconButton, Typography } from "@mui/material";
import LandingButton from "../LandingButton/LandingButton";

const RemindersDrawer = () => {
  const [open, setOpen] = React.useState(false);

<<<<<<< HEAD
  const toggleDrawer = (newOpen: boolean) => () => setOpen(newOpen);

  const openGoogleCalendar = () => {
    // You can later replace these with real selected event details
    const title = "DIY Personalisation";
    const details = "Create your personalised design in time — don’t leave it last minute!";
    const location = "DIY Personalisation";

    // Optional: Set a default date/time (example: tomorrow 9am for 1 hour)
    // Google expects YYYYMMDDTHHMMSSZ (UTC) OR without Z for local-ish
    // If you don’t want date/time, remove &dates=... completely
    // const start = "20260103T090000Z";
    // const end = "20260103T100000Z";

    const url =
      "https://calendar.google.com/calendar/render?action=TEMPLATE" +
      `&text=${encodeURIComponent(title)}` +
      `&details=${encodeURIComponent(details)}` +
      `&location=${encodeURIComponent(location)}`;
      // + `&dates=${start}/${end}`;

    setOpen(false); // ✅ actually closes drawer
    window.open(url, "_blank", "noopener,noreferrer");
  };

  const DrawerList = (
    <Box sx={{ width: 350, p: 2 }} role="presentation">
      <Box
        sx={{
          display: "flex",
          justifyContent: "flex-end",
          alignItems: "center",
        }}
      >
=======
  const toggleDrawer = (newOpen: boolean) => () => {
    setOpen(newOpen);
  };

  const DrawerList = (
    <Box sx={{ width: 450, p: 2 }} role="presentation">
      <Box
        sx={{
          display: "flex",
          justifyContent: "space-between",
          alignItems: "center",
        }}
      >
        <Typography sx={{ fontSize: "20px", fontWeight: "bold" }}>
          Notification
        </Typography>

>>>>>>> 8c992743900e1e9073f6cca2f5700ab2ef0bf4c0
        {/* ✅ Close only on this button */}
        <IconButton onClick={toggleDrawer(false)}>
          <Close />
        </IconButton>
      </Box>

      <Divider />

      <Box
        sx={{
          display: "flex",
          flexDirection: "column",
          gap: "10px",
          width: "100%",
          height: "60vh",
          textAlign: "center",
<<<<<<< HEAD
          mt: 6,
=======
          mt: 8,
>>>>>>> 8c992743900e1e9073f6cca2f5700ab2ef0bf4c0
          justifyContent: "center",
          alignItems: "center",
        }}
      >
        <Box
          component={"img"}
          src="/assets/icons/reminder-calender.svg"
<<<<<<< HEAD
          sx={{ width: 130, height: 130 }}
        />

        <Typography sx={{ fontSize: "24px", fontWeight: 700, pb: 1 }}>
          Set a reminder
        </Typography>

        <Typography sx={{ maxWidth: 360 }}>
          Add an event to your Google Calendar so you never miss birthdays, anniversaries, or special occasions again.
        </Typography>

        <LandingButton
          title="Set Reminder"
          width="300px"
          personal
          onClick={openGoogleCalendar}
=======
          sx={{
            width: 130,
            height: 130,
          }}
        />

        <Typography sx={{ fontSize: "24px", fontWeight: 700, pb: 2 }}>
          80% of our customers have got a reminder.
        </Typography>
        <Typography>
          Set a reminder below and never forget an important occasion again –
          phew!
        </Typography>
        <Typography sx={{ fontSize: "20px", fontWeight: 700, pb: 2 }}>
          Get 20% off on the DIY Personalisation app now when you set 3
          reminders!
        </Typography>

        <LandingButton
          title="Set Reminders"
          width="400px"
          personal
          onClick={toggleDrawer(false)}
        />
        <LandingButton
          title="View All Reminders"
          width="400px"
          personal
          variant="outlined"
          onClick={toggleDrawer(false)}
>>>>>>> 8c992743900e1e9073f6cca2f5700ab2ef0bf4c0
        />
      </Box>
    </Box>
  );

  return (
    <div>
      <IconButton
        onClick={toggleDrawer(true)}
        sx={{
          ...iconStyle,
          display: { lg: "flex", md: "flex", sm: "none", xs: "none" },
        }}
      >
        <Box
          component="img"
          src="/assets/icons/Reminders.svg"
<<<<<<< HEAD
          sx={{ width: 35, height: 35 }}
=======
          sx={{
            width: 35,
            height: 35,
          }}
>>>>>>> 8c992743900e1e9073f6cca2f5700ab2ef0bf4c0
        />
        <Typography fontSize="12px">Reminders</Typography>
      </IconButton>

<<<<<<< HEAD
=======
      {/* ✅ Drawer closes only on outside click or Close button */}
>>>>>>> 8c992743900e1e9073f6cca2f5700ab2ef0bf4c0
      <Drawer anchor="right" open={open} onClose={toggleDrawer(false)}>
        {DrawerList}
      </Drawer>
    </div>
  );
};

export default RemindersDrawer;

const iconStyle = {
  color: COLORS.black,
  flexDirection: "column",
  "&:hover": {
    color: COLORS.primary,
    bgcolor: "transparent",
  },
};
