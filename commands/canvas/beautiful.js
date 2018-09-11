const Social = require(`${process.cwd()}/base/Social.js`);
const Discord = require("discord.js");
const { Canvas } = require("canvas-constructor");
const snek = require("snekfetch");
const fsn = require("fs-nextra");

class Beautiful extends Social {

  constructor(client) {
    super(client, {
      name: "beautiful",
      description: "Returns a beatiful canvas with the person you like on it",
      category: "03. Canvas",
      usage: "beautiful [@mention|userid]",
      extended: "This uses the provided tag to create a beautiful canvas with the person you like. If there was no tag provided, this command will use the image of the message's author!",
      cost: 15,
      cooldown: 10,
      hidden: false,
      guildOnly: true,
      aliases: ["painting"],
      permLevel: "User"
    });
  }

  async run(message, args, level) { // eslint-disable-line no-unused-vars
    try {
      if (message.settings.socialSystem === "true") {
        if (!(await this.cmdPay(message, message.author.id, this.help.cost))) return;
      }

      const loadingMessage = await message.channel.send(`${this.client.responses.loadingMessages.random().replaceAll("{{user}}", message.member.displayName)}`);
      const person = await this.verifyUser(message, args[0] ? args[0] : message.author.id);
      const result = await this.getBeautiful(person.displayAvatarURL({format: "png", size: 256}));
      const attachment = new Discord.MessageAttachment(result, "beautiful.png");
      
      loadingMessage.delete();
      message.channel.send(`🌺 **${message.author.tag}** ❯ ${message.content}`, {files: [attachment]});
    } catch (error) {
      loadingMessage.edit(`${this.client.responses.errorMessages.random().replaceAll("{{user}}", message.member.displayName)}`);
      this.client.logger.error(error);
    }
  }

  async getBeautiful(person) {
    const plate = await fsn.readFile("./assets/images/plate_beautiful.png");
    const { body } = await snek.get(person);
    return new Canvas(634, 675)
      .setColor("#000000")
      .addRect(0, 0, 634, 675)
      .addImage(body, 423, 45, 168, 168)
      .addImage(body, 426, 382, 168, 168)
      .addImage(plate, 0, 0, 634, 675)
      .toBuffer();
  }
}

module.exports = Beautiful; //