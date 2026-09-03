const DELTA = { N: [0, -1], E: [1, 0], S: [0, 1], W: [-1, 0] };
const OPPOSITE = { N: 'S', E: 'W', S: 'N', W: 'E' };
const ORDER = ['N', 'E', 'S', 'W'];

const LEVELS = [
  { name: 'First light', path: [[0,2],[1,2],[2,2],[2,1],[2,0],[3,0],[4,0]] },
  { name: 'Around the bend', path: [[0,0],[1,0],[1,1],[1,2],[2,2],[3,2],[3,3],[3,4],[4,4]] },
  { name: 'Long way home', path: [[0,4],[1,4],[1,3],[2,3],[2,2],[2,1],[3,1],[4,1],[4,0]] },
];

const directionBetween = (a, b) => {
  const dx = b[0] - a[0], dy = b[1] - a[1];
  return dx === 1 ? 'E' : dx === -1 ? 'W' : dy === 1 ? 'S' : 'N';
};

export function tileConnections(type, rotation = 0) {
  const bases = { straight: ['N','S'], corner: ['N','E'], source: ['E'], target: ['W'] };
  return bases[type].map(direction => ORDER[(ORDER.indexOf(direction) + rotation) % 4]);
}

function rotationFor(type, required) {
  for (let rotation = 0; rotation < 4; rotation++) {
    const actual = tileConnections(type, rotation);
    if (actual.length === required.length && actual.every(direction => required.includes(direction))) return rotation;
  }
  return 0;
}

export function createPrismLevel(levelIndex) {
  const definition = LEVELS[levelIndex], size = 5, pathSet = new Map(definition.path.map((point, index) => [point.join(','), index]));
  const tiles = Array.from({ length: size * size }, (_, index) => ({ type: index % 3 ? 'corner' : 'straight', rotation: (index * 3) % 4, correct: null, path: false, locked: false }));
  definition.path.forEach((point, pathIndex) => {
    const index = point[1] * size + point[0];
    let type, required;
    if (pathIndex === 0) { type = 'source'; required = [directionBetween(point, definition.path[1])]; }
    else if (pathIndex === definition.path.length - 1) { type = 'target'; required = [OPPOSITE[directionBetween(definition.path[pathIndex - 1], point)]]; }
    else {
      required = [OPPOSITE[directionBetween(definition.path[pathIndex - 1], point)], directionBetween(point, definition.path[pathIndex + 1])];
      type = OPPOSITE[required[0]] === required[1] ? 'straight' : 'corner';
    }
    const correct = rotationFor(type, required);
    tiles[index] = { type, correct, rotation: type === 'source' || type === 'target' ? correct : (correct + (pathIndex % 2 ? 1 : 2)) % 4, path: true, locked: type === 'source' || type === 'target' };
  });
  return { ...definition, size, tiles, pathSet };
}

export function traceBeam(tiles, size) {
  let index = tiles.findIndex(tile => tile.type === 'source');
  let direction = tileConnections('source', tiles[index].rotation)[0];
  const lit = [index], visited = new Set();
  for (let steps = 0; steps < size * size * 4; steps++) {
    const state = `${index}:${direction}`;
    if (visited.has(state)) return { success: false, lit };
    visited.add(state);
    const x = index % size, y = Math.floor(index / size), [dx, dy] = DELTA[direction];
    const nx = x + dx, ny = y + dy;
    if (nx < 0 || nx >= size || ny < 0 || ny >= size) return { success: false, lit };
    index = ny * size + nx; lit.push(index);
    const tile = tiles[index], incoming = OPPOSITE[direction], connections = tileConnections(tile.type, tile.rotation);
    if (!connections.includes(incoming)) return { success: false, lit };
    if (tile.type === 'target') return { success: true, lit };
    const exit = connections.find(connection => connection !== incoming);
    if (!exit) return { success: false, lit };
    direction = exit;
  }
  return { success: false, lit };
}

const tileSvg = type => {
  const paths = {
    straight: '<path d="M50 0V100"/>', corner: '<path d="M50 0V50H100"/>',
    source: '<circle cx="30" cy="50" r="15"/><path d="M45 50H100"/>',
    target: '<path d="M0 50H34"/><path d="m50 30 18 20-18 20-18-20 18-20Z"/>',
  };
  return `<svg viewBox="0 0 100 100" aria-hidden="true">${paths[type]}</svg>`;
};

export function mountPrism(root) {
  let levelIndex = Math.min(Number(localStorage.getItem('playground:prism-level') || 0), LEVELS.length - 1);
  let level, tiles, moves = 0, seconds = 0, solved = false, timer;
  root.innerHTML = `<div class="prism-app toy"><div class="prism-copy"><p class="eyebrow">A light-routing puzzle</p><h2>Prism Path</h2><p>Rotate the glass tiles and guide the beam from the sunstone to the crystal.</p><div class="prism-meta"><span>Level <b data-level></b></span><span>Moves <b data-moves>0</b></span><span>Time <b data-time>0:00</b></span></div><div class="prism-actions"><button type="button" data-hint>Hint</button><button type="button" data-reset>Reset</button></div><p class="prism-status" aria-live="polite">Find the path.</p></div><div class="prism-stage"><div class="prism-board" role="grid" aria-label="Light-routing puzzle"></div><div class="prism-complete" hidden><strong>Crystal lit!</strong><span data-summary></span><button type="button" data-next>Next puzzle</button></div></div></div>`;
  const board = root.querySelector('.prism-board');
  function startLevel(index) {
    clearInterval(timer); levelIndex = index; level = createPrismLevel(index); tiles = level.tiles.map(tile => ({ ...tile })); moves = seconds = 0; solved = false;
    root.querySelector('[data-level]').textContent = `${index + 1}/${LEVELS.length} · ${level.name}`; root.querySelector('[data-moves]').textContent = '0'; root.querySelector('[data-time]').textContent = '0:00'; root.querySelector('.prism-status').textContent = 'Find the path.'; root.querySelector('.prism-complete').hidden = true;
    timer = setInterval(() => { seconds++; root.querySelector('[data-time]').textContent = `${Math.floor(seconds / 60)}:${String(seconds % 60).padStart(2,'0')}`; }, 1000); render();
  }
  function render() {
    const beam = traceBeam(tiles, level.size);
    board.innerHTML = tiles.map((tile, index) => `<button type="button" role="gridcell" class="prism-tile ${beam.lit.includes(index) ? 'lit' : ''} ${tile.locked ? 'locked' : ''}" data-tile="${index}" ${tile.locked ? 'disabled' : ''} aria-label="${tile.type} tile, row ${Math.floor(index / level.size) + 1}, column ${(index % level.size) + 1}"><span style="transform:rotate(${tile.rotation * 90}deg)">${tileSvg(tile.type)}</span></button>`).join('');
    if (beam.success && !solved) finish();
  }
  function rotate(index) { if (solved || tiles[index].locked) return; tiles[index].rotation = (tiles[index].rotation + 1) % 4; moves++; root.querySelector('[data-moves]').textContent = moves; render(); }
  function finish() { solved = true; clearInterval(timer); const unlocked = Math.min(levelIndex + 1, LEVELS.length - 1); localStorage.setItem('playground:prism-level', String(unlocked)); root.querySelector('.prism-status').textContent = 'The light found its way.'; root.querySelector('[data-summary]').textContent = `${moves} moves · ${Math.floor(seconds / 60)}:${String(seconds % 60).padStart(2,'0')}`; const next = root.querySelector('[data-next]'); next.textContent = levelIndex === LEVELS.length - 1 ? 'Play from the start' : 'Next puzzle'; root.querySelector('.prism-complete').hidden = false; }
  root.addEventListener('click', event => {
    const tile = event.target.closest('[data-tile]'); if (tile) rotate(+tile.dataset.tile);
    if (event.target.closest('[data-reset]')) startLevel(levelIndex);
    if (event.target.closest('[data-hint]') && !solved) { const index = tiles.findIndex(tile => tile.path && !tile.locked && tile.rotation !== tile.correct); if (index >= 0) { tiles[index].rotation = tiles[index].correct; moves++; root.querySelector('[data-moves]').textContent = moves; root.querySelector('.prism-status').textContent = 'One tile clicked into place.'; render(); } }
    if (event.target.closest('[data-next]')) startLevel(levelIndex === LEVELS.length - 1 ? 0 : levelIndex + 1);
  });
  startLevel(levelIndex);
  return () => clearInterval(timer);
}
