const Social = require(`${process.cwd()}/base/Social.js`);
const snek = require("snekfetch");
class Owl extends Social {
  constructor(client) {
    super(client, {
      name: "owl",
      description: "Lấy hình của 1 chú chim cú nha?",
      category: "2. Animals",
      usage: "owl",
      extended: "Dùng lệnh này để có 1 chú chim cú bé nhỏ <3",
      cost: 5,
      cooldown: 10,
      aliases: ["hoot"]
    });
  }

  async run(message, args, level) {
    try {

      if (message.settings.socialSystem === "true") {
        if (!(await this.cmdPay(message, message.author.id, this.help.cost))) return;
      }

      const msg = await message.channel.send(`<a:typing:397490442469376001> **${message.member.displayName}** đang ngắm nhìn 1 con chim cú nè...`);
      const owl = await snek.get("http://pics.floofybot.moe/owl").then(r => r.body.image);
      await msg.edit({
        embed: {
          "title": "Xem hình gốc ở đây nha!",
          "url": owl,
          "color": 0x9575cd,
          "image": {
            "url": owl
          }
        }
      });
    } catch (e) {
      console.log(e);
    }
  }
}

module.exports = Owl;