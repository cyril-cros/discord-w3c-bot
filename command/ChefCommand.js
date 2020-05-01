const getClanName = require("../utils/formatMessage").getClanName;

class ChefCommand {
  command;
  usage;
  description;
  clanName;

  constructor(botName, clanName) {
    this.command = `chef`;
    this.usage = `${botName}!${this.command} ##==> Describes what is a Chef, a Leader, a Clan GOD !\n\n`;
    this.description = `Describes what is a Chef, a Leader, a Clan GOD !`;
    this.clanName = clanName;
  }

  execute() {
    return `${getClanName(
      this.clanName
    )} Please find Chef's description here: https://media.giphy.com/media/RkE49ci4yPGeNKtkmT/giphy.gif \n
    More details here: https://en.wikipedia.org/wiki/Newbie`;
  }
}

module.exports = ChefCommand;
