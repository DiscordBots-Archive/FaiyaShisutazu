// About/introduction 
exports.aboutMessages = [
  "**Karen:** Ohayō! I'm **Karen**!\n**Tsukihi:** I'm **Tsukihi**!",
  "**Karen:** Not sure if **Tsukihi-chan** will even reply to you but okay...I'm **Karen**.\n**Tsukihi:** ...",
  "**Karen:** Hm **Tsukihi-chan** might not want to do this ya know... Sigh, I'm Karen by the way.\n**Tsukihi:** Right, can we do this later?",
  "**Karen:** Ohayō! We are the **Faiya Shisutazu**! **{{prefix}}** is how you request a command\n",
  "**Karen:** **Karen** daze!!\n**Tsukihi:** **Tsukihi** dayo~ We are the **Faiya Shisutazu**!",
];

// Member Join
exports.welcomeMessages = [
  "**Karen:** O-ohayou **{{user}}-san**.",
  "**Tsukihi:** O-ohayou gozaimasu **{{user}}-san**.",
  "**Karen:** O-oh, welcome **{{user}}-san** to **{{guild}}**. I hope I haven't embarrased you...",
  "**Tsukihi:** Who dis? **{{user}}** s-sounds like a name for b-bakas...",
  "**Karen:** Yay! More b-bakas in **{{guild}}** to deal with! Who is dis **{{user}}**!?",
  "**Tsukihi:** Aa yoisho.. I don't want to greet **{{user}}** **Karen-chan**...",
  "**Tsukihi:** **{{user}}-san** ? U-uh did you get lost!?",
  "**Tsukihi:** I'm platinum mad! Are {{amount}} users in **{{guild}}** not enough already?! Why has **{{user}}** got to come?"
];

// Member Leave
exports.goodbyeMessages = [
  "**Tsukihi:** Not joining **{{guild}}** again would be a very smart move **{{user}}-san** !",
  "**Karen:** Awh, **{{user}}-san** has left... Just kidding, less people in **{{guild}}** to deal with!",
  "**Karen:** Finally **{{user}}-san** left **{{guild}}**!\n**Tsukihi:** Byee~",
  "**Tsukihi:** Eeeee! **{{user}}-san** left?!",
  "**Tsukihi:** Not like we needed **{{user}}-san** in **{{guild}}** or anything, more space I guess?",
  "**Karen:** Life finally freed me from **{{user}}**!\n**Tsukihi:** Yay!"
];

// Daily
exports.dailySuccessMessages = [
  "**Tsukihi:** **{{user}}-san** got {{amount}} for today. Not like I like **{{user}}-san** or anything, I would rather deduct {{amount}}...",
  "**Karen:** {{amount}} are all yours **{{user}}-san**!",
  "**Tsukihi:** **{{user}}-san** got {{amount}}? Y-you know, getting me a new hairclip would make me platinum happy **{{user}}-san**...",
  "**Tsukihi:** N-nani? {{amount}} just got {{amount}}. What will **{{user}}-san** do with {{amount}} anyway?",
  "**Karen:** I don't think **{{user}}-san** deserves it but here, {{amount}}.",
  "**Tsukihi:** I think I might regret it later that I have to give **{{user}}-san** {{amount}} now...",
  "**Tsukihi:** Take these {{amount}} before I get platinum mad and give them all to Shinobu-chan **{{user}}-san**!",
  "**Tsukihi:** Isn't {{amount}} a lot for a baka like **{{user}}-san**, **Karen-chan**?"
];

exports.dailyFailureMessages = [
  "**Karen:** Patient please **{{user}}-san**, still {{time}} left!!",
  "**Tsukihi:** Still {{time}} til you can ask for it **{{user}}-san**..",
  "**Karen:** **{{user}}-san** already got them today, still {{time}} remaining!",
  "**Tsukihi:** B-baka **{{user}}-san**, still {{time}} left.",
  "**Tsukihi:** Again?? How about I ignore **{{user}}-san**? Please wait for {{time}} then come back..",
  "**Tsukihi:** I'm **platinum mad**! **{{user}}-san** is such an impatient baka!"
];

// Loading
exports.loadingMessages = [
  "**Tsukihi:** Aa yoisho...",
  "**Tsukihi:** Platinum loading...!",
  "**Tsukihi:** Loading a platinum response...",
  "**Tsukihi:** Aa yoisho! Why do I have to load these commands for a baka...",
  "**Tsukihi:** Would be nice if this is the last time I have to load these commands..."
];

// Music prompt cancelation
exports.musicCancelMessages = [
  "**Karen:** S-sumimasen **{{user}}-san**! Seems like I couldn't find what you wanted...",
  "**Tsukihi:** B-baka! Maybe try again with a better search term?",
  "**Tsukihi:** Wat... Nothing you want from the above list?",
  "**Karen:** Don't be so indecisive **{{user}}-san**, why can't you just pick one from the list..",
  "**Tsukihi:** Stop requesting if you don't like any of the option I give you **{{user}}-san**!"
];

// Error
exports.errorMessages = [
  "**Karen:** B-baka **{{user}}-san**! It's probably your fault that I ran into an error...",
  "**Tsukihi:** Argh! How annoying! An error occured **{{user}}-san**.",
  "**Tsukihi:** I'm platinum mad! Why do errors keep occuring when **{{user}}-san** ran the command!",
  "**Tsukihi:** It seems like an error has occured! Please try again in a bit **{{user}}-san**.",
  "**Karen:** Woah! A dumb error occured! S-sumimasen **{{user}}-san**, can you try again later?",
  "**Tsukihi:** This is probably a mistake, just like how **{{user}}-san** appeared in this server in the first place. But anyway **{{user}}-san**, this command obviously failed to load..."
];

// Purge/delete messages
exports.purgeMessages = [
  "**Tsukihi:** Purged {{amount}} messages...",
  "**Tsukihi:** Oops... I just purged {{amount}} messages..."
];

/// Reload
exports.reloadMissingArg = [
  "**Tsukihi:** N-nani?! I don't know what to do, you didn't give me anything!",
  "**Tsukihi:** Baka! You are supposed to provide a command to reload!"
];

exports.reloadNotFound = [
  "**Tsukihi:** Eeeh?! **{{user}}-san**, why would you ask me to find a command that doesn't exist, it wasn't even an alias.",
  "**Tsukihi:** What are you doing? **{{command}}** doesn't exist! Baka!"
];

exports.reloadErrUnload = [
  "**Tsukihi:** **{{user}}-san**, I think I broke it... This happened: **{{response}}**",
  "**Tsukihi:** There was an error, probably your fault! Baka! **{{response}}**"
];

exports.reloadErrLoad = [
  "**Tsukihi:** Ugh, can't you do one thing right? You ended up breaking **{{command}}**.",
  "**Tsukihi:** **{{command}}** is broken... Not my fault or problem though! (**{{response}}**)"
];

exports.reloadSuccess = [
  "**Tsukihi:** Yatta! **{{command}}** reloaded, now we can get back to what we were doing, or whatever you want to do...",
  "**Tsukihi:** I've reloaded **{{command}}**, not that I could see any point in it..."
];

// Errors
exports.notNSFWChannel = [

];

exports.guildOnlyCommand = [

];