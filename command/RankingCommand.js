const getClanName = require("../utils/formatMessage").getClanName;
const fileUtils = require("../utils/fileUtils");
const apiUtils = require("../utils/apiUtils");

class RankingCommand {
  command;
  usage;
  description;
  clanName;

  constructor(botName, clanName) {
    this.command = `ranking`;
    this.usage = `${botName}!${this.command} ##==> Lists W3C Ewok ranking\n\n`;
    this.description = `Lists W3C Ewok ranking`;
    this.clanName = clanName;
  }

  async execute(commands) {
    let outputStr = `${getClanName(
      this.clanName
    )} Lists W3C Ewok ranking: \n\n`;

    let leagues = await apiUtils.getLeague();

    let playerStats = [];
    try {
      const players = fileUtils.getPlayers();

      if (players) {
        for (const player of players) {
          playerStats.push(await apiUtils.getPlayers(player));
        }

        playerStats.sort((a, b) => {
          a.leagueId = a.leagueId ? a.leagueId : 99999;
          b.leagueId = b.leagueId ? b.leagueId : 99999;
          if (a.leagueId < b.leagueId) {
            return -1;
          } else if (a.value > b.value) {
            return 1;
          } else {
            if (a.leagueId < b.leagueId) {
              return -1;
            } else {
              return 1;
            }
          }
        });

        let i = 1;
        for (const player of playerStats) {
          let number =
            i === 1
              ? `:first_place: - `
              : i === 2
              ? `:second_place: - `
              : i === 3
              ? `:third_place: - `
              : ` ${i}    - `;

          outputStr += ` [#${
            leagues[player.leagueId]
              ? leagues[player.leagueId].from - 1 + player.leagueRank
              : "Unranked"
          }] ${number}${player.pseudo} - ${player.winlosseSolo} (${
            player.winlosseRatioSolo
          }) - rp=${player.rp} mmr=${player.mmr} - ${player.league} (#${
            player.leagueRank
          })\n`;
          i++;
        }
      }
    } catch (error) {
      outputStr += `ERROR - fetching all players stats - ${error}`;
    }
    return outputStr;
  }
}

module.exports = RankingCommand;
