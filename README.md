# P3R Portfolio

A single-page portfolio inspired by the pause menu of *Persona 3 Reload*. Navigate through projects, skills, about and contact sections using an interactive menu. A spinning record player adds background music to the experience.

Built with **React 19, TypeScript and Vite**.

---

## Features

- Interactive main menu with mouse and keyboard navigation.
- Four sections: **PROJECT, SKILLS, ABOUT and CONTACT**.
- Background videos and sound effects.
- Music player with play/pause, next track and mute controls.
- Looping music playback until paused or skipped.
- Editable text, links, contact details and media paths through `src/content/`.

---

## Requirements

- Node.js 20.19 or newer
- npm 10 or newer

---

## Getting Started

Clone the repository and install the dependencies:

```bash
git clone https://github.com/Velasco-c/P3R-Portfolio.git
cd P3R-Portfolio
npm install
npm run dev
```

Open [http://localhost:5173](http://localhost:5173) in your browser.

## Available Scripts

| Command | Description |
| --- | --- |
| `npm run dev` | Starts the development server with hot reload. |
| `npm run build` | Type-checks and builds the application into `dist/`. |
| `npm run preview` | Serves the production build locally. |
| `npm run typecheck` | Runs TypeScript checks without generating build files. |

---

## Project Structure

```text
public/          Static videos, audio, images and fonts
src/
├── content/     Editable text, links and media paths
├── components/  UI components and screens
├── engine/      Audio, music player, transitions and URL parameters
└── styles/      Stylesheets organized by feature
```

---

## Customization

Edit the files in `src/content/` to personalize the portfolio.

| File | Purpose |
| --- | --- |
| `site.ts` | Name displayed in the banner. |
| `menu.ts` | Main menu items and their modal cards. |
| `projects.ts` | Project entries and links. |
| `skills.ts` | Skills tabs and proficiency levels (0–100). |
| `about.ts` | About section text, photo and quote. |
| `contact.ts` | Contact information, email and links. |
| `media.ts` | Media file paths and music playlist. |

After making changes, run the type checker to catch potential errors:

```bash
npm run typecheck
```

### Adding Music

1. Place your `.mp3` files in `public/audio/`. Use filenames without spaces.
2. Add each track to the `music` list in `src/content/media.ts`.
3. Place the record image at `public/images/disc.png`.

---

## Deployment

Build the application for production:

```bash
npm run build
```

Upload the generated `dist/` directory to any static hosting provider.

### Vercel

Import the repository into Vercel and select the Vite framework preset. No additional configuration should be necessary for a root deployment.

### GitHub Pages

If deploying to a subpath, configure the `base` option in `vite.config.ts` to match the repository path:

```typescript
export default defineConfig({
  base: '/P3R-Portfolio/',
});
```

Preserve any existing Vite configuration and merge the `base` option into it rather than replacing the entire configuration.

---

## Credits

This project is a ground-up recreation using React, TypeScript and Vite, inspired by the original pause-menu portfolio by [Aiosssss](https://github.com/Aiosssss/porto-persona3), which was built with vanilla JavaScript, HTML and CSS.

*Persona 3 Reload*, its artwork and associated fonts are the property of Atlus and their respective rights holders. This project is an independent, non-commercial portfolio recreation and is not affiliated with or endorsed by Atlus.