const { version } = require("discord.js");
const fs = require("fs");
const moment = require("moment");
require("moment-duration-format");

module.exports = class {
  constructor(client) {
    this.client = client;
    this.config = require(`${process.cwd()}/config.js`);
  }

  async run() {
    try {
      const { id: rebootMsgID, channel: rebootMsgChan, user: rebootMsgUserID } = JSON.parse(fs.readFileSync(`${process.cwd()}/assets/json/reboot.json`, "utf8"));
      const u = await this.client.users.fetch(rebootMsgUserID);
      const m = await this.client.channels.get(rebootMsgChan)
        .messages.fetch(rebootMsgID);
      await m.edit(`${this.client.responses.bootMessages.random().replaceAll("{{user}}", u.username).trim()}`);
      fs.unlink("./reboot.json", () => {});
    } catch (O_o) {
      this.client.logger.error(O_o);
    }
    await this.client.wait(1000);

    this.client.appInfo = await this.client.fetchApplication();
    setInterval(async () => {
      this.client.appInfo = await this.client.fetchApplication();
    }, 60000);

    if (!this.client.settings.has("default")) {
      if (!this.client.config.defaultSettings) throw new Error("defaultSettings not preset in config.js or settings database. Bot cannot load.");
      this.client.settings.set("default", this.client.config.defaultSettings);
    }

    this.client.user.setActivity(`over ${this.client.users.size} users in ${this.client.guilds.size} server${this.client.guilds.size > 1 ? "s" : ""}`, { type: "WATCHING" });

    this.client.logger.log(`${this.client.user.tag}, ready to serve ${this.client.users.size} users in ${this.client.guilds.size} servers.`, "ready");

    setInterval(() => {
      const toRemind = this.client.reminders.filter(r => r.reminderTimestamp <= Date.now());
      toRemind.forEach(reminder => {
        this.client.users.get(reminder.id).send(`You asked me to remind you about: \`${reminder.reminder}\``);
        this.client.reminders.delete(`${reminder.id}-${reminder.reminderTimestamp}`);
      });
    }, 60000);
  }
};
