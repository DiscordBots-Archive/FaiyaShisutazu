const { Permissions, Collection } = require("discord.js");
const Event = require("../structures/Event.js");
const Social = require("../structures/Social.js");
const monitor = require("../monitors/monitor.js");
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
  }

  async run(message) {
    try {
      if (message.author.bot) return;
      if (message.guild && !message.guild.me) await message.guild.members.fetch(this.client.user);
      if (message.guild && !message.channel.postable) return;

      const prefix = new RegExp(`^<@!?${this.client.user.id}> |^${this.client.methods.util.regExpEsc(message.settings.prefix)}`)
        .exec(message.content);
      if (!prefix) return;

      const args = message.content.slice(prefix[0].length).trim().split(/ +/g);
      const cmd = this.client.commands.get(args.shift().toLowerCase());
      const level = this.client.permlevel(message);
      const userPermLevel = this.client.config.permLevels.find(perm => perm.level === level);

      if (message.settings.socialSystem === "true") {
        this.client.points.ensure(`${message.guild.id}-${message.author.id}`, {
          points: 100,
          level: 0,
          user: message.author.id,
          guild: message.guild.id,
          daily: 1504120109
        });
        monitor.run(this.client, message, level);
      } 

      if (!cmd) 
        await message.channel.send(`${message.client.responses.commandErrorMessages.random().replaceAll("{{user}}", message.member.displayName).replaceAll("{{prefix}}", message.settings.prefix)}`);

      if (level < this.client.levelCache[cmd.permLevel]) {
        if (message.settings.systemNotice !== "true") return;
        return message.channel.send("<:karen:559907412425834497> B-Baka! Your level so low, why should we listen to you?");
      }
      
      const rateLimit = this.ratelimit(message, cmd);
      if (typeof rateLimit === "string") {
        this.client.console.log(`\u001b[43;30m[${userPermLevel.name}]\u001b[49;39m \u001b[44m${message.author.username} (${message.author.id})\u001b[49m got ratelimited while running command ${cmd.name}`);
        return message.channel.send(`<:karen:559907412425834497> Please wait ${rateLimit.toPlural()} to run this command.`); // return stop command from executing
      }

      while (args[0] && args[0][0] === "-") message.flags.push(args.shift().slice(1));
      message.author.permLevel = level;
      await this.runCommand(message, cmd, args);
    } catch (error) {
      this.client.console.error(error);
    }
  }

  botPerms(message, cmd) {
    const missing = message.channel.type === "text" ? message.channel.permissionsFor(this.client.user).missing(cmd.botPerms) : this.impliedPermissions.missing(cmd.botPerms);
    if (missing.length > 0) {
      message.channel.send(`<:karen:559907412425834497> We do not have the following permissions \`${missing.map(key => this.friendlyPerms[key]).join(", ")}\``);
      return false;
    }
    return true;
  }

  ratelimit(message, cmd) {
    if (message.author.permLevel > 4) return false;
    const cooldown = cmd.cooldown * 1000;
    const ratelimits = this.ratelimits.get(message.author.id) || {};
    if (!ratelimits[cmd.name]) ratelimits[cmd.name] = Date.now() - cooldown;
    const difference = Date.now() - ratelimits[cmd.name];
    if (difference < cooldown) {
      return moment.duration(cooldown - difference).format("D [days], H [hours], m [minutes], s [seconds]", 1);
    } else {
      ratelimits[cmd.name] = Date.now();
      this.ratelimits.set(message.author.id, ratelimits);
      return true;
    }
  }

  async runCommand(message, cmd, args) {
    try {
      const hasPerm = this.botPerms(message, cmd);
      if (!hasPerm) return;
      const replyMessage = await message.channel.send(message.client.responses.loadingMessages.random().replaceAll("{{user}}", message.member.displayName));
      if (cmd instanceof Social) {
        await cmd.cmdVerify(message, args);
        if (message.settings.socialSystem === "true") await cmd.cmdPay(message, message.author.id, cmd.cost);
      }
      const userPermLevel = this.client.config.permLevels.find(perm => perm.level === message.author.permLevel);
      this.client.console.log(`\u001b[43;30m[${userPermLevel.name}]\u001b[49;39m \u001b[44m${message.author.username} (${message.author.id})\u001b[49m ran command ${cmd.name}`);
      await cmd.run(message, args, message.author.permLevel, replyMessage);
    } catch (error) {
      this.client.emit("commandError", error, message);
    }
  }
};