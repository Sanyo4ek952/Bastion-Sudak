import { test } from "node:test";
import assert from "node:assert/strict";

import { GET } from "./route";
import { parseQuoteSearchParams } from "./quoteSchema";

test("parseQuoteSearchParams accepts valid board and occupancy", () => {
  const url = new URL(
    "https://example.com/api/quote?roomId=room-1&checkIn=2024-07-01&checkOut=2024-07-02&board=BB&occupancy=DBL"
  );
  const result = parseQuoteSearchParams(url);
  assert.equal(result.success, true);
  if (result.success) {
    assert.equal(result.data.board, "BB");
    assert.equal(result.data.occupancy, "DBL");
  }
});

test("parseQuoteSearchParams rejects invalid occupancy", () => {
  const url = new URL(
    "https://example.com/api/quote?roomId=room-1&checkIn=2024-07-01&checkOut=2024-07-02&board=BB&occupancy=QUAD"
  );
  const result = parseQuoteSearchParams(url);
  assert.equal(result.success, false);
});

test("GET returns 400 on invalid board", async () => {
  const request = new Request(
    "https://example.com/api/quote?roomId=room-1&checkIn=2024-07-01&checkOut=2024-07-02&board=INVALID&occupancy=DBL"
  );
  const response = await GET(request);
  assert.equal(response.status, 400);
});
