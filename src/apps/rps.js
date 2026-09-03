export const winnerFor = (player, computer) => player === computer ? 'draw' : ({ rock: 'scissors', paper: 'rock', scissors: 'paper' }[player] === computer ? 'player' : 'computer');

export function mountRps(root) {
  const choices = ['rock', 'paper', 'scissors'];
  root.innerHTML = `<div class="rps-app toy"><div class="toy-intro"><p class="eyebrow">First to five points</p><h2>Hand Game</h2><p>Choose your move. The machine promises not to peek.</p><div class="score"><span>You <b data-player>0</b></span><i>:</i><span><b data-computer>0</b> Machine</span></div><p class="streak">Best streak: <b>0</b></p></div><div class="arena"><div class="versus"><div><small>You played</small><span class="move-placeholder" data-player-placeholder>?</span><img data-player-move alt="" hidden></div><span>VS</span><div><small>Machine played</small><span class="move-placeholder" data-computer-placeholder>?</span><img data-computer-move alt="" hidden></div></div><p class="round-result" aria-live="polite">Make your move</p><div class="choices">${choices.map(id => `<button type="button" data-choice="${id}" aria-label="Play ${id}"><img src="/hands/${id}.svg" alt="" aria-hidden="true"><span>${id}</span></button>`).join('')}</div><button class="text-button" data-reset type="button">Reset match</button></div></div>`;
  let player = 0, computer = 0, streak = 0, best = Number(localStorage.getItem('playground:rps-best') || 0);
  const streakEl = root.querySelector('.streak b'); streakEl.textContent = best;
  root.addEventListener('click', event => {
    const choice = event.target.closest('[data-choice]')?.dataset.choice;
    if (event.target.closest('[data-reset]')) { player = computer = streak = 0; resetMoves(); update('Make your move'); return; }
    if (!choice || player === 5 || computer === 5) return;
    const opponent = choices[Math.floor(Math.random() * choices.length)], result = winnerFor(choice, opponent);
    if (result === 'player') { player++; streak++; best = Math.max(best, streak); }
    if (result === 'computer') { computer++; streak = 0; }
    localStorage.setItem('playground:rps-best', String(best)); streakEl.textContent = best;
    showMove('player', choice);
    showMove('computer', opponent);
    update(player === 5 ? 'You won the match!' : computer === 5 ? 'Machine wins this time.' : result === 'draw' ? 'A perfect tie.' : result === 'player' ? 'Point to you!' : 'Point to the machine.');
  });
  function showMove(side, move) { const image = root.querySelector(`[data-${side}-move]`); image.src = `/hands/${move}.svg`; image.alt = `${move} hand`; image.hidden = false; root.querySelector(`[data-${side}-placeholder]`).hidden = true; }
  function resetMoves() { ['player', 'computer'].forEach(side => { root.querySelector(`[data-${side}-move]`).hidden = true; root.querySelector(`[data-${side}-placeholder]`).hidden = false; }); }
  function update(message) { root.querySelector('[data-player]').textContent = player; root.querySelector('[data-computer]').textContent = computer; root.querySelector('.round-result').textContent = message; }
}
