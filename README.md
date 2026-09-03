# Kiki's Creative Playground

A responsive collection of 14 creative toys, arcade classics, and miniature adventures presented through one cohesive playground.

## Featured Adventures

- **Garden Serpent** — an arcade Snake remix with classic and adventure modes, fruit combos, garden tasks, hazards, unlockable themes, and saved records.
- **Night Shift** — a five-wave bedroom defense game with three defender types, escalating shadows, resource management, and saved progress.
- **Parcel Quest** — a timed, top-down delivery adventure with peculiar packages, hidden shortcuts, bonus stamps, and route planning.
- **Patchwork Odyssey** — a three-chapter platform journey with collectibles, gliding, bounce pads, and persistent completion.
- **Paper Skies** — a three-course paper-airplane adventure with flight physics, updrafts, stamp rings, damage, and landing challenges.

## Creative Playground

- **Ganvas** — pixel painting with brush, eraser, flood fill, undo, sizing, rainbow color, and PNG export.
- **Ticking Room** — a time-controlled ambient room with optional sound and motion preferences.
- **Pocket Calc** — keyboard-accessible arithmetic with recent calculation history.
- **Prism Path** — three light-routing puzzles with hints, progression, and saved unlocks.
- **Cloud Café** — a timed recipe game with customer patience, combos, keyboard controls, and saved high scores.

## Arcade Classics

- **Hand Game** — a first-to-five rock-paper-scissors match with custom hand artwork and a saved best streak.
- **Tic-Tac-Toe** — a player-versus-machine classic with saved wins and draws.
- **Memory Match** — a shuffled card-matching game with move tracking and a saved personal best.
- **Number Guess** — a keyboard-friendly higher-or-lower game with guess history and a saved personal best.

## Highlights

- Full-screen responsive interface with distinct game accents and a shared Playground identity
- Keyboard, pointer, touch, swipe, and on-screen controls where appropriate
- Reduced-motion support and accessible labels, status updates, and focus states
- Local browser persistence for scores, records, unlocks, preferences, and progression
- Independently mounted experiences with automatic cleanup when changing games
- Dependency-light implementation using native JavaScript, CSS, Canvas, and browser APIs

## Run locally

```bash
npm install
npm run dev
```

## Verify

```bash
npm test
npm run build
```

## Technical notes

The app uses Vite, native ES modules, independently mounted experiences, DOM interfaces, and Canvas rendering. There are no UI runtime dependencies. Pure domain functions for calculation, game outcomes, flood filling, beam tracing, recipes, scoring, movement, collision, platform landing, route validation, and flight physics are covered by Node's built-in test runner.

Ticking Room audio is adapted from the original project and sourced from Freesound. Garden Serpent generates its short interface cues in the browser and includes a fallback for browsers without Web Audio support.
