module.exports = {
  name: "report",
  description: "Send developer a message of a bug",
  usage: `${process.env.PREFIX}report <bug/problem>`,
  aliases: ["bug", "issue"],
  run: async (message, args, client) => {
    if (!args[0]) return message.reply({ content: `No report message given.`})
   client.guilds.resolve("911173629427978311").channels.resolve("912171684990160916").fetchWebhooks().then(hooks => hooks.get('912171881581408326').send({content: `Report: ${args.join(" ")}\nLink: ${message.url}\nGuild: ${message.guild.name} - ${message.guild.id}`, username: message.author.tag, avatarURL: message.author.avatarURL()}))
   message.reply({ content: `Reported to developer!` })
  },
}