const Social = require(`${process.cwd()}/base/Social.js`);
const { get } = require("snekfetch");

class Dog extends Social {

  constructor(client) {
    super(client, {
      name: "dog",
      description: "Trả về hình 1 chú chó bất kỳ",
      category: "2. Animals",
      usage: "dog",
      extended: "Chỉ là trả về hình 1 chú chó bất kỳ thôi!",
      cost: 2,
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
    const loadingMessage = await message.channel.send(`<a:typing:397490442469376001> **${message.member.displayName}** đang ngắm nhìn 1 chú chó nè...`);
    const { body } = await get(args[0] ? `https://dog.ceo/api/breed/${args[0]}/images/random` : "https://dog.ceo/api/breeds/image/random");
    await loadingMessage.edit({
      embed: {
        "title": `🌺 **${message.author.tag}** ❯ ${message.content}`,
        "description": body.message,
        "color": 0x9575cd,
        "image": {
          "url": body.message
        },
        "footer": {
          "icon_url": message.author.displayAvatarURL({ format: "png", size: 32 }),
          "text": `Requested by ${message.author.tag} | REmibot by @Jjeuweiii`
        }
      }
    });

  }
}

module.exports = Dog;