import React from "react";
import ReactDOM from "react-dom/client";
import { BrowserRouter } from "react-router-dom";
import { QueryClient, QueryClientProvider } from "@tanstack/react-query";
import { I18nextProvider } from "react-i18next";
import App from "./app/App";
import i18n from "./i18n/config";
import "./styles/global.css";
import { AuthProvider } from "./app/auth/AuthContext";
import { CartProvider } from "./storefront/cart/CartContext";
import { ToastProvider } from "./components/feedback/ToastContext";
import { WishlistProvider } from "./storefront/wishlist/WishlistContext";
import { ThemeProvider } from "./theme/ThemeProvider";

const queryClient = new QueryClient({
  defaultOptions: {
    queries: {
      staleTime: 1000 * 30,
      retry: 1
    }
  }
});

ReactDOM.createRoot(document.getElementById("root")!).render(
  <React.StrictMode>
    <I18nextProvider i18n={i18n}>
      <QueryClientProvider client={queryClient}>
        <AuthProvider>
          <CartProvider>
            <WishlistProvider>
              <ToastProvider>
                <ThemeProvider>
                  <BrowserRouter future={{ v7_startTransition: true, v7_relativeSplatPath: true }}>
                    <App />
                  </BrowserRouter>
                </ThemeProvider>
              </ToastProvider>
            </WishlistProvider>
          </CartProvider>
        </AuthProvider>
      </QueryClientProvider>
    </I18nextProvider>
  </React.StrictMode>
);
