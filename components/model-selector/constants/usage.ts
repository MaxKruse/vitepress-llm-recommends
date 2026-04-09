export const RECOMMENDED_USAGE = {
  CODING: 1 << 0,
  INSTRUCT: 1 << 1,
  PERSONAL_ASSISTANT: 1 << 2,
  STEM: 1 << 3,
  STORYWRITING: 1 << 4,
  VISION: 1 << 5,
} as const;

export type RecommendedUsageMask = number;

export type UsageKey =
  | "coding"
  | "instruct"
  | "personal-assistant"
  | "stem"
  | "storywriting"
  | "vision";

export interface UsageLink {
  key: UsageKey;
  label: string;
  href: string;
}

export const USAGE_DEFINITIONS: Array<UsageLink & { flag: number }> = [
  {
    key: "coding",
    label: "Coding",
    href: "/recommendations/coding/",
    flag: RECOMMENDED_USAGE.CODING,
  },
  {
    key: "instruct",
    label: "Instruct",
    href: "/recommendations/instruct/",
    flag: RECOMMENDED_USAGE.INSTRUCT,
  },
  {
    key: "personal-assistant",
    label: "Personal Assistant",
    href: "/recommendations/personal-assistant/",
    flag: RECOMMENDED_USAGE.PERSONAL_ASSISTANT,
  },
  {
    key: "stem",
    label: "STEM",
    href: "/recommendations/stem/",
    flag: RECOMMENDED_USAGE.STEM,
  },
  {
    key: "storywriting",
    label: "Storywriting",
    href: "/recommendations/storywriting/",
    flag: RECOMMENDED_USAGE.STORYWRITING,
  },
  {
    key: "vision",
    label: "Vision",
    href: "/recommendations/vision/",
    flag: RECOMMENDED_USAGE.VISION,
  },
];

export function combineUsage(...flags: number[]): RecommendedUsageMask {
  return flags.reduce((mask, flag) => mask | flag, 0);
}

export function getUsageLinks(mask: RecommendedUsageMask): UsageLink[] {
  return USAGE_DEFINITIONS.filter(
    (definition) => (mask & definition.flag) === definition.flag,
  ).map(({ flag: _flag, ...link }) => link);
}

export function getUsageByKey(key: UsageKey): UsageLink & { flag: number } {
  const match = USAGE_DEFINITIONS.find((definition) => definition.key === key);

  if (!match) {
    throw new Error(`Unknown usage key: ${key}`);
  }

  return match;
}
