import { ImpactLayoutType } from '../../common/enums/impact-layout-type.enum';

/**
 * required:   always an object
 * optional:   an object, or null when the section is switched off
 * repeatable: an array of objects (max = most blocks allowed)
 *
 * Keep in sync with frontend/src/domains/admin/components/impact/layouts.ts.
 */
type SectionRule =
  | { kind: 'required' }
  | { kind: 'optional' }
  | { kind: 'repeatable'; min: number; max: number };

type SectionRules = Record<string, SectionRule>;

const required: SectionRule = { kind: 'required' };
const optional: SectionRule = { kind: 'optional' };

const VILLAGE_HEALTH: SectionRules = {
  intro: required,
  textBlock: required,
  imageGrid: required,
  impactStats: required,
};

export const IMPACT_LAYOUT_SECTIONS: Record<ImpactLayoutType, SectionRules> = {
  [ImpactLayoutType.EDUCATION]: {
    intro: required,
    storyImageRight: required,
    storyImageLeft: required,
    communityStory: required,
    statsStrip: optional,
    gallery: optional,
  },
  [ImpactLayoutType.WOMEN_EMPOWERMENT]: {
    intro: required,
    overview: required,
    howItWorks: required,
    twoImageStories: { kind: 'repeatable', min: 1, max: 4 },
    featureGrid: required,
    impactStats: required,
  },
  [ImpactLayoutType.SKILLS_EMPLOYMENT]: {
    intro: required,
    overview: required,
    video: optional,
    twoImageStory: optional,
    featureGrid: optional,
    impactStats: required,
    gallery: optional,
  },
  [ImpactLayoutType.MODEL_VILLAGE]: VILLAGE_HEALTH,
  [ImpactLayoutType.HEALTH]: VILLAGE_HEALTH,
};

/** Generous cap so a page can't bloat the row; real pages are a few KB. */
export const MAX_CONTENT_BYTES = 256 * 1024;

const isPlainObject = (v: unknown): v is Record<string, unknown> =>
  typeof v === 'object' && v !== null && !Array.isArray(v);

/** Returns a list of problems; empty when the content fits the layout. */
export function validateLayoutContent(
  layoutType: ImpactLayoutType,
  content: unknown,
): string[] {
  if (!isPlainObject(content)) return ['content must be a JSON object'];

  const rules = IMPACT_LAYOUT_SECTIONS[layoutType];
  const errors: string[] = [];

  for (const key of Object.keys(content)) {
    if (!rules[key]) {
      errors.push(`"${key}" is not a section of the ${layoutType} layout`);
    }
  }

  for (const [key, rule] of Object.entries(rules)) {
    if (!(key in content)) continue;
    const value = content[key];

    if (rule.kind === 'repeatable') {
      if (!Array.isArray(value) || !value.every(isPlainObject)) {
        errors.push(`"${key}" must be a list of blocks`);
      } else if (value.length < rule.min || value.length > rule.max) {
        errors.push(`"${key}" must have ${rule.min}–${rule.max} blocks`);
      }
    } else if (value === null) {
      if (rule.kind === 'required') errors.push(`"${key}" is required`);
    } else if (!isPlainObject(value)) {
      errors.push(`"${key}" must be an object`);
    }
  }

  if (Buffer.byteLength(JSON.stringify(content)) > MAX_CONTENT_BYTES) {
    errors.push('content is too large');
  }

  return errors;
}
