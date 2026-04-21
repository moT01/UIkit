import { strict as assert } from "node:assert";
import { test } from "node:test";
import { nav, flatNav } from "./nav.ts";

test("nav sections are non-empty", () => {
  assert.ok(nav.length > 0);
  for (const section of nav) {
    assert.ok(section.id.length > 0, `section ${section.label} missing id`);
    assert.ok(section.items.length > 0, `section ${section.label} empty`);
  }
});

test("flatNav contains every item", () => {
  const expected = nav.reduce((sum, s) => sum + s.items.length, 0);
  assert.equal(flatNav.length, expected);
});

test("flatNav entries carry section id", () => {
  for (const entry of flatNav) {
    assert.ok(entry.section.length > 0);
    assert.ok(entry.id.length > 0);
    assert.ok(entry.label.length > 0);
  }
});

test("nav ids are unique across all items", () => {
  const ids = flatNav.map((i) => i.id);
  assert.equal(new Set(ids).size, ids.length);
});
