const { Client, CommandInteraction, MessageEmbed, MessageActionRow, MessageButton, MessageCollector  } = require("discord.js");
const linkJson = require('../../link.json');
const Nodeactyl =  require('nodeactyl')
module.exports = {
    name: "usage",
    description: "Usage of your server",
    type: 'CHAT_INPUT',
    options: [
        {
            name: "serverid",
            type: "STRING",
            description: "The serverid to get usage from!",
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
if(!linkJson[interaction.user.id]) {
    interaction.deferReply({ ephemeral: false }).catch(() => {});
    return interaction.reply("You aren't connected to our panel please connect with:\n/link", );
}

var userApi = linkJson[interaction.user.id]["userapi"];
var hostname = client.config.panelurl;
interaction.deferReply({ ephemeral: false }).catch(() => {});
var serverId = args[0];

let client1 = new Nodeactyl.NodeactylClient(hostname, userApi);
var usage = new MessageEmbed()
.setTitle(`Usage`)
.setColor(`#F9914F`)
client1.getServerUsages(serverId).then(async (response) => {
    var ram = (response.resources.memory_bytes / 1000000);
    var ram2 = ram.toString()

    var myArr = ram2.split('.');
    var disk = (response.resources.disk_bytes / 1000000);
    var disk2 = disk.toString()

    var myArr2 = disk2.split('.');
    var rx = (response.resources.network_rx_bytes / 1000000);
    var rx2 = rx.toString()

    var myArr3 = rx2.split('.');
    
    var tx = (response.resources.network_tx_bytes / 1000000);
    var tx2 = tx.toString()

    var myArr4 = tx2.split(',');
    
    var cpu = response.resources.cpu_absolute
    
    if (response.current_state === "running"){
        var status = "<a:OnlineLoad:888484090628669460> Running"    
        const button = new MessageButton()
        .setCustomId("start")
        .setLabel("Start")
        .setStyle('SUCCESS')
        .setDisabled(true)
        const button2 = new MessageButton()
        .setCustomId("stop")                    
        .setStyle('PRIMARY')
        .setLabel("Stop")
        const button3 = new MessageButton()
        .setCustomId("kill")
        .setStyle('DANGER')
        .setLabel("Kill")
        const button4 = new MessageButton()
        .setCustomId("Restart")
        .setStyle("SECONDARY")
        .setLabel("restart")   
        const row = new MessageActionRow()
        .addComponents(button, button2, button3, button4 );
        usage.setDescription(`Hier is je usage van **${serverId}**\n${status}\n<:Ram:888667422758957096>: ${myArr[0]}mb\n<:cpu:888668229877239848>: ${cpu}%\nDisk: ${myArr2[0]}mb\nNetworkMB recieved:${myArr3}, NetworkMB verzonden:${myArr4}`)
        var messagee = await interaction.followUp({components: [row], embeds: [usage]});


    }
    if (response.current_state === "offline"){
        var status = "<a:OfflineLoad:888484093203996672> Offline"   
        const button = new MessageButton()
        .setCustomId("start")
        .setLabel("Start")
        .setStyle('SUCCESS')
        const button2 = new MessageButton()
        .setCustomId("stop")                    
        .setStyle('PRIMARY')
        .setLabel("Stop")
        .setDisabled(true)
        const button3 = new MessageButton()
        .setCustomId("kill")
        .setStyle('DANGER')
        .setLabel("Kill")
        .setDisabled(true)
        const button4 = new MessageButton()
        .setCustomId("Restart")
        .setStyle("SECONDARY")
        .setLabel("restart") 
        .setDisabled(true)  
        const row = new MessageActionRow()
        .addComponents(button, button2, button3, button4 );
        usage.setDescription(`Hier is je usage van **${serverId}**\n${status}\n<:Ram:888667422758957096>: ${myArr[0]}mb\n<:cpu:888668229877239848>: ${cpu}%\nDisk: ${myArr2[0]}mb\nNetworkMB recieved:${myArr3}, NetworkMB verzonden:${myArr4}`)
        var messagee = await interaction.followUp({components: [row], embeds: [usage]});

    }
    if (response.current_state === "starting"){
        var status = "<a:IdleLoad:888484092100870144> Starting"       
        const button = new MessageButton()
        .setCustomId("start")
        .setLabel("Start")
        .setStyle('SUCCESS')
        .setDisabled(true)
        const button2 = new MessageButton()
        .setCustomId("stop")                    
        .setStyle('PRIMARY')
        .setLabel("Stop")
        const button3 = new MessageButton()
        .setCustomId("kill")
        .setStyle('DANGER')
        .setLabel("Kill")
        const button4 = new MessageButton()
        .setCustomId("restart")
        .setStyle("SECONDARY")
        .setLabel("restart")   
        const row = new MessageActionRow()
        .addComponents(button, button2, button3, button4 );
        
        usage.setDescription(`Hier is je usage van **${serverId}**\n${status}\n<:Ram:888667422758957096>: ${myArr[0]}mb\n<:cpu:888668229877239848>: ${cpu}%\nDisk: ${myArr2[0]}mb\nNetworkMB recieved:${myArr3}, NetworkMB verzonden:${myArr4}`)
        var messagee = await interaction.followUp({components: [row], embeds: [usage]});

    }      
    const buttonx = new MessageButton()
    .setStyle('LINK')
    .setLabel("Server")
    .setURL("https://panel.corefire.nl/server/" + serverId)  
    const row1 = new MessageActionRow()
    .addComponents(buttonx)
    const collector = interaction.channel.createMessageComponentCollector({ componentType: 'BUTTON', time: 75000 });

    collector.on('collect', i => {
        i.deferUpdate();
        if (i.user.id === interaction.user.id) {
            if(i.customId === "restart"){
                client1.restartServer(serverId).then((response) => {
                    var embedd = new MessageEmbed()
                    .setTitle(`Restart`)
                    .setColor(`#F9914F`)
                    .setDescription(`You succesfully restarted the server!`)
                    interaction.editReply({embeds: [embedd], content: " ", components: [row1]});

                }).catch((error) => {
                    console.log(error);
            
                    var errorMessage = new MessageEmbed()
                        .setTitle(`Error`)
                        .setColor(`#F9914F`)
                        .setDescription(`Something is wrong!\nPossible errors: Invalid Api, Invalid Server code, Invalid hostname!`)
            
                    interaction.editReply({embeds: [errorMessage], content: " ", components: [row1]});
                });                        
            } else if(i.customId === "stop"){
                client1.stopServer(serverId).then((response) => {
                    var embedd = new MessageEmbed()
                    .setTitle(`Stopped`)
                    .setColor(`#F9914F`)
                    .setDescription(`You succesfully stopped the server!`)
                    interaction.editReply({embeds: [embedd], content: " ", components: [row1]});

                }).catch((error) => {
                    console.log(error);
            
                    var errorMessage = new MessageEmbed()
                        .setTitle(`Error`)
                        .setColor(`#F9914F`)
                        .setDescription(`Something is wrong!\nPossible errors: Invalid Api, Invalid Server code, Invalid hostname!`)
            
                    interaction.editReply({embeds: [errorMessage], content: " ", components: [row1]});
                });
            }else if(i.customId === "start"){
                client1.startServer(serverId).then((response) => {
                    var embedd = new MessageEmbed()
                    .setTitle(`Start`)
                    .setColor(`#F9914F`)
                    .setDescription(`You succesfully started the server!`)
                    interaction.editReply({embeds: [embedd], content: " ", components: [row1]});

                }).catch((error) => {
                    console.log(error);
            
                    var errorMessage = new MessageEmbed()
                        .setTitle(`Error`)
                        .setColor(`#F9914F`)
                        .setDescription(`Something is wrong!\nPossible errors: Invalid Api, Invalid Server code, Invalid hostname!`)
            
                    interaction.editReply({embeds: [errorMessage], content: " ", components: [row1]});
                });
            }else if(i.customId === "kill"){
                client1.stopServer(serverId).then((response) => {
                    var embedd = new MessageEmbed()
                    .setTitle(`Stopped`)
                    .setColor(`#F9914F`)
                    .setDescription(`You succesfully stopped the server!`)
                    interaction.editReply({embeds: [embedd], content: " ", components: [row1]});

                }).catch((error) => {
                    console.log(error);
            
                    var errorMessage = new MessageEmbed()
                        .setTitle(`Error`)
                        .setColor(`#F9914F`)
                        .setDescription(`Something is wrong!\nPossible errors: Invalid Api, Invalid Server code, Invalid hostname!`)
            
                    interaction.editReply({embeds: [errorMessage], content: " ", components: [row1]});
                });
                
            }


        } else {
            i.reply({ content: `These buttons aren't for you!`, ephemeral: true }).catch(() => {});
        }
    });
    
    collector.on('end', collected => {

        interaction.editReply({content: "Expired",  components: [row1]})
    });

}).catch((error) => {
    console.log(error)
})
    }
}