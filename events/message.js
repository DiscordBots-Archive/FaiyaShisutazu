const monitor = require(`${process.cwd()}/monitors/monitor.js`);

module.exports = class {
  constructor(client) {
    this.client = client;
  }

  async run(message) {
    // El Psy Kongroo
    if (message.content.toLowerCase().includes("congroo") || message.content.toLowerCase().includes("tuturu") || message.content.toLowerCase().includes("tootooroo"))
      message.channel.send(`${this.client.responses.kongrooMessages.random().replace("{{kongroo}}", message.content.toLowerCase().replace("congroo", "***Kongroo***").replace("tuturu", "***Tutturu***").replace("tootooroo", "***Tutturu***").replace(/\w\S*/g, function(txt) {return txt.charAt(0).toUpperCase() + txt.substr(1).toLowerCase();}))}`)
    
    if ((message.author.bot && message.author.id !== "454009482138353664") || !message.guild) return;
    if (!message.channel.permissionsFor(message.guild.me).has("SEND_MESSAGES")) return;
    
    // const defaults = this.client.settings.get("default");
    const settings = message.settings = this.client.getGuildSettings(message.guild);    
    
    const level = this.client.permlevel(message);

    if (message.settings.socialSystem === "true") {
      monitor.run(this.client, message, level);
    }

  
    const mentionPrefix = new RegExp(`^<@!?${this.client.user.id}> `);
    const prefixMention = mentionPrefix.exec(message.content);

    const prefixes = [settings.prefix, `${prefixMention}`];
    let prefix = false;
  
    for (const thisPrefix of prefixes) {
      if (message.content.toLowerCase().indexOf(thisPrefix) == 0) prefix = thisPrefix;
    }
  
    if (message.content.match(new RegExp(`^<@!?${this.client.user.id}>$`))) {
      return message.channel.send(`Are you looking for me? The command prefix is \`${settings.prefix}\`. You can run \`${settings.prefix}help\` to get a list of my commands  ˭̡̞(◞⁎˃ᆺ˂)◞*✰!`);
    }
  
    if (!prefix) return;
  
    const args = message.content.slice(prefix.length).trim().split(/ +/g);
    const command = args.shift().toLowerCase();
    const cmd = this.client.commands.get(command) || this.client.commands.get(this.client.aliases.get(command));
    
    if (!cmd) return;

    const rateLimit = await this.client.ratelimit(message, level, cmd.help.name, cmd.conf.cooldown); 

    if (typeof rateLimit == "string") {
      this.client.logger.log(`${this.client.config.permLevels.find(l => l.level === level).name} ${message.author.username} (${message.author.id}) got ratelimited while running command ${cmd.help.name}`);
      return message.channel.send(`Please wait ${rateLimit.toPlural()} to run this command.`); //return stop command from executing
    }

    if (cmd && !message.guild && cmd.conf.guildOnly)
      return message.channel.send("This command is unavailable via private message. Please run this command in a guild.");

    if (level < this.client.levelCache[cmd.conf.permLevel]) {
      if (settings.systemNotice === "true") {
        return message.channel.send(`B-Baka! You're only level ${level}, a ${this.client.config.permLevels.find(l => l.level === level).name.toLowerCase()}, why should I listen to you instead of a ${cmd.conf.permLevel} (level ${this.client.levelCache[cmd.conf.permLevel]}).`);
      } else {
        return;
      }
    }
      
    message.author.permLevel = level;

    message.flags = [];
    while (args[0] &&args[0][0] === "-") {
      message.flags.push(args.shift().slice(1));
    }
    
    // Log commands used (e.g.: "User REmilia (413891473528848384) ran command leaderboard")
    this.client.logger.log(`${this.client.config.permLevels.find(l => l.level === level).name} ${message.author.username} (${message.author.id}) ran command ${cmd.help.name}`, "cmd");

    // Run the requested command
    cmd.run(message, args, level);

    // Delete the user's command request
    message.delete();
  }
};