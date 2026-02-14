import { describe, it, expect } from "vitest";
import { screen } from "@testing-library/react";
import App from "../../src/app/App";
import { renderWithProviders } from "../test-utils";

describe("Shop filters", () => {
  it("shows filtered products based on search", async () => {
    renderWithProviders(<App />, ["/shop?q=rose"]);
    expect(await screen.findByText("Rose Veil")).toBeInTheDocument();
  });
});
