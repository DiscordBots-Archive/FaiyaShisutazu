const Social = require("../../structures/Social.js");
const { MessageAttachment } = require("discord.js");

class Beautiful extends Social {

  constructor(...args) {
    super(...args, {
      name: "beautiful",
      description: "Returns a beatiful canvas with the person you like on it",
      category: "3. Canvas",
      usage: "beautiful [@mention target]",
      extended: "This uses the provided tag to create a beautiful canvas with the person you like. If there was no tag provided, message command will use the image of the message's author!",
      cost: 15,
      cooldown: 10,
      aliases: ["painting"],
      botPerms: ["ATTACH_FILES"]
    });
  }

  async run(message, args, level) { // eslint-disable-line no-unused-vars
    const response = await message.channel.send(`${message.client.responses.loadingMessages.random().replaceAll("{{user}}", message.member.displayName)}`);

    try {
      const target = await this.verifyUser(message, message.mentions.users.first().id);
      const attachment = new MessageAttachment(await message.client.idiotAPI.beautiful(target.displayAvatarURL({format:"png", size:256})), "beautiful.png");
      
      await response.delete();
      await message.channel.send(`Requested by **${message.author.tag}** ❯ \`${message.content}\``, {files: [attachment]});
    } catch (error) {
      await response.edit(`${message.client.responses.errorMessages.random().replaceAll("{{user}}", message.author.tag)}`);
      message.client.console.error(error);
    }
  }
}

module.exports = Beautiful; //