export function roomPhase(hour) { if (hour < 6) return 'night'; if (hour < 9) return 'dawn'; if (hour < 17) return 'day'; if (hour < 20) return 'dusk'; return 'night'; }

export function mountRoom(root) {
  const now = new Date(), initial = now.getHours() * 60 + now.getMinutes();
  root.innerHTML = `<div class="room-app toy"><div class="room-copy"><p class="eyebrow">An ambient clock</p><h2>Ticking Room</h2><p>Move through a day, or leave the room in step with your local time.</p><label>Time of day <input type="range" min="0" max="1439" value="${initial}"></label><div class="room-time" aria-live="polite"></div><ul class="room-details" aria-label="Objects in the room"><li>◷ Wall clock</li><li>⌁ Reading lamp</li><li>♧ Potted plant</li><li>☕ Tea & books</li></ul><button class="text-button audio-button" type="button" data-audio-state="paused">Play clock ambience</button></div><figure class="room-scene" aria-label="A cozy illustrated study with a window, clock, desk lamp, books, tea, plant, and sleeping cat"><div class="sky"><span class="sun"></span><span class="cloud cloud-one"></span><span class="cloud cloud-two"></span><i class="star s1">✦</i><i class="star s2">·</i><i class="star s3">✦</i></div><div class="window"><div class="hill"></div><div class="window-cross"></div></div><div class="wall-art"><span>take</span><span>your</span><span>time</span></div><div class="clock-face"><span class="clock-dot"></span><i></i><b></b></div><div class="shelf"><span class="shelf-book one"></span><span class="shelf-book two"></span><span class="shelf-book three"></span><div class="radio"><i></i><b></b></div></div><div class="desk"><div class="lamp"><span class="lamp-shade"></span><span class="lamp-arm"></span><span class="lamp-base"></span><span class="lamp-glow"></span></div><div class="book-stack"><i></i><i></i><i></i></div><div class="mug"><i></i><span>∿</span></div><div class="plant"><span class="leaf l1"></span><span class="leaf l2"></span><span class="leaf l3"></span><span class="leaf l4"></span><b></b></div></div><div class="cat"><i></i><b></b><span></span></div><div class="rug"></div><div class="floor"></div></figure></div>`;
  const slider = root.querySelector('input'), scene = root.querySelector('.room-scene'), label = root.querySelector('.room-time');
  const tick = new Audio('/audio/ticktock.wav'); tick.loop = true; tick.volume = .18;
  function render() { const minutes = +slider.value, hour = Math.floor(minutes / 60), minute = minutes % 60, phase = roomPhase(hour); scene.dataset.phase = phase; scene.style.setProperty('--day-progress', minutes / 1439); label.textContent = `${String(hour).padStart(2,'0')}:${String(minute).padStart(2,'0')} · ${phase}`; root.querySelector('.clock-face i').style.transform = `rotate(${minute * 6}deg)`; root.querySelector('.clock-face b').style.transform = `rotate(${(hour % 12) * 30 + minute / 2}deg)`; }
  slider.addEventListener('input', render); render();
  root.querySelector('.audio-button').addEventListener('click', async event => {
    const button = event.currentTarget;
    if (!tick.paused) {
      tick.pause();
      button.dataset.audioState = 'paused';
      button.textContent = 'Play clock ambience';
      return;
    }
    try {
      await tick.play();
      button.dataset.audioState = 'playing';
      button.textContent = 'Pause clock ambience';
    } catch {
      button.dataset.audioState = 'error';
      button.textContent = 'Clock ambience unavailable';
    }
  });
  return () => { tick.pause(); tick.currentTime = 0; };
}
