import { describe, it, expect } from "vitest";
import { screen } from "@testing-library/react";
import App from "../../src/app/App";
import { renderWithProviders } from "../test-utils";

describe("Blog routes", () => {
  it("renders blog list", async () => {
    renderWithProviders(<App />, ["/blog"]);
    expect(await screen.findByRole("heading", { name: "Journal" })).toBeInTheDocument();
  });
});
