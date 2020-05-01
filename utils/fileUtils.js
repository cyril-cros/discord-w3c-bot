const fs = require("fs");
const path = require("path");
const playerFilePath = path.join(__dirname, "../config/clanPlayers.json");

function getPlayers() {
  return JSON.parse(fs.readFileSync(playerFilePath, "utf8"));
}

function setPlayers(players) {
  fs.writeFile(playerFilePath, JSON.stringify(players), err => {});
}

module.exports.getPlayers = getPlayers;
module.exports.setPlayers = setPlayers;
