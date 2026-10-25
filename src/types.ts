import type { ReactNode } from 'react';

export type SkillGroup = 'Frontend' | 'Backend' | 'Database & ORM' | 'Tools & more';

export interface Skill {
  name: string;
  icon: ReactNode;
  group: SkillGroup;
}

export interface Project {
  /** short name: also used for the sideways title on a closed card */
  name: string;
  subtitle?: string;
  description: string;
  tags: string[];
  /** card colour; keep it dark enough for white text */
  color: string;
  /** screenshot (import it from assets/images); a placeholder shows until you add one */
  image?: string;
  link?: string;
  github?: string;
}

export interface Certificate {
  /** a path inside the public folder, e.g. '/certificates/name.jpg' */
  src: string;
  label: string;
}

export interface ExperienceItem {
  kind: 'education' | 'internship';
  title: string;
  year: string;
  place: string;
  desc?: string;
  tags?: string[];
  certificates?: Certificate[];
}
