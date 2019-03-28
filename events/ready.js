const Event = require("../structures/Event.js");
const activities = [
  "with {{users}} users",
  "over {{servers}} servers",
  "@{{ping}} help"
];

module.exports = class extends Event {

  async run() {
    if (this.client.users.has("1")) this.client.users.delete("1");

    let count = 0;

    setInterval(() => {
      if (count++ === 0)
        this.client.user.setActivity(activities[count].replaceAll("{{users}}", this.client.users.size));
      else if (count++ === 1)
        this.client.user.setActivity(activities[count].replaceAll("{{servers}}", this.client.guilds.size), { type: "WATCHING" });
      else {
        this.client.user.setActivity(activities[count].replaceAll("{{ping}}", this.client.user.username), { type: "LISTENING" });
        count = 0;
      }
    }, 5000);

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