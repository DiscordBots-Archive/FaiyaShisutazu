const Social = require(`${process.cwd()}/base/Social.js`);
const Discord = require("discord.js");
const { Canvas } = require("canvas-constructor");
const snek = require("snekfetch");
const fsn = require("fs-nextra");

class Tattoo extends Social {

  constructor(client) {
    super(client, {
      name: "tattoo",
      description: "Gets a tattoo of someone's face",
      category: "03. Canvas",
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

      const loadingMessage = await message.channel.send(`${this.client.responses.loadingMessages.random().replaceAll("{{user}}", message.member.displayName)}`);
      const person = await this.verifyUser(message, args[0] ? args[0] : message.author.id);
      const result = await this.getInked(person.displayAvatarURL({format: "png", size: 512}));
      const attachment = new Discord.MessageAttachment(result, "tattoo.png");
      
      loadingMessage.delete();
      message.channel.send(`🌺 **${message.author.tag}** ❯ ${message.content}`, {files: [attachment]});
    } catch (error) {
      loadingMessage.edit(`${this.client.responses.errorMessages.random().replaceAll("{{user}}", message.member.displayName)}`);
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