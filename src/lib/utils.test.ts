import { describe, expect, it } from "vitest";
import { cn } from "./utils";

describe("cn", () => {
  it("merges tailwind classes and keeps last conflict", () => {
    expect(cn("p-2", "p-4", "text-sm")).toBe("p-4 text-sm");
  });

  it("handles conditional values", () => {
    expect(cn("p-2", false && "hidden", undefined, "m-1")).toBe("p-2 m-1");
  });
});
