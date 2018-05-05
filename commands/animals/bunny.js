const Social = require(`${process.cwd()}/base/Social.js`);
const { get } = require("snekfetch");

class Bunny extends Social {

  constructor(client) {
    super(client, {
      name: "bunny",
      description: "Trả về hình 1 chú thỏ bất kỳ",
      category: "2. Animals",
      usage: "bunny",
      extended: "Chỉ là trả về hình 1 chú thỏ bất kỳ thôi!",
      cost: 2,
      cooldown: 5,
      hidden: false,
      guildOnly: false,
      aliases: ["bunbun"],
      permLevel: "User"
    });
  }

  async run(message, args, level) {

    if (message.settings.socialSystem === "true") {
      if (!(await this.cmdPay(message, message.author.id, this.help.cost))) return;
    }
    const loadingMessage = await message.channel.send(`<a:typing:397490442469376001> **${message.member.displayName}** đang ngắm nhìn 1 chú thỏ nè...`);
    const { body } = await get("https://api.bunnies.io/v2/loop/random/?media=gif,png");
    await loadingMessage.edit({
      embed: {
        "title": "Click vào đây nếu không load được ảnh!",
        "url": body.media.gif,
        "color": 0x9575cd,
        "image": {
          "url": body.media.gif
        },
        "footer": {
          "icon_url": message.author.displayAvatarURL({ format: "png", size: 32 }),
          "text": `Requested by ${message.author.tag} | REmibot by @Jjeuweiii`
        }
      }
    });

  }
}

module.exports = Bunny;