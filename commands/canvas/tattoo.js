const Social = require(`${process.cwd()}/base/Social.js`);
const { Canvas } = require("canvas-constructor");
const snek = require("snekfetch");
const fsn = require("fs-nextra");

class Tattoo extends Social {

  constructor(client) {
    super(client, {
      name: "tattoo",
      description: "Gets a tattoo of someone's face",
      category: "3. Canvas",
      usage: "tattoo [@mention|userid]",
      extended: "This uses the provided tag to let you get a tattoo of someone's face. If there was no tag provided, this command will use the image of the message's author!",
      cost: 15,
      cooldown: 10,
      hidden: false,
      guildOnly: true,
      aliases: ["ink"],
      permLevel: "User"
    });
  }

  async run(message, args, level) { // eslint-disable-line no-unused-vars
    try {
      if (message.settings.socialSystem === "true") {
        if (!(await this.cmdPay(message, message.author.id, this.help.cost))) return;
      }

      const tattoo = await this.verifyUser(message, args[0] ? args[0] : message.author.id);
      const msg = await message.channel.send(`<a:typing:397490442469376001> **${message.member.displayName}** đang được xăm hình nè...`);

      const result = await this.getInked(tattoo.displayAvatarURL({format: "png", size: 512}));
      await message.channel.send({
        files: [{
          attachment: result,
          name: "tattoo.jpg"
        }]
      });

      await msg.delete();
    } catch (error) {
      this.client.logger.error(error);
    }
  }

  async getInked(person) {
    const plate = await fsn.readFile("./assets/images/plate_tattoo.png");
    const { body } = await snek.get(person);
    return new Canvas(750, 1089)
      .setColor("#000000")
      .addRect(0, 0, 750, 1089)
      .addImage(plate, 0, 0, 750, 1089)
      .addImage(body, 145, 575, 400, 400, {type: "round", radius: 200})
      .toBuffer();
  }
}

module.exports = Tattoo; //