import { useState, type SyntheticEvent } from "react";
import MainLayout from "../../../layout/MainLayout";
import {
<<<<<<< HEAD
  Box,
  Tabs,
  Tab,
  useTheme,
  useMediaQuery,
} from "@mui/material";
import { useAuth } from "../../../context/AuthContext";
import {
  Logout,
  LogoutOutlined,
  PersonOutline,
  ReceiptLongOutlined,
  StyleOutlined,
} from "@mui/icons-material";
import { COLORS } from "../../../constant/color";
import ProfileTabs from "./ProfileTabs/ProfileTabs";
import OrdersTab from "./OrdersTab/OrdersTab";
import DraftsCard from "./DraftsCard/DraftsCard";
import useModal from "../../../hooks/useModal";
import ConfirmModal from "../../../components/ConfirmModal/ConfirmModal";

// ✅ adjust this import/path according to your project
=======
    Box,
    Tabs,
    Tab,
    Typography,
    Divider,
    useMediaQuery,
    useTheme,
} from "@mui/material";
import { useAuth } from "../../../context/AuthContext";
import { LogoutOutlined, NotificationsActiveOutlined, PersonOutline, ReceiptLongOutlined, StyleOutlined } from "@mui/icons-material";
>>>>>>> 8c992743900e1e9073f6cca2f5700ab2ef0bf4c0

type TabValue = 0 | 1 | 2 | 3 | 4;

function a11yProps(index: number) {
<<<<<<< HEAD
  return {
    id: `user-tab-${index}`,
    "aria-controls": `user-tabpanel-${index}`,
  };
}

function TabPanel(props: {
  children?: React.ReactNode;
  value: number;
  index: number;
}) {
  const { children, value, index, ...other } = props;
  return (
    <div
      role="tabpanel"
      hidden={value !== index}
      id={`user-tabpanel-${index}`}
      aria-labelledby={`user-tab-${index}`}
      {...other}
    >
      {value === index && <Box sx={{ py: 2 }}>{children}</Box>}
    </div>
  );
}

const UserProfile = () => {
  const theme = useTheme();
  const isUpSm = useMediaQuery(theme.breakpoints.up("sm"));
  const { signOut } = useAuth();
  const [value, setValue] = useState<TabValue>(0);


  const {open:isSignoutModal,openModal:isOpenSignoutModal,closeModal:isCloseSignoutModal} = useModal()

  const handleChange = async (_: SyntheticEvent, newValue: TabValue) => {
    if (newValue === 4) {
      await signOut();
      setValue(0);
      return;
    }
    setValue(newValue);
  };

  const tabBaseSx = {
    minHeight: 36,
    py: 0.5,
    px: 1,
    borderRadius: 1.5,
    textTransform: "none" as const,
    fontSize: 13,
    fontWeight: 600,
    lineHeight: 1.1,
    color: "text.secondary",
    "& .MuiSvgIcon-root": { fontSize: 18, color: "inherit" },
    "& .MuiTab-iconWrapper": { mr: 0.5 },
    "&.Mui-selected": {
      bgcolor: COLORS.seconday,
      color: "#fff",
      "& .MuiSvgIcon-root": { color: "#fff" },
    },
    "&:hover": {
      bgcolor: 'lightgray',
    },
  };

  return (
    <MainLayout>
      <Box sx={{ p: { xs: 1.5, md: 2 }, maxWidth: 1200, mx: "auto" }}>
        <Tabs
          value={value}
          onChange={handleChange}
          variant={isUpSm ? "fullWidth" : "scrollable"}
          scrollButtons={false}
          allowScrollButtonsMobile
          aria-label="User profile tabs"
          sx={{
            width:'70%',
            display: "flex",
            m:'auto',
            border: "1px solid",
            borderColor: "divider",
            borderRadius: 2,
            p:0.5,
            minHeight: 44,
            bgcolor: "background.paper",
            "& .MuiTabs-indicator": { display: "none" },
            "& .MuiTabs-flexContainer": { gap: 0.5 },
          }}
        >
          <Tab
            icon={<PersonOutline />}
            iconPosition="start"
            label="Profile"
            {...a11yProps(0)}
            sx={tabBaseSx}
          />
          <Tab
            icon={<ReceiptLongOutlined />}
            iconPosition="start"
            label="Orders"
            {...a11yProps(1)}
            sx={tabBaseSx}
          />
          <Tab
            icon={<StyleOutlined />}
            iconPosition="start"
            label="Drafts"
            {...a11yProps(2)}
            sx={tabBaseSx}
          />
          {/* <Tab
            icon={<NotificationsActiveOutlined />}
            iconPosition="start"
            label="Reminders"
            {...a11yProps(3)}
            sx={tabBaseSx}
          /> */}
          <Tab
            icon={<LogoutOutlined />}
            iconPosition="start"
            // label="Sign out"
            onClick={isOpenSignoutModal}
            {...a11yProps(4)}
            sx={{
              ...tabBaseSx,
              color: "error.main",
              "&.Mui-selected": {
                bgcolor: COLORS.seconday,
                color: "#fff",
                "& .MuiSvgIcon-root": { color: "#fff" },
              },
            }}
          />
        </Tabs>

        <TabPanel value={value} index={0}>
          <ProfileTabs />
        </TabPanel>

        <TabPanel value={value} index={1}>
          <OrdersTab />
        </TabPanel>

        <TabPanel value={value} index={2}>
          <DraftsCard/>
        </TabPanel>

        {/* <TabPanel value={value} index={3}>
          <Typography variant="h6" gutterBottom>
            Reminders
          </Typography>
          <Typography variant="body2">Your reminders list.</Typography>
        </TabPanel> */}
      </Box>

      {
        isSignoutModal && (
          <ConfirmModal
           open={isSignoutModal}
           onCloseModal={()=>isCloseSignoutModal()}
           title="Are you sure to want logout"
           icon={<Logout/>}
           btnText="Yes, Logout"
           onClick={signOut}
          />
        )
      }
    </MainLayout>
  );
=======
    return {
        id: `user-tab-${index}`,
        "aria-controls": `user-tabpanel-${index}`,
    };
}

function TabPanel(props: { children?: React.ReactNode; value: number; index: number }) {
    const { children, value, index, ...other } = props;
    return (
        <div
            role="tabpanel"
            hidden={value !== index}
            id={`user-tabpanel-${index}`}
            aria-labelledby={`user-tab-${index}`}
            {...other}
        >
            {value === index && <Box sx={{ py: 2 }}>{children}</Box>}
        </div>
    );
}

const UserProfile = () => {
    const theme = useTheme();
    const fullWidth = useMediaQuery(theme.breakpoints.up("xs"));
    const { signOut } = useAuth();
    const [value, setValue] = useState<TabValue>(0);

    const handleChange = async (_: SyntheticEvent, newValue: TabValue) => {
        if (newValue === 4) {
            // why: make Signout an action instead of navigating to a panel
            await signOut();
            setValue(0);
            return;
        }
        setValue(newValue);
    };

    return (
        <MainLayout>
            <Box sx={{ p: { xs: 1.5, md: 2 }, maxWidth: 1200, mx: "auto" }}>
                <Tabs
                    value={value}
                    onChange={handleChange}
                    variant={fullWidth ? "fullWidth" : "scrollable"}
                    allowScrollButtonsMobile
                    aria-label="User profile tabs"
                >
                    <Tab
                        icon={<PersonOutline />}
                        iconPosition="start"
                        label="Profile"
                        {...a11yProps(0)}
                    />
                    <Tab
                        icon={<ReceiptLongOutlined />}
                        iconPosition="start"
                        label="Orders"
                        {...a11yProps(1)}
                    />
                    <Tab
                        icon={<StyleOutlined />}
                        iconPosition="start"
                        label="Draft Card"
                        {...a11yProps(2)}
                    />
                    <Tab
                        icon={<NotificationsActiveOutlined />}
                        iconPosition="start"
                        label="Reminders"
                        {...a11yProps(3)}
                    />
                    <Tab
                        icon={<LogoutOutlined />}
                        iconPosition="start"
                        label="Sign out"
                        {...a11yProps(4)}
                        sx={{
                            color: "error.main",
                            "&.Mui-selected": { color: "error.main" },
                        }}
                    />
                </Tabs>

                <Divider sx={{ my: 2 }} />

                <TabPanel value={value} index={0}>
                    <Typography variant="h6" gutterBottom>Profile</Typography>
                    <Typography variant="body2">User details and settings go here.</Typography>
                </TabPanel>

                <TabPanel value={value} index={1}>
                    <Typography variant="h6" gutterBottom>Orders</Typography>
                    <Typography variant="body2">Your order history appears here.</Typography>
                </TabPanel>

                <TabPanel value={value} index={2}>
                    <Typography variant="h6" gutterBottom>Draft Card</Typography>
                    <Typography variant="body2">Saved drafts and designs.</Typography>
                </TabPanel>

                <TabPanel value={value} index={3}>
                    <Typography variant="h6" gutterBottom>Reminders</Typography>
                    <Typography variant="body2">Your reminders list.</Typography>
                </TabPanel>
            </Box>
        </MainLayout>
    );
>>>>>>> 8c992743900e1e9073f6cca2f5700ab2ef0bf4c0
};

export default UserProfile;
