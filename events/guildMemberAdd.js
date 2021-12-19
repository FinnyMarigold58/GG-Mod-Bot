const { moderations } = require("../db.js")

module.exports = (client) => {
  client.on('guildMemberAdd', async (member) => {
    // Mute evasion check
    const data = await moderations.findOne({user: member.id, action: "Mute", active: true}) || await moderations.findOne({ user: member.id, action: "tempmute", active: true})
    let muterole = member.guild.roles.cache.filter((roless) => roless.name == "Muted").first()
    if(data) {
      member.roles.cache.forEach((role) => member.roles.remove(role,"Mute join bypass"))
      member.roles.add(muterole,"Mute join bypass")
    }
  })
}