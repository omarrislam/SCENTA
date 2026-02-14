import { describe, it, expect } from "vitest";
import { screen } from "@testing-library/react";
import App from "../../src/app/App";
import { renderWithProviders } from "../test-utils";

describe("Cart updates", () => {
  it("renders empty cart state", () => {
    renderWithProviders(<App />, ["/cart"]);
    expect(screen.getByText("Your cart is empty.")).toBeInTheDocument();
  });
});
