import assert from "node:assert/strict";
import test from "node:test";

import {
  getProductNamesForType,
  getProductTypeOptions,
  getRegionCategory,
} from "./category-selection.ts";

const category = {
  _id: "african-food",
  region: "African Food",
  slug: "african-food",
  categories: [
    {
      productType: "Grains & Rice",
      productName: ["White Rice", "Brown Rice"],
    },
    {
      productType: "Spices & Seasonings",
      productName: ["Curry Powder"],
    },
  ],
  country: ["Nigeria"],
  createdAt: "2026-01-01T00:00:00.000Z",
  updatedAt: "2026-01-01T00:00:00.000Z",
};

test("keeps the product-type name as the selected value and narrows sub-categories", () => {
  const selectedRegion = getRegionCategory([category], "african-food");

  assert.equal(selectedRegion, category);
  assert.deepEqual(getProductTypeOptions(selectedRegion), [
    "Grains & Rice",
    "Spices & Seasonings",
  ]);
  assert.deepEqual(getProductNamesForType(selectedRegion, "Grains & Rice"), [
    "White Rice",
    "Brown Rice",
  ]);
  assert.deepEqual(getProductNamesForType(selectedRegion, "african-food"), []);
});
