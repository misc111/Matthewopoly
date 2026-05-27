const ELEMENT_IDS = [
  "appShell",
  "gameClock",
  "clockMeta",
  "alertMuteButton",
  "nextAction",
  "loanCount",
  "toblTickets",
  "ccTickets",
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
  "housesCount",
  "hotelsCount",
  "repairCostTotal",
  "caughtCount",
  "caughtPenaltyTotal",
  "caughtPenaltyNote",
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
  els.loanForm.reset();
  els.loanPlayer.value = "";
  els.loanAmount.value = "";
}
