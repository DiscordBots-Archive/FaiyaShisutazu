const Social = require(`${process.cwd()}/base/Social.js`);
const Discord = require("discord.js");
const { get } = require("snekfetch");

class Duck extends Social {

  constructor(client) {
    super(client, {
      name: "duck",
      description: "Trả về hình 1 chú vịt bất kỳ",
      category: "2. Animals",
      usage: "duck",
      extended: "Chỉ là trả về hình 1 chú vịt bất kỳ thôi!",
      cost: 2,
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
    const loadingMessage = await message.channel.send(`<a:typing:397490442469376001>...`);
    const { body } = await get("https://random-d.uk/api/v1/random?type=gif");

    const embed = new Discord.MessageEmbed();
    embed
      .setTitle(`🌺 **${message.author.tag}** ❯ ${message.content}`)
      .setDescription(body.url)
      .setColor(this.client.config.colors.random())
      .setFooter(`Requested by ${message.author.tag} | REmibot by @Jjeuweiii`, message.author.displayAvatarURL({ format: "png", size: 32 }))
      .setImage(body.url)
      .setTimestamp()

    await loadingMessage.edit({embed});
  }
}

module.exports = Duck;