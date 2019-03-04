const Social = require("../../structures/Social.js");
const { MessageAttachment } = require("discord.js");

class Color extends Social {
  constructor(...args) {
    super(...args, {
      name: "color",
      description: "Displays a color sample with any supplied HEX, RGB or RGBA colour code",
      category: "3. Canvas",
      usage: "color [HEX/RGB/RGBA]",
      extended: "This uses the provided HEX, RGB, RGBA color code to create a color sample.",
      cost: 5,
      cooldown: 5,
      aliases: ["colour"],
      botPerms: ["ATTACH_FILES"]
    });
  }

  async run(message, args, level, replyMessage) { // eslint-disable-line no-unused-vars 
    try {
      if (args.length < 1) return message.channel.send("B-baka!! You must input a color for me to generate it!!");
      const attachment = new MessageAttachment(await message.client.idiotAPI.colour(args.join(" ")), "color.png");

      await replyMessage.delete();
      await message.channel.send(`Requested by **${message.author.tag}**`, {files: [attachment]});
    } catch (error) {
      await replyMessage.edit(`${message.client.responses.errorMessages.random().replaceAll("{{user}}", message.member.displayName)}`);
      message.client.console.error(error);
    }
  }
}

module.exports = Color;
