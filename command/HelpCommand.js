const getClanName = require("../utils/formatMessage").getClanName;

class HelpCommand {
  command;
  usage;
  description;
  clanName;

  constructor(botName, clanName) {
    this.command = `help`;
    this.usage = `${botName}!${this.command} ##==> List of Dinofly available commands\n\n`;
    this.description = `List of Dinofly available commands`;
    this.clanName = clanName;
  }

  execute(commands) {
    let outputStr = `${getClanName(
      this.clanName
    )} List of Dinofly available commands: \n\n`;

    commands.forEach(e => {
      outputStr += `${e.usage}`;
    });

    return outputStr;
  }
}

module.exports = HelpCommand;
