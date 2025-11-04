import React from "react";
import { render, fireEvent } from "@testing-library/react-native";

import TrackCard from "../TrackCard";

describe("TrackCard", () => {
  const mockOnPress = jest.fn();

  const defaultProps = {
    title: "Test Track",
    artist: "Test Artist",
    onPress: mockOnPress,
  };

  beforeEach(() => {
    jest.clearAllMocks();
  });

  it("renders track title and artist", () => {
    const { getByText } = render(<TrackCard {...defaultProps} />);

    expect(getByText("Test Track")).toBeTruthy();
    expect(getByText("Test Artist")).toBeTruthy();
  });

  it("calls onPress when pressed", () => {
    const { getByText } = render(<TrackCard {...defaultProps} />);

    const trackCard = getByText("Test Track").parent?.parent;
    if (trackCard) {
      fireEvent.press(trackCard);
      expect(mockOnPress).toHaveBeenCalledTimes(1);
    }
  });

  it("renders correctly with image URL", () => {
    const { getByText } = render(
      <TrackCard {...defaultProps} imageUrl="https://example.com/image.jpg" />
    );

    // Component should still render title and artist
    expect(getByText("Test Track")).toBeTruthy();
    expect(getByText("Test Artist")).toBeTruthy();
  });
});

