const axios = require("axios");
const w3cApiUrl = `https://api.w3champions.com`;

async function getPlayerStats(player) {
  let response = await axios.get(
    `${w3cApiUrl}/player/${player.pseudo}%23${player.tag}/stats`
  );
  return formatPlayerData(response);
}

async function getPlayerStatsByBattleTag(battleTag) {
  let splitResult = battleTag.split("#");

  let response = await axios.get(
    `${w3cApiUrl}/player/${splitResult[0]}%23${splitResult[1]}/stats`
  );

  return formatPlayerData(response);
}

async function getLeague() {
  let response = await axios.get(`${w3cApiUrl}/leagues/20`);
  let rankCounter = 0;

  let leagues = {};

  if (response && response.data) {
    leagues = response.data;
    leagues.map(league => {
      league.from = rankCounter + 1;
      league.to = rankCounter + league.maxParticipantCount;
      rankCounter += league.maxParticipantCount;
    });
  }
  return leagues;
}

async function getPLayersMatchesHistoryByBattleTag(battleTag) {
  let splitResult = battleTag.split("#");

  let matches = {};

  let response = await axios.get(
    `${w3cApiUrl}/player/${splitResult[0]}%23${splitResult[1]}/match?limit=1000&offset=0`
  );
  if (response && response.data && response.data.items) {
    matches = response.data.items;
  }

  return matches;
}

function formatPlayerData(response) {
  if (response && response.data && response.data.data) {
    let playerStat = response.data.data;
    return {
      pseudo: response.data.account.split("#")[0],
      winlosseSolo: `${playerStat.ladder[20].solo.wins}/${playerStat.ladder[20].solo.losses}`,
      winlosseRatioSolo: `${Math.round(
        (playerStat.ladder[20].solo.wins /
          (playerStat.ladder[20].solo.losses +
            playerStat.ladder[20].solo.wins)) *
          100
      )} %`,
      rp: Math.round(playerStat.ladder[20].solo.ranking.rp),
      mmr: Math.round(playerStat.ladder[20].solo.mmr.rating),
      leagueId: playerStat.ladder[20].solo.ranking.leagueId,
      league: `${
        playerStat.ladder[20].solo.league
          ? playerStat.ladder[20].solo.league.name
          : "Noob League"
      } - ${
        playerStat.ladder[20].solo.league
          ? playerStat.ladder[20].solo.league.division
          : "N/A"
      }`,
      leagueRank: playerStat.ladder[20].solo.ranking.rank,
      stats: playerStat.stats
    };
  } else {
    return {};
  }
}

module.exports.getPlayers = getPlayerStats;
module.exports.getPLayersMatchesHistoryByBattleTag = getPLayersMatchesHistoryByBattleTag;
module.exports.getLeague = getLeague;
module.exports.getPlayerStatsByBattleTag = getPlayerStatsByBattleTag;
