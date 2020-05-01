function checkBattleTag(battleTag) {
  return battleTag.match(/[a-zA-Z]+#{1}[0-9]+/gm);
}

module.exports.checkBattleTag = checkBattleTag;
