const palette = ['#25213c','#ff6b6b','#ffd166','#65d6ce','#72a7ff','#b8a1ff','#f7f1e8','#ffffff'];

export function floodFill(pixels, size, start, replacement) {
  const target = pixels[start]; if (target === replacement) return pixels;
  const next = [...pixels], queue = [start], seen = new Set();
  while (queue.length) { const i = queue.pop(); if (seen.has(i) || next[i] !== target) continue; seen.add(i); next[i] = replacement; const x = i % size, y = Math.floor(i / size); if (x) queue.push(i - 1); if (x < size - 1) queue.push(i + 1); if (y) queue.push(i - size); if (y < size - 1) queue.push(i + size); }
  return next;
}

export function randomColor() {
  const channel = () => Math.floor(Math.random() * 256);
  return `rgb(${channel()}, ${channel()}, ${channel()})`;
}

export function mountGanvas(root) {
  let size = 16, color = palette[1], rainbow = false, tool = 'brush', pixels = Array(size * size).fill('#ffffff'), history = [], drawing = false, lastIndex = -1;
  root.innerHTML = `<div class="ganvas-app toy"><aside class="paint-tools"><div><p class="eyebrow">Pixel sketchbook</p><h2>Ganvas</h2><p>Press and drag to paint, fill, undo, and keep your tiny masterpiece.</p></div><fieldset><legend>Tool</legend><div class="segmented"><button class="active" data-tool="brush">Brush</button><button data-tool="erase">Erase</button><button data-tool="fill">Fill</button></div></fieldset><fieldset><legend>Colour</legend><div class="palette">${palette.map((c, i) => `<button aria-label="${c}" data-color="${c}" class="${i === 1 ? 'active' : ''}" style="--swatch:${c}"></button>`).join('')}<input aria-label="Custom colour" type="color" value="#ff6b6b"><button class="rainbow-swatch" aria-label="Rainbow brush" aria-pressed="false" data-rainbow>🌈</button></div></fieldset><label>Canvas size <select><option value="12">12 × 12</option><option value="16" selected>16 × 16</option><option value="24">24 × 24</option></select></label><div class="tool-actions"><button data-action="undo">Undo</button><button data-action="clear">Clear</button><button data-action="save">Save PNG</button></div></aside><div class="pixel-wrap"><div class="pixel-canvas" role="grid" aria-label="Drawing canvas"></div></div></div>`;
  const canvas = root.querySelector('.pixel-canvas');
  function render() { canvas.style.setProperty('--size', size); canvas.innerHTML = pixels.map((c, i) => `<button role="gridcell" aria-label="Pixel ${i + 1}" data-pixel="${i}" style="background:${c}"></button>`).join(''); }
  function snapshot() { history.push([...pixels]); if (history.length > 30) history.shift(); }
  function brushColor() { return tool === 'erase' ? '#ffffff' : rainbow ? randomColor() : color; }
  function paint(index) {
    if (index === lastIndex) return;
    lastIndex = index;
    pixels[index] = brushColor();
    const cell = canvas.querySelector(`[data-pixel="${index}"]`);
    if (cell) cell.style.background = pixels[index];
  }
  function endStroke() { drawing = false; lastIndex = -1; }
  canvas.addEventListener('pointerdown', event => {
    const pixel = event.target.closest('[data-pixel]');
    if (!pixel) return;
    event.preventDefault();
    snapshot();
    const index = +pixel.dataset.pixel;
    if (tool === 'fill') {
      pixels = floodFill(pixels, size, index, rainbow ? randomColor() : color);
      render();
      return;
    }
    drawing = true;
    paint(index);
  });
  canvas.addEventListener('pointermove', event => {
    if (!drawing || tool === 'fill') return;
    const pixel = document.elementFromPoint(event.clientX, event.clientY)?.closest('[data-pixel]');
    if (pixel && canvas.contains(pixel)) paint(+pixel.dataset.pixel);
  });
  addEventListener('pointerup', endStroke);
  addEventListener('pointercancel', endStroke);
  canvas.addEventListener('pointerleave', endStroke);
  root.addEventListener('click', e => {
    const toolButton = e.target.closest('[data-tool]'), swatch = e.target.closest('[data-color]'), rainbowButton = e.target.closest('[data-rainbow]'), action = e.target.closest('[data-action]')?.dataset.action;
    if (toolButton) { tool = toolButton.dataset.tool; root.querySelectorAll('[data-tool]').forEach(x => x.classList.toggle('active', x === toolButton)); }
    if (swatch) { color = swatch.dataset.color; rainbow = false; root.querySelector('[data-rainbow]').setAttribute('aria-pressed', 'false'); root.querySelectorAll('[data-color]').forEach(x => x.classList.toggle('active', x === swatch)); }
    if (rainbowButton) { rainbow = !rainbow; rainbowButton.setAttribute('aria-pressed', String(rainbow)); root.querySelectorAll('[data-color]').forEach(x => x.classList.remove('active')); }
    if (action === 'undo' && history.length) { pixels = history.pop(); render(); }
    if (action === 'clear') { snapshot(); pixels.fill('#ffffff'); render(); }
    if (action === 'save') savePng();
  });
  root.querySelector('input[type=color]').addEventListener('input', e => { color = e.target.value; rainbow = false; root.querySelector('[data-rainbow]').setAttribute('aria-pressed', 'false'); root.querySelectorAll('[data-color]').forEach(x => x.classList.remove('active')); });
  root.querySelector('select').addEventListener('change', e => { size = +e.target.value; history = []; pixels = Array(size * size).fill('#ffffff'); render(); });
  function savePng() { const out = document.createElement('canvas'), scale = 24; out.width = out.height = size * scale; const ctx = out.getContext('2d'); pixels.forEach((c, i) => { ctx.fillStyle = c; ctx.fillRect((i % size) * scale, Math.floor(i / size) * scale, scale, scale); }); const link = document.createElement('a'); link.download = 'ganvas.png'; link.href = out.toDataURL(); link.click(); }
  render();
  return () => { removeEventListener('pointerup', endStroke); removeEventListener('pointercancel', endStroke); };
}
