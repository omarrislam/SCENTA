import { describe, it, expect } from "vitest";
import { screen } from "@testing-library/react";
import App from "../../src/app/App";
import { renderWithProviders } from "../test-utils";

describe("Account auth", () => {
  it("shows login when visiting account without auth", async () => {
    renderWithProviders(<App />, ["/account"]);
    expect(await screen.findByText("Login")).toBeInTheDocument();
  });
});
