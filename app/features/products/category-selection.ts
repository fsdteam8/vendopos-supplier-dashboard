import type { Category } from "../categories/types";

export function getRegionCategory(
  categories: Category[] | undefined,
  regionId: string,
): Category | undefined {
  return categories?.find((category) => category._id === regionId);
}

export function getProductTypeOptions(category: Category | undefined): string[] {
  return category?.categories.map(({ productType }) => productType) ?? [];
}

export function getProductNamesForType(
  category: Category | undefined,
  productType: string,
): string[] {
  return (
    category?.categories.find((item) => item.productType === productType)
      ?.productName ?? []
  );
}
