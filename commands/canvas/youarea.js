const Social = require("../../structures/Social.js");
const { MessageAttachment } = require("discord.js");
const { get } = require("snekfetch");

class YouAreA extends Social {
  constructor(...args) {
    super(...args, {
      name: "youarea",
      description: "Displays a 'You Are A ...' meme with the provided text",
      category: "3. Canvas",
      usage: "youarea [text]",
      extended: "This uses the provided text to create a 'You Are A ...' meme.",
      cost: 15,
      cooldown: 5,
      aliases: [],
      botPerms: ["ATTACH_FILES"]
    });
  }

  async run(message, args, level, replyMessage) { // eslint-disable-line no-unused-vars 
    try {
      const text = args.join(" ").toUpperCase();    
      const { body } = await get("https://i.ode.bz/auto/nichijou").query({ text });
      const attachment = new MessageAttachment(body, `${text}.gif`);

      await replyMessage.delete();
      await message.channel.send(`Requested by **${message.author.tag}**`, {files: [attachment]});
    } catch (error) {
      await replyMessage.edit(`${message.client.responses.errorMessages.random().replaceAll("{{user}}", message.member.displayName)}`);
      message.client.console.error(error);
    }
  }
}

module.exports = YouAreA;
