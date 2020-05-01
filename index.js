//https://www.devdungeon.com/content/javascript-discord-bot-tutorial#create_a_bot_account

// ########################################################### IMPORTS //
const Discord = require("discord.js");
const client = new Discord.Client();

// ########################################################### PARAMETERS //
const bot_secret_token = process.env.BOT_TOKEN;
const clanName = process.env.CLAN_NAME;
const botName = process.env.BOT_NAME;

const currentServerId =
  process.env.NODE_ENV === "Production"
    ? process.env.PROD_SERVER
    : process.env.TEST_SERVER;
const currentChannelId =
  process.env.NODE_ENV === "Production"
    ? process.env.PROD_CHANNEL
    : process.env.TEST_CHANNEL;

// ########################################################### LOAD COMMANDS //
const HelpCommand = require("./command/HelpCommand");
const ChefCommand = require("./command/ChefCommand");
const ClanPlayersCommand = require("./command/ClanPlayersCommand");
const RankingCommand = require("./command/RankingCommand");
const LeagueCommand = require("./command/LeagueCommand");
const StatsCommand = require("./command/StatsCommand");

helpCommand = new HelpCommand(botName, clanName);
chefCommand = new ChefCommand(botName, clanName);
clanPlayersCommand = new ClanPlayersCommand(botName, clanName);
rankingCommand = new RankingCommand(botName, clanName);
leagueCommand = new LeagueCommand(botName, clanName);
statsCommand = new StatsCommand(botName, clanName);

const commandList = [
  helpCommand,
  chefCommand,
  clanPlayersCommand,
  rankingCommand,
  leagueCommand,
  statsCommand
];

// ########################################################### EVENTS //
client.on("ready", () => {
  if (
    client.guilds.cache.get(currentServerId) &&
    client.channels.cache.get(currentChannelId)
  ) {
    let generalChannel = client.channels.cache.get(currentChannelId); // Replace with known channel ID
    generalChannel.send(`I am Connected ! For more info => ${botName}!help`);
  }
});

client.on("message", receivedMessage => {
  // Prevent bot from responding to its own messages
  if (receivedMessage.author === client.user) {
    return;
  }

  if (receivedMessage.content === "!help") {
    receivedMessage.channel.send(
      `If you want to know my Command try ${botName}!help`
    );
  } else if (
    receivedMessage.content.startsWith(`${botName}!`) &&
    receivedMessage.channel.id === currentChannelId
  ) {
    processCommand(receivedMessage.content, receivedMessage.channel);
  }
});

// ########################################################### COMMANDS //
async function processCommand(content, discordChannel) {
  let fullCommand = content.substr(botName.length + 1); // Remove the leading exclamation mark
  let splitCommand = fullCommand.split(" "); // Split the message up in to pieces for each space
  let primaryCommand = splitCommand[0]; // The first word directly after the exclamation is the command
  let arguments = splitCommand.slice(1); // All other words are arguments/parameters/options for the command

  let outputMessage;

  switch (primaryCommand) {
    case "help":
      outputMessage = helpCommand.execute(commandList);
      break;
    case "chef":
      outputMessage = chefCommand.execute();
      break;
    case "clanPlayers":
      outputMessage = await clanPlayersCommand.execute(arguments);
      break;
    case "ranking":
      outputMessage = await rankingCommand.execute(arguments);
      break;
    case "leagues":
      outputMessage = await leagueCommand.execute(arguments);
      break;
    case "stats":
      outputMessage = await statsCommand.execute(arguments);
      break;
    default:
      outputMessage = `I don't understand the command. Try ${botName}!help`;
      break;
  }

  discordChannel.send(outputMessage);
}

client.login(bot_secret_token);
