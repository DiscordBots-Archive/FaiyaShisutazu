const Social = require(`${process.cwd()}/base/Social.js`);
const Discord = require("discord.js");
const { get } = require("snekfetch");

class RedPanda extends Social {

  constructor(client) {
    super(client, {
      name: "redpanda",
      description: "Trả về hình 1 chú gấu trúc đỏ bất kỳ",
      category: "2. Animals",
      usage: "redpanda",
      extended: "Chỉ là trả về hình 1 chú gấu trúc đỏ bất kỳ thôi!",
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
    const { body } = await get("https://animals.anidiots.guide/red_panda");

    const embed = new Discord.MessageEmbed();
    embed
      .setTitle(`🌺 **${message.author.tag}** ❯ ${message.content}`)
      .setDescription(body.link)
      .setColor(this.client.config.colors.random())
      .setFooter(`Requested by ${message.author.tag} | REmibot by @Jjeuweiii`, message.author.displayAvatarURL({ format: "png", size: 32 }))
      .setImage(body.link)
      .setTimestamp()

    await loadingMessage.edit({embed});
  }
}

module.exports = RedPanda;