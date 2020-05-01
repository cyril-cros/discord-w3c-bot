const getClanName = require("../utils/formatMessage").getClanName;
const apiUtils = require("../utils/apiUtils");

class LeagueCommand {
  command;
  usage;
  description;
  clanName;

  constructor(botName, clanName) {
    this.command = `leagues`;
    this.usage = `${botName}!${this.command} ##==> Provides insight on W3C leagues\n\n`;
    this.description = `Provides insight on W3C leagues`;
    this.clanName = clanName;
  }

  async execute(commands) {
    let outputStr = `${getClanName(
      this.clanName
    )} List of Dinofly available commands: \n\n`;

    let leagues = await apiUtils.getLeague();

    leagues.forEach(league => {
      outputStr += `${league.id} - ${league.name} - ${league.division} - From rank ${league.from} to ${league.to} \n`;
    });

    return outputStr;
  }
}

module.exports = LeagueCommand;
