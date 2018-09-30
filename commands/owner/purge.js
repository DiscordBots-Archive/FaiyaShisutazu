const Owner = require("../../structures/Owner.js");

class Purge extends Owner {

  constructor(...args) {
    super(...args, {
      name: "purge",
      description: "Allows you to purge a users or channels messages.",
      category: "Owner",
      usage: "purge [amount of messages to purge] [@user]",
      extended: "This purges a specified number of message in a channel, from everyone or from a specific individual.",
      aliases: ["clean", "remove", "delete"],
      permLevel: "Moderator"
    });
  }

  async run(message, args, level) { // eslint-disable-line no-unused-vars
    if (args[0].isNumber() == true && args[1] == null) {
      if (args[0] < 2 || args[0] > 100) return message.channel.send("Unable to purge messages, invalid integer for purge amount. Value must be between 2 and 100 messages.").then((msg) => msg.delete(5000));
      const todelete = await message.channel.messages.fetch({limit: args[0]});
      await message.channel.bulkDelete(todelete).catch(error => console.log(error.stack));
      await message.channel.send(message.client.responses.purgeMessages.random().replaceAll("{{amount}}", todelete.size)).then((msg) => msg.delete(10000));
    }
  }
}

module.exports = Purge;