const Social = require(`${process.cwd()}/base/Social.js`);
const Discord = require("discord.js");
const { get } = require("snekfetch");

class Duck extends Social {

  constructor(client) {
    super(client, {
      name: "duck",
      description: "Returns an image of a duck",
      category: "02. Animals",
      usage: "duck",
      extended: "This returns an image of a duck.",
      cost: 5,
      cooldown: 5,
      hidden: false,
      guildOnly: false,
      aliases: [],
      permLevel: "User"
    });
  }

  async run(message, args, level) { 
    if (message.settings.socialSystem === "true") {
      if (!(await this.cmdPay(message, message.author.id, this.help.cost))) return;
    }

    const { body } = await get("https://random-d.uk/api/v1/random?type=gif");
    const response = await message.channel.send(`${this.client.responses.loadingMessages.random().replaceAll("{{user}}", message.member.displayName)}`);
    const embed = new Discord.MessageEmbed();
    embed
      .setDescription(body.url)
      .setColor(this.client.config.colors.random())
      .setFooter(`Requested by ${message.author.tag} | REmibot by @Jjeuweiii`, message.author.displayAvatarURL({ format: "png", size: 32 }))
      .setImage(body.url)
      .setTimestamp();

    response.edit(`🌺 **${message.author.tag}** ❯ ${message.content}`, {embed});
  }
}

module.exports = Duck;