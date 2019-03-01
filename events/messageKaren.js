const Event = require("../structures/Event.js");
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

      if (!cmd) 
        await message.channel.send(`❎ | ${message.client.responses.commandErrorMessages.random().replaceAll("{{user}}", message.member.displayName).replaceAll("{{prefix}}", message.settings.prefix)}`);

      if (level < this.client.levelCache[cmd.permLevel]) {
        if (message.settings.systemNotice !== "true") return;
        return message.channel.send(`B-Baka! You're only level ${level}, a ${userPermLevel.name.toLowerCase()}, why should I listen to you instead of a ${cmd.permLevel} (level ${this.client.levelCache[cmd.permLevel]}).`);
      }
      
      await message.channel.send(`✅ | ${message.client.responses.commandSuccessMessages.random().replaceAll("{{user}}", message.member.displayName)}`);
    } catch (error) {
      this.client.console.error(error);
    }
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
};