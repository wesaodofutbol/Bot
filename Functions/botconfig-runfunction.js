const { MessageFlags, EmbedBuilder, ActionRowBuilder, ButtonBuilder, StringSelectMenuBuilder, StringSelectMenuOptionBuilder, ModalBuilder, TextInputBuilder, ActivityType, ChannelSelectMenuBuilder, RoleSelectMenuBuilder, ChannelType, AttachmentBuilder } = require("discord.js")
const axios = require("axios")
const url = require("node:url")

const { JsonDatabase } = require("wio.db")
const dbConfigs = new JsonDatabase({ databasePath: "./databases/dbConfigs.json" })
const dbe = new JsonDatabase({ databasePath: "./databases/emojis-globais.json" });


async function StartAll(client, interaction) {
    const logo = new AttachmentBuilder('./assets/logo_sk.jpg', { name: 'logo_sk.jpg' });
    const configEmoji = `<:config:${dbe.get('config')}>`;
    const estrelaEmoji = `<a:estrela:${dbe.get('estrela')}>`;

    const embed = new EmbedBuilder()
        .setTitle(`${estrelaEmoji} Painel de Controle - SK Store`)
        .setDescription(`Olá **${interaction.user.username}**, seja bem-vindo ao centro de comando!\n\n> *Gerencie todas as funcionalidades do seu bot de forma simples e rápida através dos botões abaixo.*`)
        .addFields(
            { name: `🚀 Vendas & Produtos`, value: `Configure preços, estoque e painéis.`, inline: true },
            { name: `🎫 Atendimento`, value: `Gerencie tickets e suporte ao cliente.`, inline: true },
            { name: `⚙️ Sistema`, value: `Personalize o bot e veja rendimentos.`, inline: true }
        )
        .setColor(dbConfigs.get(`color`) || "#ff0000")
        .setThumbnail('attachment://logo_sk.jpg')
        .setFooter({ text: 'SK Store - Qualidade e Segurança', iconURL: 'attachment://logo_sk.jpg' })
        .setTimestamp();

    const components = new ActionRowBuilder().addComponents(
        new ButtonBuilder().setCustomId(`configVendas`).setLabel(`Vendas`).setEmoji(`<:cart:1371936077559894237>`).setStyle(1),
        new ButtonBuilder().setCustomId(`configticket`).setLabel(`Ticket`).setEmoji(`<:1225477547630788648:1289647471965900843>`).setStyle(1),
        new ButtonBuilder().setCustomId(`configBemvindo`).setLabel(`Boas vindas`).setEmoji(`<:bell:1334638906544492645>`).setStyle(1),
        new ButtonBuilder().setCustomId(`configAutomaticas`).setLabel(`Ações Automáticas`).setEmoji(`<:mais:1334665468736438313>`).setStyle(2),
    );

    const components2 = new ActionRowBuilder().addComponents(
        new ButtonBuilder().setCustomId(`configbot`).setLabel(`Personalização`).setEmoji(`<:cor:1334663672949112885>`).setStyle(1),
        new ButtonBuilder().setCustomId(`rendimentosBot`).setLabel(`Rendimentos`).setEmoji(`<:banco:1334665466425114705>`).setStyle(3),
        new ButtonBuilder().setCustomId(`uploadEmojisSK`).setLabel(`Instalar Emojis`).setEmoji(`✨`).setStyle(2),
        new ButtonBuilder().setCustomId(`configModeracao`).setLabel(`Moderação`).setEmoji(`<:1289362293456633942:1364987313750282251>`).setStyle(4),
    );

    const responseData = {
        components: [components, components2],
        files: [logo],
        embeds: [embed]
    };

    if (interaction.isButton() || interaction.isSelectMenu()) {
        await interaction.update(responseData);
    } else {
        await interaction.editReply(responseData);
    }
}

async function botConfigTickets(client, interaction) {
    const estrelaEmoji = `<a:estrela:${dbe.get('estrela')}>`;
    
    interaction.update({
        files: [],
        embeds: [
            new EmbedBuilder()
                .setTitle(`${estrelaEmoji} Configuração de Sistemas`)
                .setDescription(`Selecione uma das opções abaixo para configurar os sistemas automáticos do seu bot.`)
                .addFields(
                    { name: `🎫 Tickets`, value: `Configure o sistema de suporte.`, inline: true },
                    { name: `💡 Sugestões`, value: `Gerencie o canal de sugestões.`, inline: true }
                )
                .setColor(dbConfigs.get(`color`) || "#ff0000")
                .setFooter({ text: 'SK Store - Qualidade e Segurança', iconURL: client.user.avatarURL() })
        ], components: [
            new ActionRowBuilder()
                .addComponents(
                    new ButtonBuilder()
                        .setStyle(2)
                        .setCustomId(`configticket`)
                        .setLabel(`Configurar Ticket`)
                        .setEmoji(`<:1166960895201656852:1239447582464282674>`),
                    new ButtonBuilder()
                        .setStyle(2)
                        .setCustomId(`configsugestsistem`)
                        .setLabel(`Configurar Sistema Sugestão`)
                        .setEmoji(`<:comentario:1245612394634543134>`)
                ),
            new ActionRowBuilder()
                .addComponents(
                    new ButtonBuilder().setCustomId(`voltarconfiginicio`).setLabel(`Voltar ao Início`).setEmoji(`<:voltar:1365849508059287633>`).setStyle(2)
                )

        ]
    })
}

module.exports = {
    botConfigTickets,
    StartAll
};
