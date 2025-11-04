import React from "react";
import { render } from "@testing-library/react-native";

import EmptyState from "../EmptyState";

describe("EmptyState", () => {
  it("renders message", () => {
    const { getByText } = render(
      <EmptyState message="No tracks found" />
    );

    expect(getByText("No tracks found")).toBeTruthy();
  });

  it("renders different messages correctly", () => {
    const { getByText, rerender } = render(
      <EmptyState message="Initial message" />
    );

    expect(getByText("Initial message")).toBeTruthy();

    rerender(<EmptyState message="Updated message" />);
    expect(getByText("Updated message")).toBeTruthy();
  });
});

