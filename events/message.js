const Event = require("../structures/Event.js");
const monitor = require("../monitors/monitor.js");
const Social = require("../structures/Social.js");
const { Permissions, Collection } = require("discord.js");
const moment = require("moment");
require("moment-duration-format");

module.exports = class extends Event {

  constructor(...args) {
    super(...args);

    this.impliedPermissions = new Permissions([
      "VIEW_CHANNEL",
      "SEND_MESSAGES",
      "SEND_TTS_MESSAGES",
      "EMBED_LINKS",
      "ATTACH_FILES",
      "READ_MESSAGE_HISTORY",
      "MENTION_EVERYONE",
      "USE_EXTERNAL_EMOJIS",
      "ADD_REACTIONS"
    ]);

    this.friendlyPerms = Object.keys(Permissions.FLAGS).reduce((obj, key) => {
      obj[key] = key.split("_").join(" ").toProperCase();
      return obj;
    }, {});

    this.ratelimits = new Collection();
    this.playlists = new Collection();
  }

  async run(message) {
    try {
      if (message.author.bot) return;

      // Let Karen handles Steins;Gate references
      if (this.client.user.id === "475552332138938378") {
        if (message.content.search(/El[\s\W]+Psy[\s\W]+Con([a-z]*)/i) !== -1
        || message.content.search(/T[u,o]{1,2}[\s,-]?T[u,o]{1,2}[\s,-]?r[u,o]?[u,o]?/i) !== -1
        || message.content.search(/Ho(u)?oin Kyo(u)?ma/i) !== -1)
          message.channel.send(`***${message.author.tag}*** *said "${message.content}"*\n\n${this.client.responses.steinerMessages.random()
            .replaceAll("{{user}}", `${message.author.tag}`)
            .replaceAll("{{steiner}}", message.content.replace(/El[\s\W]+Psy[\s\W]+Con([a-z]*)/i, "**El Psy Kongroo**")
              .replaceAll(/T[u,o]{1,2}[\s,-]?T[u,o]{1,2}[\s,-]?r[u,o]?[u,o]?/i, "**Tutturu**")
              .replaceAll(/Ho(u)?oin Kyo(u)?ma/i, "**Hououin Kyouma**"))}`);
      } 

      if (!message.guild) return message.channel.send("Please message Tsukihi instead!");
      if (message.guild && !message.guild.me) await message.guild.members.fetch(this.client.user);
      if (message.guild && !message.channel.postable) return;

      const prefix = new RegExp(`^<@!?${this.client.user.id}> |^${this.client.methods.util.regExpEsc(message.settings.prefix)}`)
        .exec(message.content);
      if (!prefix) return;

      const args = message.content.slice(prefix[0].length).trim().split(/ +/g);
      const cmd = this.client.commands.get(args.shift().toLowerCase());
      const level = this.client.permlevel(message);
      const userPermLevel = this.client.config.permLevels.find(perm => perm.level === level);

      if (this.client.user.id === "475552332138938378") {
        let response;

        if (!cmd) {
          response = message.channel.send(`❎ | ${message.client.responses.commandErrorMessages.random().replaceAll("{{user}}", message.member.displayName).replaceAll("{{prefix}}", message.settings.prefix)}`);
          return message.react("⁉");
        }

        if (level < this.client.levelCache[cmd.permLevel]) {
          if (message.settings.systemNotice !== "true") return;
          return message.channel.send(`B-Baka! You're only level ${level}, a ${userPermLevel.name.toLowerCase()}, why should I listen to you instead of a ${cmd.permLevel} (level ${this.client.levelCache[cmd.permLevel]}).`);
        }
  
        response = await message.channel.send(`✅ | ${message.client.responses.commandSuccessMessages.random().replaceAll("{{user}}", message.member.displayName)}`);
        const filter = m => m.author.id === "475554834892980230";
        const collected = await message.channel.awaitMessages(filter, {max: 1, time: 2000, errors: ["time"]});
        if (collected.size !== 1)
          setTimeout( async () => await response.edit(message.client.responses.waitTsukihiMessages.random().replaceAll("{{user}}", message.member.displayName)), 2000);
      } else {
        if (message.settings.socialSystem === "true") monitor.run(this.client, message, level);
        const filter = m => (m.author.id === "475552332138938378" && m.content.startsWith("✅"));
        const collected = await message.channel.awaitMessages(filter, {max: 1, time: 1000, errors: ["time"]});
        if (collected.size === 1) {
          const rateLimit = this.ratelimit(message, cmd);

          if (typeof rateLimit === "string") {
            this.client.console.log(`\u001b[43;30m[${userPermLevel.name}]\u001b[49;39m \u001b[44m${message.author.username} (${message.author.id})\u001b[49m got ratelimited while running command ${cmd.name}`);
            return message.channel.send(`Please wait ${rateLimit.toPlural()} to run this command.`); // return stop command from executing
          }

          if (cmd.guildOnly && !message.guild) return message.channel.send("This command is unavailable via private message. Please run this command in a guild.");
          
          while (args[0] && args[0][0] === "-") message.flags.push(args.shift().slice(1));
          message.author.permLevel = level;
          await this.runCommand(message, cmd, args);
        }
      }
    } catch (error) {
      this.client.console.error(error);
    }
  }

  botPerms(message, cmd) {
    const missing = message.channel.type === "text" ? message.channel.permissionsFor(this.client.user).missing(cmd.botPerms) : this.impliedPermissions.missing(cmd.botPerms);
    if (missing.length > 0) {
      message.channel.send(`The bot does not have the following permissions \`${missing.map(key => this.friendlyPerms[key]).join(", ")}\``);
      return false;
    }
    return true;
  }

  async runCommand(message, cmd, args) {
    try {
      const hasPerm = this.botPerms(message, cmd);
      if (!hasPerm) return;
      if (cmd instanceof Social) {
        await cmd.cmdVerify(message, args);
        if (message.settings.socialSystem === "true") await cmd.cmdPay(message, message.author.id, cmd.cost);
      }
      const userPermLevel = this.client.config.permLevels.find(perm => perm.level === message.author.permLevel);
      this.client.console.log(`\u001b[43;30m[${userPermLevel.name}]\u001b[49;39m \u001b[44m${message.author.username} (${message.author.id})\u001b[49m ran command ${cmd.name}`);
      await cmd.run(message, args, message.author.permLevel);
    } catch (error) {
      this.client.emit("commandError", error, message);
    }
  }

  ratelimit(message, cmd) {
    if (message.author.permLevel > 4) return false;

    const cooldown = cmd.cooldown * 1000;
    const ratelimits = this.ratelimits.get(message.author.id) || {}; // get the ENMAP first.
    if (!ratelimits[cmd.name]) ratelimits[cmd.name] = Date.now() - cooldown; // see if the command has been run before if not, add the ratelimit
    const difference = Date.now() - ratelimits[cmd.name]; // easier to see the difference
    if (difference < cooldown) { // check the if the duration the command was run, is more than the cooldown
      return moment.duration(cooldown - difference).format("D [days], H [hours], m [minutes], s [seconds]", 1); // returns a string to send to a channel
    } else {
      ratelimits[cmd.name] = Date.now(); // set the key to now, to mark the start of the cooldown
      this.ratelimits.set(message.author.id, ratelimits); // set it
      return true;
    }
  }
};