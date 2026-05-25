const ELEMENT_IDS = [
  "appShell",
  "gameClock",
  "nextAction",
  "loanCount",
  "currentTurnLabel",
  "turnTime",
  "turnState",
  "playerName",
  "playerRail",
  "toblTickets",
  "ccTickets",
  "drawerOutput",
  "lotteryTime",
  "lotteryStatus",
  "votingTime",
  "votingStatus",
  "propertyTaxTime",
  "propertyTaxStatus",
  "loanForm",
  "loanPlayer",
  "loanAmount",
  "loanList",
  "defraudAmount",
  "caughtTotal",
  "taxSpaces",
  "taxRate",
  "spaceTaxTotal",
  "themeButtons",
];

export function byId(id) {
  return document.getElementById(id);
}

export function cacheElements() {
  return ELEMENT_IDS.reduce((elements, id) => {
    elements[id] = byId(id);
    return elements;
  }, {});
}

export function clearTransientForms(els) {
  els.playerName.value = "";
  els.loanForm.reset();
  els.loanPlayer.value = "";
  els.loanAmount.value = "";
}
