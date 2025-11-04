import React from "react";
import { render } from "@testing-library/react-native";

import Loader from "../Loader";

describe("Loader", () => {
  it("renders loader component", () => {
    const { container } = render(<Loader />);
    expect(container).toBeTruthy();
  });

  it("renders with large size", () => {
    const { container } = render(<Loader size="large" />);
    expect(container).toBeTruthy();
  });

  it("renders with small size", () => {
    const { container } = render(<Loader size="small" />);
    expect(container).toBeTruthy();
  });
});

