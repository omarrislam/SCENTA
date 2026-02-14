import { describe, it, expect } from "vitest";
import { screen } from "@testing-library/react";
import App from "../../src/app/App";
import { renderWithProviders } from "../test-utils";

describe("Admin products", () => {
  it("renders admin products list", async () => {
    localStorage.setItem(
      "scenta-user",
      JSON.stringify({ id: "admin", name: "Admin", role: "admin" })
    );
    renderWithProviders(<App />, ["/admin/products"]);
    expect(await screen.findByRole("heading", { name: "Products" })).toBeInTheDocument();
  });
});
