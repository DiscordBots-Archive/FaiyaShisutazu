const Social = require(`${process.cwd()}/base/Social.js`);
const { Canvas } = require("canvas-constructor");
const snek = require("snekfetch");
const fsn = require("fs-nextra");

class Wanted extends Social {

  constructor(client) {
    super(client, {
      name: "wanted",
      description: "Puts someone on a wanted poster",
      category: "3. Canvas",
      usage: "wanted [@mention|userid]",
      extended: "This uses the provided tag to let you put someone on a wanted poster. If there was no tag provided, this command will use the image of the message's author!",
      cost: 15,
      cooldown: 10,
      hidden: false,
      guildOnly: true,
      aliases: [],
      permLevel: "User"
    });
  }

  async run(message, args, level) { // eslint-disable-line no-unused-vars 
    try {
      if (message.settings.socialSystem === "true") {
        if (!(await this.cmdPay(message, message.author.id, this.help.cost))) return;
      }

      const wanted = await this.verifyUser(message, args[0] ? args[0] : message.author.id);
      const msg = await message.channel.send("...");

      const result = await this.getWanted(wanted.displayAvatarURL({format: "png", size: 256}));
      await message.channel.send({
        files: [{
          attachment: result,
          name: "wanted.jpg"
        }]
      });

      await msg.delete();
    } catch (error) {
      this.client.logger.error(error);
    }
  }

  async getWanted(person) {
    const plate = await fsn.readFile("./assets/images/plate_wanted.png");
    const { body } = await snek.get(person);
    return new Canvas(360, 640)
      .setColor("#debb80")
      .addRect(0, 0, 360, 640)
      .addImage(body, 30, 200, 300, 300)
      .addImage(plate, 0, 0, 360, 640)
      .toBuffer();
  }
}

module.exports = Wanted; //