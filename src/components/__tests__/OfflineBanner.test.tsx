import React from "react";
import { render } from "@testing-library/react-native";

import OfflineBanner from "../OfflineBanner";

describe("OfflineBanner", () => {
  it("renders when visible is true", () => {
    const { getByText } = render(<OfflineBanner visible={true} />);

    expect(getByText("You are offline. Showing cached results.")).toBeTruthy();
  });

  it("does not render when visible is false", () => {
    const { queryByText } = render(<OfflineBanner visible={false} />);

    expect(
      queryByText("You are offline. Showing cached results.")
    ).toBeNull();
  });
});

