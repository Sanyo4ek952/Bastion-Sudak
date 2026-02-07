import test from "node:test";
import assert from "node:assert/strict";

import { getPriceForDateRange } from "./getPriceForDateRange";

const date = (value: string) => new Date(`${value}T00:00:00.000Z`);

test("returns standard room price for season and board", () => {
  const price = getPriceForDateRange(
    "standard",
    "seaView",
    "dbl",
    date("2024-01-10"),
    date("2024-01-12"),
    "RO"
  );
  assert.equal(price, 3000);
});

test("returns null for unavailable occupancy", () => {
  const price = getPriceForDateRange(
    "standard",
    "twoRoom",
    "trpl",
    date("2024-01-10"),
    date("2024-01-12"),
    "RO"
  );
  assert.equal(price, null);
});

test("returns economy price for June season", () => {
  const price = getPriceForDateRange(
    "economy",
    "oneRoom",
    "sngl",
    date("2024-06-05"),
    date("2024-06-07"),
    "BB"
  );
  assert.equal(price, 3800);
});
