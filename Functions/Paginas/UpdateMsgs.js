
const { EmbedBuilder, ActionRowBuilder, StringSelectMenuBuilder } = require("discord.js")
const { JsonDatabase } = require("wio.db")
const dbProducts = new JsonDatabase({ databasePath: "./databases/dbProducts.json" })
const dbConfigs = new JsonDatabase({ databasePath: "./databases/dbConfigs.json" })
const dbe = new JsonDatabase({ databasePath: "./databases/emojis-globais.json" })
const dbPanels = new JsonDatabase({ databasePath: "./databases/dbPanels.json" });

const dinheiroEmoji = `<:dinheiro:${dbe.get('dinheiro')}>`;
const caixaEmoji = `<:caixa:${dbe.get('caixa')}>`;
const carrinhoEmoji = `<:carrinho:${dbe.get('carrinho')}>`;
const estrelaEmoji = `<a:estrela:${dbe.get('estrela')}>`;

let sharedUpdateQueue = {
    msgUpdates: new Set(),
    selectUpdates: new Set(),
};
let sharedDebounceTimer;

async function UpdateMsgs(client, productId) {
    sharedUpdateQueue.msgUpdates.add(productId);
    debounceSyncUpdate(client);
}

async function UpdateSelects(client, produtos) {
    sharedUpdateQueue.selectUpdates.add(produtos);
    debounceSyncUpdate(client);
}

function debounceSyncUpdate(client) {
    if (!sharedDebounceTimer) {
        sharedDebounceTimer = setTimeout(async () => {
            try {
                const productUpdates = Array.from(sharedUpdateQueue.msgUpdates);
                const selectUpdates = Array.from(sharedUpdateQueue.selectUpdates);

                sharedUpdateQueue.msgUpdates.clear();
                sharedUpdateQueue.selectUpdates.clear();
                sharedDebounceTimer = null;

                const updatePromises = [];
                
                if (productUpdates.length > 0) {
                    updatePromises.push(batchUpdateMessages(client, productUpdates));
                }
                
                if (selectUpdates.length > 0) {
                    updatePromises.push(updatePanels(client, selectUpdates));
                }
                
                if (updatePromises.length > 0) {
                    await Promise.all(updatePromises);
                }
            } catch (error) {
                console.error("Erro no processamento de atualizações em lote:", error);
            }
        }, 5000);
    }
}

async function batchUpdateMessages(client, productIds) {
    try {
        let productsToUpdate;

        if (!productIds || productIds.length === 0 || (productIds.length === 1 && productIds[0] === null)) {
            productsToUpdate = await dbProducts.all();
        } else {
            productsToUpdate = await dbProducts.all().filter(product => productIds.includes(product.ID));
        }

        for (const productData of productsToUpdate) {
            if (!productData || !productData.data) continue;

            const messageLocation = productData.data.msgLocalization || {};
            if (!messageLocation.channelId || !messageLocation.messageId) continue;

            const productColor = productData.data.color || "none";
            const productThumbnailUrl = productData.data.thumbUrl || "none";
            const productBannerUrl = productData.data.bannerUrl || "none";
            const productStock = Array.isArray(productData.data.stock) ? productData.data.stock : [];
            const productPrice = productData.data.price || "0";
            const productName = productData.data.name || "Produto sem nome";
            const productDescription = productData.data.description || "Sem descrição";

            const defaultThumbnail = await dbConfigs.get(`vendas.images.thumbUrl`) || "none";
            const defaultBanner = await dbConfigs.get(`vendas.images.bannerUrl`) || "none";
            const defaultEmbedColor = await dbConfigs.get(`vendas.embeds.color`) || "#460580";
            const footerText = await dbConfigs.get(`vendas.footer`) || `${client.user.username} - Todos os direitos reservados.`;

            const productEmoji = productData.data.emoji || estrelaEmoji;
            const productEmbed = new EmbedBuilder()
                .setTitle(`${productEmoji} ${productName}`)
                .setDescription(`\n${productDescription}\n\n${dinheiroEmoji} **Valor:** \`${Number(productPrice).toLocaleString('pt-BR', { style: 'currency', currency: 'BRL' })}\`\n${caixaEmoji} **Estoque:** \`${productStock.length}\` unidades\n\n${carrinhoEmoji} *Selecione uma opção abaixo para comprar.*`)
                .setColor(productColor !== "none" ? productColor : defaultEmbedColor !== "none" ? defaultEmbedColor : "#460580")
                .setFooter({ text: footerText, iconURL: client.user.avatarURL() });

            if (productThumbnailUrl !== "none" && productThumbnailUrl) {
                productEmbed.setThumbnail(productThumbnailUrl);
            } else if (defaultThumbnail !== "none" && defaultThumbnail) {
                productEmbed.setThumbnail(defaultThumbnail);
            }

            if (productBannerUrl !== "none" && productBannerUrl) {
                productEmbed.setImage(productBannerUrl);
            } else if (defaultBanner !== "none" && defaultBanner) {
                productEmbed.setImage(defaultBanner);
            }

            try {
                let messageChannel = await client.channels.fetch(messageLocation.channelId);
                let targetMessage = await messageChannel.messages.fetch(messageLocation.messageId);
                await targetMessage.edit({ embeds: [productEmbed] });
            } catch (msgError) {
                console.error(`Erro ao atualizar mensagem para o produto ${productData.ID}:`, msgError.message);
            }
        }
    } catch (error) {
        console.error("Erro ao processar atualização em lote de mensagens:", error);
    }
}

async function updatePanels(client, uniqueProdutos) {
    try {
        let allPanels;

        if (!uniqueProdutos || uniqueProdutos.length === 0 || (uniqueProdutos.length === 1 && uniqueProdutos[0] === null)) {
            allPanels = dbPanels.all();
        } else {
            allPanels = dbPanels.all().filter(panel => {
                return panel.data && panel.data.products && 
                       Object.keys(panel.data.products).some(prod => uniqueProdutos.includes(prod));
            });
        }

        if (!allPanels || allPanels.length === 0) return;

        for (let i = 0; i < allPanels.length; i++) {
            const panel = allPanels[i];
            if (!panel || !panel.data || !panel.data.products || !panel.ID) continue;
            if (!panel.data.msgLocalization || !panel.data.msgLocalization.channelId || !panel.data.msgLocalization.messageId) continue;
            
            const productIds = Object.keys(panel.data.products);
            let allOptions = [];

            for (const pId of productIds) {
                const productDetails = dbProducts.get(pId);
                if (!productDetails) continue;
                
                const stockLength = Array.isArray(productDetails.stock) ? productDetails.stock.length : 0;
                const emojiP = await dbPanels.get(`${panel.ID}.products.${pId}.emoji`) || "🛒";
                
                allOptions.push({
                    label: productDetails.name || `Produto ${pId}`,
                    emoji: emojiP,
                    description: `💸 R$ ${productDetails.price} | 📦 Estoque: ${stockLength}`,
                    value: pId
                });
            }

            if (allOptions.length === 0) continue;
            if (allOptions.length > 25) allOptions = allOptions.slice(0, 25);

            const placeholderP = await dbPanels.get(`${panel.ID}.selectMenu.placeholder`) || "Selecione um produto";
            const titleP = panel.data.embed?.title || "Painel de Produtos";
            const descriptionP = panel.data.embed?.description || "Selecione um produto abaixo";
            const colorP = panel.data.embed?.color || "none";
            const bannerP = panel.data.embed?.bannerUrl || "none";
            const thumbP = panel.data.embed?.thumbUrl || "none";
            const footerP = panel.data.embed?.footer || "none";
            const defaultEmbedColor = await dbConfigs.get(`vendas.embeds.color`) || "#460580";

            const rowPanel = new ActionRowBuilder()
                .addComponents(
                    new StringSelectMenuBuilder()
                        .setCustomId(panel.ID)
                        .setPlaceholder(placeholderP)
                        .addOptions(allOptions)
                );

            const embedPanel = new EmbedBuilder()
                .setTitle(`${estrelaEmoji} ${titleP}`)
                .setDescription(`\n${descriptionP}\n\n${carrinhoEmoji} *Escolha uma das opções no menu abaixo.*`)
                .setColor(colorP !== "none" ? colorP : defaultEmbedColor !== "none" ? defaultEmbedColor : "#460580")
                .setFooter({ text: footerP !== "none" ? footerP : `${client.user.username} - Todos os direitos reservados.`, iconURL: client.user.avatarURL() });

            if (thumbP !== "none" && thumbP) embedPanel.setThumbnail(thumbP);
            if (bannerP !== "none" && bannerP) embedPanel.setImage(bannerP);

            try {
                let channel = await client.channels.fetch(panel.data.msgLocalization.channelId);
                let message = await channel.messages.fetch(panel.data.msgLocalization.messageId);
                await message.edit({ embeds: [embedPanel], components: [rowPanel] });
            } catch (msgError) {
                console.error(`Erro ao atualizar mensagem para o painel ${panel.ID}:`, msgError.message);
            }
        }
    } catch (error) {
        console.error("Erro ao processar atualização de painéis:", error);
    }
}

module.exports = {
    UpdateMsgs,
    UpdateSelects
}
