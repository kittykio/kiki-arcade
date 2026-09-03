export const winningLine = board => {
  const lines = [[0,1,2],[3,4,5],[6,7,8],[0,3,6],[1,4,7],[2,5,8],[0,4,8],[2,4,6]];
  return lines.find(([a,b,c]) => board[a] && board[a] === board[b] && board[a] === board[c]) || null;
};

export const bestTicTacToeMove = board => {
  const open = board.map((value, index) => value ? -1 : index).filter(index => index >= 0);
  const completes = mark => open.find(index => { const next = [...board]; next[index] = mark; return winningLine(next); });
  return completes('O') ?? completes('X') ?? (board[4] ? undefined : 4) ?? open[Math.floor(Math.random() * open.length)];
};

const intro = (eyebrow, title, copy, extra = '') => `<div class="classic-copy"><p class="eyebrow">${eyebrow}</p><h2>${title}</h2><p>${copy}</p>${extra}</div>`;

export function mountTicTacToe(root) {
  root.innerHTML = `<div class="classic-app tic-app toy">${intro('A pencil-and-paper classic','Tic-Tac-Toe','Make a line before the machine does. You are crosses and always take the first turn.','<div class="classic-score"><span>Wins <b data-wins>0</b></span><span>Draws <b data-draws>0</b></span></div>')}<div class="classic-stage"><p class="classic-status" aria-live="polite">Your turn</p><div class="tic-board" role="grid" aria-label="Tic-Tac-Toe board">${Array.from({length:9},(_,i)=>`<button type="button" role="gridcell" data-cell="${i}" aria-label="Empty square ${i+1}"></button>`).join('')}</div><button class="classic-reset" type="button">New round</button></div></div>`;
  let board = Array(9).fill(''), locked = false;
  let wins = Number(localStorage.getItem('playground:tic-wins') || 0), draws = Number(localStorage.getItem('playground:tic-draws') || 0);
  const cells = [...root.querySelectorAll('[data-cell]')], status = root.querySelector('.classic-status');
  const scores = () => { root.querySelector('[data-wins]').textContent = wins; root.querySelector('[data-draws]').textContent = draws; }; scores();
  const paint = () => cells.forEach((cell,i) => { cell.textContent=board[i]; cell.dataset.mark=board[i]; cell.disabled=locked||Boolean(board[i]); cell.setAttribute('aria-label',board[i]?`Square ${i+1}: ${board[i]}`:`Empty square ${i+1}`); });
  const finish = () => { const line=winningLine(board); if(line){ locked=true; line.forEach(i=>cells[i].classList.add('winner')); status.textContent=`${board[line[0]] === 'X' ? 'You win!' : 'Machine wins.'}`; if(board[line[0]]==='X'){ wins++; localStorage.setItem('playground:tic-wins',wins); } scores(); return true; } if(board.every(Boolean)){ locked=true; draws++; localStorage.setItem('playground:tic-draws',draws); scores(); status.textContent='A thoughtful draw.'; return true; } return false; };
  root.addEventListener('click', event => { const cell=event.target.closest('[data-cell]'); if(event.target.closest('.classic-reset')){ board=Array(9).fill(''); locked=false; cells.forEach(c=>c.classList.remove('winner')); status.textContent='Your turn'; paint(); return; } if(!cell||locked||board[cell.dataset.cell])return; board[cell.dataset.cell]='X'; paint(); if(finish())return; locked=true; status.textContent='Machine is thinking…'; setTimeout(()=>{ const move=bestTicTacToeMove(board); if(move!==undefined)board[move]='O'; locked=false; paint(); if(!finish())status.textContent='Your turn'; },350); });
  paint();
}

export const createMemoryDeck = (pairs, random = Math.random) => [...pairs,...pairs].map((value,index)=>({value,id:`${value}-${index}`})).sort(()=>random()-.5);

export function mountMemory(root) {
  const symbols=['★','☂','♬','☕','⚑','☁','◆','✿'];
  root.innerHTML=`<div class="classic-app memory-app toy">${intro('A matching classic','Memory Match','Turn over two cards at a time and clear the desk in as few moves as possible.','<div class="classic-score"><span>Moves <b data-moves>0</b></span><span>Best <b data-best>—</b></span></div>')}<div class="classic-stage"><p class="classic-status" aria-live="polite">Find a matching pair</p><div class="memory-board"></div><button class="classic-reset" type="button">Shuffle cards</button></div></div>`;
  let deck=[], open=[], matched=new Set(), moves=0, busy=false; const boardEl=root.querySelector('.memory-board'), status=root.querySelector('.classic-status'); let best=Number(localStorage.getItem('playground:memory-best')||0);
  const update=()=>{root.querySelector('[data-moves]').textContent=moves;root.querySelector('[data-best]').textContent=best||'—';};
  const render=()=>{boardEl.innerHTML=deck.map((card,i)=>`<button type="button" data-card="${i}" class="${open.includes(i)||matched.has(i)?'is-open':''}" aria-label="${matched.has(i)?`Matched ${card.value}`:open.includes(i)?`Card ${card.value}`:`Hidden card ${i+1}`}" ${matched.has(i)?'disabled':''}><span>${card.value}</span></button>`).join('');update();};
  const reset=()=>{deck=createMemoryDeck(symbols);open=[];matched=new Set();moves=0;busy=false;status.textContent='Find a matching pair';render();};
  root.addEventListener('click',event=>{if(event.target.closest('.classic-reset'))return reset();const button=event.target.closest('[data-card]');if(!button||busy)return;const index=Number(button.dataset.card);if(open.includes(index)||matched.has(index))return;open.push(index);render();if(open.length===2){moves++;busy=true;const[a,b]=open;if(deck[a].value===deck[b].value){matched.add(a);matched.add(b);open=[];busy=false;status.textContent='A match!';if(matched.size===deck.length){if(!best||moves<best){best=moves;localStorage.setItem('playground:memory-best',best);}status.textContent=`Desk cleared in ${moves} moves!`; }render();}else{status.textContent='Not this pair—remember them.';setTimeout(()=>{open=[];busy=false;status.textContent='Try another pair';render();},700);}}});reset();
}

export const guessHint = (guess, target) => guess === target ? 'correct' : guess < target ? 'higher' : 'lower';

export function mountGuess(root) {
  root.innerHTML=`<div class="classic-app guess-app toy">${intro('The first JavaScript game','Number Guess','I am thinking of a number from 1 to 100. Use the clues to find it efficiently.','<div class="classic-score"><span>Guesses <b data-count>0</b></span><span>Best <b data-best>—</b></span></div>')}<div class="classic-stage"><div class="guess-orb" aria-hidden="true">?</div><form class="guess-form"><label for="guess-number">Your guess</label><div><input id="guess-number" type="number" inputmode="numeric" min="1" max="100" required autocomplete="off"><button type="submit">Check</button></div></form><p class="classic-status" aria-live="polite">Pick any number from 1 to 100.</p><ol class="guess-history" aria-label="Previous guesses"></ol><button class="classic-reset" type="button">New number</button></div></div>`;
  let target=1+Math.floor(Math.random()*100), count=0, done=false;let best=Number(localStorage.getItem('playground:guess-best')||0);const input=root.querySelector('input'),status=root.querySelector('.classic-status'),history=root.querySelector('.guess-history');
  const update=()=>{root.querySelector('[data-count]').textContent=count;root.querySelector('[data-best]').textContent=best||'—';};
  const reset=()=>{target=1+Math.floor(Math.random()*100);count=0;done=false;history.replaceChildren();status.textContent='Pick any number from 1 to 100.';input.value='';input.disabled=false;root.querySelector('.guess-orb').textContent='?';update();input.focus();};
  root.querySelector('form').addEventListener('submit',event=>{event.preventDefault();if(done)return;const guess=Number(input.value);if(!Number.isInteger(guess)||guess<1||guess>100){status.textContent='Enter a whole number from 1 to 100.';return;}count++;const hint=guessHint(guess,target);history.insertAdjacentHTML('afterbegin',`<li><b>${guess}</b><span>${hint}</span></li>`);if(hint==='correct'){done=true;input.disabled=true;root.querySelector('.guess-orb').textContent=target;if(!best||count<best){best=count;localStorage.setItem('playground:guess-best',best);}status.textContent=`Correct in ${count} ${count===1?'guess':'guesses'}!`; }else status.textContent=`Go ${hint}.`;input.value='';update();input.focus();});root.querySelector('.classic-reset').addEventListener('click',reset);reset();
}
