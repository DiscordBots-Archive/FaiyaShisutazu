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

      if (message.content.search(/El[\s\W]+Psy[\s\W]+Con([a-z]*)/i) !== -1
        || message.content.search(/T[u,o]{1,2}[\s,-]?T[u,o]{1,2}[\s,-]?r[u,o]?[u,o]?/i) !== -1
        || message.content.search(/Ho(u)?oin Kyo(u)?ma/i) !== -1)
        message.channel.send(`***${message.author.tag}*** *said "${message.content}"*\n\n${this.client.responses.steinerMessages.random()
          .replaceAll("{{user}}", `${message.author.tag}`)
          .replaceAll("{{steiner}}", message.content.replace(/El[\s\W]+Psy[\s\W]+Con([a-z]*)/i, "**El Psy Kongroo**")
            .replaceAll(/T[u,o]{1,2}[\s,-]?T[u,o]{1,2}[\s,-]?r[u,o]?[u,o]?/i, "**Tutturu**")
            .replaceAll(/Ho(u)?oin Kyo(u)?ma/i, "**Hououin Kyouma**"))}`);

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

      let response;
      if (!cmd) {
        response = message.channel.send(`❎ | ${message.client.responses.commandErrorMessages.random().replaceAll("{{user}}", message.member.displayName).replaceAll("{{prefix}}", message.settings.prefix)}`);
        return message.react("");
      }

      if (level < this.client.levelCache[cmd.permLevel]) {
        if (message.settings.systemNotice !== "true") return;
        return message.channel.send(`B-Baka! You're only level ${level}, a ${userPermLevel.name.toLowerCase()}, why should I listen to you instead of a ${cmd.permLevel} (level ${this.client.levelCache[cmd.permLevel]}).`);
      }
      
      response = await message.channel.send(`✅ | ${message.client.responses.commandSuccessMessages.random().replaceAll("{{user}}", message.member.displayName)}`);
      const filter = m => m.author.id === "475554834892980230";
      const collected = await message.channel.awaitMessages(filter, {max: 1, time: 2000, errors: ["time"]});
      setTimeout( async () => {
        if (collected.size !== 1) await response.edit(message.client.responses.waitTsukihiMessages.random().replaceAll("{{user}}", message.member.displayName));
      }, 5000);
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