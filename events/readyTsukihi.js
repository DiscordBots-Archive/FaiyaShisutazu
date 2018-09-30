const Event = require("../structures/Event.js");

module.exports = class extends Event {

  async run() {
    if (this.client.users.has("1")) this.client.users.delete("1");

    this.client.user.setActivity(`with Karen! | @${this.client.user.username} help`);

    this.client.console.log(`${this.client.user.tag}, ready to serve ${this.client.users.size} users in ${this.client.guilds.size} servers.`);
    
    this.client.appInfo = await this.client.fetchApplication();
    setInterval(async () => {
      this.client.appInfo = await this.client.fetchApplication();
    }, 60000);

    setInterval(() => {
      const toRemind = this.client.reminders.filter(reminder => reminder.reminderTimestamp <= Date.now());
      toRemind.forEach(reminder => {
        this.client.users.get(reminder.id).send(`You asked me to remind you about: \`${reminder.reminder}\` in \`${this.client.guilds.get(reminder.guildid).name}\``);
        this.client.reminders.delete(`${reminder.id}-${reminder.reminderTimestamp}`);
      });
    }, 60000);
  }
};
