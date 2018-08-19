// Member Join
exports.welcomeMessages = [
  "O-ohayou **{{user}}-san**.",
  "Ai đây nhỉ? **{{user}}** joined the server.",
  "**{{user}}-san** vô đúng channel không vậy!?",
  "ERGH, sao có thêm đứa này nữaa, {{amount}} users chưa đủ à!"
];

// Member Leave
exports.goodbyeMessages = [
  "**{{user}}-san** đi luôn đừng về hộ nhé!",
  "Awh, **{{user}}-san** has left... Đi đi cho rộng chỗ!",
  "Hay lắm **{{user}}-san**! Bái baii..",
  "Eeeee! Sao **{{user}}-san** bỏ em ở đây?!",
  "Finally, **{{user}}**-san đi rồi @everyone!"
];

// Daily
exports.dailySuccessMessages = [
  "Yatta! **{{user}}-san** được {{amount}} nè.",
  "{{amount}} của **{{user}}-san** nè!",
  "Tưởng **{{user}}-san** sẽ chả bao giờ đến lấy {{amount}} luôn í..",
  "**{{user}}-san** được {{amount}}? Bao em ăn tối nha **{{user}}-san**?",
  "Eeee cuối cùng **{{user}}-san** cũng nhận {{amount}} ùi."
];

exports.dailyFailureMessages = [
  "Cái gì cũng phải từ từ nhé **{{user}}-san**, còn tận {{time}} lận!!",
  "Còn {{time}} nữa mới nhận nha **{{user}}-san**..",
  "**{{user}}-san** hôm nay lấy rồi mà, phải chờ {{time}} nữa!",
  "**{{user}}-san** xin xỏ hoài vậy, còn {{time}} lận nha.",
  "Cắt daily của **{{user}}-san** nhé? Chờ {{time}} nữa hộ nha.."
];

exports.balanceMessages = [
  "Pfft, {{amount}}? Nub quá nè **{{user}}-san**.",
  "Only {{amount}}? Không có tiền thì cạp đất mà ăn nha **{{user}}**!",
  "**{{user}}-san** có {{amount}} à.",
  "**{{user}}**, again? Ugh, có {{amount}} mà cũng bày đặt... Jeez~"
];

exports.otherBalanceMessages = [
  "Sao lại muốn coi **{{user}}-san** có bao nhiêu? Có {{amount}} nè!",
  "N-nani? **{{user}}-san**'s balance? Có {{amount}} à..",
  "Quan tâm đến **{{user}}** vậy? **{{user}}-san** có {{amount}}.",
  "Cơn gió nào? **{{user}}** hả? **{{user}}-san** có {{amount}}.",
  "Hm, chờ tẹo nè.. It's {{amount}}, hỏi của **{{user}}** chi dạ?"
];

// Steins;Gate Ref Correction
exports.steinerMessages = [
  "Ý **{{user}}-san** là {{steiner}}???",
  "Sai rùi nha **{{user}}-san**! \"{{steiner}}\" mới đúng!",
  "?? :smile: ?? It's \"{{steiner}}\"",
  "\"{{steiner}}\" nha! **{{user}}-san**, do you you even Tutturu? https://i.imgur.com/N8n0ZC5.jpg",
  "B-baka!! Là \"{{steiner}}\"!"
];

// Rankup
exports.rankupMessages = [
  "**{{user}}-san** lên **{{rank}}** rồi nè!",
  "**{{user}}-san**? **{{rank}}**?? Cái gì đang xảy ra thế này?",
  "**{{user}}-san** lên **{{rank}}** rồi á!?",
  "Lên **{{rank}}** rổi đó nhưng còn lâu mới đuổi kịp em nhé **{{user}}-san**!",
  "**{{user}}-san** mãi mới lên **{{rank}}** lêu lêu!",
  "**{{user}}-san** cuối cùng cũng đc **{{rank}}** ?? R-rank rác rưởi!!!"
];

// Loading
exports.loadingMessages = [
  "Chờ em 1 tí nha **{{user}}-san**!",
  "Đang tải nè **{{user}}-san**..."
];

// About
exports.aboutMessages = [
  "Ohayō **{{user}}-san**! Chúng mình cùng phấn đấu nhé!",
  "Mệt ùi hông muốn trả lời **{{user}}-san** nữa! Phí sức lắm...",
  "Gì đây **{{user}}-san**?! Đánh nhau hông?",
  "Command prefix của em là **{{prefix}}** nha! Mất công **{{user}}-san** lại quên...",
  "Gì hoài vậy **{{user}}-san**? Con người chứ có phải c-con con , con gì ấy nhỉ, đâu mà nói hoài?",
  "Ohayō, em là Üc207Pr4f57t9, Ex-Machina! Mọi người có thể gọi em là Schwi-chan! Dùng prefix **{{prefix}}** của em để chạy các commands nha!.",
  "**{{user}}-san** tìm em hả? Command prefix của em là **{{prefix}}**. Chạy **{{prefix}}**help để biết thêm về các commands của em nha ˭̡̞(◞⁎˃ᆺ˂)◞*✰!"
];

// Purge/delete messages
exports.purgeMessages = [
  "Hông biết đâu nha, senpai nào vừa kêu em purge {{amount}} messages...",
  "Oops... Em vừa xóa {{amount}} messages mất ùi..."
];

// Reboot
exports.rebootMessages = [
  "Minna-san chờ emm… Senpai kêu em reboot~",
  "Minna-san! Em cần reboot, chờ em tí..."
];

// Poweroff
exports.rebootMessages = [
  "Minna-san bái bai, em phải đi rồi~",
  "Minna-san ơi! Em đi ngủ một tí, ~ngápppp~..."
];

// Boot
exports.bootMessages = [
  "**{{user}}-senpai**! Minna-san! Em quay lại ùi nè!",
  "**{{user}}-san** với mọi người nhớ em hơm?"
];

// Reload
exports.reloadMissingArg = [
  "N-nani?! điền command đàng hoàng vô hộ em với, không biết thì hỏi nha..",
  "Baka!? Phải nói rõ command em mới reload dc chớ owo"
];

exports.reloadNotFound = [
  "Eeeh?! **{{user}}-san**, làm gì có `{{command}}` (╯°□°）╯︵ ┻━┻",
  "Gi vậy má **{[user}}**? `{{command}}` doesn't exist! Baka!"
];

exports.reloadErrUnload = [
  "**{{user}}-san**, lỗi mất rồi nè: {{response}}",
  "Èoooo, lỗi nữa rồi: ({response})"
];

exports.reloadErrLoad = [
  "Ugh, can't you do one thing right? **{{user}}-san** làm hỏng mất command `{{command}}` của em bây giờ?",
  "`{{command}}` hỏng rồi .. Tại **{{user}}-san** nhé!"
];

exports.reloadSuccess = [
  "Yatta! `{{command}}` reloaded rồi nè...",
  "Em reloaded `{{command}}` rồi, xài commands gì mà reload hoài vậy owo"
];

// Errors
exports.notNSFWChannel = [

];

exports.guildOnlyCommand = [

];
