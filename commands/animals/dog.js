const Social = require(`${process.cwd()}/base/Social.js`);
const Discord = require("discord.js");
const { get } = require("snekfetch");

class Dog extends Social {

  constructor(client) {
    super(client, {
      name: "dog",
      description: "Returns an image of a dog",
      category: "02. Animals",
      usage: "dog",
      extended: "This returns an image of a dog.",
      cost: 5,
      cooldown: 5,
      hidden: false,
      guildOnly: false,
      aliases: ["doggo"],
      permLevel: "User"
    });
  }

  async run(message, args, level) {
    if (message.settings.socialSystem === "true") {
      if (!(await this.cmdPay(message, message.author.id, this.help.cost))) return;
    }

    const { body } = await get(args[0] ? `https://dog.ceo/api/breed/${args[0]}/images/random` : "https://dog.ceo/api/breeds/image/random");
    const response = await message.channel.send(`${this.client.responses.loadingMessages.random().replaceAll("{{user}}", message.member.displayName)}`);
    const embed = new Discord.MessageEmbed();
    embed
      .setDescription(body.message)
      .setColor(this.client.config.colors.random())
      .setFooter(`Requested by ${message.author.tag} | REmibot by @Jjeuweiii`, message.author.displayAvatarURL({ format: "png", size: 32 }))
      .setImage(body.message)
      .setTimestamp();

    response.edit(`🌺 **${message.author.tag}** ❯ ${message.content}`, {embed});
  }
}

module.exports = Dog;