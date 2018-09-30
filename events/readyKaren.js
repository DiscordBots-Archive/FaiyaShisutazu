const Event = require("../structures/Event.js");

module.exports = class extends Event {

  async run() {
    if (this.client.users.has("1")) this.client.users.delete("1");

    this.client.user.setActivity(`over ${this.client.users.size} users in ${this.client.guilds.size} server${this.client.guilds.size > 1 ? "s" : ""}`, { type: "WATCHING" });

    this.client.console.log(`${this.client.user.tag}, ready to serve ${this.client.users.size} users in ${this.client.guilds.size} servers.`);
    
    this.client.appInfo = await this.client.fetchApplication();
    setInterval(async () => {
      this.client.appInfo = await this.client.fetchApplication();
    }, 60000);
  }
};
