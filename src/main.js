import './styles.css';
import { mountGanvas } from './apps/ganvas.js';
import { mountRoom } from './apps/room.js';
import { mountRps } from './apps/rps.js';
import { mountCalculator } from './apps/calculator.js';
import { mountPrism } from './apps/prism.js';
import { mountCafe } from './apps/cafe.js';
import { mountTicTacToe, mountMemory, mountGuess } from './apps/classics.js';
import { mountSnake } from './apps/snake.js';
import { mountNight } from './apps/night.js';
import { mountParcel } from './apps/parcel.js';
import { mountPatchwork } from './apps/patchwork.js';
import { mountSkies } from './apps/skies.js';

const experiences = [
  { id: 'ganvas', group: 'creative', icon: '✦', title: 'Ganvas', subtitle: 'Paint a tiny world', color: '#ff6b6b', mount: mountGanvas },
  { id: 'room', group: 'creative', icon: '☾', title: 'Ticking Room', subtitle: 'Slow down for a minute', color: '#65d6ce', mount: mountRoom },
  { id: 'rps', group: 'classics', iconImage: '/hands/scissors.svg', title: 'Hand Game', subtitle: 'Best of five', color: '#ffd166', mount: mountRps },
  { id: 'calculator', group: 'creative', icon: '⌁', title: 'Pocket Calc', subtitle: 'Make numbers friendly', color: '#b8a1ff', mount: mountCalculator },
  { id: 'prism', group: 'creative', iconImage: '/icons/prism.svg', title: 'Prism Path', subtitle: 'Bend light home', color: '#72a7ff', mount: mountPrism },
  { id: 'cafe', group: 'creative', iconImage: '/icons/cafe.svg', title: 'Cloud Café', subtitle: 'Serve the sky', color: '#f29a75', mount: mountCafe },
  { id: 'tic', group: 'classics', iconImage: '/icons/tic.svg', title: 'Tic-Tac-Toe', subtitle: 'Three in a row', color: '#ef857c', mount: mountTicTacToe },
  { id: 'memory', group: 'classics', iconImage: '/icons/memory.svg', title: 'Memory Match', subtitle: 'Clear the card desk', color: '#e66f8b', mount: mountMemory },
  { id: 'guess', group: 'classics', iconImage: '/icons/guess.svg', title: 'Number Guess', subtitle: 'Chase the secret number', color: '#79b985', mount: mountGuess },
  { id: 'snake', group: 'adventures', iconImage: '/icons/snake.svg', title: 'Garden Serpent', subtitle: 'Grow through the wilds', color: '#75b881', mount: mountSnake },
  { id: 'night', group: 'adventures', iconImage: '/icons/night.svg', title: 'Night Shift', subtitle: 'Guard the dreaming room', color: '#9a82ba', mount: mountNight },
  { id: 'parcel', group: 'adventures', iconImage: '/icons/parcel.svg', title: 'Parcel Quest', subtitle: 'Deliver the peculiar', color: '#e2a64f', mount: mountParcel },
  { id: 'patchwork', group: 'adventures', iconImage: '/icons/patchwork.svg', title: 'Patchwork Odyssey', subtitle: 'Mend a handmade world', color: '#e96f76', mount: mountPatchwork },
  { id: 'skies', group: 'adventures', iconImage: '/icons/skies.svg', title: 'Paper Skies', subtitle: 'Carry mail on the wind', color: '#78b9cc', mount: mountSkies },
];

const collections = [
  { id: 'adventures', kicker: 'Big worlds, small screen', title: 'Featured Adventures', note: 'Explore, defend, fly, and discover.' },
  { id: 'creative', kicker: 'The original toybox', title: 'Creative Studio', note: 'Make something, unwind, or chase a score.' },
  { id: 'classics', kicker: 'Quick, familiar, polished', title: 'Arcade Classics', note: 'Perfect for one more round.' },
];

const iconMarkup = (item) => item.iconImage
  ? `<img src="${item.iconImage}" alt="" aria-hidden="true">`
  : item.icon;

const app = document.querySelector('#app');
app.innerHTML = `
  <main id="arcade" class="shell" data-view="home">
    <header class="topbar">
      <a class="brand" href="#home" aria-label="Kiki Arcade home"><span class="playground-logo brand-logo" aria-hidden="true"><i></i><i></i><i></i><i></i><b></b></span><span>Kiki Arcade</span></a>
      <div class="top-actions">
        <span class="clock" aria-label="Current time"></span>
        <button class="preference-button motion-toggle" type="button" aria-pressed="false">Motion: Full</button>
      </div>
    </header>
    <section class="home-view" aria-labelledby="welcome-title">
      <div class="welcome-copy">
        <div><p class="eyebrow"><span class="playground-logo hero-logo" aria-hidden="true"><i></i><i></i><i></i><i></i><b></b></span><span>Welcome to Kiki's little world</span></p><h1 id="welcome-title">Choose your<br><em>next little adventure.</em></h1></div>
        <div class="welcome-note"><b>${experiences.length} things to play</b><p>Make art, chase high scores, explore tiny worlds, or simply slow down for a minute.</p><a href="#game-collections">Explore the collection ↓</a></div>
      </div>
      <div class="launcher-grid" id="game-collections"></div>
    </section>
    <section class="workspace" aria-live="polite" hidden>
      <div class="window-bar">
        <button class="back-button" type="button">← All toys</button>
        <div class="window-title"></div>
        <span class="window-status">ready</span>
      </div>
      <div class="experience"></div>
    </section>
    <footer class="site-footer"><div class="footer-spectrum" aria-hidden="true"><i></i><i></i><i></i><i></i><i></i></div><p>A growing collection by Kiki.</p><span>Make room for play.</span></footer>
  </main>`;

const launcher = app.querySelector('.launcher-grid');
let cardIndex = 0;
launcher.innerHTML = collections.map(collection => {
  const games = experiences.filter(item => item.group === collection.id);
  return `<section class="game-shelf" data-group="${collection.id}" aria-labelledby="${collection.id}-title">
    <header class="shelf-heading"><div><p>${collection.kicker}</p><h2 id="${collection.id}-title">${collection.title}</h2></div><span>${collection.note}</span><b>${String(games.length).padStart(2, '0')}</b></header>
    <div class="shelf-grid">${games.map(item => {
      const index = cardIndex++;
      return `<button class="launch-card" style="--accent:${item.color};--delay:${index * 45}ms" data-app="${item.id}">
        <span class="card-number">${String(index + 1).padStart(2, '0')}</span>
        <span class="card-art" aria-hidden="true"><i></i><i></i><i></i><span class="card-icon">${iconMarkup(item)}</span></span>
        <span class="card-copy"><small>${collection.id === 'adventures' ? 'Adventure' : collection.id === 'creative' ? 'Creative toy' : 'Classic'}</small><strong>${item.title}</strong><em>${item.subtitle}</em></span><span class="card-arrow">Play ↗</span>
      </button>`;
    }).join('')}</div>
  </section>`;
}).join('');

let cleanup = () => {};
const home = app.querySelector('.home-view');
const workspace = app.querySelector('.workspace');
const stage = app.querySelector('.experience');

function openExperience(id, updateHash = true) {
  const item = experiences.find((entry) => entry.id === id);
  if (!item) return showHome(updateHash);
  cleanup();
  home.hidden = true;
  workspace.hidden = false;
  app.querySelector('.shell').dataset.view = 'workspace';
  app.querySelector('.shell').style.setProperty('--app-accent', item.color);
  document.body.style.setProperty('--app-accent', item.color);
  workspace.dataset.app = item.id;
  app.querySelector('.window-title').innerHTML = `<span style="color:${item.color}">${iconMarkup(item)}</span> ${item.title}`;
  stage.replaceChildren();
  cleanup = item.mount(stage, settings) || (() => {});
  document.title = `${item.title} · Kiki Arcade`;
  if (updateHash) history.pushState(null, '', `#${id}`);
  app.querySelector('.back-button').focus();
}

function showHome(updateHash = true) {
  cleanup(); cleanup = () => {};
  workspace.hidden = true; delete workspace.dataset.app; home.hidden = false; stage.replaceChildren();
  app.querySelector('.shell').dataset.view = 'home';
  app.querySelector('.shell').style.removeProperty('--app-accent');
  document.body.style.removeProperty('--app-accent');
  document.title = 'Kiki Arcade';
  if (updateHash) history.pushState(null, '', '#home');
}

launcher.addEventListener('click', (event) => {
  const button = event.target.closest('[data-app]');
  if (button) openExperience(button.dataset.app);
});
app.querySelector('.back-button').addEventListener('click', () => showHome());

const settings = {
  reducedMotion: localStorage.getItem('playground:motion') === 'reduced' || matchMedia('(prefers-reduced-motion: reduce)').matches,
};
function syncSettings() {
  document.documentElement.classList.toggle('reduce-motion', settings.reducedMotion);
  const motion = app.querySelector('.motion-toggle');
  motion.setAttribute('aria-pressed', String(settings.reducedMotion));
  motion.textContent = settings.reducedMotion ? 'Motion: Reduced' : 'Motion: Full';
}
app.querySelector('.motion-toggle').addEventListener('click', () => {
  settings.reducedMotion = !settings.reducedMotion; localStorage.setItem('playground:motion', settings.reducedMotion ? 'reduced' : 'full'); syncSettings();
});

const updateClock = () => { app.querySelector('.clock').textContent = new Intl.DateTimeFormat([], { hour: '2-digit', minute: '2-digit' }).format(new Date()); };
updateClock(); setInterval(updateClock, 30_000); syncSettings();
addEventListener('popstate', () => location.hash.slice(1) === 'home' ? showHome(false) : openExperience(location.hash.slice(1), false));
const initial = location.hash.slice(1); if (initial && initial !== 'home') openExperience(initial, false);
