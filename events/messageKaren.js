const Event = require("../structures/Event.js");
const Music = require("../structures/Music.js");
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
        await message.channel.send(`❎ ${message.client.responses.commandErrorMessages.random().replaceAll("{{user}}", message.member.displayName).replaceAll("{{prefix}}", message.settings.prefix)}`);

      if (level < this.client.levelCache[cmd.permLevel]) {
        if (message.settings.systemNotice !== "true") return;
        return message.channel.send("B-Baka! Your level so low, why should I listen to you?");
      }
      
      const rateLimit = this.ratelimit(message, cmd);
      if (typeof rateLimit === "string") {
        this.client.console.log(`\u001b[43;30m[${userPermLevel.name}]\u001b[49;39m \u001b[44m${message.author.username} (${message.author.id})\u001b[49m got ratelimited while running command ${cmd.name}`);
        return message.channel.send(`Please wait ${rateLimit.toPlural()} to run this command.`); // return stop command from executing
      }

      const loadingMessage = await message.channel.send(`<a:loading:542815160650432532> ${message.client.responses.waitTsukihiMessages.random().replaceAll("{{user}}", message.member.displayName)}`);
      const filter = m => (m.author.id === "475554834892980230" && m.content.startsWith("<a:loading:542815160650432532>"));
      const collected = await message.channel.awaitMessages(filter, {max: 1, time: 10000, errors: ["time"]});
      setTimeout( async () => {
        if (collected.size === 1) {
          if (cmd instanceof Music) await loadingMessage.delete();
          else await loadingMessage.edit(message.client.responses.commandSuccessMessages.random().replaceAll("{{user}}", message.member.displayName));
        }
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