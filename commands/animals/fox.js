const Social = require(`${process.cwd()}/base/Social.js`);
const { get } = require("snekfetch");

class Fox extends Social {
  
  constructor(client) {
    super(client, {
      name: "fox",
      description: "Trả về hình 1 chú cáo bất kỳ",
      category: "2. Animals",
      usage: "bird",
      extended: "Chỉ là trả về hình 1 chú cáo bất kỳ thôi!",
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
    const loadingMessage = await message.channel.send(`<a:typing:397490442469376001> **${message.member.displayName}** đang ngắm nhìn 1 chú cáo nè...`);
    const { body } = await get("https://randomfox.ca/floof/");
    await loadingMessage.edit({
      embed: {
        "title": "Click vào đây nếu không load được ảnh!",
        "url": body.link,
        "color": 0x9575cd,
        "image": {
          "url": body.image
        },
        "footer": {
          "icon_url": message.author.displayAvatarURL({ format: "png", size: 32 }),
          "text": `Requested by ${message.author.tag} | REmibot by @Jjeuweiii`
        }
      }
    });

  }
}

module.exports = Fox;