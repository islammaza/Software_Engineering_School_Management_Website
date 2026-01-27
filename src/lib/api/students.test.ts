import { beforeEach, describe, expect, it, vi } from "vitest";

vi.mock("../supabaseClient", () => {
  type Call = { method: string; args: unknown[] };
  const calls: Call[] = [];

  const createBuilder = (result: { data: unknown[]; error: unknown } = { data: [], error: null }) => {
    const builder: any = {
      select: (...args: unknown[]) => {
        calls.push({ method: "select", args });
        return builder;
      },
      eq: (...args: unknown[]) => {
        calls.push({ method: "eq", args });
        return builder;
      },
      neq: (...args: unknown[]) => {
        calls.push({ method: "neq", args });
        return builder;
      },
      then: (onFulfilled: any, onRejected: any) => Promise.resolve(result).then(onFulfilled, onRejected),
    };
    return builder;
  };

  const supabase = {
    from: (table: string) => {
      calls.push({ method: "from", args: [table] });
      return createBuilder();
    },
  };

  return {
    supabase,
    __getCalls: () => calls,
    __resetCalls: () => {
      calls.length = 0;
    },
  };
});

import { checkDuplicateStudent } from "./students";
// eslint-disable-next-line @typescript-eslint/consistent-type-imports
import { __getCalls, __resetCalls } from "../supabaseClient";

describe("checkDuplicateStudent", () => {
  beforeEach(() => {
    __resetCalls();
  });

  it("trims name and strips non-digits from phone", async () => {
    const res = await checkDuplicateStudent(5, "  Ali  ", "+20 (010) 123-4567", "2001-01-01");

    expect(res.error).toBeNull();
    expect(res.data?.exists).toBe(false);

    const calls = __getCalls();
    expect(calls).toEqual(
      expect.arrayContaining([
        { method: "from", args: ["students"] },
        { method: "eq", args: ["group_id", 5] },
        { method: "eq", args: ["full_name", "Ali"] },
        { method: "eq", args: ["contact_info", "200101234567"] },
        { method: "eq", args: ["date_of_birth", "2001-01-01"] },
      ])
    );
  });

  it("adds neq filter when excludeStudentId is provided", async () => {
    await checkDuplicateStudent(2, "Sara", "1234", "1999-12-31", 77);

    const calls = __getCalls();
    expect(calls).toEqual(expect.arrayContaining([{ method: "neq", args: ["id", 77] }]));
  });
});
