import { describe, it, expect } from "vitest";
import { validateProjectName, isPackageManagerInstalled } from "./validation.js";

describe("validateProjectName", () => {
  it("should accept valid kebab-case names", () => {
    expect(validateProjectName("my-app")).toBeUndefined();
    expect(validateProjectName("app")).toBeUndefined();
    expect(validateProjectName("my-cool-app-123")).toBeUndefined();
    expect(validateProjectName("a")).toBeUndefined();
  });

  it("should reject empty names", () => {
    expect(validateProjectName("")).toBe("Project name is required");
  });

  it("should reject names with uppercase letters", () => {
    expect(validateProjectName("MyApp")).toBeDefined();
  });

  it("should reject names starting with a hyphen", () => {
    expect(validateProjectName("-my-app")).toBeDefined();
  });

  it("should reject names with special characters", () => {
    expect(validateProjectName("my_app")).toBeDefined();
    expect(validateProjectName("my app")).toBeDefined();
    expect(validateProjectName("my.app")).toBeDefined();
  });

  it("should reject names exceeding 214 characters", () => {
    const longName = "a".repeat(215);
    expect(validateProjectName(longName)).toBe("Project name must be 214 characters or less");
  });
});

describe("isPackageManagerInstalled", () => {
  it("should return true for npm (always available with Node)", () => {
    expect(isPackageManagerInstalled("npm")).toBe(true);
  });

  it("should return a boolean for pnpm", () => {
    const result = isPackageManagerInstalled("pnpm");
    expect(typeof result).toBe("boolean");
  });

  it("should return a boolean for yarn", () => {
    const result = isPackageManagerInstalled("yarn");
    expect(typeof result).toBe("boolean");
  });
});
