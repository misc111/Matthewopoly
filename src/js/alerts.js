import { state } from "./state.js";

let audioContext;
let audioUnlocked = false;

function getAudioContext() {
  const AudioContextClass = window.AudioContext || window.webkitAudioContext;
  if (!AudioContextClass) return null;
  if (!audioContext) audioContext = new AudioContextClass();
  return audioContext;
}

function unlockAudio() {
  const context = getAudioContext();
  if (!context) return;
  if (context.state === "suspended") context.resume();

  if (audioUnlocked) return;
  audioUnlocked = true;

  const oscillator = context.createOscillator();
  const gain = context.createGain();
  gain.gain.value = 0.0001;
  oscillator.connect(gain);
  gain.connect(context.destination);
  oscillator.start();
  oscillator.stop(context.currentTime + 0.03);
}

function playTone(frequency, startOffset, duration) {
  const context = getAudioContext();
  if (!context) return;
  if (context.state === "suspended") context.resume();

  const start = context.currentTime + startOffset;
  const oscillator = context.createOscillator();
  const gain = context.createGain();
  oscillator.type = "square";
  oscillator.frequency.setValueAtTime(frequency, start);
  gain.gain.setValueAtTime(0.0001, start);
  gain.gain.exponentialRampToValueAtTime(0.22, start + 0.018);
  gain.gain.exponentialRampToValueAtTime(0.0001, start + duration);
  oscillator.connect(gain);
  gain.connect(context.destination);
  oscillator.start(start);
  oscillator.stop(start + duration + 0.02);
}

export function installAlertUnlock() {
  const unlock = () => {
    unlockAudio();
    ["pointerdown", "keydown", "touchstart"].forEach((eventName) => {
      window.removeEventListener(eventName, unlock, true);
    });
  };

  ["pointerdown", "keydown", "touchstart"].forEach((eventName) => {
    window.addEventListener(eventName, unlock, { capture: true, once: true, passive: true });
  });
}

export function playDueAlert(dueTimers) {
  if (!dueTimers.length || state.alertsMuted) return;

  unlockAudio();
  playTone(880, 0, 0.11);
  playTone(1175, 0.14, 0.13);
  playTone(880, 0.31, 0.17);

  if ("vibrate" in navigator) navigator.vibrate([180, 80, 220]);
}
