const { Client } = require("discord.js");
const CommandStore = require("./CommandStore.js");
const EventStore = require("./EventStore.js");
const BotConsole = require("./BotConsole.js");
const idioticAPI = require("idiotic-api");
const Enmap = require("enmap");

class TsukihiClient extends Client {
  constructor(options) {
    super(options);
    this.config = require("../config.js");
    this.console = new BotConsole(this);
    this.responses = require(`../assets/languages/${this.config.defaultSettings.language}/Tsukihi/responses.js`);
    this.idiotAPI = new idioticAPI.Client(`${this.config.idiotAPI}`, { dev: true });
    
    this.commands = new CommandStore(this);
    this.events = new EventStore(this);

    this.levelCache = {};
    this.methods = {
      util: require("../util/Util.js"),
      errors: require("../util/CustomError.js")
    };
  
    this.settings = new Enmap({ name: "settingsTsukihi" });
    this.reminders = new Enmap({ name: "reminders" });
    this.points = new Enmap({ name: "points" });
    this.store = new Enmap({ name: "shop" });

    this.ready = false;
    this.on("ready", this._ready.bind(this));
    this.on("message", message => this._message(message));
  }

  _ready() {
    this.ready = true;
    this.emit("readyTsukihi");
  }

  _message(message) {
    this.message = true;
    this.emit("messageTsukihi", message);
  }

  async login(token) {
    await this.init();
    return super.login(token);
  }

  get ping() {    
    return this.pings.reduce((prev, p) => prev + p, 0) / this.pings.length;    
  }

  get status() {    
    return this.ws.connection ? this.ws.connection.status : null;    
  }

  permlevel(message) {
    let permlvl = 0;
    
    const permOrder = this.config.permLevels.slice(0).sort((prev, val) => prev.level < val.level ? 1 : -1);
    
    while (permOrder.length) {
      const currentLevel = permOrder.shift();
      if (message.guild && currentLevel.guildOnly) continue;
      if (currentLevel.check(message)) {
        permlvl = currentLevel.level;
        break;
      }
    }
    return permlvl;
  }
    
  getGuildSettings(guild) {
    const def = this.config.defaultSettings;
    if (!guild) return def;
    const returns = {};
    const overrides = this.settings.get(guild.id) || {};
    for (const key in def) {
      returns[key] = overrides[key] || def[key];
    }
    return returns;
  }
    
  getSettings(id) {
    const defaults = this.settings.get("default") || this.config.defaultSettings;
    let guild = this.settings.get(id);
    if (typeof guild !== "object") guild = {};
    const returnObject = {};
    Object.keys(defaults).forEach(key => {
      returnObject[key] = guild[key] ? guild[key] : defaults[key];
    });
    return returnObject;
  }
    
  writeSettings(id, newSettings) {
    const defaults = this.settings.get("default") || this.config.defaultSettings;
    let settings = this.settings.get(id);
    if (typeof settings !== "object") settings = {};
    for (const key in newSettings) {
      if (defaults[key] !== newSettings[key]) {
        settings[key] = newSettings[key];
      } else {
        delete settings[key];
      }
    }
    this.settings.set(id, settings);
  }
    
  async init() {
    const [commands, events] = await Promise.all([this.commands.loadFiles(), this.events.loadFiles()]);
    this.console.log(`Tsukihi loaded a total of ${commands} commands.`);
    this.console.log(`Tsukihi loaded a total of ${events} events.`);
    
    for (let i = 0; i < this.config.permLevels.length; i++) {
      const thisLevel = this.config.permLevels[i];
      this.levelCache[thisLevel.name] = thisLevel.level;
    }
  }
}

module.exports = TsukihiClient;