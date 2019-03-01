require("./util/Prototypes.js");
require("./extenders/Message.js");
require("./extenders/GuildMember.js");
require("./extenders/Guild.js");
require("./extenders/DMChannel.js");
require("./extenders/TextChannel.js");

const Karen = require("./structures/Karen.js");
const Tsukihi = require("./structures/Tsukihi.js");

const errorDirnameRegex = new RegExp(`${__dirname}/`, "g");

const botKaren = new Karen({
  disableEveryone: true,
  messageCacheMaxSize: 100,
  messageCacheLifetime: 240,
  messageSweepInterval: 300
});

const botTsukihi = new Tsukihi({
  disableEveryone: true,
  messageCacheMaxSize: 100,
  messageCacheLifetime: 240,
  messageSweepInterval: 300
});

botKaren.login(botKaren.config.karenKey);
botTsukihi.login(botTsukihi.config.tsukihiKey);

botKaren.on("disconnect", () => botKaren.console.warn("Karen is disconnecting..."))
  .on("reconnect", () => botKaren.console.log("Karen reconnecting..."))
  .on("error", err => botKaren.console.error(err))
  .on("warn", info => botKaren.console.warn(info));

botTsukihi.on("disconnect", () => botTsukihi.console.warn("Tsukihi is disconnecting..."))
  .on("reconnect", () => botTsukihi.console.log("Tsukihi reconnecting..."))
  .on("error", err => botTsukihi.console.error(err))
  .on("warn", info => botTsukihi.console.warn(info));

process.on("uncaughtException", err => {
  const errorMsg = err.stack.replace(errorDirnameRegex, "./");
  console.error(`Uncaught Exception: ${errorMsg}`);
});

process.on("unhandledRejection", err => {
  const errorMsg = err.stack.replace(errorDirnameRegex, "./");
  console.error(`Uncaught Exception: ${errorMsg}`);
});
