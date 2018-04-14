const Social = require(`${process.cwd()}/base/Social.js`);
const snek = require("snekfetch");
class Bunny extends Social {
  constructor(client) {
    super(client, {
      name: "bunny",
      description: "Lấy hình 1 chú thỏ chăng??",
      category: "2. Animals",
      usage: "bunny",
      extended: "Dùng lệnh này để nhận được 1 chú thỏ dễ thương.",
      cost: 5,
      cooldown: 10,
      aliases: []
    });
  }

  async run(message, args, level) {
    try {

      if (message.settings.socialSystem === "true") {
        if (!(await this.cmdPay(message, message.author.id, this.help.cost))) return;
      }

      const msg = await message.channel.send(`<a:typing:397490442469376001> **${message.member.displayName}** đang vuốt ve 1 con thỏ...`);
      const {
        body
      } = await snek.get("https://api.bunnies.io/v2/loop/random/?media=gif,png");
      await msg.edit({
        embed: {
          "url": body.media.gif,
          "color": 0x9575cd,
          "image": {
            "url": body.media.gif
          }
        }
      });
    } catch (e) {
      console.log(e);
    }
  }
}

module.exports = Bunny;