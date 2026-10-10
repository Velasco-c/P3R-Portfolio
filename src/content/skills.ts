import type { SkillGroup, SkillTab } from '../types/content';

export const skillTabs: SkillTab[] = [
  { id: 'frontend', code: '01', label: 'FRONTEND' },
  { id: 'backend', code: '02', label: 'BACKEND' },
  { id: 'tools', code: '03', label: 'TOOLS' },
  { id: 'languages', code: '04', label: 'LANGUAGES' },
];

/** One group per tab (matched by id). `level` is 0 - 100. */
export const skillGroups: SkillGroup[] = [
  {
    id: 'frontend',
    code: '01',
    title: 'FRONTEND & WEB ENGINEERING',
    skills: [
      { name: 'HTML5 · CSS3', level: 90 },
      { name: 'JavaScript', level: 85 },
      { name: 'UI/UX Design · Figma', level: 40 },
      { name: 'React', level: 5 },
      { name: 'TypeScript', level: 5 },
    ],
  },
  {
    id: 'backend',
    code: '02',
    title: 'BACKEND & DATABASES',
    skills: [
      { name: 'Node.js · REST APIs', level: 80 },
      { name: 'MySQL · Relational Databases', level: 70 },
      { name: 'Git · Version Control', level: 85 },
    ],
  },
  {
    id: 'tools',
    code: '03',
    title: 'DEVELOPMENT TOOLS',
    skills: [
      { name: 'VS Code', level: 90 },
      { name: 'GitHub', level: 85 },
      { name: 'Postman', level: 85 },
      { name: 'Docker', level: 80 },
      { name: 'n8n · Process Automation', level: 40 },
    ],
  },
  {
    id: 'languages',
    code: '04',
    title: 'LANGUAGE PROFICIENCY',
    skills: [
      { name: 'Spanish (Native)', level: 95 },
      { name: 'English (B1 Intermediate)', level: 15 },
    ],
  },
];