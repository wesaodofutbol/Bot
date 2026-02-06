const { MessageFlags, EmbedBuilder, ActionRowBuilder, ButtonBuilder, ModalBuilder, TextInputBuilder, TextInputStyle } = require("discord.js");
const { SlashCommandBuilder } = require("@discordjs/builders");
const moment = require("moment");
const { JsonDatabase } = require("wio.db");
const { getCache } = require("../../../Functions/connect_api");
const dbConfigs = new JsonDatabase({ databasePath: "./databases/dbConfigs.json" });
const dbProducts = new JsonDatabase({ databasePath: "./databases/dbProducts.json" });
const dbPerms = new JsonDatabase({ databasePath: "./databases/dbPermissions.json" });

const dbe = new JsonDatabase({ databasePath: "./databases/emojis-globais.json" });

module.exports = {
    data: new SlashCommandBuilder()
        .setName("criar-produto")
        .setDescription("Cadastre um novo produto!"),

    async execute(interaction, client) {
        let dono = getCache(null, "owner")

        const isInDb = (await dbPerms.get("vendas"))?.includes(interaction.user.id);
        const isOwner = interaction.user.id === dono;

        if (!isInDb && !isOwner) {
            await interaction.reply({
                content: `❌ | Você não tem permissão para usar este comando!`,
                flags: MessageFlags.Ephemeral
            });
            return;
        }

        // Criar modal para inserir o ID do produto
        const modal = new ModalBuilder()
            .setCustomId('criarProdutoModal')
            .setTitle('Criar Novo Produto');

        const idInput = new TextInputBuilder()
            .setCustomId('produtoIdInput')
            .setLabel('ID do Produto')
            .setPlaceholder('Ex: vip_mensal, produto1, gold_pack')
            .setStyle(TextInputStyle.Short)
            .setMaxLength(25)
            .setRequired(true);

        const nomeInput = new TextInputBuilder()
            .setCustomId('produtoNomeInput')
            .setLabel('Nome do Produto')
            .setPlaceholder('Ex: VIP Mensal, Pacote Gold')
            .setStyle(TextInputStyle.Short)
            .setMaxLength(100)
            .setRequired(false);

        const precoInput = new TextInputBuilder()
            .setCustomId('produtoPrecoInput')
            .setLabel('Preço do Produto')
            .setPlaceholder('Ex: 10.00, 25.50, 100')
            .setStyle(TextInputStyle.Short)
            .setMaxLength(15)
            .setRequired(false);

        const descricaoInput = new TextInputBuilder()
            .setCustomId('produtoDescricaoInput')
            .setLabel('Descrição do Produto')
            .setPlaceholder('Descreva seu produto aqui...')
            .setStyle(TextInputStyle.Paragraph)
            .setMaxLength(1000)
            .setRequired(false);

        const firstRow = new ActionRowBuilder().addComponents(idInput);
        const secondRow = new ActionRowBuilder().addComponents(nomeInput);
        const thirdRow = new ActionRowBuilder().addComponents(precoInput);
        const fourthRow = new ActionRowBuilder().addComponents(descricaoInput);

        modal.addComponents(firstRow, secondRow, thirdRow, fourthRow);

        await interaction.showModal(modal);
    },
};
