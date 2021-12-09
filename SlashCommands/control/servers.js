


const { Client, CommandInteraction, MessageEmbed, MessageActionRow, MessageSelectMenu } = require("discord.js");
const linkJson = require('../../link.json');
const fs = require('fs');
const Nodeactyl =  require('nodeactyl')
module.exports = {
    name: "servers",
    description: "Get an list of all your servers",
    type: 'CHAT_INPUT',

    /**
     *
     * @param {Client} client
     * @param {CommandInteraction} interaction
     * @param {String[]} args
     */
    run: async (client, interaction, args) => {
        await interaction.deferReply({ ephemeral: false }).catch(() => {});

var d = new Date();
var Month = d.getMonth() + 1;
var Day = d.getDate();
var Year = d.getFullYear();
var datetime = `${Day}/${Month}/${Year}`;


if(!linkJson[interaction.user.id]) return interaction.followUp("You aren't connected to our panel please connect with:\n/link");

var userApi = linkJson[interaction.user.id]["userapi"];
var hostname = client.config.panelurl;

let client1 = new Nodeactyl.NodeactylClient(hostname, userApi);

client1.getAllServers().then((response1) => {

    // console.log(response1);

    client1.getServerPage(1).then((response2) => {
const menu =  new MessageSelectMenu()
.setCustomId('Servers')
.setPlaceholder('Nothing selected')
.setMinValues(1)
.setMaxValues(1)


  
        var countServers = response1["meta"]["pagination"]["total"];
        var allServers = "**__Your servers:__**\n\n";
        var embed = new MessageEmbed()
            .setTitle(`**${interaction.user.username} - All servers**`)
            .setColor(`#F9914F`)
            .setFooter("Below you can choose a server to directly control")

        for (let i = 0; i < response2.length; i++) {
            if (response2[i]["attributes"]["server_owner"] == true) { // configure if he is owner or not (OWNER)

                var you_are = "Owner";
            
            } else if (response2[i]["attributes"]["server_owner"] == false){// configure if he is owner or not (SUBUSER)

                var you_are = "SubUser";

            }

            if(response2[i]["attributes"]["is_suspended"] == true) { // Check if server is suspended or not (SUSPENDED)
                var is_suspended = "Suspended"
            } else if (response2[i]["attributes"]["is_suspended"] == false) { // Check if server is suspended or not (ACTIVE)
                var is_suspended = "Active"
            }

            menu.addOptions([	
            {
                label: response2[i]["attributes"]["name"],
                description: 'This is a description',
                value: response2[i]["attributes"]["identifier"],
            }
            ,])
            var addServer = `*Je bent:* ${you_are}\n*Status:* ${is_suspended}\n*Link:* ${hostname}/server/${response2[i]["attributes"]["identifier"]}\n\n`;
            embed.addField(`*Server:* ${response2[i]["attributes"]["name"]}`, addServer, true)
            allServers += `${addServer}\n`
            
        }
        const row = new MessageActionRow()
        .addComponents(menu);

            interaction.followUp({embeds: [embed], components: [row]});

    }).catch((error) => {
        console.log(error);

        var errorMessage = new MessageEmbed()
            .setTitle(`Error`)
            .setColor(`#F9914F`)
            .setDescription(`There is something wrong\nMaybe your apikey?`)


            interaction.followUp({embeds: [errorMessage]});
    });        

 }).catch((error) => {
    console.log(error);

    var errorMessage = new MessageEmbed()
        .setTitle(`Error`)
        .setColor(`#F9914F`)
        .setDescription(`Er is iets mis!`)

        interaction.followUp({embeds: [errorMessage]});

 });



}
}