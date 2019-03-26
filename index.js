require("./util/Prototypes.js");
require("./extenders/Message.js");
require("./extenders/GuildMember.js");
require("./extenders/Guild.js");
require("./extenders/DMChannel.js");
require("./extenders/TextChannel.js");

const FaiyaShisutazu = require("./structures/FaiyaShisutazu.js");

const errorDirnameRegex = new RegExp(`${__dirname}/`, "g");

const faiyaShisutazu = new FaiyaShisutazu({
  disableEveryone: true,
  messageCacheMaxSize: 100,
  messageCacheLifetime: 240,
  messageSweepInterval: 300
});

faiyaShisutazu.login(faiyaShisutazu.config.key);

faiyaShisutazu.on("disconnect", () => faiyaShisutazu.console.warn("FaiyaShisutazu is disconnecting..."))
  .on("reconnect", () => faiyaShisutazu.console.log("FaiyaShisutazu reconnecting..."))
  .on("error", err => faiyaShisutazu.console.error(err))
  .on("warn", info => faiyaShisutazu.console.warn(info));

process.on("uncaughtException", err => {
  const errorMsg = err.stack.replace(errorDirnameRegex, "./");
  console.error(`Uncaught Exception: ${errorMsg}`);
});

process.on("unhandledRejection", err => {
  const errorMsg = err.stack.replace(errorDirnameRegex, "./");
  console.error(`Uncaught Exception: ${errorMsg}`);
});
