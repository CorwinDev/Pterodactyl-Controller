const client = require("../index");
const { Webhook } = require('discord-webhook-node');

client.on("ready", () => {
    console.log(`${client.user.tag} is up and ready to go!`)
    const hook = new Webhook(client.config.Webhook);

    client.hook = hook

    hook.setUsername(client.user.username)
    hook.setAvatar(client.user.avatarURL)
    hook.info("Started")
});
