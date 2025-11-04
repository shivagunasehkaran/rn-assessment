import React from "react";
import { render, fireEvent } from "@testing-library/react-native";

import ErrorState from "../ErrorState";

describe("ErrorState", () => {
  const mockOnRetry = jest.fn();

  beforeEach(() => {
    jest.clearAllMocks();
  });

  it("renders error message", () => {
    const { getByText } = render(
      <ErrorState message="Something went wrong" />
    );

    expect(getByText("Something went wrong")).toBeTruthy();
  });

  it("renders retry button when onRetry is provided", () => {
    const { getByText } = render(
      <ErrorState message="Error" onRetry={mockOnRetry} />
    );

    expect(getByText("Retry")).toBeTruthy();
  });

  it("does not render retry button when onRetry is not provided", () => {
    const { queryByText } = render(<ErrorState message="Error" />);

    expect(queryByText("Retry")).toBeNull();
  });

  it("calls onRetry when retry button is pressed", () => {
    const { getByText } = render(
      <ErrorState message="Error" onRetry={mockOnRetry} />
    );

    fireEvent.press(getByText("Retry"));
    expect(mockOnRetry).toHaveBeenCalledTimes(1);
  });
});

