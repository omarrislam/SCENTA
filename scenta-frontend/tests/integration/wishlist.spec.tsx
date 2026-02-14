import { describe, it, expect } from "vitest";
import { screen } from "@testing-library/react";
import App from "../../src/app/App";
import { renderWithProviders } from "../test-utils";

describe("Wishlist", () => {
  it("renders wishlist page when authenticated", async () => {
    localStorage.setItem("scenta-user", JSON.stringify({ id: "demo", name: "Tester" }));
    renderWithProviders(<App />, ["/account/wishlist"]);
    expect(await screen.findByRole("heading", { name: "Wishlist" })).toBeInTheDocument();
  });
});
