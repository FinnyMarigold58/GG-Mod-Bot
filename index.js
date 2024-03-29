console.log("Booting...")
require("dotenv").config()

const fs = require("fs")

const Sentry = require("@sentry/node")
const Tracing = require("@sentry/tracing")

const { keep_alive } = require("./keep_alive");
const mongo = require("./db.js")
const Discord = require("discord.js")
const client = new Discord.Client({ intents: 32767})
client.db = mongo
client.tempcheck = require("./tempCheck.js")(client)
client.Sentry = Sentry

client.commands = new Discord.Collection()
fs.readdir("./commands/", (err, files) => {
    files.forEach((file) => {
        let path = `./commands/${file}`
        fs.readdir(path, (err, files) => {
            if (err) console.error(err)
            let jsfile = files.filter((f) => f.split(".").pop() === "js")
            if (jsfile.length <= 0) {
                console.error(`Couldn't find commands in the ${file} category.`)
                return
            }
            jsfile.forEach((f, i) => {
                let props = require(`./commands/${file}/${f}`)
                props.category = file
                try {
                    client.commands.set(props.name, props)
                    if (props.aliases) props.aliases.forEach((alias) => client.commands.set(alias, props))
                } catch (err) {
                    if (err) console.error(err)
                }
            })
        })
    })
})
client.slashCommands = new Discord.Collection()
fs.readdir("./slashCommands/", (err, files) => {
    files.forEach((file) => {
        let path = `./slashCommands/${file}`
        fs.readdir(path, (err, files) => {
            if (err) console.error(err)
            let jsfile = files.filter((f) => f.split(".").pop() === "js")
            if (jsfile.length <= 0) {
                console.error(`Couldn't find slash commands in the ${file} category.`)
            }
            jsfile.forEach((f, i) => {
                let props = require(`./slashCommands/${file}/${f}`)
                props.category = file
                try {
                    client.slashCommands.set(props.command.name, props)
                } catch (err) {
                    if (err) console.error(err)
                }
            })
        })
    })
})

const eventFiles = fs.readdirSync("./events").filter((file) => file.endsWith(".js"))
for (const file of eventFiles) {
    require(`./events/${file}`)(client)
}

client.botAdmin = (id) => {
    if (["263472056753061889","606022064792535070"].includes(id)) return true
    return false
}

client.on("ready", async() => {
    console.log("Connected!")
    client.user.setActivity(`Moderation Bot`)

    Sentry.init({
      dsn: process.env.SENTRY,
      tracesSampleRate: 1.0,
    })
})

//client.on("debug", console.log)

client.login(process.env.TOKEN)

client.on("error", (err) => console.error(err))

module.exports = { client }