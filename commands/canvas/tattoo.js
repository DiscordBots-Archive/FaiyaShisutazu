const Social = require("../../structures/Social.js");
const { MessageAttachment } = require("discord.js");

class Tattoo extends Social {

  constructor(...args) {
    super(...args , {
      name: "tattoo",
      description: "Gets a tattoo of someone's face",
      category: "3. Canvas",
      usage: "tattoo [@mention|userid]",
      extended: "This uses the provided tag to let you get a tattoo of someone's face. If there was no tag provided, this command will use the image of the message's author!",
      cost: 15,
      cooldown: 10,
      aliases: ["ink"],
      botPerms: ["ATTACH_FILES"]
    });
  }

  async run(message, args, level) { // eslint-disable-line no-unused-vars
    const response = await message.channel.send(`${message.client.responses.loadingMessages.random().replaceAll("{{user}}", message.member.displayName)}`);

    try {
      const target = await this.verifyUser(message, message.mentions.users.size === 1 ? message.mentions.users.first().id : message.author.id);
      const attachment = new MessageAttachment(await message.client.idiotAPI.tattoo(target.displayAvatarURL({ format:"png", size:512 })), "tattoo.png");
      
      await response.delete();
      await message.channel.send(`Requested by **${message.author.tag}** ❯ \`${message.content}\``, {files: [attachment]});
    } catch (error) {
      await response.edit(`${message.client.responses.errorMessages.random().replaceAll("{{user}}", message.member.displayName)}`);
      message.client.console.error(error);
    }
  }
}

module.exports = Tattoo; //