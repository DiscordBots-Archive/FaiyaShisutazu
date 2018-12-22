require("./util/Prototypes.js");
require("./extenders/Message.js");
require("./extenders/GuildMember.js");
require("./extenders/Guild.js");
require("./extenders/DMChannel.js");
require("./extenders/TextChannel.js");

const TsukihiClient = require("./structures/BotTsukihi.js");
const KarenClient = require("./structures/BotKaren.js");
const errorDirnameRegex = new RegExp(`${__dirname}/`, "g");

const client = new TsukihiClient({
  disableEveryone: true,
  messageCacheMaxSize: 100,
  messageCacheLifetime: 240,
  messageSweepInterval: 300
});

const supClient = new KarenClient({
  disableEveryone: true,
  messageCacheMaxSize: 100,
  messageCacheLifetime: 240,
  messageSweepInterval: 300
});

client.login(client.config.discordKey1);
supClient.login(client.config.discordKey2);

client.on("disconnect", () => client.console.warn("Bot is disconnecting..."))
  .on("reconnect", () => client.console.log("Bot reconnecting..."))
  .on("error", err => client.console.error(err))
  .on("warn", info => client.console.warn(info));

supClient.on("disconnect", () => supClient.console.warn("Bot is disconnecting..."))
  .on("reconnect", () => supClient.console.log("Bot reconnecting..."))
  .on("error", err => supClient.console.error(err))
  .on("warn", info => supClient.console.warn(info));

process.on("uncaughtException", err => {
  const errorMsg = err.stack.replace(errorDirnameRegex, "./");
  client.console.error(`Uncaught Exception: ${errorMsg}`);
  process.exit(1);
});

process.on("unhandledRejection", client.console.error);
