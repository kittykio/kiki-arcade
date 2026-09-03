const keys = ['AC', '±', '%', '÷', '7', '8', '9', '×', '4', '5', '6', '−', '1', '2', '3', '+', '0', '.', '⌫', '='];

export function calculate(a, operator, b) {
  const x = Number(a), y = Number(b);
  if (operator === '+') return x + y;
  if (operator === '−') return x - y;
  if (operator === '×') return x * y;
  if (operator === '÷') return y === 0 ? 'Not a number' : x / y;
  if (operator === '%') return x % y;
  return y;
}

export function mountCalculator(root) {
  root.innerHTML = `<div class="calc-app toy"><div class="toy-intro"><p class="eyebrow">A softer way to count</p><h2>Pocket Calc</h2><p>Keyboard-friendly arithmetic with a little memory.</p><ol class="calc-history" aria-label="Calculation history"></ol></div><div class="calculator"><div class="calc-screen" aria-live="polite"><small class="calc-expression">Ready when you are</small><output>0</output></div><div class="calc-keys">${keys.map(key => `<button type="button" data-key="${key}" class="${['÷','×','−','+','=','%'].includes(key) ? 'operator' : ''}">${key}</button>`).join('')}</div></div></div>`;
  let current = '0', previous = '', operator = '', replace = false;
  const output = root.querySelector('output'), expression = root.querySelector('.calc-expression'), history = root.querySelector('.calc-history');
  const render = () => { output.value = current; output.textContent = current; expression.textContent = previous ? `${previous} ${operator}` : 'Ready when you are'; };
  const input = (key) => {
    if (/^\d$/.test(key) || key === '.') { if (key === '.' && current.includes('.')) return; current = replace || current === '0' ? (key === '.' ? '0.' : key) : current + key; replace = false; }
    else if (key === 'AC') { current = '0'; previous = operator = ''; }
    else if (key === '⌫') current = current.length > 1 ? current.slice(0, -1) : '0';
    else if (key === '±') current = String(Number(current) * -1);
    else if (['÷','×','−','+','%'].includes(key)) { if (previous && !replace) current = String(calculate(previous, operator, current)); previous = current; operator = key; replace = true; }
    else if (key === '=' && previous) { const line = `${previous} ${operator} ${current}`; current = String(calculate(previous, operator, current)); history.insertAdjacentHTML('afterbegin', `<li><span>${line}</span><strong>${current}</strong></li>`); [...history.children].slice(4).forEach(el => el.remove()); previous = operator = ''; replace = true; }
    render();
  };
  root.addEventListener('click', event => { const key = event.target.closest('[data-key]')?.dataset.key; if (key) input(key); });
  const keyboard = event => { const map = { '/':'÷', '*':'×', '-':'−', Enter:'=', Backspace:'⌫', Escape:'AC' }; const key = map[event.key] || event.key; if (keys.includes(key)) { event.preventDefault(); input(key); } };
  addEventListener('keydown', keyboard); render();
  return () => removeEventListener('keydown', keyboard);
}
