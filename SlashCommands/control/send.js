
const discord = require("discord.js");
const { ServerBuilder } = require("nodeactyl");
const Nodeactyl = require('nodeactyl');
module.exports = {
    name: "send",
    description: "Send an command to your server",
    type: 'CHAT_INPUT',
    options: [
        {
            name: "serverid",
            type: "STRING",
            description: "The serverID to send an command to",
            required: true
        },
        {
            name: "cmd",
            type: "STRING",
            description: "The command to send",
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
        await interaction.deferReply({ ephemeral: false }).catch(() => {});


    const linkJson = require('../../link.json');
    
    var serverId = args[0];
    const Command = args[1]

    var helpEmbed = new discord.MessageEmbed()
        .setTitle(`Voorbeeld - Send`)
        .setColor("#F9914F")
        .setDescription(`-send <ServerId> <Command>`)

    if(!serverId) return interaction.followUp(helpEmbed);
    if(!Command) return interaction.followUp(helpEmbed);
    
    if(!linkJson[interaction.user.id]) return interaction.followUp("Je moet je account even koppelen aan de bot!\n-link");



    var userApi = linkJson[interaction.user.id]["userapi"];
    var hostname = client.config.panelurl;

    let client1 = new Nodeactyl.NodeactylClient(hostname, userApi);

    client1.sendServerCommand(serverId, Command).then((response) => {
        console.log(response)

        interaction.followUp(`Je heb succesvol een command verzonden naar: **${serverId}**\nCommand: ${Command}`);

    }).catch((error) => {
        console.log(error);

        var errorMessage = new discord.MessageEmbed()
            .setTitle(`Error`)
            .setColor(`#F9914F`)
            .setDescription(`Er is iets mis!`)

            interaction.followUp({embeds:[errorMessage]});
    });


}
}