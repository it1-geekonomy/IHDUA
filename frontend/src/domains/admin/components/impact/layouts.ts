import type { ImpactLayoutType } from "@/domains/admin/lib/api";

export type FieldDef =
  | { kind: "text"; key: string; label: string; placeholder?: string; required?: boolean; help?: string }
  | { kind: "textarea"; key: string; label: string; placeholder?: string; required?: boolean; rows?: number }
  | { kind: "paragraphs"; key: string; label: string; required?: boolean; max?: number }
  /** Stored as { url, alt } */
  | { kind: "image"; key: string; label: string; required?: boolean; help?: string }
  /** Stored as a URL string (SVG/WebP icon) */
  | { kind: "icon"; key: string; label: string; required?: boolean }
  /** Stored as a URL string (MP4/WebM) */
  | { kind: "video"; key: string; label: string; required?: boolean }
  | { kind: "color"; key: string; label: string }
  | { kind: "select"; key: string; label: string; options: { value: string; label: string }[] }
  /** Stored as { label, href } */
  | { kind: "button"; key: string; label: string; required?: boolean; placeholder?: string }
  | { kind: "group"; key: string; label: string; fields: FieldDef[] }
  | {
      kind: "list";
      key: string;
      label: string;
      itemLabel: string;
      fields: FieldDef[];
      min?: number;
      max?: number;
    }
  /** List of { url, alt } */
  | { kind: "images"; key: string; label: string; min?: number; max?: number };

export interface SectionDef {
  key: string;
  title: string;
  description: string;
  /** Optional sections can be switched off; their content is saved as null. */
  optional?: boolean;
  /** Repeatable sections are saved as an array of blocks. */
  repeatable?: { min: number; max: number; itemLabel: string };
  fields: FieldDef[];
}

export interface ImpactCategoryDef {
  /** URL segment in the admin and the default website slug */
  slug: string;
  name: string;
  layoutType: ImpactLayoutType;
  displayOrder: number;
  summary: string;
  examples: Examples;
  sections: SectionDef[];
}

/** Category-specific placeholder text, taken from the existing website pages. */
interface Examples {
  pageName: string;
  slug: string;
  eyebrow: string;
  introHeading: string;
  highlight: string;
  statValue: string;
  statLabel: string;
  storyHeading: string;
  textBlockEyebrow?: string;
  textBlockHeading?: string;
  button?: string;
}

const eg = (s?: string) => (s ? `e.g. ${s}` : undefined);

const highlightItem = (ex: Examples): FieldDef[] => [
  { kind: "icon", key: "iconUrl", label: "Icon", required: true },
  { kind: "text", key: "heading", label: "Heading", required: true, placeholder: eg(`${ex.highlight} or Mission`) },
  { kind: "textarea", key: "description", label: "Description", rows: 2 },
];

const statItem = (ex: Examples): FieldDef[] => [
  { kind: "icon", key: "iconUrl", label: "Icon", required: true },
  { kind: "color", key: "iconBg", label: "Icon background" },
  { kind: "text", key: "value", label: "Value", required: true, placeholder: eg(ex.statValue) },
  { kind: "text", key: "label", label: "Label", required: true, placeholder: eg(ex.statLabel) },
];

const featureItem: FieldDef[] = [
  { kind: "icon", key: "iconUrl", label: "Icon", required: true },
  { kind: "text", key: "title", label: "Title", required: true },
  { kind: "textarea", key: "description", label: "Description", rows: 2, required: true },
];

function introSection(ex: Examples, withButton: boolean): SectionDef {
  return {
    key: "intro",
    title: "Intro & Highlights",
    description: "Small label, page heading, short description and two highlight cards below the banner.",
    fields: [
      { kind: "text", key: "eyebrow", label: "Small label", placeholder: eg(ex.eyebrow) },
      { kind: "text", key: "heading", label: "Heading", required: true, placeholder: eg(ex.introHeading) },
      { kind: "textarea", key: "description", label: "Description", rows: 3 },
      ...(withButton
        ? [{ kind: "button", key: "button", label: "Button (optional)", placeholder: ex.button } as FieldDef]
        : []),
      { kind: "list", key: "highlights", label: "Highlight cards", itemLabel: "Highlight", fields: highlightItem(ex), min: 2, max: 2 },
    ],
  };
}

function storySection(
  key: string,
  title: string,
  description: string,
  headingExample?: string,
  buttonExample?: string,
): SectionDef {
  return {
    key,
    title,
    description,
    fields: [
      { kind: "text", key: "heading", label: "Heading", required: true, placeholder: eg(headingExample) },
      { kind: "paragraphs", key: "paragraphs", label: "Paragraphs", required: true, max: 5 },
      { kind: "image", key: "image", label: "Image", required: true },
      ...(buttonExample
        ? [{ kind: "button", key: "button", label: "Button (optional)", placeholder: buttonExample } as FieldDef]
        : []),
    ],
  };
}

const twoImageStoryFields = (heading: string): FieldDef[] => [
  { kind: "text", key: "heading", label: "Heading", required: true, placeholder: eg(heading) },
  { kind: "textarea", key: "topDescription", label: "Text above images", rows: 3, required: true },
  { kind: "images", key: "images", label: "Images", min: 2, max: 2 },
  { kind: "textarea", key: "bottomDescription", label: "Text below images", rows: 3 },
];

const featureGridFields = (eyebrow: string, heading: string): FieldDef[] => [
  { kind: "text", key: "eyebrow", label: "Small label", placeholder: eg(eyebrow) },
  { kind: "text", key: "heading", label: "Heading", required: true, placeholder: eg(heading) },
  { kind: "paragraphs", key: "paragraphs", label: "Paragraphs", max: 4 },
  { kind: "list", key: "features", label: "Feature cards", itemLabel: "Feature", fields: featureItem, min: 1, max: 4 },
];

function impactStatsSection(ex: Examples, withStyle: boolean): SectionDef {
  return {
    key: "impactStats",
    title: "Impact Stats",
    description: "\"The Impact We Make\" panel with four numbers.",
    fields: [
      ...(withStyle
        ? [
            {
              kind: "select",
              key: "style",
              label: "Style",
              options: [
                { value: "panel", label: "Full panel (heading, text and banner)" },
                { value: "strip", label: "Compact strip (numbers only)" },
              ],
            } as FieldDef,
          ]
        : []),
      { kind: "text", key: "heading", label: "Heading", placeholder: "The Impact We Make" },
      { kind: "paragraphs", key: "paragraphs", label: "Paragraphs", max: 3 },
      { kind: "text", key: "bannerHeading", label: "Banner heading", placeholder: "Creating Lasting Change" },
      { kind: "list", key: "stats", label: "Stats", itemLabel: "Stat", fields: statItem(ex), min: 4, max: 4 },
    ],
  };
}

function villageHealthSections(ex: Examples): SectionDef[] {
  return [
    introSection(ex, false),
    {
      key: "textBlock",
      title: "Why It Matters",
      description: "Centered text block with a small label, heading and paragraphs.",
      fields: [
        { kind: "text", key: "eyebrow", label: "Small label", placeholder: eg(ex.textBlockEyebrow) },
        { kind: "text", key: "heading", label: "Heading", required: true, placeholder: eg(ex.textBlockHeading) },
        { kind: "paragraphs", key: "paragraphs", label: "Paragraphs", required: true, max: 4 },
      ],
    },
    {
      key: "imageGrid",
      title: "Image Grid",
      description: "Heading, text and a 2×2 grid of four photos.",
      fields: [
        { kind: "text", key: "heading", label: "Heading", required: true, placeholder: eg(ex.storyHeading) },
        { kind: "paragraphs", key: "paragraphs", label: "Paragraphs", max: 3 },
        { kind: "images", key: "images", label: "Photos", min: 4, max: 4 },
      ],
    },
    impactStatsSection(ex, false),
  ];
}

const EXAMPLES = {
  education: {
    pageName: "Adarsha Academy KRS",
    slug: "adarsha-academy-krs",
    eyebrow: "EDUCATION",
    introHeading: "Adarsha Academy",
    highlight: "3,000+",
    statValue: "3,000+",
    statLabel: "Students",
    storyHeading: "Education in a Rural Setting",
    button: "Visit School Website",
  },
  women: {
    pageName: "Self-Help Group & Federation",
    slug: "self-help-group-federation",
    eyebrow: "WOMEN EMPOWERMENT",
    introHeading: "Self Help Group & Federation",
    highlight: "7,578+",
    statValue: "7,578+",
    statLabel: "Women in self-help groups",
    storyHeading: "The Power of Collective Action",
  },
  skills: {
    pageName: "Youth",
    slug: "youth",
    eyebrow: "SKILLS & EMPLOYMENT",
    introHeading: "Youth Skill Development",
    highlight: "514+",
    statValue: "514+",
    statLabel: "Youth trained",
    storyHeading: "Why Youth Skill Development Matters",
    button: "View All Photos",
  },
  village: {
    pageName: "Rejuvenation of Villages",
    slug: "rejuvenation-of-villages",
    eyebrow: "MODEL VILLAGE",
    introHeading: "Rejuvenation of Villages",
    highlight: "16+",
    statValue: "16+",
    statLabel: "Villages",
    storyHeading: "Sustainable Village Development",
    textBlockEyebrow: "WHY VILLAGE DEVELOPMENT MATTERS",
    textBlockHeading: "Building Stronger Rural Communities",
  },
  health: {
    pageName: "Health Awareness",
    slug: "health-awareness",
    eyebrow: "HEALTH",
    introHeading: "Health Awareness",
    highlight: "855",
    statValue: "855",
    statLabel: "People reached",
    storyHeading: "Creating Awareness in Communities",
    textBlockEyebrow: "WHY HEALTH AWARENESS MATTERS",
    textBlockHeading: "Prevention Starts With Awareness",
  },
} satisfies Record<string, Examples>;

export const IMPACT_CATEGORIES: ImpactCategoryDef[] = [
  {
    slug: "education",
    name: "Education",
    layoutType: "education",
    displayOrder: 1,
    summary: "School pages such as Vinayaka Jnana Vidyashale and Adarsha Academy KRS.",
    examples: EXAMPLES.education,
    sections: [
      introSection(EXAMPLES.education, true),
      storySection("storyImageRight", "Story (image right)", "Heading and paragraphs with a photo on the right.", "Education in a Rural Setting"),
      storySection("storyImageLeft", "Story (image left)", "Heading and paragraphs with a photo on the left. Shows \"View All Photos\" when a gallery is added.", "Education for Rural Children"),
      {
        key: "communityStory",
        title: "Community Story",
        description: "Story with a photo and a highlighted feature card.",
        fields: [
          { kind: "text", key: "heading", label: "Heading", required: true, placeholder: eg("Learning in the Heart of the Community") },
          { kind: "paragraphs", key: "paragraphs", label: "Paragraphs", required: true, max: 3 },
          { kind: "image", key: "image", label: "Image", required: true },
          {
            kind: "group",
            key: "featureCard",
            label: "Feature card",
            fields: [
              { kind: "icon", key: "iconUrl", label: "Icon" },
              { kind: "text", key: "title", label: "Title", required: true, placeholder: eg("A Rural Learning Environment") },
              { kind: "textarea", key: "description", label: "Description", rows: 2 },
            ],
          },
        ],
      },
      {
        key: "statsStrip",
        title: "Stats Strip",
        description: "Row of four numbers, e.g. students, teachers, years.",
        optional: true,
        fields: [
          {
            kind: "list",
            key: "items",
            label: "Stats",
            itemLabel: "Stat",
            fields: statItem(EXAMPLES.education).filter((f) => f.key !== "iconBg"),
            min: 1,
            max: 4,
          },
        ],
      },
      {
        key: "gallery",
        title: "Photo Gallery",
        description: "Separate gallery page at /{slug}/gallery, linked from the image-left story.",
        optional: true,
        fields: [
          { kind: "text", key: "heading", label: "Heading", placeholder: "Gallery" },
          { kind: "text", key: "ctaLabel", label: "Link label", placeholder: "View All Photos" },
          { kind: "images", key: "images", label: "Photos", min: 1, max: 40 },
        ],
      },
    ],
  },
  {
    slug: "women-empowerment",
    name: "Women Empowerment",
    layoutType: "women_empowerment",
    displayOrder: 2,
    summary: "Pages such as Self-Help Group & Federation and Microfinance Initiatives.",
    examples: EXAMPLES.women,
    sections: [
      introSection(EXAMPLES.women, false),
      storySection("overview", "Overview", "Heading and paragraphs with a photo.", EXAMPLES.women.storyHeading),
      {
        key: "howItWorks",
        title: "How It Works",
        description: "Label, heading, description and step cards.",
        fields: [
          { kind: "text", key: "eyebrow", label: "Small label", placeholder: eg("HOW SELF-HELP GROUPS WORK") },
          { kind: "text", key: "heading", label: "Heading", required: true, placeholder: eg("Small Steps. Shared Progress.") },
          { kind: "textarea", key: "description", label: "Description", rows: 3 },
          {
            kind: "list",
            key: "steps",
            label: "Steps",
            itemLabel: "Step",
            min: 1,
            max: 6,
            fields: [
              { kind: "icon", key: "iconUrl", label: "Icon (optional)" },
              { kind: "text", key: "title", label: "Title", required: true, placeholder: eg("Regular Savings") },
              { kind: "textarea", key: "description", label: "Description", rows: 2, required: true },
            ],
          },
        ],
      },
      {
        key: "twoImageStories",
        title: "Two-Image Stories",
        description: "Heading, text, two photos side by side, and closing text. Add more than one block if needed.",
        repeatable: { min: 1, max: 4, itemLabel: "Story block" },
        fields: twoImageStoryFields("Creating Financial Independence for Rural Women"),
      },
      {
        key: "featureGrid",
        title: "Feature Grid",
        description: "Label, heading, text and up to four feature cards in a 2×2 grid.",
        fields: featureGridFields("SELF-HELP GROUPS & FEDERATIONS", "Stronger Communities, Together"),
      },
      impactStatsSection(EXAMPLES.women, false),
    ],
  },
  {
    slug: "skills-and-employment",
    name: "Skills & Employment",
    layoutType: "skills_employment",
    displayOrder: 3,
    summary: "Pages such as Women, Youth, Farmers and Stitching Unit.",
    examples: EXAMPLES.skills,
    sections: [
      introSection(EXAMPLES.skills, false),
      storySection(
        "overview",
        "Overview",
        "Heading and paragraphs with a photo, with an optional button.",
        EXAMPLES.skills.storyHeading,
        EXAMPLES.skills.button,
      ),
      {
        key: "video",
        title: "Videos",
        description: "Heading, text and up to four videos (used on the Stitching Unit page).",
        optional: true,
        fields: [
          { kind: "text", key: "heading", label: "Heading", required: true, placeholder: eg("Forging Paths to Economic Engagement") },
          { kind: "paragraphs", key: "paragraphs", label: "Paragraphs", max: 3 },
          {
            kind: "list",
            key: "videos",
            label: "Videos",
            itemLabel: "Video",
            min: 1,
            max: 4,
            fields: [
              { kind: "video", key: "url", label: "Video file", required: true },
              { kind: "text", key: "title", label: "Title", required: true },
              { kind: "image", key: "poster", label: "Poster image (optional)" },
            ],
          },
          { kind: "paragraphs", key: "bottomParagraphs", label: "Text below videos", max: 3 },
        ],
      },
      {
        key: "twoImageStory",
        title: "Two-Image Story",
        description: "Heading, text, two photos side by side, and closing text.",
        optional: true,
        fields: twoImageStoryFields("Building Skills for a Better Future"),
      },
      {
        key: "featureGrid",
        title: "Feature Grid",
        description: "Label, heading, text and up to four feature cards in a 2×2 grid.",
        optional: true,
        fields: featureGridFields("SKILLS TOGETHER", "Learning Skills, Building Futures"),
      },
      impactStatsSection(EXAMPLES.skills, true),
      {
        key: "gallery",
        title: "Photo Gallery",
        description: "Either a one-row slider on this page, or a separate gallery page at /{slug}/gallery.",
        optional: true,
        fields: [
          { kind: "text", key: "heading", label: "Heading", placeholder: "Gallery" },
          {
            kind: "select",
            key: "displayMode",
            label: "Show as",
            options: [
              { value: "inline", label: "Slider on this page" },
              { value: "page", label: "Separate gallery page" },
            ],
          },
          { kind: "images", key: "images", label: "Photos", min: 1, max: 40 },
        ],
      },
    ],
  },
  {
    slug: "model-village",
    name: "Model Village",
    layoutType: "model_village",
    displayOrder: 4,
    summary: "Pages such as Rejuvenation of Villages and Increase the Green Cover.",
    examples: EXAMPLES.village,
    sections: villageHealthSections(EXAMPLES.village),
  },
  {
    slug: "health",
    name: "Health",
    layoutType: "health",
    displayOrder: 5,
    summary: "Pages such as Health Awareness and Health Camps.",
    examples: EXAMPLES.health,
    sections: villageHealthSections(EXAMPLES.health),
  },
];

export function getCategoryDef(slug: string): ImpactCategoryDef | undefined {
  return IMPACT_CATEGORIES.find((c) => c.slug === slug);
}

type Json = Record<string, unknown>;

export function emptyFieldValue(field: FieldDef): unknown {
  switch (field.kind) {
    case "image":
      return { url: "", alt: "" };
    case "button":
      return { label: "", href: "" };
    case "paragraphs":
      return [""];
    case "select":
      return field.options[0]?.value ?? "";
    case "group":
      return emptyObject(field.fields);
    case "list":
      return Array.from({ length: field.min ?? 1 }, () => emptyObject(field.fields));
    case "images":
      return Array.from({ length: field.min ?? 1 }, () => ({ url: "", alt: "" }));
    default:
      return "";
  }
}

export function emptyObject(fields: FieldDef[]): Json {
  return Object.fromEntries(fields.map((f) => [f.key, emptyFieldValue(f)]));
}

export function emptySection(section: SectionDef): unknown {
  if (section.repeatable) {
    return Array.from({ length: section.repeatable.min }, () => emptyObject(section.fields));
  }
  return section.optional ? null : emptyObject(section.fields);
}

export function emptyContent(sections: SectionDef[]): Json {
  return Object.fromEntries(sections.map((s) => [s.key, emptySection(s)]));
}

/** Fills keys missing from saved content (e.g. sections added to a layout later). */
export function mergeContent(sections: SectionDef[], saved: unknown): Json {
  const base = emptyContent(sections);
  if (!saved || typeof saved !== "object") return base;
  const stored = saved as Json;
  for (const section of sections) {
    if (section.key in stored) base[section.key] = stored[section.key];
  }
  return base;
}

const isBlank = (v: unknown) => typeof v !== "string" || v.trim() === "";

function validateFields(fields: FieldDef[], value: Json, path: string, errors: string[]) {
  for (const field of fields) {
    const v = value?.[field.key];
    const where = `${path} › ${field.label}`;
    switch (field.kind) {
      case "image":
        if (field.required && isBlank((v as Json)?.url)) errors.push(`${where}: add an image`);
        break;
      case "button": {
        const b = (v as Json) ?? {};
        if (!isBlank(b.label) && isBlank(b.href)) errors.push(`${where}: add the button link`);
        break;
      }
      case "paragraphs":
        if (field.required && !(v as string[] | undefined)?.some((p) => !isBlank(p))) {
          errors.push(`${where}: add at least one paragraph`);
        }
        break;
      case "group":
        validateFields(field.fields, (v as Json) ?? {}, where, errors);
        break;
      case "list": {
        const items = (v as Json[]) ?? [];
        if (field.min && items.length < field.min) errors.push(`${where}: needs ${field.min}`);
        items.forEach((item, i) => validateFields(field.fields, item, `${where} ${i + 1}`, errors));
        break;
      }
      case "images": {
        const filled = ((v as Json[]) ?? []).filter((img) => !isBlank(img?.url)).length;
        if (field.min && filled < field.min) errors.push(`${where}: add at least ${field.min}`);
        break;
      }
      case "select":
      case "color":
        break;
      default:
        if (field.required && isBlank(v)) errors.push(`${where}: required`);
    }
  }
}

export function validateContent(sections: SectionDef[], content: Json): string[] {
  const errors: string[] = [];
  for (const section of sections) {
    const value = content[section.key];
    if (value === null || value === undefined) continue;
    if (section.repeatable) {
      (value as Json[]).forEach((block, i) =>
        validateFields(section.fields, block, `${section.title} ${i + 1}`, errors),
      );
    } else {
      validateFields(section.fields, value as Json, section.title, errors);
    }
  }
  return errors;
}
