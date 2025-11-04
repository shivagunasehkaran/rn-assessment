import React from "react";
import { render, fireEvent } from "@testing-library/react-native";
import { Platform } from "react-native";

import SearchBar from "../SearchBar";

describe("SearchBar", () => {
  const mockOnChangeText = jest.fn();

  beforeEach(() => {
    jest.clearAllMocks();
  });

  it("renders with placeholder", () => {
    const { getByPlaceholderText } = render(
      <SearchBar value="" onChangeText={mockOnChangeText} placeholder="Search..." />
    );

    expect(getByPlaceholderText("Search...")).toBeTruthy();
  });

  it("calls onChangeText when text is entered", () => {
    const { getByPlaceholderText } = render(
      <SearchBar value="" onChangeText={mockOnChangeText} placeholder="Search..." />
    );

    const input = getByPlaceholderText("Search...");
    fireEvent.changeText(input, "test query");

    expect(mockOnChangeText).toHaveBeenCalledWith("test query");
  });

  it("displays current value", () => {
    const { getByDisplayValue } = render(
      <SearchBar value="current value" onChangeText={mockOnChangeText} />
    );

    expect(getByDisplayValue("current value")).toBeTruthy();
  });

  it("renders clear button on Android when value exists", () => {
    const originalPlatform = Platform.OS;
    Platform.OS = "android";
    
    const { getByText } = render(
      <SearchBar value="test" onChangeText={mockOnChangeText} />
    );

    const clearButton = getByText("×");
    expect(clearButton).toBeTruthy();
    
    Platform.OS = originalPlatform;
  });

  it("calls onChangeText with empty string when clear button is pressed on Android", () => {
    const originalPlatform = Platform.OS;
    Platform.OS = "android";
    
    const { getByText } = render(
      <SearchBar value="test" onChangeText={mockOnChangeText} />
    );

    const clearButton = getByText("×");
    fireEvent.press(clearButton);

    expect(mockOnChangeText).toHaveBeenCalledWith("");
    
    Platform.OS = originalPlatform;
  });
});

