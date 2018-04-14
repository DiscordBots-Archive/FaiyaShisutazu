// Member Join
exports.welcomeMessages = [
  "O-ohayou {{user}}-san.",
  "Hmph, thay mặt cho ae LangSonFam, ohayou {{user}}-san.",
  "Ai đây nhỉ? {{user}} joined the server.",
  "{{user}}-san vô đúng channel không vậy!?",
  "ERGH, sao có thêm đứa này nữaa, {{amount}} users chưa đủ à!"
];

// Member Leave
exports.goodbyeMessages = [
  "{{user}}-san đi luôn đừng về hộ nhé!",
  "Awh, {{user}}-san has left... Đi đi cho rộng chỗ!",
  "Hay lắm {{user}}-san! Bái baii..",
  "{{user}}-san đã tự giải thoát cho chính mình...",
  "Eeeee! Sao {{user}}-san bỏ em ở đây?!",
  "Finally, {{user}}-san đi rồi @everyone!"
];

// Commands
exports.pingMessages = [
  "Ugh, nữa hả? {{user}}-san hỏi gì hoài vậy! {{ms}}ms.",
  "Ping đến server của em là {{ms}}ms nha {{user}}.",
  "{{ms}}ms để chạm tới cõi lòng em nhé {{user}}-san.",
  "{{user}}-san thích lãng phí thời gian wá nhỉ? Tốn {{ms}}ms ùi..",
  "Pong! Mất {{ms}}ms nè {{user}}-san.."
];


exports.goMessages = [
  "Ehhhhh! {{user}}-san rủ mọi người chơi {{game}} nè.",
  "Chơi {{game}} cùng {{user}}-san đi mọi người vì {{user}}-san cô đơn lắm!",
  "{{user}} thọt quá nên tuyển người kéo rank {{game}} nè mọi người ơiii",
  "Goooooo! Chơi {{game}} với {{user}}-san nè~"
];

exports.dailySuccessMessages = [
  "Yatta! {{user}}-san được {{amount}} nè.",
  "{{amount}} của {{user}}-san nè!",
  "Tưởng {{user}}-san sẽ chả bao giờ đến lấy {{amount}} luôn í..",
  "{{user}}-san được {{amount}}? Bao em ăn tối nha {{user}}-san?",
  "Eeee cuối cùng {{user}}-san cũng nhận {{amount}} ùi."
];

// Level Up
exports.levelUpMessages = [
  "E-eh? {{user}}-san lên {{level}} rồi hả??",
  "Hmph, lên {{level}} rồi kìa {{user}}-san, gke nkỉ !",
  "Hyaa~! {{user}}-san tăng cấp lên {{level}} ùi.",
  "Mới {{level}} mà ra gió hả {{user}}?"
];

exports.dailyFailureMessages = [
  "Cái gì cũng phải từ từ nhé {{user}}-san, còn {{time}} lận!!",
  "Còn {{time}} mới nhận nha {{user}}-san..",
  "{{user}}-san hôm nay lấy rồi mà, phải chờ {{time}} nữa",
  "{{user}}-san xin xỏ hoài vậy, còn tận {{time}} lận nha.",
  "Cắt daily của {{user}}-san nhé? Chờ {{time}} nữa hộ em.."
];

exports.balanceMessages = [
  "Pfft, {{amount}}? Nub quá nè {{user}}-san.",
  "Only {{amount}}? Không có tiền thì cạp đất mà ăn nha {{user}}!",
  "{{user}}-san có {{amount}} à.",
  "{{user}}, again? Ugh, có {{amount}} mà cũng bày đặt... Jeez~"
];

exports.otherBalanceMessages = [
  "Sao lại muốn coi {{user}}-san có bao nhiêu? Có {{amount}} nè mặc dù em chả quan tâm lắm.",
  "N-nani? {{user}}-san's balance? Có {{amount}} à..",
  "Quan tâm đến {{user}} vậy? {{user}}-san có {{amount}}.",
  "Cơn gió nào? {{user}} hả? {{user}}-san có {{amount}}.",
  "Hm, chờ tẹo nè.. It's {{amount}}, hỏi của {{user}} chi dạ?"
];

exports.purgeMessages = [
  "Hông biết đâu nha, senpai nào vừa kêu em purge {{amount}} messages...",
  "Oops... Em vừa xóa {{amount}} messages mất ùi..."
];

exports.aboutMessages = [
  "Ohayō mina-san! Chúng mình cùng phấn đấu nhé!",
  "Nãy em giới thiệu rồi mà hỏi hoài vậy? Con người chứ có phải c-con con , con gì ấy nhỉ, đâu mà nói hoài?",
  "Ohayō, em là REmilia! Mọi người có thể gọi em là REm-chan!"
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
exports.bootOneMessages = [
  "{{user}}-senpai! Minna-san! Em quay lại ùi nè!"
];

exports.bootTwoMessages = [
  "{{user}}-san với mọi người nhớ em hơm?"
];

// Reload
exports.reloadMissingArg = [
  "N-nani?! điền command đàng hoàng vô hộ em với, không biết thì hỏi nha..",
  "Baka!? Phải nói rõ command em mới reload dc chớ owo"
];

exports.reloadNotFound = [
  "Eeeh?! {{user}}-san, làm gì có `{{command}}` (╯°□°）╯︵ ┻━┻",
  "Gi vậy má {[user}}? `{{command}}` doesn't exist! Baka!"
];

exports.reloadErrUnload = [
  "{{user}}-san, lỗi mất rồi nè: {{response}}",
  "Èoooo, lỗi nữa rồi: ({response})"
];

exports.reloadErrLoad = [
  "Ugh, can't you do one thing right? {{user}}-san làm hỏng mất command `{{command}}` của em bây giờ?",
  "`{{command}}` hỏng rồi .. Tại {{user}}-san nhé!"
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






