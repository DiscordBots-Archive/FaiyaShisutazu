const Social = require(`${process.cwd()}/base/Social.js`);
const { Canvas } = require("canvas-constructor");
const snek = require("snekfetch");
const fsn = require("fs-nextra");

class Valut extends Social {
  constructor(client) {
    super(client, {
      name: "thumbs",
      description: "Thể hiện sự tán thành với ai đó...",
      category: "3. Canvas",
      usage: "thumbs [@mention|user id]",
      extended: "Dùng để cho người bị tag 1 cái thumbs up, không tag ai để tự thumbs up cho chính mình!",
      cost: 2,
      cooldown: 10,
      aliases: ["vault"]
    });
  }

  async run(message, args, level) { // eslint-disable-line no-unused-vars
    try {
      const user = await this.verifyUser(message, args[0] ? args[0] : message.author.id);
      if (message.settings.socialSystem === "true") {
        if (!(await this.cmdPay(message, message.author.id, this.help.cost))) return;
      }
      const msg = await message.channel.send("...");
      const { getThumbsUp } = this;
      const result = await getThumbsUp(user.displayAvatarURL({format: "png", size: 128}));

      await message.channel.send({
        files: [{
          attachment: result,
          name: "thumbs.jpg"
        }]
      });
      await msg.delete();
    } catch (error) {
      throw error;
    }
  }

  async getThumbsUp(person) {
    const plate = await fsn.readFile("./assets/images/plate_vaultboy.png");
    const { body } = await snek.get(person);
    return new Canvas(365, 365)
      .setColor("#000000")
      .addRect(0, 0, 365, 365)
      .addImage(body, 153, 62, 100, 100)
      .addImage(plate, 0, 0, 365, 365)
      .toBuffer();
  }
}

module.exports = Valut; //