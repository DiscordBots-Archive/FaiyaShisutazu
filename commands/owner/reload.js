const Owner = require("../../structures/Owner.js");

class Reload extends Owner {

  constructor(...args) {
    super(...args, {
      name: "reload",
      description: "Reloads a command that has been modified",
      category: "Owner",
      usage: "reload [command]",
      extended: "This reloads a specific command for new changes or fixes.",
      aliases: [],
      permLevel: "Bot Admin"
    });
  }

  async run(message, args, level, replyMessage) { // eslint-disable-line no-unused-vars
    await replyMessage.delete();
    if (!args || args.size < 1) return message.channel.send(`${message.client.responses.reloadMissingArg.random().replaceAll("{{user}}", message.member.displayName)}`);
    
    const commands = message.client.commands.get(args[0]) || message.client.commands.get(message.client.aliases.get(args[0]));
    if (!commands) return message.channel.send(`${message.client.responses.reloadNotFound.random().replaceAll("{{user}}", message.member.displayName)}`);

    let response = await message.client.unloadCommand(commands.conf.location, commands.help.name);
    if (response) return message.channel.send(`${message.client.responses.reloadErrUnload.random().replaceAll("{{user}}", message.member.displayName).replaceAll("{{response}}", response)}`);

    response = message.client.loadCommand(commands.conf.location, commands.help.name);
    if (response) return message.channel.send(`${message.client.responses.reloadErrLoad.random().replaceAll("{{user}}", message.member.displayName).replaceAll("{{response}}", response)}`);

    message.channel.send(`${message.client.responses.reloadSuccess.random().replaceAll("{{command}}", commands.help.name)}`);
  }
}
module.exports = Reload;
