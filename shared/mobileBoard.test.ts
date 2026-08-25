import { describe, expect, it } from "vitest";
import { autoScrollDelta, clampScrollLeft, edgeScrollSpeed } from "./mobileBoard";

describe("mobile board scrolling", () => {
  it("scrolls toward the left and right edge only", () => {
    expect(autoScrollDelta(10, 0, 375, 60, 20)).toBe(-20);
    expect(autoScrollDelta(370, 0, 375, 60, 20)).toBe(20);
    expect(autoScrollDelta(190, 0, 375, 60, 20)).toBe(0);
  });

  it("uses a smooth distance-based speed inside the 30-50px trigger zone", () => {
    expect(edgeScrollSpeed(4, 0, 375, 44, 18)).toBe(-16);
    expect(edgeScrollSpeed(44, 0, 375, 44, 18)).toBe(-3);
    expect(edgeScrollSpeed(331, 0, 375, 44, 18)).toBe(3);
    expect(edgeScrollSpeed(371, 0, 375, 44, 18)).toBe(16);
    expect(edgeScrollSpeed(190, 0, 375, 44, 18)).toBe(0);
  });

  it("keeps scrollLeft inside the board bounds", () => {
    expect(clampScrollLeft(-20, 1200, 375)).toBe(0);
    expect(clampScrollLeft(500, 1200, 375)).toBe(500);
    expect(clampScrollLeft(1400, 1200, 375)).toBe(825);
  });
});
