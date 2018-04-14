const Command = require(`${process.cwd()}/base/Command.js`);

class About extends Command {
  constructor(client) {
    super(client, {
      name: "about",
      description: "Tìm hiểu về em tí nha!",
      usage: "about",
      category: "1. General"
    });
  }

  async run(message, args, level) { // eslint-disable-line no-unused-vars
    try {
      message.channel.send(this.client.responses.aboutMessages.random());
    } catch (e) {
      console.log(e);
    }
  }
}

module.exports = About;