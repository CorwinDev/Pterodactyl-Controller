const { Client, CommandInteraction, MessageEmbed } = require("discord.js");
const linkJson = require('../../link.json');
const Nodeactyl = require('nodeactyl')
module.exports = {
    name: "kill",
    description: "Kill your server",
    type: 'CHAT_INPUT',
    options: [
        {
            name: "serverid",
            type: "STRING",
            description: "The serverid to kill",
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
        await interaction.deferReply({ ephemeral: false }).catch(() => { });

        var serverId = args[0];
        var helpEmbed = new MessageEmbed()
            .setTitle(`Example - Kill`)
            .setColor(client.config.embed.default)
            .setDescription(`/kill <ServerId>`)

        if (!serverId) return interaction.followUp({ embeds: [helpEmbed] });

        if (!linkJson[interaction.user.id]) return client.error("notconnected", interaction)


        var userApi = linkJson[interaction.user.id]["userapi"];
        var hostname = client.config.panelurl
 
        let client1 = new Nodeactyl.NodeactylClient(hostname, userApi);

        client1.killServer(serverId).then((response) => {
            var embed = new MessageEmbed()
                .setTitle(`Kill`)
                .setColor(client.config.embed.default)
                .setDescription(`You succesfully Killed the server!`)

            interaction.followUp({ embeds: [embed] });
        }).catch((error) => {

            client.error(error, interaction)

        });


    }
}