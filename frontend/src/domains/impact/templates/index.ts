import type { ComponentType } from "react";
import EducationTemplate from "./EducationTemplate";
import WomenEmpowermentTemplate from "./WomenEmpowermentTemplate";
import SkillsEmploymentTemplate from "./SkillsEmploymentTemplate";
import ModelVillageTemplate from "./ModelVillageTemplate";
import HealthTemplate from "./HealthTemplate";
import type { CategoryTemplateProps } from "./types";

export {
  EducationTemplate,
  WomenEmpowermentTemplate,
  SkillsEmploymentTemplate,
  ModelVillageTemplate,
  HealthTemplate,
};

export * from "./types";

export const IMPACT_TEMPLATE_MAP: Record<
  string,
  ComponentType<CategoryTemplateProps>
> = {
  // Education
  education: EducationTemplate,
  EDUCATION: EducationTemplate,

  // Women Empowerment
  "women-empowerment": WomenEmpowermentTemplate,
  WOMEN_EMPOWERMENT: WomenEmpowermentTemplate,

  // Skills & Employment
  "skills-employment": SkillsEmploymentTemplate,
  "skills-and-employment": SkillsEmploymentTemplate,
  SKILLS_EMPLOYMENT: SkillsEmploymentTemplate,

  // Model Village
  "model-village": ModelVillageTemplate,
  MODEL_VILLAGE: ModelVillageTemplate,

  // Health
  health: HealthTemplate,
  HEALTH: HealthTemplate,
};

/**
 * Returns the matching Category Template component based on slug or template type.
 * Defaults to EducationTemplate if no match is found.
 */
export function getImpactTemplate(
  key?: string | null,
): ComponentType<CategoryTemplateProps> {
  if (!key) return EducationTemplate;
  const normalizedKey = key.trim().toLowerCase();
  return (
    IMPACT_TEMPLATE_MAP[key] ||
    IMPACT_TEMPLATE_MAP[normalizedKey] ||
    EducationTemplate
  );
}

