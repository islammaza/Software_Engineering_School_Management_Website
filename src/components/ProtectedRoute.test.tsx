import { describe, expect, it, vi } from "vitest";
import { render, screen } from "@testing-library/react";
import { MemoryRouter, Route, Routes } from "react-router-dom";
import ProtectedRoute from "./auth/ProtectedRoute";
import { isAuthenticated } from "@/lib/auth";

vi.mock("@/lib/auth", () => ({
  isAuthenticated: vi.fn(),
}));

const ProtectedContent = () => <div>protected content</div>;
const LoginPage = () => <div>login page</div>;

describe("ProtectedRoute", () => {
  it("redirects to /login when not authenticated", async () => {
    (isAuthenticated as unknown as ReturnType<typeof vi.fn>).mockReturnValue(
      false,
    );

    render(
      <MemoryRouter initialEntries={["/groups"]}>
        <Routes>
          <Route path="/login" element={<LoginPage />} />
          <Route
            path="/groups"
            element={
              <ProtectedRoute>
                <ProtectedContent />
              </ProtectedRoute>
            }
          />
        </Routes>
      </MemoryRouter>,
    );

    expect(await screen.findByText("login page")).toBeInTheDocument();
  });

  it("renders children when authenticated", async () => {
    (isAuthenticated as unknown as ReturnType<typeof vi.fn>).mockReturnValue(
      true,
    );

    render(
      <MemoryRouter initialEntries={["/groups"]}>
        <Routes>
          <Route path="/login" element={<LoginPage />} />
          <Route
            path="/groups"
            element={
              <ProtectedRoute>
                <ProtectedContent />
              </ProtectedRoute>
            }
          />
        </Routes>
      </MemoryRouter>,
    );

    expect(await screen.findByText("protected content")).toBeInTheDocument();
  });
});
