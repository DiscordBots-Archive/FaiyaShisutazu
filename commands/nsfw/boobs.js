const Social = require(`${process.cwd()}/base/Social.js`);
const Discord = require("discord.js");
const snek = require("snekfetch");

class Boobs extends Social {

  constructor(client) {
    super(client, {
      name: "boobs",
      description: "Returns b0bs images",
      category: "06. NSFW?",
      usage: "boobs",
      extended: "This returns a random b0bs image from oboobs.ru.",
      cost: 15,
      cooldown: 10,
      hidden: false,
      guildOnly: true,
      aliases: ["tits"],
      permLevel: "User"
    });
  }

  async run(message, args, level) { // eslint-disable-line no-unused-vars
    try {
      if (!message.channel.nsfw) return message.response("🔞", "You need to be in a NSFW channel to use this command!");
      if (message.settings.socialSystem === "true") {
        if (!(await this.cmdPay(message, message.author.id, this.help.cost))) return;
      }

      const response = await message.channel.send(`${this.client.responses.loadingMessages.random().replaceAll("{{user}}", message.member.displayName)}`);
      const { body } = await snek.get("http://api.oboobs.ru/boobs/0/1/random");
      const embed = new Discord.MessageEmbed();
      embed
        .setTitle(`🌺 **${message.author.tag}** ❯ ${message.content}`)
        .setDescription(`http://media.oboobs.ru/${body[0].preview}`)
        .setColor(this.client.config.colors.random())
        .setFooter(`Requested by ${message.author.tag} | REmibot by @Jjeuweiii`, message.author.displayAvatarURL({ format: "png", size: 32 }))
        .setImage(`http://media.oboobs.ru/${body[0].preview}`)
        .setTimestamp()

      response.edit(`🌺 **${message.author.tag}** ❯ ${message.content}`, {embed});
    } catch (error) {
      response.edit(`${this.client.responses.errorMessages.random().replaceAll("{{user}}", message.member.displayName)}`);
      this.client.logger.error(error);
    }
  }
}

module.exports = Boobs;