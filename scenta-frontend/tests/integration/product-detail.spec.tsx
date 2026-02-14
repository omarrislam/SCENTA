import { describe, it, expect } from "vitest";
import { screen } from "@testing-library/react";
import App from "../../src/app/App";
import { renderWithProviders } from "../test-utils";

describe("Product detail flow", () => {
  it("renders product details", async () => {
    renderWithProviders(<App />, ["/product/silk-amber"]);
    expect(await screen.findByText("Silk Amber")).toBeInTheDocument();
  });
});
