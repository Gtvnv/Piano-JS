/**
 * Simulador de Piano
 * -------------------
 * - Teclas geradas dinamicamente (uma oitava + o Dó seguinte).
 * - Som sintetizado com a Web Audio API (nenhum arquivo .mp3 necessário).
 * - Interação por mouse (pressionar/soltar) e teclado do computador.
 */

// Definição das notas de uma oitava (C4 ao C5).
// freq: frequência em Hz | key: tecla do teclado | type: branca ou preta.
const NOTES = [
  { note: "Dó",  freq: 261.63, key: "a", code: "A", type: "white" },
  { note: "Dó#", freq: 277.18, key: "w", code: "W", type: "black" },
  { note: "Ré",  freq: 293.66, key: "s", code: "S", type: "white" },
  { note: "Ré#", freq: 311.13, key: "e", code: "E", type: "black" },
  { note: "Mi",  freq: 329.63, key: "d", code: "D", type: "white" },
  { note: "Fá",  freq: 349.23, key: "f", code: "F", type: "white" },
  { note: "Fá#", freq: 369.99, key: "t", code: "T", type: "black" },
  { note: "Sol", freq: 392.0,  key: "g", code: "G", type: "white" },
  { note: "Sol#",freq: 415.3,  key: "y", code: "Y", type: "black" },
  { note: "Lá",  freq: 440.0,  key: "h", code: "H", type: "white" },
  { note: "Lá#", freq: 466.16, key: "u", code: "U", type: "black" },
  { note: "Si",  freq: 493.88, key: "j", code: "J", type: "white" },
  { note: "Dó²", freq: 523.25, key: "k", code: "K", type: "white" },
];

// ---------- Áudio (Web Audio API) ----------
let audioCtx = null;
let masterGain = null;

/** Inicializa o contexto de áudio na primeira interação (exigência dos navegadores). */
function initAudio() {
  if (audioCtx) return;
  const AudioContextClass = window.AudioContext || window.webkitAudioContext;
  audioCtx = new AudioContextClass();
  masterGain = audioCtx.createGain();
  masterGain.gain.value = Number(volumeInput.value) / 100;
  masterGain.connect(audioCtx.destination);
}

/**
 * Toca uma nota por um curto período com envelope suave,
 * evitando o "clique" de corte abrupto do som.
 */
function playTone(freq) {
  initAudio();
  if (audioCtx.state === "suspended") audioCtx.resume();

  const now = audioCtx.currentTime;
  const osc = audioCtx.createOscillator();
  const gain = audioCtx.createGain();

  osc.type = "triangle"; // timbre mais suave que a onda quadrada
  osc.frequency.value = freq;

  // Envelope ADSR simplificado.
  const peak = 0.9;
  gain.gain.setValueAtTime(0, now);
  gain.gain.linearRampToValueAtTime(peak, now + 0.01); // ataque
  gain.gain.exponentialRampToValueAtTime(0.001, now + 1.1); // decaimento

  osc.connect(gain);
  gain.connect(masterGain);

  osc.start(now);
  osc.stop(now + 1.2);
}

// ---------- Construção das teclas ----------
const piano = document.getElementById("piano");
const volumeInput = document.getElementById("volume");
const toggleNotes = document.getElementById("toggle-notes");
const toggleKeys = document.getElementById("toggle-keys");

// Mapa tecla-do-teclado -> elemento da tecla, para acesso rápido.
const keyMap = new Map();

function buildPiano() {
  NOTES.forEach((item) => {
    const keyEl = document.createElement("button");
    keyEl.type = "button";
    keyEl.className = `key key--${item.type}`;
    keyEl.dataset.freq = item.freq;
    keyEl.dataset.key = item.key;
    keyEl.setAttribute(
      "aria-label",
      `Nota ${item.note}, tecla ${item.code}`
    );

    keyEl.innerHTML = `
      <span class="key__note">${item.note}</span>
      <span class="key__code">${item.code}</span>
    `;

    piano.appendChild(keyEl);
    keyMap.set(item.key, keyEl);
  });
}

// ---------- Acionamento das teclas ----------
function pressKey(keyEl) {
  if (!keyEl) return;
  keyEl.classList.add("active");
  playTone(Number(keyEl.dataset.freq));
}

function releaseKey(keyEl) {
  if (!keyEl) return;
  keyEl.classList.remove("active");
}

// Mouse / toque
piano.addEventListener("pointerdown", (event) => {
  const keyEl = event.target.closest(".key");
  if (keyEl) pressKey(keyEl);
});

piano.addEventListener("pointerup", (event) => {
  const keyEl = event.target.closest(".key");
  if (keyEl) releaseKey(keyEl);
});

// Garante que a tecla "volte" caso o ponteiro saia dela ainda pressionado.
piano.addEventListener("pointerleave", (event) => {
  const keyEl = event.target.closest(".key");
  if (keyEl) releaseKey(keyEl);
}, true);

// ---------- Teclado do computador ----------
// evita repetição de som enquanto a tecla fica pressionada
const activeKeyboardKeys = new Set();

document.addEventListener("keydown", (event) => {
  const key = event.key.toLowerCase();
  if (!keyMap.has(key) || activeKeyboardKeys.has(key)) return;
  activeKeyboardKeys.add(key);
  pressKey(keyMap.get(key));
});

document.addEventListener("keyup", (event) => {
  const key = event.key.toLowerCase();
  if (!keyMap.has(key)) return;
  activeKeyboardKeys.delete(key);
  releaseKey(keyMap.get(key));
});

// ---------- Controles ----------
volumeInput.addEventListener("input", () => {
  if (masterGain) masterGain.gain.value = Number(volumeInput.value) / 100;
});

toggleNotes.addEventListener("change", () => {
  piano.classList.toggle("hide-notes", !toggleNotes.checked);
});

toggleKeys.addEventListener("change", () => {
  piano.classList.toggle("hide-keys", !toggleKeys.checked);
});

// ---------- Inicialização ----------
buildPiano();
