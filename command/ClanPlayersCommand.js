const getClanName = require("../utils/formatMessage").getClanName;
const fileUtils = require("../utils/fileUtils");
const globalUtils = require("../utils/globalUtils");

const COMMAND_ADD_PLAYER = "add";
const COMMAND_REMOVE_PLAYER = "remove";

class ClanPlayersCommand {
  command;
  usage;
  description;
  clanName;

  constructor(botName, clanName) {
    this.command = `clanPlayers`;
    this.usage = `${botName}!${this.command} ##==> To list  ${clanName} players registered to W3 Champions Ladder
${botName}!${this.command} add PLAYER_BATTLETAG ##==> To add a ${clanName} player in the list of registered player to W3 Champions Ladder
${botName}!${this.command} remove PLAYER_BATTLETAG ##==> To remove a ${clanName} player in the list of  registered player to W3 Champions Ladder\n\n`;
    this.description = `Lists ${clanName} players registered to W3 Champions Ladder (sub queries to add or remove player to the list \n\n`;
    this.clanName = clanName;
  }

  execute(argumentList) {
    let outputStr = `${getClanName(this.clanName)} `;

    if (!argumentList || argumentList.length === 0) {
      outputStr += getPlayersList();
    } else {
      switch (argumentList[0]) {
        case COMMAND_ADD_PLAYER:
          outputStr += addRemovePlayerToList(COMMAND_ADD_PLAYER, argumentList);
          break;
        case "remove":
          outputStr += addRemovePlayerToList(
            COMMAND_REMOVE_PLAYER,
            argumentList
          );
          break;
        default:
          outputStr += `Unknown Command.`;
          break;
      }
    }

    function getPlayersList() {
      let outputStr = ``;
      try {
        const players = fileUtils.getPlayers();
        if (players && players.length > 0) {
          outputStr += `${players.length} Players are participating to W3C Ladder: \n\n`;
          players.forEach(player => {
            outputStr += `- ${player.pseudo} - (${player.battleTag})  \n`;
          });
        } else {
          outputStr += `There is no Player configured. Please add some using command ${botName}!clanPlayers add battleTag`;
        }
      } catch (error) {
        outputStr += `ERROR - fetching all users failed - ${error}`;
      }

      return outputStr;
    }

    function addRemovePlayerToList(com, argumentList) {
      let outputStr = ``;

      if (
        argumentList &&
        argumentList.length === 2 &&
        globalUtils.checkBattleTag(argumentList[1])
      ) {
        try {
          const players = fileUtils.getPlayers();

          const existingPlayer = players.find(p => {
            return p.battleTag === argumentList[1];
          });

          if (existingPlayer && com === COMMAND_ADD_PLAYER) {
            outputStr += `ERROR - adding user failed - player ${existingPlayer.battleTag} already exists in the list`;
          } else if (!existingPlayer && com === COMMAND_REMOVE_PLAYER) {
            outputStr += `ERROR - removing user failed - player ${existingPlayer.battleTag} doesn't exist in the list`;
          } else if (com === COMMAND_ADD_PLAYER) {
            let splitUser = argumentList[1].split("#");
            players.push({
              pseudo: splitUser[0],
              tag: splitUser[1],
              battleTag: argumentList[1]
            });
            fileUtils.setPlayers(players);

            outputStr += `SUCCESS - Player added -  ${argumentList[1]} `;
          } else if (com === COMMAND_REMOVE_PLAYER) {
            const existingPlayerIndex = players.findIndex(p => {
              return p.battleTag === argumentList[1];
            });

            players.splice(existingPlayerIndex, 1);

            fileUtils.setPlayers(players);
            outputStr += `SUCCESS - Player removed -  ${argumentList[1]} `;
          }
        } catch (error) {
          outputStr += `ERROR - adding/removingg user failed - ${error}`;
        }
      } else {
        outputStr += `ERROR - adding/removing user failed -> Wrong arguments or BattleTag format`;
      }

      return outputStr;
    }

    return outputStr;
  }
}

module.exports = ClanPlayersCommand;
