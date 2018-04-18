const Social = require(`${process.cwd()}/base/Social.js`);
const snek = require("snekfetch");
class Dog extends Social {
  constructor(client) {
    super(client, {
      name: "dog",
      description: "Lấy hình 1 chú cún chăng?",
      category: "2. Animals",
      usage: "dog",
      extended: "Dùng lệnh này để có 1 bé cún nha...",
      cost: 2,
      cooldown: 10,
      aliases: ["doggo", "pupper"]
    });
  }

  async run(message, args, level) { // eslint-disable-line no-unused-vars
    try {
      const url = args[0] ? `https://dog.ceo/api/breed/${args[0]}/images/random` : "https://dog.ceo/api/breeds/image/random";

      if (message.settings.socialSystem === "true") {
        if (!(await this.cmdPay(message, message.author.id, this.help.cost))) return;
      }

      const msg = await message.channel.send(`<a:typing:397490442469376001> **${message.member.displayName}** đang chơi đùa cùng 1 bé cún...`);
      const {
        body
      } = await snek.get(url);
      await msg.edit({
        embed: {
          "url": body.message,
          "color": 0x9575cd,
          "image": {
            "url": body.message
          }
        }
      });
    } catch (e) {
      console.log(e);
    }
  }
}

module.exports = Dog;