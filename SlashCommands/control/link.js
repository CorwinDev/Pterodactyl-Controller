const { Client, CommandInteraction, MessageEmbed } = require("discord.js");
const linkJson = require('../../link.json');
const fs = require('fs');
const Nodeactyl = require('nodeactyl')
module.exports = {
    name: "link",
    description: "Link your api code with our panel",
    type: 'CHAT_INPUT',
    options: [
        {
            name: "apikey",
            type: "STRING",
            description: "The radio you want to play",
            required: true
        }
    ],
    /**
     *
     * @param {Client} client
     * @param {CommandInteraction} interaction
     * @param {String[]} args
     */
    run: async (client, interaction, args) => {
        await interaction.deferReply({ ephemeral: true }).catch(() => { });
        var userID = interaction.user.id;
        var userApi = args[0];

        var helpEmbed = new MessageEmbed()
            .setTitle(`Example - /link`)
            .setColor(client.config.embed.default)
            .setDescription(`/link <Api key>`)

        if (!userApi) return interaction.followUp({ embeds: [helpEmbed] });

        if (!linkJson[userID]) {
            linkJson[userID] = {
                userapi: false
            }
        }

        linkJson[userID].userapi = userApi;
        var hostname = client.config.panelurl
        let client1 = new Nodeactyl.NodeactylClient(hostname, userApi);
        // console.log(JSON.stringify(linkJson));
        client1.getAccountDetails().then((response1) => {
            fs.writeFile("./link.json", JSON.stringify(linkJson), function (err) {
                if (err) {

                    var errorEmbed = new MessageEmbed()
                        .setTitle(`Link Error!`)
                        .setDescription(`There is something wrong, please contact the staff team`)
                        .setColor(`#F9914F`)
                    interaction.followUp({ embeds: [errorEmbed] });

                    client.hook.warn(err)
                }
                if (!err) {
                    var successEmbed = new MessageEmbed()
                        .setTitle(`Account linked!`)
                        .setDescription(`You are connect with user: ${response1.username}`)
                        .setColor(`#F9914F`)
                    interaction.followUp({ embeds: [successEmbed] });
                }
            });
        }).catch((error) => {

            client.error(error, interaction)

        })

    }
}