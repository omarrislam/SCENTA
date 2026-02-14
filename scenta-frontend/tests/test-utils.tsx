import type { PropsWithChildren, ReactElement } from "react";
import { render } from "@testing-library/react";
import { QueryClient, QueryClientProvider } from "@tanstack/react-query";
import { I18nextProvider } from "react-i18next";
import { MemoryRouter } from "react-router-dom";
import i18n from "../src/i18n/config";
import { AuthProvider } from "../src/app/auth/AuthContext";
import { CartProvider } from "../src/storefront/cart/CartContext";
import { ToastProvider } from "../src/components/feedback/ToastContext";
import { WishlistProvider } from "../src/storefront/wishlist/WishlistContext";
import { ThemeProvider } from "../src/theme/ThemeProvider";

const Wrapper = ({ children, initialEntries = ["/"] }: PropsWithChildren<{ initialEntries?: string[] }>) => {
  const client = new QueryClient();
  return (
    <I18nextProvider i18n={i18n}>
      <QueryClientProvider client={client}>
        <AuthProvider>
          <CartProvider>
            <WishlistProvider>
              <ToastProvider>
                <ThemeProvider>
                  <MemoryRouter initialEntries={initialEntries}>{children}</MemoryRouter>
                </ThemeProvider>
              </ToastProvider>
            </WishlistProvider>
          </CartProvider>
        </AuthProvider>
      </QueryClientProvider>
    </I18nextProvider>
  );
};

export const renderWithProviders = (ui: ReactElement, initialEntries?: string[]) =>
  render(<Wrapper initialEntries={initialEntries}>{ui}</Wrapper>);
