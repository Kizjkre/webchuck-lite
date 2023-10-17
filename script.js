import { Chuck } from 'https://cdn.jsdelivr.net/npm/webchuck/+esm';

const chuck = await (await fetch('./chu.ck')).text();

const editor = newChuckEditor('editor');
editor.setValue(chuck, 1);

const states = Object.freeze({
  playing: 0,
  stopped: 1
});
let status = states.stopped;

const action = document.querySelector('#action');
const mixer = document.querySelector('#mixer');

action.addEventListener('click', async () => {
  window.theChuck ??= await Chuck.init([]);

  switch (status) {
    case states.playing:
      status = states.stopped;

      theChuck.removeLastCode();

      action.innerHTML = `
        <svg xmlns="http://www.w3.org/2000/svg" width="32" height="32" fill="currentColor" class="bi bi-play" viewBox="0 0 16 16">
          <path d="M10.804 8 5 4.633v6.734L10.804 8zm.792-.696a.802.802 0 0 1 0 1.392l-6.363 3.692C4.713 12.69 4 12.345 4 11.692V4.308c0-.653.713-.998 1.233-.696l6.363 3.692z"/>
        </svg>
      `;
      break;
    case states.stopped:
      status = states.playing;

      theChuck.runCode(editor.getValue());

      action.innerHTML = `
        <svg xmlns="http://www.w3.org/2000/svg" width="32" height="32" fill="currentColor" class="bi bi-stop" viewBox="0 0 16 16">
          <path d="M3.5 5A1.5 1.5 0 0 1 5 3.5h6A1.5 1.5 0 0 1 12.5 5v6a1.5 1.5 0 0 1-1.5 1.5H5A1.5 1.5 0 0 1 3.5 11V5zM5 4.5a.5.5 0 0 0-.5.5v6a.5.5 0 0 0 .5.5h6a.5.5 0 0 0 .5-.5V5a.5.5 0 0 0-.5-.5H5z"/>
        </svg>
      `;
      break;
  }
});

const sliders = [...chuck.matchAll(/^\s*(?!\/\/ +)global float (\w+)/gm)]
  .map(([, variable]) => variable);

sliders.forEach(variable => {
  const div = document.createElement('div');
  div.classList.add('slider-wrap');

  const p = document.createElement('p');
  p.textContent = variable;

  const input = document.createElement('input');
  input.setAttribute('type', 'range');
  input.setAttribute('min', '0');
  input.setAttribute('max', '1');
  input.setAttribute('value', '0');
  input.setAttribute('step', '0.01');

  div.append(p, input);
  mixer.append(div);

  input.addEventListener('change', e => theChuck.setFloat(variable, +e.target.value));
});
