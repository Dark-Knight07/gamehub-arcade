# Owais GameHub

A gaming platform where people browse, discover and **actually play** games right in the browser. Built with Next.js 14, React, TypeScript and Tailwind CSS. Ready to deploy on Vercel with zero configuration.

**Play. Explore. Enjoy.**

## What's inside

- **14 original, playable games.** Every one is written from scratch in HTML5 and JavaScript, so there are no copyright or licensing issues.
  - Online: Star Sentinel (shooter), Pulse Runner (endless runner), Night Circuit (racing), Neon Glide (flappy-style), Breakout, Snake, Neon Pong (1 or 2 players), 2048, Tic-Tac-Toe (AI or 2 players), Memory Match, Slide Puzzle
  - Offline downloads: Sudoku, Mine Grid (Minesweeper), Circuit Breaker (Lights Out)
- **Full game player** with a game viewport, title, live score and best, controls panel, pause, restart, sound toggle, fullscreen and exit. Keyboard shortcuts: P pause, R restart, M sound, F fullscreen.
- **Offline editions.** Every game is packaged into a single self-contained HTML file (about 20 KB) that runs with no internet connection.
- **Library** with search, genre, online/offline, rating and category filters, plus sorting. Filters are stored in the URL, so filtered views can be shared.
- **Search bar** with live suggestions and keyboard navigation. Press `/` to focus it.
- **Player features:** favorites, recently played, game history, continue playing, personal best scores, your own star ratings, and saved progress (2048, Sudoku, Circuit Breaker).
- **11 categories:** Action, Arcade, Adventure, Puzzle, Racing, Sports, Strategy, Simulation, Casual, Multiplayer, Classic.
- **Responsive** on desktop, laptop, tablet and phone. Every game has touch controls.

There is no backend, database or account system. Player data is stored in the browser with `localStorage`.

## Getting started

Requires **Node.js 18.17 or newer**.

```bash
npm install
npm run dev
```

Open http://localhost:3000.

Production build:

```bash
npm run build
npm start
```

`npm run dev` and `npm run build` first run `scripts/build-downloads.mjs`, which packages every game into `public/downloads/` and measures the file sizes. You don't need to run it yourself.

## Deploy to Vercel

1. Push this folder to a new GitHub repository:
   ```bash
   git init
   git add .
   git commit -m "Owais GameHub"
   git branch -M main
   git remote add origin https://github.com/<your-username>/owais-gamehub.git
   git push -u origin main
   ```
2. Go to https://vercel.com/new and import the repository.
3. Vercel detects Next.js automatically. Leave every setting at its default and click **Deploy**.

That's it. No environment variables are required. Optionally, set `NEXT_PUBLIC_SITE_URL` to your custom domain so social link previews use it (see `.env.example`).

## Project structure

```
public/
  games/_sdk/          Shared game SDK (sdk.js) and base styles (base.css)
  games/<id>/          Playable source for each game (index.html)
  downloads/           Offline editions (generated at build time)
  art/                 Key artwork (SVG)
  screenshots/         Real gameplay screenshots
scripts/
  build-downloads.mjs  Packages games into offline HTML files
src/
  app/(site)/          Pages with the site navigation and footer
    page.tsx           Home
    games/             Library
    online/ offline/   Online and offline sections
    categories/        Category index and pages
    favorites/ recent/ Player pages
    game/[id]/         Game details
  app/play/[id]/       Full-screen game player
  components/          UI components (Player.tsx is the game player)
  data/
    games.ts           Game catalog (metadata only)
    categories.ts      Categories
    types.ts           Data types
  lib/
    store.ts           Favorites, history and ratings in localStorage
    search.ts          Ranked search
```

## Adding a game

Game **source** lives in `public/games/`, separate from the **catalog metadata** in `src/data/games.ts`.

1. Create `public/games/my-game/index.html`. To get pause, restart, sound and score support, add `data-game` and the SDK:
   ```html
   <html lang="en" data-game="my-game">
   <head>
     <link rel="stylesheet" href="../_sdk/base.css" />
     <script src="../_sdk/sdk.js"></script>
   </head>
   ```
2. Add artwork at `public/art/my-game.svg` (or .jpg/.png) and two screenshots at `public/screenshots/my-game-1.jpg` and `-2.jpg`.
3. Add an entry to `games` in `src/data/games.ts`. Every field is typed in `src/data/types.ts`: ID, name, description, thumbnail, screenshots, genre, type, rating, developer, game URL, engine, controls, platform, download URL, system requirements and more. File size is measured automatically.
4. For a downloadable game, set `type: "offline"` and `downloadUrl: "/downloads/owais-gamehub-my-game.html"`. That file is generated for you on the next `npm run dev` or `npm run build`.

Games made with any engine that exports to HTML5 or WebGL (Phaser, PixiJS, Three.js, Godot, Unity WebGL, Construct and so on) work the same way. Put the exported build in `public/games/<id>/` and point `gameUrl` at its HTML file. Keep individual files under 50 MB for Vercel.

### The GameHub SDK

Inside a game, `window.GameHub` provides:

| Call | Purpose |
| --- | --- |
| `GameHub.on("pause" \| "resume" \| "restart" \| "mute", fn)` | React to the player's buttons |
| `GameHub.paused`, `GameHub.muted` | Current state; skip updates while paused |
| `GameHub.score(n)` | Update the live score in the player toolbar |
| `GameHub.gameOver(n)` / `GameHub.win(n)` | End a round; saves the personal best and records history |
| `GameHub.config({ lowerIsBetter: true })` | For games where fewer moves or less time is better |
| `GameHub.save(state)` / `load()` / `clearSave()` | Save progress so players can continue later |
| `GameHub.sound(freq, seconds, wave, volume)` | Tiny synthesized sound effect that respects mute |
| `GameHub.fit(canvas, w, h)`, `point`, `loop`, `swipe` | Canvas scaling, pointer input, game loop and swipe helpers |

Messages between the player and a game use `postMessage`:

- Player to game: `{ source: "ogh-host", type: "pause" | "resume" | "restart" | "mute", muted }`
- Game to player: `{ source: "ogh-game", game, type: "ready" | "score" | "gameover" | "win" | "paused" | "resumed" | "muted", ... }`

## Embedding an external game you're authorised to use

For a browser game hosted elsewhere (for example on a partner's site), add a catalog entry with:

```ts
engine: "external",
gameUrl: "https://partner.example.com/their-game/",
sdk: false,
```

The player loads it in a sandboxed iframe (`allow-scripts allow-same-origin allow-pointer-lock allow-forms`). Restart reloads the game, and fullscreen and exit work as usual. Pause and sound buttons appear only when `sdk: true`, which means the external game implements the postMessage protocol above.

The external site must allow being framed. Its `X-Frame-Options` or `Content-Security-Policy: frame-ancestors` headers must permit your domain. Only embed games you have written permission to embed.

## Content and legal

Every included game, artwork and screenshot is original to this project. Only add games you have made yourself, open-source games whose license allows redistribution (keep their license file with the build), public-domain games, or games you have written permission to embed or distribute. Do not add commercial games, ROMs or cracked or pirated content.

## Browser storage keys

| Key | Contents |
| --- | --- |
| `ogh:favorites` | Favorite game IDs |
| `ogh:history` | Play sessions, most recent 150 |
| `ogh:ratings` | Your star ratings |
| `ogh:best:<id>` | Personal best per game |
| `ogh:save:<id>` | Saved progress per game |
| `ogh:muted` | Sound preference |

---

Owais GameHub, by MD Owais
