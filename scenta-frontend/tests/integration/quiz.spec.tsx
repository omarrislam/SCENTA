import { describe, it, expect } from "vitest";
import { screen } from "@testing-library/react";
import App from "../../src/app/App";
import { renderWithProviders } from "../test-utils";

describe("Quiz flow", () => {
  it("renders quiz start", async () => {
    renderWithProviders(<App />, ["/quiz"]);
    expect(await screen.findByRole("heading", { name: "Find Your Scent" })).toBeInTheDocument();
  });
});
