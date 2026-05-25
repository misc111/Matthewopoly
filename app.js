import { SECOND } from "./src/js/config.js";
import { tick } from "./src/js/actions.js";
import { cacheElements, clearTransientForms } from "./src/js/dom.js";
import { bindEvents } from "./src/js/events.js";
import { installIcons } from "./src/js/icons.js";
import { render } from "./src/js/render.js";
import { loadState, saveState } from "./src/js/state.js";

const els = cacheElements();

function renderOnly() {
  render(els);
}

function persistAndRender() {
  saveState();
  renderOnly();
}

installIcons();
loadState();
clearTransientForms(els);
bindEvents(els, persistAndRender, renderOnly);
renderOnly();

setInterval(() => {
  tick();
  persistAndRender();
}, SECOND);
