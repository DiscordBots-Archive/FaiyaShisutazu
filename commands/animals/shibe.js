const Social = require(`${process.cwd()}/base/Social.js`);
const snek = require("snekfetch");
class Shibe extends Social {
  constructor(client) {
    super(client, {
      name: "shibe",
      description: "Lấy hình của 1 chú Shiba Inu? Tại sao hông nhỉ?",
      category: "2. Animals",
      usage: "shibe",
      extended: "Dùng lệnh này để nhận ngay 1 chú Shiba Inu luônn~",
      cost: 2,
      cooldown: 10,
      aliases: ["doge", "shib"]
    });
  }

  async run(message, args, level) { // eslint-disable-line no-unused-vars
    try {

      if (message.settings.socialSystem === "true") {
        if (!(await this.cmdPay(message, message.author.id, this.help.cost))) return;
      }

      const msg = await message.channel.send(`<a:typing:397490442469376001> **${message.member.displayName}** đang chơi với 1 con Shiba Inu nè..`);
      const {
        body
      } = await snek.get("http://shibe.online/api/shibes");
      await msg.edit({
        embed: {
          "url": body[0],
          "color": 0x9575cd,
          "image": {
            "url": body[0]
          }
        }
      });
    } catch (e) {
      console.log(e);
    }
  }
}

module.exports = Shibe;