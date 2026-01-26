import { beforeEach, describe, expect, it, vi } from "vitest";
import { getSchoolId, isAuthenticated, logout, requireAuth } from "./auth";

describe("auth helpers", () => {
  beforeEach(() => {
    window.localStorage.clear();
    window.sessionStorage.clear();
    // reset side-effects
    // @ts-expect-error jsdom
    window.onpopstate = null;
  });

  it("isAuthenticated is false when no schoolId", () => {
    expect(getSchoolId()).toBeNull();
    expect(isAuthenticated()).toBe(false);
  });

  it("isAuthenticated is true when schoolId exists", () => {
    window.localStorage.setItem("schoolId", "123");
    expect(isAuthenticated()).toBe(true);
  });

  it("requireAuth navigates to /login when missing schoolId", () => {
    const navigate = vi.fn();
    expect(requireAuth(navigate)).toBeNull();
    expect(navigate).toHaveBeenCalledWith("/login");
  });

  it("requireAuth returns schoolId when present", () => {
    window.localStorage.setItem("schoolId", "abc");
    const navigate = vi.fn();
    expect(requireAuth(navigate)).toBe("abc");
    expect(navigate).not.toHaveBeenCalled();
  });

  it("logout clears storage and blocks back navigation", () => {
    window.localStorage.setItem("schoolId", "1");
    window.localStorage.setItem("adminEmail", "a@b.com");
    window.localStorage.setItem("adminName", "Admin");
    window.localStorage.setItem("somethingElse", "x");
    window.sessionStorage.setItem("tmp", "y");

    const pushStateSpy = vi.spyOn(window.history, "pushState");

    logout();

    expect(window.localStorage.length).toBe(0);
    expect(window.sessionStorage.length).toBe(0);
    expect(pushStateSpy).toHaveBeenCalled();
    expect(typeof window.onpopstate).toBe("function");
  });
});
