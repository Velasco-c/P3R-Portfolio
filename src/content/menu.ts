import type { MenuOption } from '../types/content';

/**
 * Main menu entries, in display order.
 * The position of each item in this array is its keyboard / selection index.
 */
export const menuOptions: MenuOption[] = [
  {
    id: 'project',
    name: 'PROJECT',
    description: 'View Featured Works & Projects',
    rotation: -20,
    zIndex: 1,
    offsetX: -40,
    offsetY: 25,
    fontSize: '5.15rem',
    bannerScaleX: 1.07,
    bannerScaleY: 3.35,
    tag: 'PORTFOLIO WORKS',
    summary: 'Featured applications, interactive web systems & creative experiments',
    cards: [
      {
        title: 'Persona 3 Reload Pause Menu',
        desc: 'Pixel-perfect vanilla recreation with SVG color-inversion, Web Audio SFX, and video backdrops.',
      },
      {
        title: 'Persona 5 Style Portfolio',
        desc: 'Signature comic-book high-contrast red & black interactive developer showcase.',
      },
      {
        title: 'Persona 5 Typography Playground',
        desc: 'Custom typeface exploration tool for Ransom and Solid font systems.',
      },
      {
        title: 'Modern Web App Suite',
        desc: 'High-performance responsive web applications crafted with clean code architecture.',
      },
    ],
  },
  {
    id: 'skills',
    name: 'SKILLS',
    description: 'View Technical Abilities & Stack',
    rotation: -12,
    zIndex: 2,
    offsetX: -65,
    offsetY: 30,
    fontSize: '4.55rem',
    bannerScaleX: 0.96,
    bannerScaleY: 3.05,
    tag: 'ABILITIES & PROFICIENCY',
    summary: 'Modern frontend technologies, system design, and AI workflows',
    cards: [
      {
        title: 'Modern Frontend Core',
        desc: 'TypeScript, JavaScript (ES6+), HTML5 Semantic Architecture, Native CSS3 (Flexbox/Grid/Animations).',
      },
      {
        title: 'Component Systems',
        desc: 'React, Next.js App Router, Vue.js, Tailwind CSS v4, Headless UI, Material Design 3 tokens.',
      },
      {
        title: 'Performance & Audio',
        desc: 'Web Audio API latency mitigation, 60fps WAAPI & CSS Hardware Accelerated pipelines.',
      },
      {
        title: 'AI Integration & Dev Tools',
        desc: 'Frontier LLM integrations, Prompt Engineering, Agentic coding workflows, Git automation.',
      },
    ],
  },
  {
    id: 'about',
    name: 'ABOUT',
    description: 'Developer Profile & Philosophy',
    rotation: -4,
    zIndex: 3,
    offsetX: -80,
    offsetY: 35,
    fontSize: '4.85rem',
    bannerScaleX: 1.02,
    bannerScaleY: 3.25,
    tag: 'PROFILE & JOURNEY',
    summary: 'Frontend web designer & developer dedicated to immersive web experiences',
    cards: [
      {
        title: 'Design Philosophy',
        desc: 'Belief in high-fidelity micro-interactions, bold visual identity, and accessible engineering.',
      },
      {
        title: 'Inspiration',
        desc: 'Persona 3 Reload & Atlus design systems: dynamic angled layouts, typographic hierarchy, and responsive fluid motion.',
      },
      {
        title: 'Developer Identity',
        desc: 'Ilham Ziqri: Frontend specialist crafting web interfaces that feel alive, intuitive, and memorable.',
      },
    ],
  },
  {
    id: 'contact',
    name: 'CONTACT',
    description: 'Initiate Communication',
    rotation: 5,
    zIndex: 4,
    offsetX: -85,
    offsetY: 40,
    fontSize: '4.65rem',
    bannerScaleX: 1.04,
    bannerScaleY: 3.2,
    tag: 'COMMUNICATION CHANNELS',
    summary: 'Available for collaboration, freelance inquiries, and frontend opportunities',
    cards: [
      {
        title: 'Direct Mail',
        desc: 'aiosssml@gmail.com: Priority channel for direct communication and collaborations.',
      },
      {
        title: 'GitHub Repository',
        desc: 'github.com/Aiosssss: Explore active source code, repos, and open-source experiments.',
      },
    ],
  },
];
