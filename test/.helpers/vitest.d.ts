import "@testing-library/jest-dom";

declare module "vitest" {
  interface Expect extends jest.Matchers<void> {
    toBeInTheDocument(): void;
  }
}
