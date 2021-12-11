const { Client, CommandInteraction, MessageEmbed } = require("discord.js");
const linkJson = require('../../link.json');
const Nodeactyl = require('nodeactyl')
module.exports = {
    name: "start",
    description: "Start your server",
    type: 'CHAT_INPUT',
    options: [
        {
            name: "serverid",
            type: "STRING",
            description: "The serverid to start",
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
            .setTitle(`Example - Start`)
            .setColor("#F9914F")
            .setDescription(`/start <ServerId>`)

        if (!serverId) return interaction.followUp({ embeds: [helpEmbed] });

        if (!linkJson[interaction.user.id]) return interaction.followUp("You have to link your account to the panel.\n!link");

        var userApi = linkJson[interaction.user.id]["userapi"];
        var hostname = client.config.panelurl

        let client1 = new Nodeactyl.NodeactylClient(hostname, userApi);

        client1.startServer(serverId).then((response) => {
            var errorMessage = new MessageEmbed()
                .setTitle(`Start`)
                .setColor(`#F9914F`)
                .setDescription(`You succesfully started the server!`)

            interaction.followUp({ embeds: [errorMessage] });
        }).catch((error) => {


            var errorMessage = new MessageEmbed()
                .setTitle(`Error`)
                .setColor(`#F9914F`)
                .setDescription(`Something is wrong!\nPossible errors: Invalid Api, Invalid Server code, Invalid hostname!`)

            interaction.followUp({ embeds: [errorMessage] });
        });


    }
}