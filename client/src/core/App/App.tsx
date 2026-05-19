import React from "react";
import Router from "../Router/Router";
<<<<<<< HEAD
import theme from "../../style/theme";
import { AuthProvider } from "../../context/AuthContext";
import { CartProvider } from "../../context/AddToCart";
=======
// import { WishCardProvider } from "../../context/WishCardContext";
import { ThemeProvider } from "@emotion/react";
import theme from "../../style/theme";
import { AuthProvider } from "../../context/AuthContext";
import { CartProvider } from "../../context/AddToCart";
import { Toaster } from "react-hot-toast";
>>>>>>> 8c992743900e1e9073f6cca2f5700ab2ef0bf4c0
import { COLORS } from "../../constant/color";
import { AdminProvider } from "../../context/AdminContext";
import { Slide2Provider } from "../../context/Slide2Context";
import { Slide3Provider } from "../../context/Slide3Context";
import { Slide4Provider } from "../../context/Slide4Context";
import { AdminCardEditorProvider } from "../../context/AdminEditorContext";
import { Slide1Provider } from "../../context/Slide1Context";
import GlobalWatermark from "../../components/GlobalWatermark/GlobalWatermark";
import { CategoriesEditorProvider } from "../../context/CategoriesEditorContext";
import { NotificationProvider } from "../../context/NotificationContext";
<<<<<<< HEAD
import { ThemeProvider } from "@emotion/react";
import { Toaster } from "react-hot-toast";
=======
>>>>>>> 8c992743900e1e9073f6cca2f5700ab2ef0bf4c0

const App = () => {

  return (
    <React.Fragment>
<<<<<<< HEAD
      <ThemeProvider theme={theme}>
        <AuthProvider>
          <CartProvider>
            {/* Fist Slide */}
            <Slide1Provider>
              {/* Second Slide */}
              <Slide2Provider>
                {/* Third Slide */}
                <Slide3Provider>
                  {/* Fourth Slide  */}
                  <Slide4Provider>
                    <AdminProvider>
                      <NotificationProvider>
=======
        <ThemeProvider theme={theme}>
          <AuthProvider>
            <CartProvider>
              {/* Fist Slide */}
              <Slide1Provider>
                {/* Second Slide */}
                <Slide2Provider>
                  {/* Third Slide */}
                  <Slide3Provider>
                    {/* Fourth Slide  */}
                    <Slide4Provider>
                      <AdminProvider>
                        <NotificationProvider>
>>>>>>> 8c992743900e1e9073f6cca2f5700ab2ef0bf4c0
                        <AdminCardEditorProvider>
                          <CategoriesEditorProvider>
                            <Router />
                          </CategoriesEditorProvider>
                        </AdminCardEditorProvider>
<<<<<<< HEAD
                      </NotificationProvider>
                    </AdminProvider>
                  </Slide4Provider>
                </Slide3Provider>
              </Slide2Provider>
            </Slide1Provider>

            {/* Global water mark */}
            <GlobalWatermark />

            <Toaster
              position="bottom-right"
              reverseOrder={false}
              toastOptions={{
                // global styles
                style: {
                  borderRadius: "10px",
                  background: "#333",
                  color: "#fff",
                  width: "300px",
                  minHeight: "60px",
                  padding: "12px",
                  fontSize: "16px",
                },

                // success specific
                success: {
                  style: {
                    background: "#ecececff",
                    color: COLORS.black,
                  },
                },

                // error specific
                error: {
                  style: {
                    background: "#9c1006ff",
                    color: COLORS.white,
                  },
                },
              }}
            />
          </CartProvider>
        </AuthProvider>
      </ThemeProvider>
=======
                        </NotificationProvider>
                      </AdminProvider>
                    </Slide4Provider>
                  </Slide3Provider>
                </Slide2Provider>
              </Slide1Provider>

              {/* Global water mark */}
              <GlobalWatermark />

              <Toaster
                position="bottom-right"
                reverseOrder={false}
                toastOptions={{
                  // global styles
                  style: {
                    borderRadius: "10px",
                    background: "#333",
                    color: "#fff",
                    width: "300px",
                    minHeight: "60px",
                    padding: "12px",
                    fontSize: "16px",
                  },

                  // success specific
                  success: {
                    style: {
                      background: "#ecececff",
                      color: COLORS.black,
                    },
                  },

                  // error specific
                  error: {
                    style: {
                      background: "#9c1006ff",
                      color: COLORS.white,
                    },
                  },
                }}
              />
            </CartProvider>
          </AuthProvider>
        </ThemeProvider>
>>>>>>> 8c992743900e1e9073f6cca2f5700ab2ef0bf4c0
    </React.Fragment>
  );
};

export default App;
