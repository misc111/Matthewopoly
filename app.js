import { SECOND } from "./src/js/config.js?v=20260527c";
import { tick } from "./src/js/actions.js?v=20260527c";
import { installAlertUnlock, playDueAlert } from "./src/js/alerts.js";
import { cacheElements, clearTransientForms } from "./src/js/dom.js";
import { bindEvents } from "./src/js/events.js?v=20260527c";
import { installIcons } from "./src/js/icons.js?v=20260527c";
import { render } from "./src/js/render.js?v=20260527c";
import { loadState, saveState } from "./src/js/state.js?v=20260527c";

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
installAlertUnlock();
bindEvents(els, persistAndRender, renderOnly);
renderOnly();

setInterval(() => {
  const dueTimers = tick();
  playDueAlert(dueTimers);
  persistAndRender();
}, SECOND);
