import { describe, it, expect } from "vitest";
import { validateProjectName } from "./validation.js";

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
});
