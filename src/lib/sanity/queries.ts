export const ALL_PLANS_QUERY = `
  *[_type == "plan"] | order(category asc, displayOrder asc, name asc) {
    "id": planId.current,
    name,
    carrier,
    "category": category,
    tier,
    monthlyPremium,
    annualDeductible,
    rating,
    reviewCount,
    tagline,
    highlights,
    benefits[] { label, value, "included": coalesce(included, true) },
    coinsurance,
    maxBenefit,
    waitingPeriod,
    availableStates,
    "popular": coalesce(popular, false),
    badge
  }
`;

export const PLAN_BY_ID_QUERY = `
  *[_type == "plan" && planId.current == $id][0] {
    "id": planId.current,
    name,
    carrier,
    "category": category,
    tier,
    monthlyPremium,
    annualDeductible,
    rating,
    reviewCount,
    tagline,
    highlights,
    benefits[] { label, value, "included": coalesce(included, true) },
    coinsurance,
    maxBenefit,
    waitingPeriod,
    availableStates,
    "popular": coalesce(popular, false),
    badge
  }
`;

export const PLANS_BY_CATEGORY_QUERY = `
  *[_type == "plan" && category == $category] | order(displayOrder asc, name asc) {
    "id": planId.current,
    name,
    carrier,
    "category": category,
    tier,
    monthlyPremium,
    annualDeductible,
    rating,
    reviewCount,
    tagline,
    highlights,
    benefits[] { label, value, "included": coalesce(included, true) },
    coinsurance,
    maxBenefit,
    waitingPeriod,
    availableStates,
    "popular": coalesce(popular, false),
    badge
  }
`;

export const ALL_CATEGORIES_QUERY = `
  *[_type == "category"] | order(displayOrder asc) {
    "slug": slug.current,
    name,
    shortName,
    icon,
    color,
    bgColor,
    description,
    longDescription,
    whoNeedsIt,
    keyBenefits,
    faqs[] { question, answer }
  }
`;

export const CATEGORY_BY_SLUG_QUERY = `
  *[_type == "category" && slug.current == $slug][0] {
    "slug": slug.current,
    name,
    shortName,
    icon,
    color,
    bgColor,
    description,
    longDescription,
    whoNeedsIt,
    keyBenefits,
    faqs[] { question, answer }
  }
`;
