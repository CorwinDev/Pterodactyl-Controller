const { MessageEmbed } = require("discord.js")
const client = require("./index.js")
module.exports = function (error, interaction, edit) {

    if (error === 403) {
        var errorMessage = new MessageEmbed()
            .setTitle(`Error`)
            .setColor(client.config.embed.error)
            .setDescription("Something is wrong!\nErrors: ```403(Not found error)\nThis is likely because you deleted the apikey\nOr wrong apikey```")

        if (edit) {
            interaction.editReply({ embeds: [errorMessage] })
        } else {
            interaction.followUp({ embeds: [errorMessage] });

        }

        client.hook.error("Error: " + error + "\nUser: " + interaction.user.username + "\nCommandName: " + interaction.commandName)
    } else if (error === "notconnected") {
        var errorMessage = new MessageEmbed()
            .setTitle(`Error`)
            .setColor(client.config.embed.error)
            .setDescription("You aren't connected to our panel please connect with:\n/link")

        if (edit) {
            interaction.editReply({ embeds: [errorMessage] })
        } else {
            interaction.followUp({ embeds: [errorMessage] });

        }
    } else if (error === "cmdnotexist") {
        var errorMessage = new MessageEmbed()
            .setTitle(`Error`)
            .setColor(client.config.embed.error)
            .setDescription("This command doens't exist! Please contact the bot owner")


        if (edit) {
            interaction.editReply({ embeds: [errorMessage] })
        } else {
            interaction.followUp({ embeds: [errorMessage] });

        }
        client.hook.error("Error: " + error + "\nUser: " + interaction.user.username + "\nCommandName: " + interaction.commandName)

    } else {
        var errorMessage = new MessageEmbed()
            .setTitle(`Error`)
            .setColor(client.config.embed.error)
            .setDescription("Something is wrong!\nPossible errors: ```Invalid Api\n\nInvalid Server code\n\nInvalid hostname!```")


        if (edit) {
            interaction.editReply({ embeds: [errorMessage] })
        } else {
            interaction.followUp({ embeds: [errorMessage] });

        }
        client.hook.error("Error: " + error + "\nUser: " + interaction.user.username + "\nCommandName: " + interaction.commandName)
    }

}
