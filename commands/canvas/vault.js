const Social = require(`${process.cwd()}/base/Social.js`);
const Discord = require("discord.js");
const { Canvas } = require("canvas-constructor");
const snek = require("snekfetch");
const fsn = require("fs-nextra");

class Valut extends Social {

  constructor(client) {
    super(client, {
      name: "thumbs",
      description: "Gives someone a thumbs up",
      category: "03. Canvas",
      usage: "thumbs [@mention|userid]",
      extended: "This uses the provided tag to give someone a thumbs up. If there was no tag provided, this command will use the image of the message's author!",
      cost: 15,
      cooldown: 10,
      hidden: false,
      guildOnly: true,
      aliases: ["like"],
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
      const result = await this.getThumbsUp(person.displayAvatarURL({format: "png", size: 128}));
      const attachment = new Discord.MessageAttachment(result, "vault.png");
      
      loadingMessage.delete();
      message.channel.send(`🌺 **${message.author.tag}** ❯ ${message.content}`, {files: [attachment]});
    } catch (error) {
      loadingMessage.edit(`${this.client.responses.errorMessages.random().replaceAll("{{user}}", message.member.displayName)}`);
      this.client.logger.error(error);
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