import { describe, it, expect } from "vitest";
import { screen } from "@testing-library/react";
import ProductCard from "../../src/components/product/ProductCard";
import { products } from "../../src/services/mockData";
import { renderWithProviders } from "../test-utils";

describe("Product components", () => {
  it("renders product card", () => {
    renderWithProviders(<ProductCard product={products[0]} />);
    expect(screen.getByText(products[0].name)).toBeInTheDocument();
  });
});
