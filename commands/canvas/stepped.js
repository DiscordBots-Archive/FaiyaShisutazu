const Social = require(`${process.cwd()}/base/Social.js`);
const { Canvas } = require("canvas-constructor");
const snek = require("snekfetch");
const fsn = require("fs-nextra");

class Stepped extends Social {

  constructor(client) {
    super(client, {
      name: "stepped",
      description: "Steps on someone you dislike",
      category: "3. Canvas",
      usage: "stepped [@mention|userid]",
      extended: "This uses the provided tag to let you step on a person you dislike. If there was no tag provided, this command will use the image of the message's author!",
      cost: 15,
      cooldown: 10,
      hidden: false,
      guildOnly: true,
      aliases: ["step"],
      permLevel: "User"
    });
  }

  async run(message, args, level) { // eslint-disable-line no-unused-vars 
    try {
      if (message.settings.socialSystem === "true") {
        if (!(await this.cmdPay(message, message.author.id, this.help.cost))) return;
      }

      const stepped = (message.mentions.users.first() || message.author).displayAvatarURL({
        format: "png",
        size: 128
      });
      const msg = await message.channel.send("Tản bộ 1 tí nào...");

      const result = await this.getStepped(stepped);
      await message.channel.send({
        files: [{
          attachment: result,
          name: "stepped.jpg"
        }]
      });

      await msg.delete();
    } catch (error) {
      this.client.logger.error(error);
    }
  }

  async getStepped(person) {
    const plate = await fsn.readFile("./assets/images/plate_stepped.png");
    const { body } = await snek.get(person);
    return new Canvas(400, 562)
      .setColor("#cccccc")
      .addRect(0, 0, 400, 566)
      .rotate(50 * -Math.PI / 180)
      .addImage(body, -280, 350, 128, 128)
      .rotate(-50 * Math.PI / -180)
      .addImage(plate, 0, 0, 400, 566)
      .toBuffer();
  }
}

module.exports = Stepped; //