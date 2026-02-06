const { MessageFlags, EmbedBuilder, ActionRowBuilder, ButtonBuilder, ModalBuilder, TextInputBuilder, AttachmentBuilder, ChannelSelectMenuBuilder, ChannelType, RoleSelectMenuBuilder, ActivityType, TextInputStyle, InteractionType, StringSelectMenuBuilder } = require("discord.js")
const { JsonDatabase } = require("wio.db")
const { dbMessageAuto } = require("../../../databases/autoMessages")

const dbEmojis = new JsonDatabase({ databasePath: "./databases/emojis.json" })
const dbConfigs = new JsonDatabase({ databasePath: "./databases/dbConfigs.json" })
const axios = require("axios")
const { MercadoPagoConfig, PaymentRefund } = require("mercadopago")
const dbPerms = new JsonDatabase({ databasePath: "./databases/dbPermissions.json" })
const dbPurchases = new JsonDatabase({ databasePath: "./databases/dbPurchases.json" })
const Estatisticas = require("../../../Functions/estatisticas");

const { writeFile, unlink } = require("node:fs")
const moment = require("moment")
const { getCache } = require("../../../Functions/connect_api")
const { botConfigTickets, StartAll } = require("../../../Functions/botconfig-runfunction")
const { ConfigPayments, PainelVendasMain, mpMethod, togglePixMP, ModalMP, SaldoPayment, toggleBalance, depositBonus, minimumDeposit, semiAutoMethod, toggleSemiAuto, changePixModal, changeQrCodeModal, configChannelsMain, SelectChannelSet, toggleNewSales, changeTerms, buttonDuvidas, SkWalletMethod, toggleSkWallet } = require("../../../Functions/Paginas/BotConfig")
const e = require("express")
const { UpdateMsgs, UpdateSelects } = require("../../../Functions/Paginas/UpdateMsgs")
const { PageCompras, PainelCompras } = require("../../../Functions/e-sales/TransacoesPage")
const dbProducts = new JsonDatabase({ databasePath: "./databases/dbProducts.json" })
const dbProfiles = new JsonDatabase({ databasePath: "./databases/dbProfiles.json" })
const dbOpenedCarts = new JsonDatabase({ databasePath: "./databases/dbOpenedCarts.json" })
const lockChannelSystem = require('../eventsFunctions/lockUnlock');
const { PageNubank } = require("../../../Functions/Pagamentos/NubankPage")
const { connectIMAP, disconnectIMAP } = require("../../../Functions/Pagamentos/Nubank")
const { createPixCharge, generateQRCodeBuffer } = require("../../../Functions/Pagamentos/SkWallet")


const Imap = require('imap');

const dbe = new JsonDatabase({ databasePath: "./databases/emojis-globais.json" });

module.exports = {
    name: "interactionCreate",
    async execute(interaction, client) {
        const colorC = dbConfigs.get(`vendas.embeds.color`)
        const buttonId = interaction.customId;
        const dinheiroEmoji = `<:dinheiro:${dbe.get('dinheiro')}>`;
        const caixaEmoji = `<:caixa:${dbe.get('caixa')}>`;
        const userEmoji = `<:user:${dbe.get('user')}>`;
        const estrelaEmoji = `<a:estrela:${dbe.get('estrela')}>`;
        const calendarioEmoji = `<:calendario:${dbe.get('calendario')}>`;
        const umEmoji = `<:um:${dbe.get('um')}>`;
        const doisEmoji = `<:dois:${dbe.get('dois')}>`;
        const tresEmoji = `<:tres:${dbe.get('tres')}>`;
        const quatroEmoji = `<:quatro:${dbe.get('quatro')}>`;
        const cincoEmoji = `<:cinco:${dbe.get('cinco')}>`;
        const seisEmoji = `<:seis:${dbe.get('seis')}>`;
        const seteEmoji = `<:sete:${dbe.get('sete')}>`;
        const oitoEmoji = `<:oito:${dbe.get('oito')}>`;
        const desligadoEmoji = `<:desligado:${dbe.get('desligado')}>`;
        const ligadoEmoji = `<:ligado:${dbe.get('ligado')}>`;
        const configEmoji = `<:config:${dbe.get('config')}>`;
        const saco_dinheiroEmoji = `<:saco_dinheiro:${dbe.get('saco_dinheiro')}>`;
        const mensagem = `<:mensagem:${dbe.get('mensagem')}>`;
        const suporteEmoji = `<:suporte:${dbe.get('suporte')}>`;
        const editarEmoji = `<:editar:${dbe.get('editar')}>`;
        const corEmoji = `<:cor:${dbe.get('cor')}>`;
        const imagemEmoji = `<:imagem:${dbe.get('imagem')}>`;
        const lupaEmoji = `<:lupa:${dbe.get('lupa')}>`;
        const modalEmoji = `<:modal:${dbe.get('modal')}>`;
        const docEmoji = `<:doc:${dbe.get('doc')}>`;
        const loadingEmoji = `<a:loading:${dbe.get('loading')}>`;
        const lixoEmoji = `<:lixo:${dbe.get('lixo')}>`;
        const carrinhoEmoji = `<:carrinho:${dbe.get('carrinho')}>`;
        const cupomEmoji = `<:cupom:${dbe.get('cupom')}>`;
        const voltarEmoji = `<:voltar:${dbe.get('voltar')}>`;
        const sendEmoji = `<:send:${dbe.get('send')}>`;
        const desligado = `<:desligado:${dbe.get('desligado')}>`;
        const ligado = `<:ligado:${dbe.get('ligado')}>`;
        const config = `<:config:${dbe.get('config')}>`;
        const saco_dinheiro = `<:saco_dinheiro:${dbe.get('saco_dinheiro')}>`;
        const suporte = `<:suporte:${dbe.get('suporte')}>`;
        const user = `<:user:${dbe.get('user')}>`;
        const editar = `<:editar:${dbe.get('editar')}>`;
        const cor = `<:cor:${dbe.get('cor')}>`;
        const imagem = `<:imagem:${dbe.get('imagem')}>`;
        const lupa = `<:lupa:${dbe.get('lupa')}>`;
        const qrcodeEmoji = `<:qrcode:${dbe.get('qrcode')}>`;
        const cadeadoEmoji = `<:cadeado:${dbe.get('cadeado')}>`;
        const mercadopagoEmoji = `<:mercadopago:${dbe.get('mercadopago')}>`;
        const explorarEmoji = `<:explorar:${dbe.get('explorar')}>`;
        const pixEmoji = `<:pix:${dbe.get('pix')}>`;
        const chaveEmoji = `<:chave:${dbe.get('chave')}>`;
        const presenteEmoji = `<:presente:${dbe.get('presente')}>`;
        const bancoEmoji = `<:banco:${dbe.get('banco')}>`;
        const moedasEmoji = `<:moedas:${dbe.get('moedas')}>`;
        const calendario2Emoji = `<:calendario2:${dbe.get('calendario2')}>`;
        const sk_logoEmoji = `<:sk_logo:${dbe.get('sk_logo')}>`;


        // sistema de bem vindo
        if (interaction.type == InteractionType.ModalSubmit) {
            if (interaction.customId === 'sdaju111idsjjsdua') {
                const title = interaction.fields.getTextInputValue('tokenMP');
                const title2 = interaction.fields.getTextInputValue('tokenMP2');
                const title3 = interaction.fields.getTextInputValue('qualcanal');
                const cargoId = interaction.fields.getTextInputValue('cargo'); // Obtém o ID do cargo

                const stringSemEspacos = title3.replace(/\s/g, '');
                const arrayDeBancos = stringSemEspacos.split(',');

                if (isNaN(title2) == true) return interaction.reply({ content: `❌ | Você colocou um tempo incorreto para a mensagem ser apagada!`, ephemeral: true });

                if (cargoId && isNaN(cargoId)) {
                    return interaction.reply({ content: `❌ | O ID do cargo fornecido não é válido!`, ephemeral: true });
                }

                dbConfigs.set(`vendas.welcome`, {
                    msg: title,
                    tempo: title2,
                    channelid: arrayDeBancos,
                    cargoId: cargoId || null,
                });

                interaction.reply({ content: `✅ | Todas configurações de Bem vindo foram configuradas com sucesso!`, ephemeral: true });
            }


        }

        //lock e unlock automatico



        // reaçoes automaticas
        if (interaction.isButton() && interaction.customId === "configReacao") {
            try {
                // Buscar reações existentes para exibir na mensagem
                const reacoesAutomaticas = dbConfigs.get(`vendas.reacoes.automaticas`) || [];

                // Criar uma lista formatada de reações existentes
                let listaReacoes = "";
                if (reacoesAutomaticas.length > 0) {
                    listaReacoes = "**Reações Automáticas Configuradas:**\n";
                    reacoesAutomaticas.forEach((reacao, index) => {
                        listaReacoes += `${index + 1}. **ID:** \`${reacao.id}\` | **Emoji:** ${reacao.emoji} | **Canal:** <#${reacao.canalId}>\n`;
                    });
                    listaReacoes += "\n";
                } else {
                    listaReacoes = "**Não há reações automáticas configuradas.**\n\n";
                }

                const row = new ActionRowBuilder()
                    .addComponents(
                        new ButtonBuilder()
                            .setCustomId('addReacao')
                            .setLabel('Adicionar Reação Automática')
                            .setStyle(3)
                            .setEmoji('➕'),
                        new ButtonBuilder()
                            .setCustomId('removeReacao')
                            .setLabel('Remover Reação Automática')
                            .setStyle(4)
                            .setEmoji('🗑️')
                    );

                // Construir a mensagem com a lista de reações
                const mensagem = `**Sistema de Reações Automáticas**\n\n${listaReacoes}Escolha uma opção:`;

                await interaction.reply({
                    content: mensagem,
                    components: [row],
                    ephemeral: true
                });
            } catch (error) {
                console.error("Erro ao listar reações automáticas:", error);
                await interaction.reply({
                    content: "❌ Ocorreu um erro ao carregar o sistema de reações automáticas.",
                    ephemeral: true
                });
            }
        }

        if (interaction.isButton() && interaction.customId === "addReacao") {
            const modal = new ModalBuilder()
                .setCustomId('modalAddReacao')
                .setTitle('Adicionar Reação Automática');

            const reacaoIdInput = new TextInputBuilder()
                .setCustomId('reacaoId')
                .setLabel('Nome/ID da reação (para identificação)')
                .setStyle(TextInputStyle.Short)
                .setPlaceholder('Ex: reacao-anuncios')
                .setRequired(true);

            const emojiInput = new TextInputBuilder()
                .setCustomId('emoji')
                .setLabel('Emoji para reagir')
                .setStyle(TextInputStyle.Short)
                .setPlaceholder('Ex: 👍 ou ID de emoji personalizado')
                .setRequired(true);

            const canalInput = new TextInputBuilder()
                .setCustomId('canalId')
                .setLabel('ID do Canal')
                .setStyle(TextInputStyle.Short)
                .setPlaceholder('Ex: 123456789012345678')
                .setRequired(true);

            const actionRow1 = new ActionRowBuilder().addComponents(reacaoIdInput);
            const actionRow2 = new ActionRowBuilder().addComponents(emojiInput);
            const actionRow3 = new ActionRowBuilder().addComponents(canalInput);

            modal.addComponents(actionRow1, actionRow2, actionRow3);

            await interaction.showModal(modal);
        }

        if (interaction.isButton() && interaction.customId === "removeReacao") {
            const reacoesAutomaticas = dbConfigs.get(`vendas.reacoes.automaticas`) || [];

            if (reacoesAutomaticas.length === 0) {
                return interaction.reply({
                    content: "Não há reações automáticas configuradas para remover.",
                    ephemeral: true
                });
            }

            const modal = new ModalBuilder()
                .setCustomId('modalRemoveReacao')
                .setTitle('Remover Reação Automática');

            const reacaoIdInput = new TextInputBuilder()
                .setCustomId('reacaoId')
                .setLabel('Nome/ID da reação a ser removida')
                .setStyle(TextInputStyle.Short)
                .setPlaceholder('Digite o ID exato da reação')
                .setRequired(true);

            const actionRow = new ActionRowBuilder().addComponents(reacaoIdInput);
            modal.addComponents(actionRow);

            await interaction.showModal(modal);
        }

        if (interaction.type == InteractionType.ModalSubmit && interaction.customId === "modalAddReacao") {
            try {
                const reacaoId = interaction.fields.getTextInputValue('reacaoId');
                const emoji = interaction.fields.getTextInputValue('emoji');
                const canalId = interaction.fields.getTextInputValue('canalId');

                // Verificar se o canal existe
                const canal = interaction.guild.channels.cache.get(canalId);
                if (!canal) {
                    return interaction.reply({
                        content: `❌ Erro: O canal com ID ${canalId} não foi encontrado no servidor.`,
                        ephemeral: true
                    });
                }

                // Verificar se o ID da reação já existe
                const reacoesAutomaticas = dbConfigs.get(`vendas.reacoes.automaticas`) || [];
                if (reacoesAutomaticas.some(reacao => reacao.id === reacaoId)) {
                    return interaction.reply({
                        content: `❌ Erro: Já existe uma reação com o ID "${reacaoId}". Por favor, escolha outro ID.`,
                        ephemeral: true
                    });
                }

                // Adicionar nova reação ao banco de dados
                reacoesAutomaticas.push({
                    id: reacaoId,
                    emoji: emoji,
                    canalId: canalId
                });

                dbConfigs.set(`vendas.reacoes.automaticas`, reacoesAutomaticas);

                await interaction.reply({
                    content: `✅ Reação automática configurada com sucesso!\n**ID:** ${reacaoId}\n**Emoji:** ${emoji}\n**Canal:** <#${canalId}>`,
                    ephemeral: true
                });
            } catch (error) {
                console.error("Erro ao adicionar reação automática:", error);
                await interaction.reply({
                    content: "❌ Ocorreu um erro ao configurar a reação automática.",
                    ephemeral: true
                });
            }
        }

        if (interaction.type == InteractionType.ModalSubmit && interaction.customId === "modalRemoveReacao") {
            try {
                const reacaoId = interaction.fields.getTextInputValue('reacaoId');

                // Buscar reações existentes
                const reacoesAutomaticas = dbConfigs.get(`vendas.reacoes.automaticas`) || [];
                const reacaoIndex = reacoesAutomaticas.findIndex(reacao => reacao.id === reacaoId);

                if (reacaoIndex === -1) {
                    return interaction.reply({
                        content: `❌ Erro: Não foi encontrada nenhuma reação com o ID "${reacaoId}".`,
                        ephemeral: true
                    });
                }

                // Remover a reação do array
                const reacaoRemovida = reacoesAutomaticas[reacaoIndex];
                reacoesAutomaticas.splice(reacaoIndex, 1);

                // Atualizar o banco de dados
                dbConfigs.set(`vendas.reacoes.automaticas`, reacoesAutomaticas);

                await interaction.reply({
                    content: `✅ Reação automática removida com sucesso!\n**ID:** ${reacaoRemovida.id}\n**Emoji:** ${reacaoRemovida.emoji}\n**Canal:** <#${reacaoRemovida.canalId}>`,
                    ephemeral: true
                });
            } catch (error) {
                console.error("Erro ao remover reação automática:", error);
                await interaction.reply({
                    content: "❌ Ocorreu um erro ao remover a reação automática.",
                    ephemeral: true
                });
            }
        }


        // config de moedas do bot
        if (interaction.isStringSelectMenu()) {
            if (interaction.customId == 'selectMoeda') {
                let selectedValue = interaction.values[0];
                if (selectedValue == 'R$') selectedValue = 'BRL'
                if (selectedValue == 'US$') selectedValue = 'USD'
                if (selectedValue == '€') selectedValue = 'EUR'
                await dbConfigs.set(`vendas.payments.lenguage`, selectedValue)

                await interaction.update({
                    content: `Estamos atualizando o formato de moeda...`,
                    ephemeral: true,
                    components: []
                })

                if (selectedValue == "BRL") {
                    global.lenguage = {
                        "um": "pt-BR",
                        "dois": "BRL",
                        "stripe": "brl",
                    }
                } else if (selectedValue == "EUR") {
                    global.lenguage = {
                        "um": "nl-NL",
                        "dois": "EUR",
                        "stripe": "eur",
                    }
                } else if (selectedValue == "USD") {
                    global.lenguage = {
                        "um": "pt-BR",
                        "dois": "USD",
                        "stripe": "usd",
                    }
                } else {
                    global.lenguage = {
                        "um": "pt-BR",
                        "dois": "BRL",
                        "stripe": "brl",
                    }
                }

                await UpdateMsgs(client, null)
                await UpdateSelects(client, null)

                await interaction.editReply({
                    content: `✅ | Formato de moeda alterado para **${selectedValue}**!`,
                    ephemeral: true,
                    components: []
                })



            }
        }

        if (interaction.type == InteractionType.ModalSubmit) {
            if (interaction.customId === 'modalimapnubank') {
                const email = interaction.fields.getTextInputValue('email');
                const senha = interaction.fields.getTextInputValue('Senha');

                let typebank = dbConfigs.get(`vendas.payments.NubankType`)
                if (!typebank) {
                    await PageNubank(client, interaction);
                    return interaction.followUp({
                        content: `❌ Você precisa selecionar um banco primeiro!`,
                        ephemeral: true
                    });
                }

                await interaction.update({
                    content: `🔄 | Testando conexão com o servidor IMAP...`,
                });

                // Configuração IMAP
                let imapConfig = {
                    user: email,
                    password: senha,
                    host: 'imap.gmail.com',
                    port: 993,
                    tls: true,
                    tlsOptions: { rejectUnauthorized: false },
                    keepalive: true,
                    authTimeout: 3000, // Timeout de autenticação
                    connTimeout: 10000, // Timeout de conexão
                };

                // Função para testar conexão IMAP
                async function testImapConnection(config) {
                    return new Promise((resolve, reject) => {
                        const testImap = new Imap(config);

                        const timeoutId = setTimeout(() => {
                            testImap.end();
                            reject('Timeout ao tentar conectar ao servidor IMAP');
                        }, 15000); // 15 segundos de timeout total

                        testImap.once('ready', () => {
                            clearTimeout(timeoutId);
                            testImap.openBox('INBOX', false, (err, box) => {
                                testImap.end();
                                if (err) {
                                    reject('Erro ao acessar INBOX: ' + err.message);
                                } else {
                                    resolve(true);
                                }
                            });
                        });

                        testImap.once('error', (err) => {
                            clearTimeout(timeoutId);
                            testImap.end();
                            if (err.message.includes('AUTHENTICATIONFAILED')) {
                                reject('Credenciais inválidas');
                            } else {
                                reject('Erro de conexão: ' + err.message);
                            }
                        });

                        testImap.connect();
                    });
                }

                try {
                    // Primeiro testa a conexão
                    await testImapConnection(imapConfig)
                        .then(async () => {
                            // Se o teste for bem sucedido, inicia a conexão real
                            return connectIMAP(typebank, imapConfig);
                        })
                        .then(async message => {
                            // Salva as configurações e atualiza a interface
                            await dbConfigs.set(`vendas.payments.NubankEmail`, email);
                            await dbConfigs.set(`vendas.payments.NubankSenha`, senha);
                            await dbConfigs.set(`vendas.payments.Nubank`, true);
                            await PageNubank(client, interaction, 1);

                            interaction.followUp({
                                content: `✅ Conexão IMAP estabelecida com sucesso!`,
                                ephemeral: true
                            });
                        })
                        .catch(async error => {
                            console.error('[❌ ERRO IMAP]', error);
                            await PageNubank(client, interaction, 1);

                            let errorMessage = '❌ Erro ao conectar ao IMAP: ';

                            if (error.includes('AUTHENTICATIONFAILED')) {
                                errorMessage += 'Credenciais inválidas.';
                            } else if (error.includes('Timeout')) {
                                errorMessage += 'Tempo de conexão excedido.';
                            } else {
                                errorMessage += 'Verifique suas credenciais e tente novamente.';
                            }

                            interaction.followUp({
                                content: errorMessage,
                                ephemeral: true
                            });
                        });

                } catch (error) {
                    console.error('[❌ ERRO CRÍTICO]', error);
                    await PageNubank(client, interaction, 1);

                    interaction.followUp({
                        content: `❌ Erro crítico ao processar sua solicitação. Tente novamente mais tarde.`,
                        ephemeral: true
                    });
                }
            }
        }

        if (interaction.isStringSelectMenu()) {

            if (interaction.customId === 'selecttypebank') {

                let typebank = interaction.values[0];
                await dbConfigs.set(`vendas.payments.NubankType`, typebank)
                await PageNubank(client, interaction);
                await interaction.followUp({ content: `Banco selecionado com sucesso!`, components: [], ephemeral: true });
                return

            }

            if (interaction.customId == 'e-salesMediacao') {
                await PainelCompras(interaction, interaction.values[0])
            }
        }

        if (interaction.isButton()) {

            if (interaction.customId.startsWith(`paginasCompras_seguinte_`) || interaction.customId.startsWith(`paginasCompras_anterior_`)) {
                let page = interaction.customId.split('_')[2]
                let message = await PageCompras(interaction, page)
                await interaction.update(
                    {
                        content: message.content,
                        components: message.components,
                        flags: MessageFlags.Ephemeral
                    }
                )

            }

            if (interaction.customId == 'voltarCompras') {

                await interaction.update({
                    content: `🔄 | Carregando...`,
                    ephemeral: true, components: []
                })

                let message = await PageCompras(interaction, 1)

                await interaction.editReply(
                    {
                        content: message.content,
                        components: message.components,
                        flags: MessageFlags.Ephemeral
                    }
                )

            }





            if (interaction.customId == 'configBemvindo') {

                const modalaAA = new ModalBuilder()
                    .setCustomId('sdaju111idsjjsdua')
                    .setTitle(`Editar Boas Vindas`);

                const newnameboteN = new TextInputBuilder()
                    .setCustomId('tokenMP')
                    .setLabel(`Mensagem`)
                    .setPlaceholder(`Insira aqui sua mensagem, use {member} para mencionar o membro e {guildname} para o servidor.`)
                    .setStyle(TextInputStyle.Paragraph)
                    .setRequired(false)
                    .setMaxLength(1000)

                const newnameboteN2 = new TextInputBuilder()
                    .setCustomId('tokenMP2')
                    .setLabel(`TEMPO PARA APAGAR A MENSAGEM`)
                    .setPlaceholder(`Insira aqui a quantidade em segundos.`)
                    .setStyle(TextInputStyle.Short)
                    .setRequired(false)
                    .setMaxLength(6)


                const newnameboteN3 = new TextInputBuilder()
                    .setCustomId('qualcanal')
                    .setLabel(`QUAL CANAL VAI SER ENVIADO?`)
                    .setPlaceholder(`Insira aqui o ID do canal que vai enviar. (ID, ID, ID)`)
                    .setStyle(TextInputStyle.Short)
                    .setRequired(true)
                    .setMaxLength(200)

                const newnameboteN4 = new TextInputBuilder()
                    .setCustomId('cargo')
                    .setLabel(`QUAL CARGO QUE VAI RECEBER?`)
                    .setPlaceholder(`Insira aqui o ID do cargo ex: 324651674527164`)
                    .setStyle(TextInputStyle.Short)
                    .setRequired(false)
                    .setMaxLength(30)

                const firstActionRow3 = new ActionRowBuilder().addComponents(newnameboteN);
                const firstActionRow4 = new ActionRowBuilder().addComponents(newnameboteN2);
                const firstActionRow5 = new ActionRowBuilder().addComponents(newnameboteN3);
                const firstActionRow6 = new ActionRowBuilder().addComponents(newnameboteN4);


                modalaAA.addComponents(firstActionRow3, firstActionRow4, firstActionRow5, firstActionRow6);
                await interaction.showModal(modalaAA);

            }

            if (interaction.customId == `lenguageMoeda`) {
                let selects = new ActionRowBuilder()
                    .addComponents(
                        new StringSelectMenuBuilder()
                            .setCustomId('selectMoeda')
                            .setPlaceholder('Selecione o formato de moeda')
                            .addOptions([
                                {
                                    label: 'R$',
                                    value: 'R$',
                                    description: 'Formato de moeda em Reais'
                                },
                                {
                                    label: 'US$',
                                    value: 'US$',
                                    description: 'Formato de moeda em Dólares'
                                },
                                {
                                    label: '€',
                                    value: '€',
                                    description: 'Formato de moeda em Euros'
                                },
                            ])
                    )

                interaction.reply({
                    content: `Selecione no select abaixo qual o formato de moeda que deseja utilizar.`,
                    ephemeral: true,
                    components: [selects]
                })
            }

            if (interaction.customId === 'rendimentosBot') {
                await interaction.deferReply({ ephemeral: true });

                // Obter dados das estatísticas
                const estatisticasHoje = await Estatisticas(client, 1, interaction.guild.id);
                const estatisticasSemana = await Estatisticas(client, 7, interaction.guild.id);
                const estatisticasMes = await Estatisticas(client, 30, interaction.guild.id);
                const estatisticasAno = await Estatisticas(client, 365, interaction.guild.id);
                const estatisticasTotal = await Estatisticas(client, 0, interaction.guild.id);

                // Calcular média por venda (usando dados totais)
                const mediaPorVenda = estatisticasTotal.total.quantidadePedidos > 0
                    ? estatisticasTotal.total.valorTotal / estatisticasTotal.total.quantidadePedidos
                    : 0;

                // Formatação de valores monetários
                const formatarMoeda = (valor) => {
                    return Number(valor).toLocaleString(global.lenguage.um, {
                        style: 'currency',
                        currency: global.lenguage.dois
                    });
                };

                // Obter data e hora atual
                const agora = new Date();
                const horaFormatada = `${agora.getHours()}:${String(agora.getMinutes()).padStart(2, '0')}`;

                // Criar embed com o dashboard
                const embed = new EmbedBuilder()
                    .setColor('#36393F')
                    .setTitle('Dashboard de Estatísticas - Vendas')
                    .setDescription(`Olá **${interaction.user.username}**, aqui está o resumo completo das estatísticas de vendas de aplicativos.`)
                    .addFields(
                        // Primeira linha - Hoje, Esta Semana, Este Mês
                        {
                            name: `${calendario2Emoji} Hoje`,
                            value: `- Vendas: ${estatisticasHoje.intervalo.quantidadePedidos}\n- Total: ${formatarMoeda(estatisticasHoje.intervalo.valorTotal)}`,
                            inline: true
                        },
                        {
                            name: `${calendario2Emoji} Esta Semana`,
                            value: `- Vendas: ${estatisticasSemana.intervalo.quantidadePedidos}\n- Total: ${formatarMoeda(estatisticasSemana.intervalo.valorTotal)}`,
                            inline: true
                        },
                        {
                            name: `${calendario2Emoji} Este Mês`,
                            value: `- Vendas: ${estatisticasMes.intervalo.quantidadePedidos}\n- Total: ${formatarMoeda(estatisticasMes.intervalo.valorTotal)}`,
                            inline: true
                        },
                        // Segunda linha - Este Ano, Total Histórico, Média por Venda
                        {
                            name: `${calendario2Emoji} Este Ano`,
                            value: `- Vendas: ${estatisticasAno.intervalo.quantidadePedidos}\n- Total: ${formatarMoeda(estatisticasAno.intervalo.valorTotal)}`,
                            inline: true
                        },
                        {
                            name: `${moedasEmoji} Total Histórico`,
                            value: `- Vendas: ${estatisticasTotal.total.quantidadePedidos}\n- Total: ${formatarMoeda(estatisticasTotal.total.valorTotal)}`,
                            inline: true
                        },
                        {
                            name: `${bancoEmoji} Média por Venda`,
                            value: `${formatarMoeda(mediaPorVenda)}`,
                            inline: true
                        }
                    )
                    .setFooter({
                        text: `Solicitado por ${interaction.user.username} - Hoje às ${horaFormatada} - Hoje às ${horaFormatada}`,
                        iconURL: interaction.user.displayAvatarURL({ dynamic: true })
                    });

                // Enviar resposta
                await interaction.editReply({ embeds: [embed], components: [] });
            }

            if (interaction.customId === 'changeBanner22') {

                let envieaimagemabaixo = `Olá! Envie a imagem que deseja utilizar como banner.`

                let message = await interaction.reply({
                    content: envieaimagemabaixo,
                    ephemeral: true
                })

                const filter = m => m.author.id === interaction.user.id;
                const collector = interaction.channel.createMessageCollector({ filter, max: 1 })
                collector.on('collect', async message => {
                    if (message.attachments.size > 0) {
                        const attachment = message.attachments.first();
                        if (attachment.contentType.includes('image')) {
                            const url = attachment.url;
                            await dbConfigs.set(`vendas.images.bannerUrl`, url)
                            await message.delete()
                            await interaction.editReply(`✅ | Banner alterado com sucesso!`)
                        } else {
                            await message.delete()
                            await interaction.editReply(`❌ | O conteúdo enviado não é uma imagem.`)
                        }
                    } else {
                        if (message.content.includes('http')) {
                            await dbConfigs.set(`vendas.images.bannerUrl`, message.content)
                            await message.delete()
                            await interaction.editReply(`✅ | Banner alterado com sucesso!`)
                        } else {
                            await message.delete()
                            await interaction.editReply(`❌ | O conteúdo enviado não é uma imagem.`)
                        }
                    }

                })



            } else if (interaction.customId === 'changeThumbnail22') {

                let envieaimagemabaixo = `Olá! Envie a imagem que deseja utilizar como thumbnail.`

                let message = await interaction.reply({
                    content: envieaimagemabaixo,
                    ephemeral: true
                })

                const filter = m => m.author.id === interaction.user.id;
                const collector = interaction.channel.createMessageCollector({ filter, max: 1 })
                collector.on('collect', async message => {
                    if (message.attachments.size > 0) {
                        const attachment = message.attachments.first();
                        if (attachment.contentType.includes('image')) {
                            const url = attachment.url;
                            await dbConfigs.set(`vendas.images.thumbUrl`, url)
                            await message.delete()
                            await interaction.editReply(`✅ | Thumbnail alterado com sucesso!`)
                        } else {
                            await message.delete()
                            await interaction.editReply(`❌ | O conteúdo enviado não é uma imagem.`)
                        }
                    } else {
                        if (message.content.includes('http')) {
                            await dbConfigs.set(`vendas.images.thumbUrl`, message.content)
                            await message.delete()
                            await interaction.editReply(`✅ | Thumbnail alterado com sucesso!`)
                        } else {
                            await message.delete()
                            await interaction.editReply(`❌ | O conteúdo enviado não é uma imagem.`)
                        }
                    }

                })
            }



            if (interaction.customId == "voltarconfiginicio") {
                StartAll(client, interaction);
            }

            if (interaction.customId == `configPayments`) {
                let message = await ConfigPayments(client, interaction)
                await interaction.update(message)
            }


            if (interaction.customId == `previousPaymentMethods`) {
                let message = await PainelVendasMain(client, interaction)
                await interaction.update(message)
            };


            if (interaction.customId == 'mpMethod') {
                let message = await mpMethod(client, interaction)
                await interaction.update(message)
            }
            if (interaction.customId == 'togglePix') {
                await togglePixMP(client, interaction)
                let message = await mpMethod(client, interaction)
                await interaction.update(message)
            }

            if (interaction.customId == 'changeAccessToken') {
                await ModalMP(client, interaction)
            }

            if (interaction.customId === 'balanceMethod') {
                let message = await SaldoPayment(client, interaction)
                await interaction.update(message)
            }

            if (interaction.customId === 'toggleBalance') {
                await toggleBalance(client, interaction)
                let message = await SaldoPayment(client, interaction)
                await interaction.update(message)
            }

            if (interaction.customId === 'depositBonus') {
                await depositBonus(client, interaction)
            }

            if (interaction.customId === 'minimumDeposit') {
                await minimumDeposit(client, interaction)
            }

            if (interaction.customId === 'semiAutoMethod') {
                let message = await semiAutoMethod(client, interaction)
                await interaction.update(message)
            }

            if (interaction.customId === 'toggleSemiAuto') {
                await toggleSemiAuto(client, interaction)
                let message = await semiAutoMethod(client, interaction)
                await interaction.update(message)
            }

            if (interaction.customId === 'changePix') {
                await changePixModal(client, interaction)
            }

            if (interaction.customId === 'changeQrCode') {
                await changeQrCodeModal(client, interaction)
            }

            if (interaction.customId === 'configChannels') {
                let message = await configChannelsMain(client, interaction)
                await interaction.update(message)
            }

            if (interaction.customId == 'changeLogsPriv' || interaction.customId == 'changeRoleStaff' || interaction.customId == 'changeCategoryCart' || interaction.customId == 'changeLogsPublic' || interaction.customId == 'changeRoleCustomer' || interaction.customId == 'changeLogsavaliar') {
                let message = await SelectChannelSet(client, interaction)
                await interaction.update(message)
            }


            if (interaction.customId == 'toggleNewSales') {
                await toggleNewSales(client, interaction)
                let message = await PainelVendasMain(client, interaction)
                await interaction.update(message)
            }

            if (interaction.customId == 'changeTerms') {
                await changeTerms(client, interaction)
            }

            if (interaction.customId === 'createProductBtn') {
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
            }



            // Tratamento para botões de edição simplificada de produtos
            const editActions = [
                'changeName_', 'changePrice_', 'changeDescription_', 'configStock_',
                'advancedConfigs_', 'updateMsg_', 'deleteProduct_', 'infoProduct_'
            ];

            const actionFound = editActions.find(action => interaction.customId.startsWith(action));

            if (actionFound) {
                const idProduct = interaction.customId.replace(actionFound, "");
                const action = actionFound.replace("_", "");

                // Verificar se o produto existe
                if (!dbProducts.has(idProduct)) {
                    return interaction.reply({ content: "❌ | Este produto não existe mais.", flags: MessageFlags.Ephemeral });
                }

                // Simular o comportamento do comando /config-produto
                // Para isso, precisamos das variáveis e lógica do config.js
                const colorC = await dbConfigs.get(`vendas.embeds.color`);
                const nameP = await dbProducts.get(`${idProduct}.name`);
                const descriptionP = await dbProducts.get(`${idProduct}.description`);
                const priceP = await dbProducts.get(`${idProduct}.price`);
                const estoqueP = await dbProducts.get(`${idProduct}.stock`);
                const bannerP = await dbProducts.get(`${idProduct}.bannerUrl`);

                // Emojis (usando os mesmos do config.js)
                const dinheiroEmoji = `<:dinheiro:${await dbe.get('dinheiro')}>`;
                const caixaEmoji = `<:caixa:${dbe.get('caixa')}>`;
                const userEmoji = `<:user:${dbe.get('user')}>`;
                const estrelaEmoji = `<a:estrela:${dbe.get('estrela')}>`;
                const configEmoji = `<:config:${await dbe.get('config')}>`;
                const saco_dinheiroEmoji = `<:saco_dinheiro:${await dbe.get('saco_dinheiro')}>`;
                const editarEmoji = `<:editar:${await dbe.get('editar')}>`;
                const corEmoji = `<:cor:${await dbe.get('cor')}>`;
                const imagemEmoji = `<:imagem:${await dbe.get('imagem')}>`;
                const lupaEmoji = `<:lupa:${await dbe.get('lupa')}>`;
                const modalEmoji = `<:modal:${await dbe.get('modal')}>`;
                const docEmoji = `<:doc:${await dbe.get('doc')}>`;
                const loadingEmoji = `<a:loading:${await dbe.get('loading')}>`;
                const lixoEmoji = `<:lixo:${await dbe.get('lixo')}>`;
                const carrinhoEmoji = `<:carrinho:${await dbe.get('carrinho')}>`;
                const cupomEmoji = `<:cupom:${await dbe.get('cupom')}>`;
                const voltarEmoji = `<:voltar:${await dbe.get('voltar')}>`;
                const sendEmoji = `<:send:${await dbe.get('send')}>`;

                const rowProduct1 = new ActionRowBuilder()
                    .addComponents(
                        new ButtonBuilder().setCustomId(`changeName_${idProduct}`).setLabel(`NOME`).setEmoji(`${editarEmoji}`).setStyle(`Success`),
                        new ButtonBuilder().setCustomId(`changePrice_${idProduct}`).setLabel(`PREÇO`).setEmoji(`${saco_dinheiroEmoji}`).setStyle(`Success`),
                        new ButtonBuilder().setCustomId(`changeDescription_${idProduct}`).setLabel(`DESCRIÇÃO`).setEmoji(`${docEmoji}`).setStyle(`Success`),
                        new ButtonBuilder().setCustomId(`configStock_${idProduct}`).setLabel(`ESTOQUE`).setEmoji(`${caixaEmoji}`).setStyle(`Success`)
                    );

                const rowProduct2 = new ActionRowBuilder()
                    .addComponents(
                        new ButtonBuilder().setCustomId(`advancedConfigs_${idProduct}`).setLabel(`Configurações Avançadas`).setEmoji(`${configEmoji}`).setStyle(`Primary`),
                        new ButtonBuilder().setCustomId(`updateMsg_${idProduct}`).setLabel(`Atualizar Mensagem`).setEmoji(`${loadingEmoji}`).setStyle(`Primary`),
                        new ButtonBuilder().setCustomId(`deleteProduct_${idProduct}`).setEmoji(`${lixoEmoji}`).setStyle(`Danger`),
                        new ButtonBuilder().setCustomId(`infoProduct_${idProduct}`).setEmoji(`${lupaEmoji}`).setStyle(`Primary`)
                    );

                const embedProduct = new EmbedBuilder()
                    .setTitle(`${client.user.username} | Configurando Produto`)
                    .setDescription(`**${modalEmoji} | Descrição:**\n\n${descriptionP}\n\n**${docEmoji} ID: **${idProduct}**\n${carrinhoEmoji} Produto: **${nameP}**\n${dinheiroEmoji} Valor à vista: **${Number(priceP).toLocaleString(global.lenguage.um, { style: 'currency', currency: global.lenguage.dois })}**\n${caixaEmoji} Estoque:** ${estoqueP.length}`)
                    .setImage(bannerP != "none" ? bannerP : "https://sem-img.com")
                    .setColor(colorC !== "none" ? colorC : "#460580")
                    .setFooter({ text: `${client.user.username} - Todos os direitos reservados.`, iconURL: client.user.avatarURL() });

                // Lógica específica para cada ação (baseada no config.js)
                if (action === 'changeName') {
                    await interaction.deferUpdate();
                    await interaction.editReply({
                        embeds: [new EmbedBuilder()
                            .setTitle(`${client.user.username} | Nome`)
                            .setDescription(`Envie o nome que será utilizado! \`(${nameP})\``)
                            .setFooter({ text: `Você tem 2 minutos para enviar.` })
                            .setColor(colorC !== "none" ? colorC : "#460580")
                        ],
                        components: []
                    });

                    const collectorMsg = interaction.channel.createMessageCollector({
                        filter: (m) => m.author.id == interaction.user.id,
                        max: 1,
                        time: 120000
                    });

                    collectorMsg.on("collect", async (iMsg) => {
                        await iMsg.delete().catch(() => {});
                        const msgContent = iMsg.content;
                        if (msgContent.length > 38) {
                            return interaction.followUp({ content: `❌ | Limite de 38 caracteres excedido.`, flags: MessageFlags.Ephemeral });
                        }
                        await dbProducts.set(`${idProduct}.name`, msgContent);
                        const newName = await dbProducts.get(`${idProduct}.name`);
                        embedProduct.setDescription(`**${modalEmoji} | Descrição:**\n\n${descriptionP}\n\n**${docEmoji} ID: **${idProduct}**\n${carrinhoEmoji} Produto: **${newName}**\n${dinheiroEmoji} Valor à vista: **${Number(priceP).toLocaleString(global.lenguage.um, { style: 'currency', currency: global.lenguage.dois })}**\n${caixaEmoji} Estoque:** ${estoqueP.length}`);
                        await interaction.editReply({ embeds: [embedProduct], components: [rowProduct1, rowProduct2] });
                    });
                }

                if (action === 'changePrice') {
                    await interaction.deferUpdate();
                    await interaction.editReply({
                        embeds: [new EmbedBuilder()
                            .setTitle(`${client.user.username} | Preço`)
                            .setDescription(`Envie o preço que será utilizado! \`(${Number(priceP).toLocaleString(global.lenguage.um, { style: 'currency', currency: global.lenguage.dois })})\``)
                            .setFooter({ text: `Você tem 2 minutos para enviar.` })
                            .setColor(colorC !== "none" ? colorC : "#460580")
                        ],
                        components: []
                    });

                    const collectorMsg = interaction.channel.createMessageCollector({
                        filter: (m) => m.author.id == interaction.user.id,
                        max: 1,
                        time: 120000
                    });

                    collectorMsg.on("collect", async (iMsg) => {
                        await iMsg.delete().catch(() => {});
                        const msgContent = iMsg.content.trim().replace(`R$`, ``).replace(`,`, `.`);
                        const priceRegex = /^\d+(\.\d{1,2})?$/;
                        if (!priceRegex.test(msgContent)) {
                            return interaction.followUp({ content: `❌ | O preço inserido é inválido.`, flags: MessageFlags.Ephemeral });
                        }
                        await dbProducts.set(`${idProduct}.price`, msgContent);
                        const newPrice = await dbProducts.get(`${idProduct}.price`);
                        embedProduct.setDescription(`**${modalEmoji} | Descrição:**\n\n${descriptionP}\n\n**${docEmoji} ID: **${idProduct}**\n${carrinhoEmoji} Produto: **${nameP}**\n${dinheiroEmoji} Valor à vista: **${Number(newPrice).toLocaleString(global.lenguage.um, { style: 'currency', currency: global.lenguage.dois })}**\n${caixaEmoji} Estoque:** ${estoqueP.length}`);
                        await interaction.editReply({ embeds: [embedProduct], components: [rowProduct1, rowProduct2] });
                    });
                }

                if (action === 'changeDescription') {
                    await interaction.deferUpdate();
                    await interaction.editReply({
                        embeds: [new EmbedBuilder()
                            .setTitle(`${client.user.username} | Descrição`)
                            .setDescription(`Envie a descrição que será utilizada!\n\`\`\`${descriptionP}\`\`\``)
                            .setFooter({ text: `Você tem 2 minutos para enviar.` })
                            .setColor(colorC !== "none" ? colorC : "#460580")
                        ],
                        components: []
                    });

                    const collectorMsg = interaction.channel.createMessageCollector({
                        filter: (m) => m.author.id == interaction.user.id,
                        max: 1,
                        time: 120000
                    });

                    collectorMsg.on("collect", async (iMsg) => {
                        await iMsg.delete().catch(() => {});
                        const msgContent = iMsg.content;
                        if (msgContent.length > 2800) {
                            return interaction.followUp({ content: `❌ | Limite de 2800 caracteres excedido.`, flags: MessageFlags.Ephemeral });
                        }
                        await dbProducts.set(`${idProduct}.description`, msgContent);
                        const newDesc = await dbProducts.get(`${idProduct}.description`);
                        embedProduct.setDescription(`**${modalEmoji} | Descrição:**\n\n${newDesc}\n\n**${docEmoji} ID: **${idProduct}**\n${carrinhoEmoji} Produto: **${nameP}**\n${dinheiroEmoji} Valor à vista: **${Number(priceP).toLocaleString(global.lenguage.um, { style: 'currency', currency: global.lenguage.dois })}**\n${caixaEmoji} Estoque:** ${estoqueP.length}`);
                        await interaction.editReply({ embeds: [embedProduct], components: [rowProduct1, rowProduct2] });
                    });
                }

                if (action === 'updateMsg') {
                    await interaction.deferUpdate();
                    await UpdateMsgs(client, idProduct);
                    await interaction.followUp({ content: `✅ | Mensagem do produto atualizada com sucesso!`, flags: MessageFlags.Ephemeral });
                }

                if (action === 'infoProduct') {
                    await interaction.deferUpdate();
                    const productSellsTotal = await dbProducts.get(`${idProduct}.sellsTotal`) || 0;
                    const productIncomeTotal = await dbProducts.get(`${idProduct}.incomeTotal`) || 0;
                    const embedProductInfo = new EmbedBuilder()
                        .setAuthor({ name: client.user.username, iconURL: client.user.avatarURL() })
                        .setTitle(`${client.user.username} | Estatísticas`)
                        .setDescription(`${carrinhoEmoji} Total de Vendas: **__${Number(productSellsTotal)}__**\n${dinheiroEmoji} Rendeu: **R$__${Number(productIncomeTotal).toFixed(2)}__**`)
                        .setColor(colorC !== "none" ? colorC : "#460580")
                        .setTimestamp();
                    await interaction.followUp({ embeds: [embedProductInfo], flags: MessageFlags.Ephemeral });
                }

                if (action === 'deleteProduct') {
                    const modal = new ModalBuilder()
                        .setCustomId(`modalConfirmDelete-${idProduct}`)
                        .setTitle(`Excluir Produto: ${nameP}`);
                    const inputConfirm = new TextInputBuilder()
                        .setCustomId('confirmText')
                        .setLabel(`Escreva "SIM" para confirmar a exclusão:`)
                        .setMaxLength(3)
                        .setPlaceholder(`SIM`)
                        .setRequired(true)
                        .setStyle(TextInputStyle.Short);
                    modal.addComponents(new ActionRowBuilder().addComponents(inputConfirm));
                    await interaction.showModal(modal);
                }

                // Configurações de Estoque
                if (action === 'configStock') {
                    await interaction.deferUpdate();
                    const rowStock1 = new ActionRowBuilder()
                        .addComponents(
                            new StringSelectMenuBuilder().setCustomId(`changesStock_${idProduct}`).setPlaceholder(`Selecione uma opção (Estoque)`)
                                .setOptions(
                                    { label: `Adicionar`, emoji: `➕`, description: `Adicione estoque em seu produto.`, value: `addStock` },
                                    { label: `Remover`, emoji: `➖`, description: `Remova estoque do seu produto.`, value: `removeStock` },
                                    { label: `Limpar`, emoji: `${lixoEmoji}`, description: `Limpa todo o estoque.`, value: `clearStock` }
                                )
                        );
                    const rowStock2 = new ActionRowBuilder()
                        .addComponents(
                            new ButtonBuilder().setCustomId(`backToProduct_${idProduct}`).setLabel(`Voltar`).setEmoji(`${voltarEmoji}`).setStyle(2)
                        );

                    await interaction.editReply({
                        embeds: [new EmbedBuilder()
                            .setTitle(`${client.user.username} | Configurando Estoque`)
                            .setDescription(`**ID:** \`${idProduct}\`\n**Estoque Atual:** \`${estoqueP.length}\` itens.\n\nSelecione uma opção abaixo para gerenciar o estoque.`)
                            .setColor(colorC !== "none" ? colorC : "#460580")
                        ],
                        components: [rowStock1, rowStock2]
                    });
                }

                // Configurações Avançadas
                if (action === 'advancedConfigs') {
                    await interaction.deferUpdate();
                    const rowAdv = new ActionRowBuilder()
                        .addComponents(
                            new StringSelectMenuBuilder().setCustomId(`changesAdv_${idProduct}`).setPlaceholder(`Configurações Avançadas`)
                                .setOptions(
                                    { label: `Banner`, emoji: `${imagemEmoji}`, description: `Alterar banner do produto.`, value: `changeBanner` },
                                    { label: `Miniatura`, emoji: `${modalEmoji}`, description: `Alterar miniatura do produto.`, value: `changeThumb` },
                                    { label: `Cargo`, emoji: `${userEmoji}`, description: `Alterar cargo de cliente.`, value: `changeRole` },
                                    { label: `Cor`, emoji: `${corEmoji}`, description: `Alterar cor da embed.`, value: `changeColor` }
                                )
                        );
                    const rowAdv2 = new ActionRowBuilder()
                        .addComponents(
                            new ButtonBuilder().setCustomId(`backToProduct_${idProduct}`).setLabel(`Voltar`).setEmoji(`${voltarEmoji}`).setStyle(2)
                        );

                    await interaction.editReply({
                        embeds: [new EmbedBuilder()
                            .setTitle(`${client.user.username} | Configurações Avançadas`)
                            .setDescription(`**ID:** \`${idProduct}\`\n\nSelecione o que deseja alterar nas configurações visuais e de cargo do produto.`)
                            .setColor(colorC !== "none" ? colorC : "#460580")
                        ],
                        components: [rowAdv, rowAdv2]
                    });
                }
            }

            // Botão de voltar para o painel do produto
            if (interaction.customId.startsWith('backToProduct_')) {
                const idProduct = interaction.customId.replace('backToProduct_', "");
                if (!dbProducts.has(idProduct)) return interaction.reply({ content: "❌ | Produto não encontrado.", flags: MessageFlags.Ephemeral });
                
                const colorC = await dbConfigs.get(`vendas.embeds.color`);
                const nameP = await dbProducts.get(`${idProduct}.name`);
                const descriptionP = await dbProducts.get(`${idProduct}.description`);
                const priceP = await dbProducts.get(`${idProduct}.price`);
                const estoqueP = await dbProducts.get(`${idProduct}.stock`);
                const bannerP = await dbProducts.get(`${idProduct}.bannerUrl`);

                const configEmoji = `<:config:${await dbe.get('config')}>`;
                const saco_dinheiroEmoji = `<:saco_dinheiro:${await dbe.get('saco_dinheiro')}>`;
                const editarEmoji = `<:editar:${await dbe.get('editar')}>`;
                const caixaEmoji = `<:caixa:${dbe.get('caixa')}>`;
                const lupaEmoji = `<:lupa:${await dbe.get('lupa')}>`;
                const modalEmoji = `<:modal:${await dbe.get('modal')}>`;
                const docEmoji = `<:doc:${await dbe.get('doc')}>`;
                const loadingEmoji = `<a:loading:${await dbe.get('loading')}>`;
                const lixoEmoji = `<:lixo:${await dbe.get('lixo')}>`;
                const carrinhoEmoji = `<:carrinho:${await dbe.get('carrinho')}>`;
                const dinheiroEmoji = `<:dinheiro:${await dbe.get('dinheiro')}>`;

                const rowProduct1 = new ActionRowBuilder()
                    .addComponents(
                        new ButtonBuilder().setCustomId(`changeName_${idProduct}`).setLabel(`NOME`).setEmoji(`${editarEmoji}`).setStyle(`Success`),
                        new ButtonBuilder().setCustomId(`changePrice_${idProduct}`).setLabel(`PREÇO`).setEmoji(`${saco_dinheiroEmoji}`).setStyle(`Success`),
                        new ButtonBuilder().setCustomId(`changeDescription_${idProduct}`).setLabel(`DESCRIÇÃO`).setEmoji(`${docEmoji}`).setStyle(`Success`),
                        new ButtonBuilder().setCustomId(`configStock_${idProduct}`).setLabel(`ESTOQUE`).setEmoji(`${caixaEmoji}`).setStyle(`Success`)
                    );

                const rowProduct2 = new ActionRowBuilder()
                    .addComponents(
                        new ButtonBuilder().setCustomId(`advancedConfigs_${idProduct}`).setLabel(`Configurações Avançadas`).setEmoji(`${configEmoji}`).setStyle(`Primary`),
                        new ButtonBuilder().setCustomId(`updateMsg_${idProduct}`).setLabel(`Atualizar Mensagem`).setEmoji(`${loadingEmoji}`).setStyle(`Primary`),
                        new ButtonBuilder().setCustomId(`deleteProduct_${idProduct}`).setEmoji(`${lixoEmoji}`).setStyle(`Danger`),
                        new ButtonBuilder().setCustomId(`infoProduct_${idProduct}`).setEmoji(`${lupaEmoji}`).setStyle(`Primary`)
                    );

                const embedProduct = new EmbedBuilder()
                    .setTitle(`${client.user.username} | Configurando Produto`)
                    .setDescription(`**${modalEmoji} | Descrição:**\n\n${descriptionP}\n\n**${docEmoji} ID: **${idProduct}**\n${carrinhoEmoji} Produto: **${nameP}**\n${dinheiroEmoji} Valor à vista: **${Number(priceP).toLocaleString(global.lenguage.um, { style: 'currency', currency: global.lenguage.dois })}**\n${caixaEmoji} Estoque:** ${estoqueP.length}`)
                    .setImage(bannerP != "none" ? bannerP : "https://sem-img.com")
                    .setColor(colorC !== "none" ? colorC : "#460580")
                    .setFooter({ text: `${client.user.username} - Todos os direitos reservados.`, iconURL: client.user.avatarURL() });

                await interaction.update({ embeds: [embedProduct], components: [rowProduct1, rowProduct2] });
            }

            // Tratamento para o menu de estoque
            if (interaction.isStringSelectMenu() && interaction.customId.startsWith('changesStock_')) {
                const idProduct = interaction.customId.replace('changesStock_', "");
                const value = interaction.values[0];
                
                if (value === 'addStock') {
                    await interaction.reply({ content: "📦 | Envie os itens do estoque (um por linha ou separado por vírgula):", flags: MessageFlags.Ephemeral });
                    const collector = interaction.channel.createMessageCollector({ filter: m => m.author.id === interaction.user.id, max: 1, time: 60000 });
                    collector.on('collect', async m => {
                        await m.delete().catch(() => {});
                        const items = m.content.includes('\n') ? m.content.split('\n') : m.content.split(',');
                        const currentStock = await dbProducts.get(`${idProduct}.stock`) || [];
                        const newStock = currentStock.concat(items.map(i => i.trim()).filter(i => i !== ""));
                        await dbProducts.set(`${idProduct}.stock`, newStock);
                        await interaction.followUp({ content: `✅ | ${items.length} itens adicionados ao estoque!`, flags: MessageFlags.Ephemeral });
                    });
                } else if (value === 'clearStock') {
                    await dbProducts.set(`${idProduct}.stock`, []);
                    await interaction.reply({ content: "✅ | Estoque limpo com sucesso!", flags: MessageFlags.Ephemeral });
                } else if (value === 'removeStock') {
                    await interaction.reply({ content: "⚠️ | Para remover itens específicos, use o sistema de backup ou limpe o estoque.", flags: MessageFlags.Ephemeral });
                }
            }

            // Tratamento para o menu de configurações avançadas
            if (interaction.isStringSelectMenu() && interaction.customId.startsWith('changesAdv_')) {
                const idProduct = interaction.customId.replace('changesAdv_', "");
                const value = interaction.values[0];

                if (value === 'changeBanner') {
                    await interaction.reply({ content: "🖼️ | Envie o link da imagem para o Banner:", flags: MessageFlags.Ephemeral });
                    const collector = interaction.channel.createMessageCollector({ filter: m => m.author.id === interaction.user.id, max: 1, time: 60000 });
                    collector.on('collect', async m => {
                        await m.delete().catch(() => {});
                        const url = m.content.trim();
                        if (!url.startsWith('http')) return interaction.followUp({ content: "❌ | Link inválido.", flags: MessageFlags.Ephemeral });
                        await dbProducts.set(`${idProduct}.bannerUrl`, url);
                        await interaction.followUp({ content: "✅ | Banner atualizado!", flags: MessageFlags.Ephemeral });
                    });
                } else if (value === 'changeColor') {
                    await interaction.reply({ content: "🎨 | Envie a cor em Hexadecimal (Ex: #FFFFFF):", flags: MessageFlags.Ephemeral });
                    const collector = interaction.channel.createMessageCollector({ filter: m => m.author.id === interaction.user.id, max: 1, time: 60000 });
                    collector.on('collect', async m => {
                        await m.delete().catch(() => {});
                        const color = m.content.trim();
                        if (!color.startsWith('#')) return interaction.followUp({ content: "❌ | Cor inválida.", flags: MessageFlags.Ephemeral });
                        await dbProducts.set(`${idProduct}.color`, color);
                        await interaction.followUp({ content: "✅ | Cor atualizada!", flags: MessageFlags.Ephemeral });
                    });
                } else {
                    await interaction.reply({ content: "⚠️ | Esta função ainda está sendo implementada no painel simplificado.", flags: MessageFlags.Ephemeral });
                }
            }

            if (interaction.customId.startsWith('resetperm_')) {
                let type = interaction.customId.split('_')[2]
                let name = interaction.customId.split('_')[1]

                if (type == 'Cargo') {
                    type = 'roles'
                } else if (type == 'Canal') {
                    type = 'channels'
                } else if (type == 'Categoria') {
                    type = 'channels'
                }


                await dbConfigs.set(`vendas.${type}.${name}`, `none`)
                let message = await configChannelsMain(client, interaction)
                await interaction.update(message)

            }





            if (interaction.customId === 'configVendas') {
                const type = getCache(null, 'type');
                const dono = getCache(null, "owner");

                const isInDb = (await dbPerms.get("vendas"))?.includes(interaction.user.id);
                const isOwner = interaction.user.id === dono;

                if (!isInDb && !isOwner) {
                    await interaction.reply({
                        content: `❌ | Você não tem permissão para usar este comando.`,
                        flags: MessageFlags.Ephemeral
                    });
                    return;
                }

                let message = await PainelVendasMain(client, interaction);
                await interaction.update(message);

            } else if (interaction.customId === 'configTicket') {
                const type = getCache(null, 'type');
                const dono = getCache(null, "owner");

    
                const isInDb = (await dbPerms.get("ticket"))?.includes(interaction.user.id);
                const isOwner = interaction.user.id === dono;

                if (!isInDb && !isOwner) {
                    await interaction.reply({
                        content: `❌ | Você não tem permissão para usar este comando.`,
                        flags: MessageFlags.Ephemeral
                    });
                    return;
                }

                await botConfigTickets(client, interaction);
            }


            if (interaction.customId === 'previousPaymentMP') {
                let message = await ConfigPayments(client, interaction)
                await interaction.update(message)
            }

            if (interaction.customId === 'buttonDuvidas') {
                await buttonDuvidas(client, interaction)
            }

        }

        if (interaction.isChannelSelectMenu() || interaction.isRoleSelectMenu() || interaction.isStringSelectMenu()) {

            if (interaction.customId.startsWith('setChannel_')) {

                let type = interaction.customId.split('_')[2]
                let name = interaction.customId.split('_')[1]

                if (type == 'Cargo') {
                    type = 'roles'
                    // verifica qual a posição do cargo
                    let cargo = interaction.guild.roles.cache.get(interaction.values[0])
                    let posicao = cargo.position
                    const botRole = interaction.guild.members.me.roles.highest;
                    if (botRole.position <= posicao) {
                        await interaction.reply({
                            content: `❌ | O cargo selecionado é maior que o meu cargo, não posso atribuir!`,
                            flags: MessageFlags.Ephemeral
                        })
                        return;
                    }
                } else if (type == 'Canal') {
                    type = 'channels'
                } else if (type == 'Categoria') {
                    type = 'channels'
                }

                await dbConfigs.set(`vendas.${type}.${name}`, interaction.values[0])
                let message = await configChannelsMain(client, interaction)
                await interaction.update(message)
            }

        }



        if (interaction.type == InteractionType.ModalSubmit) {

            if (interaction.customId === 'modalDuvidas') {
                const newButtonDuvidasInserted = interaction.fields.getTextInputValue('newButtonDuvidasText')

                if (newButtonDuvidasInserted.toLowerCase() === 'remover') {
                    await dbConfigs.set('buttonDuvidas', 'none')
                    await interaction.reply({
                        content: '✅ | Canal duvidas removido com sucesso!',
                        flags: MessageFlags.Ephemeral
                    })
                    return;
                }

                if (!/^\d{17,19}$/.test(newButtonDuvidasInserted)) {
                    await interaction.reply({
                        content: '❌ | ID de canal inválido, tente novamente!',
                        flags: MessageFlags.Ephemeral
                    })
                    return;
                }

                try {
                    await dbConfigs.set('buttonDuvidas', newButtonDuvidasInserted)
                    await interaction.reply({
                        content: `✅ | Canal duvidas alterado para:\n${newButtonDuvidasInserted}`,
                        flags: MessageFlags.Ephemeral
                    })
                } catch (error) {
                    console.error('Error updating dbConfigs:', error)
                    await interaction.reply({
                        content: '❌ | Erro ao atualizar configurações',
                        flags: MessageFlags.Ephemeral
                    })
                }
            }

            if (interaction.customId == `modalTerms`) {
                await interaction.deferUpdate()
                const newTermsInserted = interaction.fields.getTextInputValue(`newTermsText`)
                await dbConfigs.set(`vendas.termsPurchase`, newTermsInserted)
                await interaction.followUp({
                    content: `✅ | Termos alterado para:\n${newTermsInserted}`,
                    flags: MessageFlags.Ephemeral
                })
            };



            if (interaction.customId == 'modalAccessToken') {
                let tokenmp = interaction.fields.getTextInputValue('accessTokenText');
                await axios.get(`https://api.mercadopago.com/v1/payments/search`, {
                    headers: {
                        "Authorization": `Bearer ${tokenmp}`
                    }
                }).then(async (response) => {
                    await dbConfigs.set(`vendas.payments.mpAcessToken`, tokenmp)
                    let message = await mpMethod(client, interaction)
                    await interaction.update(message)


                }).catch(async (err) => {
                    await interaction.reply({
                        content: `❌ | Access token invalido.`,
                        flags: MessageFlags.Ephemeral
                    })
                })
            }
            if (interaction.customId == `modalBonusDeposit`) {
                const bonusInserted = interaction.fields.getTextInputValue(`bonusDepositNum`)

                if (isNaN(bonusInserted)) {
                    await interaction.reply({
                        content: `❌ | O bônus inserido não é um número válido.`,
                        flags: MessageFlags.Ephemeral
                    })
                    return;
                } else {
                    if (bonusInserted > 100) {
                        await interaction.reply({
                            content: `⚠ | O bônus deve ser menor ou igual a **100**.`,
                            flags: MessageFlags.Ephemeral
                        })
                        return;
                    };
                };

                await dbConfigs.set(`vendas.balance.bonusDeposit`, Number(bonusInserted))

                let message = await SaldoPayment(client, interaction)
                await interaction.update(message)
            }
            if (interaction.customId == `modalMinimumDeposit`) {
                const valueInserted = interaction.fields.getTextInputValue(`minimumDepositNum`)
                    .trim()
                    .replace(`R$`, ``)

                const valueRegex = /^\d+(\.\d{1,2})?$/;
                if (!valueRegex.test(valueInserted)) {
                    await interaction.reply({
                        content: `❌ | O valor inserido é inválido.`,
                        flags: MessageFlags.Ephemeral
                    })
                    return;
                };

                await dbConfigs.set(`vendas.balance.minimumDeposit`, Number(valueInserted))
                let message = await SaldoPayment(client, interaction)
                await interaction.update(message)
            }


            if (interaction.customId == 'modalPix') {

                const pixKeyInserted = interaction.fields.getTextInputValue(`pixKeyText`)
                    .trim()
                    .toLowerCase()
                const pixKeyTypeInserted = interaction.fields.getTextInputValue(`pixKeyTypeText`)
                    .trim()

                await dbConfigs.set(`vendas.semiAuto.pix.key`, pixKeyInserted)
                await dbConfigs.set(`vendas.semiAuto.pix.keyType`, pixKeyTypeInserted)

                let message = await semiAutoMethod(client, interaction)
                await interaction.update(message)


            }


            if (interaction.customId === 'modalQrCode') {
                const qrCode = interaction.fields.getTextInputValue('qrCodeText')
                if (qrCode == 'remover') {
                    await dbConfigs.set(`vendas.semiAuto.qrCode`, 'none')
                } else {
                    await dbConfigs.set(`vendas.semiAuto.qrCode`, qrCode)
                }
                let message = await semiAutoMethod(client, interaction)
                await interaction.update(message)
            }

            if (interaction.customId.startsWith('modalConfirmDelete-')) {
                const idProduct = interaction.customId.replace('modalConfirmDelete-', "");
                const insertedText = interaction.fields.getTextInputValue('confirmText').toLowerCase();

                if (insertedText === 'sim') {
                    const nameP = await dbProducts.get(`${idProduct}.name`);
                    await dbProducts.delete(idProduct);

                    // Remover dos painéis
                    const allPanels = dbPanels.all();
                    for (const panel of allPanels) {
                        if (panel.data.products && panel.data.products[idProduct]) {
                            await dbPanels.delete(`${panel.ID}.products.${idProduct}`);
                        }
                    }

                    await interaction.update({
                        embeds: [new EmbedBuilder()
                            .setTitle(`${client.user.username} | Produto Excluido`)
                            .setDescription(`✅ | Produto: **${nameP}** deletado com sucesso.`)
                            .setColor(`Green`)
                        ],
                        components: []
                    });
                } else {
                    await interaction.reply({ content: "❌ | Exclusão cancelada. Você deve digitar 'SIM'.", flags: MessageFlags.Ephemeral });
                }
            }

            // Handler do modal de criar produto
            if (interaction.customId === 'criarProdutoModal') {
                const idProduct = interaction.fields.getTextInputValue('produtoIdInput')
                    .trim()
                    .replace(/\s/g, "");
                const nomeProduct = interaction.fields.getTextInputValue('produtoNomeInput')?.trim() || 'Não configurado(a).';
                const precoProduct = interaction.fields.getTextInputValue('produtoPrecoInput')?.trim().replace('R$', '').replace(',', '.') || '10.00';
                const descricaoProduct = interaction.fields.getTextInputValue('produtoDescricaoInput')?.trim() || 'Não configurado(a).';

                // Validar ID do produto
                if (idProduct.includes(".") || idProduct.includes("-")) {
                    await interaction.reply({
                        content: `❌ | ID do produto: **${idProduct}** não pode conter **.** ou **-**.`,
                        flags: MessageFlags.Ephemeral
                    });
                    return;
                }

                if (dbProducts.has(idProduct)) {
                    await interaction.reply({
                        content: `❌ | ID do produto: **${idProduct}** já existe.`,
                        flags: MessageFlags.Ephemeral
                    });
                    return;
                }

                if (!isNaN(idProduct)) {
                    await interaction.reply({
                        content: `❌ | O ID do produto deve ser um texto, não apenas números.`,
                        flags: MessageFlags.Ephemeral
                    });
                    return;
                }

                // Validar preço
                const precoRegex = /^\d+(\.\d{1,2})?$/;
                const precoFinal = precoRegex.test(precoProduct) ? precoProduct : '10.00';

                const corGeral = dbConfigs.get('vendas.embeds.color');
                const moment = require('moment');

                await dbProducts.set(`${idProduct}.id`, idProduct);
                await dbProducts.set(`${idProduct}.name`, nomeProduct);
                await dbProducts.set(`${idProduct}.description`, descricaoProduct);
                await dbProducts.set(`${idProduct}.thumbUrl`, "none");
                await dbProducts.set(`${idProduct}.bannerUrl`, "none");
                await dbProducts.set(`${idProduct}.color`, corGeral);
                await dbProducts.set(`${idProduct}.price`, precoFinal);
                await dbProducts.set(`${idProduct}.role`, "none");
                await dbProducts.set(`${idProduct}.useCoupon`, true);
                await dbProducts.set(`${idProduct}.stock`, []);
                await dbProducts.set(`${idProduct}.notificationUsers`, {});
                await dbProducts.set(`${idProduct}.creationData`, moment());

                const nameP = await dbProducts.get(`${idProduct}.name`);
                const descriptionP = await dbProducts.get(`${idProduct}.description`);
                const thumbP = await dbProducts.get(`${idProduct}.thumbUrl`);
                const bannerP = await dbProducts.get(`${idProduct}.bannerUrl`);
                const colorP = await dbProducts.get(`${idProduct}.color`);
                const priceP = await dbProducts.get(`${idProduct}.price`);
                const estoqueP = await dbProducts.get(`${idProduct}.stock`);

                // EMOJIS
                const dinheiroEmoji = `<:dinheiro:${dbe.get('dinheiro')}>`;
                const caixaEmoji = `<:caixa:${dbe.get('caixa')}>`;
                const estrelaEmoji = `<a:estrela:${dbe.get('estrela')}>`;
                const carrinhoEmoji = `<:carrinho:${dbe.get('carrinho')}>`;
                const suporteEmoji = `<:suporte:${dbe.get('suporte')}>`;
                const editarEmoji = `<:editar:${dbe.get('editar')}>`;
                const saco_dinheiroEmoji = `<:saco_dinheiro:${dbe.get('saco_dinheiro')}>`;
                const docEmoji = `<:doc:${dbe.get('doc')}>`;

                const thumbC = dbConfigs.get(`vendas.images.thumbUrl`);
                const bannerC = dbConfigs.get(`vendas.images.bannerUrl`);
                const buttonDuvidas = dbConfigs.get(`buttonDuvidas`);

                const embedProduct = new EmbedBuilder()
                    .setTitle(`${nameP}`)
                    .setDescription(`${estrelaEmoji} **${nameP}**\n\n${descriptionP}\n\n${dinheiroEmoji} **Valor:** R$ ${Number(priceP).toFixed(2).replace('.', ',')}\n${caixaEmoji} **Estoque:** ${estoqueP.length} unidades\n\n${carrinhoEmoji} *Selecione uma opção abaixo para comprar.*`)
                    .setThumbnail(thumbP !== "none" ? thumbP : thumbC !== "none" ? thumbC : "https://sem-img.com")
                    .setImage(bannerP !== "none" ? bannerP : bannerC !== "none" ? bannerC : "https://sem-img.com")
                    .setColor(colorP != "none" ? colorP : "#460580")
                    .setFooter({ text: `${client.user.username} - Todos os direitos reservados.`, iconURL: client.user.avatarURL() });

                if (buttonDuvidas !== "none" && buttonDuvidas) {
                    const msg = await interaction.channel.send({
                        content: ``,
                        embeds: [embedProduct],
                        components: [
                            new ActionRowBuilder()
                                .addComponents(
                                    new ButtonBuilder().setCustomId(idProduct).setLabel(`Comprar`).setEmoji(`<:carrinho:1236021394610061352>`).setStyle(`Success`),
                                    new ButtonBuilder().setURL(`https://discord.com/channels/${interaction.guild.id}/${buttonDuvidas}`).setLabel(`Dúvidas`).setEmoji(`${suporteEmoji}`).setStyle(`Link`)
                                )
                        ]
                    });
                    await dbProducts.set(`${idProduct}.msgLocalization.channelId`, interaction.channel.id);
                    await dbProducts.set(`${idProduct}.msgLocalization.messageId`, msg.id);
                } else {
                    const msg = await interaction.channel.send({
                        content: ``,
                        embeds: [embedProduct],
                        components: [
                            new ActionRowBuilder()
                                .addComponents(
                                    new ButtonBuilder().setCustomId(idProduct).setLabel(`Comprar`).setEmoji(`<:carrinho:1236021394610061352>`).setStyle(`Success`)
                                )
                        ]
                    });
                    await dbProducts.set(`${idProduct}.msgLocalization.channelId`, interaction.channel.id);
                    await dbProducts.set(`${idProduct}.msgLocalization.messageId`, msg.id);
                }

                // Interface de edição simplificada conforme a imagem
                const rowProduct1 = new ActionRowBuilder()
                    .addComponents(
                        new ButtonBuilder().setCustomId(`changeName_${idProduct}`).setLabel(`NOME`).setEmoji(`${editarEmoji}`).setStyle(`Success`),
                        new ButtonBuilder().setCustomId(`changePrice_${idProduct}`).setLabel(`PREÇO`).setEmoji(`${saco_dinheiroEmoji}`).setStyle(`Success`),
                        new ButtonBuilder().setCustomId(`changeDescription_${idProduct}`).setLabel(`DESCRIÇÃO`).setEmoji(`${docEmoji}`).setStyle(`Success`),
                        new ButtonBuilder().setCustomId(`configStock_${idProduct}`).setLabel(`ESTOQUE`).setEmoji(`${caixaEmoji}`).setStyle(`Success`)
                    );

                const rowProduct2 = new ActionRowBuilder()
                    .addComponents(
                        new ButtonBuilder().setCustomId(`advancedConfigs_${idProduct}`).setLabel(`Configurações Avançadas`).setEmoji(`${configEmoji}`).setStyle(`Primary`),
                        new ButtonBuilder().setCustomId(`updateMsg_${idProduct}`).setLabel(`Atualizar Mensagem`).setEmoji(`${loadingEmoji}`).setStyle(`Primary`),
                        new ButtonBuilder().setCustomId(`deleteProduct_${idProduct}`).setEmoji(`${lixoEmoji}`).setStyle(`Danger`),
                        new ButtonBuilder().setCustomId(`infoProduct_${idProduct}`).setEmoji(`${lupaEmoji}`).setStyle(`Primary`)
                    );

                const embedConfig = new EmbedBuilder()
                    .setTitle(`${client.user.username} | Configurando Produto`)
                    .setDescription(`**${modalEmoji} | Descrição:**\n\n${descriptionP}\n\n**${docEmoji} ID: **${idProduct}**\n${carrinhoEmoji} Produto: **${nameP}**\n${dinheiroEmoji} Valor à vista: **${Number(priceP).toLocaleString(global.lenguage.um, { style: 'currency', currency: global.lenguage.dois })}**\n${caixaEmoji} Estoque:** ${estoqueP.length}`)
                    .setImage(bannerP != "none" ? bannerP : "https://sem-img.com")
                    .setColor(colorP != "none" ? colorP : "#460580")
                    .setFooter({ text: `${client.user.username} - Todos os direitos reservados.`, iconURL: client.user.avatarURL() });

                await interaction.reply({
                    content: `✅ | Produto **${nameP}** criado com sucesso!`,
                    embeds: [embedConfig],
                    components: [rowProduct1, rowProduct2],
                    flags: MessageFlags.Ephemeral
                });
            }

        }


        //Ticket System
        if (interaction.customId === "configsugestsistem") {
            const sistema = dbConfigs.get(`ticket.sugest.sistema`) === "ON" ? "\`🟢 Ligado\`" : "\`🔴 Desligado\`"

            const channel = interaction.guild.channels.cache.get(dbConfigs.get(`ticket.sugest.channel`))
            const embed = new EmbedBuilder()
                .setColor(dbConfigs.get(`ticket.color`) || "Default")
                .setAuthor({ name: `Configurando Sistema Sugestão`, iconURL: interaction.guild.iconURL({ dynamic: true }) })
                .addFields(
                    {
                        name: `Sistema ON/OFF:`,
                        value: `${sistema || 'Não definido'}`,
                        inline: true
                    },
                    {
                        name: `Emojis Atuais:`,
                        value: `Emoji Concordo: \`${dbConfigs.get(`ticket.sugest.certo`) || 'Não configurado'}\`.\nEmoji Discordo: \`${dbConfigs.get(`ticket.sugest.errado`) || 'Não configurado'}\`.`,
                        inline: true
                    },
                    {
                        name: `Atual Canal de Sugestão:`,
                        value: `${channel || "`Não Definido`"}`
                    }
                )
            const row = new ActionRowBuilder()
                .addComponents(
                    new ButtonBuilder()
                        .setStyle(dbConfigs.get(`ticket.sugest.sistema`) === "ON" ? 3 : 4)
                        .setCustomId(`sugestonoff`)
                        .setLabel(dbConfigs.get(`ticket.sugest.sistema`) === "ON" ? "Sistema (Ligado)" : "Sistema (Desligado)" || 'Não configurado')
                        .setEmoji(dbConfigs.get(`ticket.sugest.sistema`) === "ON" ? "<:on_mt:1232722645238288506>" : "<:off:1243274635748048937>" || '❌'),
                    new ButtonBuilder()
                        .setStyle(2)
                        .setCustomId(`sugestmudaemojicerto`)
                        .setLabel(`Mudar Emoji Concordo`)
                        .setEmoji(dbConfigs.get(`ticket.sugest.certo`) || '✔'),
                    new ButtonBuilder()
                        .setStyle(2)
                        .setCustomId(`sugestmudaemojidiscordo`)
                        .setLabel(`Mudar Emoji Discordo`)
                        .setEmoji(dbConfigs.get(`ticket.sugest.errado`) || '❌'),
                    new ButtonBuilder()
                        .setStyle(2)
                        .setCustomId(`sugestmudachannel`)
                        .setLabel(`Mudar Canal`)
                        .setEmoji("<:comentario:1245612394634543134>"),
                    new ButtonBuilder()
                        .setStyle(1)
                        .setCustomId(`configAutomaticas`)

                        .setEmoji(voltarEmoji)
                )
            interaction.update({ embeds: [embed], components: [row] })
        }

        if (interaction.customId === "sugestonoff") {
            // Obtenha o valor atual primeiro
            const currentValue = dbConfigs.get(`ticket.sugest.sistema`);

            // Defina o novo valor com base no valor atual
            if (currentValue === "ON") {
                await dbConfigs.set(`ticket.sugest.sistema`, "OFF");
            } else {
                await dbConfigs.set(`ticket.sugest.sistema`, "ON");
            }

            // Continue com o resto do código
            const sistema = dbConfigs.get(`ticket.sugest.sistema`) === "ON" ? "\`🟢 Ligado\`" : "\`🔴 Desligado\`";

            const channel = interaction.guild.channels.cache.get(dbConfigs.get(`ticket.sugest.channel`))
            const embed = new EmbedBuilder()
                .setColor(dbConfigs.get(`ticket.color`) || "Default")
                .setAuthor({ name: `Configurando Sistema Sugestão`, iconURL: interaction.guild.iconURL({ dynamic: true }) })
                .addFields(
                    {
                        name: `Sistema ON/OFF:`,
                        value: `${sistema || 'Não definido'}`,
                        inline: true
                    },
                    {
                        name: `Emojis Atuais:`,
                        value: `Emoji Concordo: \`${dbConfigs.get(`ticket.sugest.certo`) || 'Não configurado'}\`.\nEmoji Discordo: \`${dbConfigs.get(`ticket.sugest.errado`) || 'Não configurado'}\`.`,
                        inline: true
                    },
                    {
                        name: `Atual Canal de Sugestão:`,
                        value: `${channel || "`Não Definido`"}`
                    }
                )
            const row = new ActionRowBuilder()
                .addComponents(
                    new ButtonBuilder()
                        .setStyle(dbConfigs.get(`ticket.sugest.sistema`) === "ON" ? 3 : 4)
                        .setCustomId(`sugestonoff`)
                        .setLabel(dbConfigs.get(`ticket.sugest.sistema`) === "ON" ? "Sistema (Ligado)" : "Sistema (Desligado)" || 'Não configurado')
                        .setEmoji(dbConfigs.get(`ticket.sugest.sistema`) === "ON" ? "<:on_mt:1232722645238288506>" : "<:off:1243274635748048937>" || '❌'),
                    new ButtonBuilder()
                        .setStyle(2)
                        .setCustomId(`sugestmudaemojicerto`)
                        .setLabel(`Mudar Emoji Concordo`)
                        .setEmoji(dbConfigs.get(`ticket.sugest.certo`) || '✔'),
                    new ButtonBuilder()
                        .setStyle(2)
                        .setCustomId(`sugestmudaemojidiscordo`)
                        .setLabel(`Mudar Emoji Discordo`)
                        .setEmoji(dbConfigs.get(`ticket.sugest.errado`) || '❌'),
                    new ButtonBuilder()
                        .setStyle(2)
                        .setCustomId(`sugestmudachannel`)
                        .setLabel(`Mudar Canal`)
                        .setEmoji("<:comentario:1245612394634543134>"),
                    new ButtonBuilder()
                        .setStyle(1)
                        .setCustomId(`configAutomaticas`)

                        .setEmoji(voltarEmoji)
                )

            interaction.update({ embeds: [embed], components: [row] })
        }

        if (interaction.customId === "sugestmudachannel") {
            const select = new ActionRowBuilder()
                .addComponents(
                    new ChannelSelectMenuBuilder()
                        .setChannelTypes(ChannelType.GuildText)
                        .setCustomId(`channel_select_sugest`)
                        .setMaxValues(1)
                        .setPlaceholder(`Selecione um canal...`),
                )
            const row = new ActionRowBuilder()
                .addComponents(
                    new ButtonBuilder()
                        .setStyle(1)
                        .setCustomId(`configsugestsistem`)
                        .setEmoji(dbEmojis.get(`29`))
                )
            interaction.update({
                embeds: [
                    new EmbedBuilder()
                        .setAuthor({ name: `Configurando Sistema Sugestão`, iconURL: interaction.guild.iconURL({ dynamic: true }) })
                        .setDescription(`Selecione o canal que será definido como o canal de sugestão.`)
                        .setColor(dbConfigs.get(`ticket.color`) || "Default")
                ], components: [select, row]
            })
        }

        if (interaction.isChannelSelectMenu()) {
            const cargos = interaction.values

            if (interaction.customId === "channel_select_logs") {
                cargos.map((cargos) => {
                    dbConfigs.set(`ticket.ticket.canal_logs`, cargos)
                    embedAndButtonConfig()
                    const channellogs = interaction.guild.channels.cache.get(dbConfigs.get(`ticket.ticket.canal_logs`))
                    interaction.channel.send({ content: `${dbEmojis.get(`6`)} | Canal de logs alterado com sucesso! O novo canal é ${channellogs}` }).then(msg => {
                        setTimeout(() => {
                            msg.delete().catch(err => { })
                        }, 5000)
                    })
                })
            }

            if (interaction.customId === "channel_select_avalia") {
                cargos.map((cargos) => {
                    dbConfigs.set(`ticket.ticket.canal_avalia`, cargos)
                    embedAndButtonConfig()
                    const channelavalia = interaction.guild.channels.cache.get(dbConfigs.get(`ticket.ticket.canal_avalia`))
                    interaction.channel.send({ content: `${dbEmojis.get(`6`)} | Canal de avaliação alterado com sucesso! O novo canal é ${channelavalia}` }).then(msg => {
                        setTimeout(() => {
                            msg.delete().catch(err => { })
                        }, 5000)
                    })
                })
            }

            if (interaction.customId === "channel_select_category") {
                cargos.map((cargos) => {
                    dbConfigs.set(`ticket.ticket.categoria`, cargos)
                    embedAndButtonConfig()
                    const categoria = interaction.guild.channels.cache.get(dbConfigs.get(`ticket.ticket.categoria`))
                    interaction.channel.send({ content: `${dbEmojis.get(`6`)} | Categoria padrão alterado com sucesso! A nova categoria é ${categoria}` }).then(msg => {
                        setTimeout(() => {
                            msg.delete().catch(error => { })
                        }, 5000)
                    })
                })
            }

            if (interaction.customId === "channel_select_sugest") {
                cargos.map(async (cargos) => {
                    dbConfigs.set(`ticket.sugest.channel`, cargos)
                    const sistema = dbConfigs.get(`ticket.sugest.sistema`) === "ON" ? "\`🟢 Ligado\`" : "\`🔴 Desligado\`"

                    const channel = interaction.guild.channels.cache.get(dbConfigs.get(`ticket.sugest.channel`))
                    const embed = new EmbedBuilder()
                        .setColor(dbConfigs.get(`ticket.color`) || "Default")
                        .setAuthor({ name: `Configurando Sistema Sugestão`, iconURL: interaction.guild.iconURL({ dynamic: true }) })
                        .addFields(
                            {
                                name: `Sistema ON/OFF:`,
                                value: `${sistema || 'Não definido'}`,
                                inline: true
                            },
                            {
                                name: `Emojis Atuais:`,
                                value: `Emoji Concordo: \`${dbConfigs.get(`ticket.sugest.certo`) || 'Não configurado'}\`.\nEmoji Discordo: \`${dbConfigs.get(`ticket.sugest.errado`) || 'Não configurado'}\`.`,
                                inline: true
                            },
                            {
                                name: `Atual Canal de Sugestão:`,
                                value: `${channel || "`Não Definido`"}`
                            }
                        )
                    const row = new ActionRowBuilder()
                        .addComponents(
                            new ButtonBuilder()
                                .setStyle(dbConfigs.get(`ticket.sugest.sistema`) === "ON" ? 3 : 4)
                                .setCustomId(`sugestonoff`)
                                .setLabel(dbConfigs.get(`ticket.sugest.sistema`) === "ON" ? "Sistema (Ligado)" : "Sistema (Desligado)" || 'Não configurado')
                                .setEmoji(dbConfigs.get(`ticket.sugest.sistema`) === "ON" ? "<:on_mt:1232722645238288506>" : "<:off:1243274635748048937>" || '❌'),
                            new ButtonBuilder()
                                .setStyle(2)
                                .setCustomId(`sugestmudaemojicerto`)
                                .setLabel(`Mudar Emoji Concordo`)
                                .setEmoji(dbConfigs.get(`ticket.sugest.certo`) || '✔'),
                            new ButtonBuilder()
                                .setStyle(2)
                                .setCustomId(`sugestmudaemojidiscordo`)
                                .setLabel(`Mudar Emoji Discordo`)
                                .setEmoji(dbConfigs.get(`ticket.sugest.errado`) || '❌'),
                            new ButtonBuilder()
                                .setStyle(2)
                                .setCustomId(`sugestmudachannel`)
                                .setLabel(`Mudar Canal`)
                                .setEmoji("<:comentario:1245612394634543134>"),
                            new ButtonBuilder()
                                .setStyle(1)
                                .setCustomId(`configAutomaticas`)

                                .setEmoji(voltarEmoji)
                        )
                    interaction.update({ embeds: [embed], components: [row] })
                })
            }
        }

        if (interaction.customId === "sugestmudaemojidiscordo") {
            interaction.deferUpdate()
            interaction.channel.send(`${dbEmojis.get(`16`)} | Envie um emoji aqui no chat...`).then(msg => {
                const filter = m => m.author.id === interaction.user.id;
                const collector = interaction.message.channel.createMessageCollector({ filter, max: 1 })
                collector.on("collect", async message => {
                    message.delete()
                    const newt = message.content

                    const emojiRegex = /[\u{1F300}-\u{1F5FF}\u{1F600}-\u{1F64F}\u{1F680}-\u{1F6FF}\u{2600}-\u{26FF}\u{2700}-\u{27BF}]/u;

                    if (emojiRegex.test(newt)) {
                        dbConfigs.set(`ticket.sugest.errado`, newt)
                        msg.edit({ content: `${dbEmojis.get(`6`)} | Emoji trocado com sucesso!` }).then(msg => {
                            setTimeout(() => {
                                msg.delete().catch(err => { })
                            }, 5000)
                        })
                    } else if (newt.startsWith("<")) {
                        dbConfigs.set(`ticket.sugest.errado`, newt)
                        msg.edit({ content: `${dbEmojis.get(`6`)} | Emoji trocado com sucesso!` }).then(msg => {
                            setTimeout(() => {
                                msg.delete().catch(err => { })
                            }, 5000)
                        })
                    } else {
                        msg.edit({ content: `${dbEmojis.get(`13`)} | Mande um emoji válido!` }).then(msg => {
                            setTimeout(() => {
                                msg.delete().catch(err => { })
                            }, 5000)
                        })
                    }

                    const sistema = dbConfigs.get(`ticket.sugest.sistema`) === "ON" ? "\`🟢 Ligado\`" : "\`🔴 Desligado\`"

                    const channel = interaction.guild.channels.cache.get(dbConfigs.get(`ticket.sugest.channel`))
                    const embed = new EmbedBuilder()
                        .setColor(dbConfigs.get(`ticket.color`) || "Default")
                        .setAuthor({ name: `Configurando Sistema Sugestão`, iconURL: interaction.guild.iconURL({ dynamic: true }) })
                        .addFields(
                            {
                                name: `Sistema ON/OFF:`,
                                value: `${sistema || 'Não definido'}`,
                                inline: true
                            },
                            {
                                name: `Emojis Atuais:`,
                                value: `Emoji Concordo: \`${dbConfigs.get(`ticket.sugest.certo`) || 'Não configurado'}\`.\nEmoji Discordo: \`${dbConfigs.get(`ticket.sugest.errado`) || 'Não configurado'}\`.`,
                                inline: true
                            },
                            {
                                name: `Atual Canal de Sugestão:`,
                                value: `${channel || "`Não Definido`"}`
                            }
                        )
                    const row = new ActionRowBuilder()
                        .addComponents(
                            new ButtonBuilder()
                                .setStyle(dbConfigs.get(`ticket.sugest.sistema`) === "ON" ? 3 : 4)
                                .setCustomId(`sugestonoff`)
                                .setLabel(dbConfigs.get(`ticket.sugest.sistema`) === "ON" ? "Sistema (Ligado)" : "Sistema (Desligado)" || 'Não configurado')
                                .setEmoji(dbConfigs.get(`ticket.sugest.sistema`) === "ON" ? "<:on_mt:1232722645238288506>" : "<:off:1243274635748048937>" || '❌'),
                            new ButtonBuilder()
                                .setStyle(2)
                                .setCustomId(`sugestmudaemojicerto`)
                                .setLabel(`Mudar Emoji Concordo`)
                                .setEmoji(dbConfigs.get(`ticket.sugest.certo`) || '✔'),
                            new ButtonBuilder()
                                .setStyle(2)
                                .setCustomId(`sugestmudaemojidiscordo`)
                                .setLabel(`Mudar Emoji Discordo`)
                                .setEmoji(dbConfigs.get(`ticket.sugest.errado`) || '❌'),
                            new ButtonBuilder()
                                .setStyle(2)
                                .setCustomId(`sugestmudachannel`)
                                .setLabel(`Mudar Canal`)
                                .setEmoji("<:comentario:1245612394634543134>"),
                            new ButtonBuilder()
                                .setStyle(1)
                                .setCustomId(`configAutomaticas`)

                                .setEmoji(voltarEmoji)
                        )
                    interaction.message.edit({ embeds: [embed], components: [row] })
                })
            })
        }

        if (interaction.customId === "sugestmudaemojicerto") {
            interaction.deferUpdate()
            interaction.channel.send(`${dbEmojis.get(`16`)} | Envie um emoji aqui no chat...`).then(msg => {
                const filter = m => m.author.id === interaction.user.id;
                const collector = interaction.message.channel.createMessageCollector({ filter, max: 1 })
                collector.on("collect", async message => {
                    message.delete()
                    const newt = message.content

                    const emojiRegex = /[\u{1F300}-\u{1F5FF}\u{1F600}-\u{1F64F}\u{1F680}-\u{1F6FF}\u{2600}-\u{26FF}\u{2700}-\u{27BF}]/u;

                    if (emojiRegex.test(newt)) {
                        dbConfigs.set(`ticket.sugest.certo`, newt)
                        msg.edit({ content: `${dbEmojis.get(`6`)} | Emoji trocado com sucesso!` }).then(msg => {
                            setTimeout(() => {
                                msg.delete().catch(err => { })
                            }, 5000)
                        })
                    } else if (newt.startsWith("<")) {
                        dbConfigs.set(`ticket.sugest.certo`, newt)
                        msg.edit({ content: `${dbEmojis.get(`6`)} | Emoji trocado com sucesso!` }).then(msg => {
                            setTimeout(() => {
                                msg.delete().catch(err => { })
                            }, 5000)
                        })
                    } else {
                        msg.edit({ content: `${dbEmojis.get(`13`)} | Mande um emoji válido!` }).then(msg => {
                            setTimeout(() => {
                                msg.delete().catch(err => { })
                            }, 5000)
                        })
                    }

                    const sistema = dbConfigs.get(`ticket.sugest.sistema`) === "ON" ? "\`🟢 Ligado\`" : "\`🔴 Desligado\`"

                    const channel = interaction.guild.channels.cache.get(dbConfigs.get(`ticket.sugest.channel`))
                    const embed = new EmbedBuilder()
                        .setColor(dbConfigs.get(`ticket.color`) || "Default")
                        .setAuthor({ name: `Configurando Sistema Sugestão`, iconURL: interaction.guild.iconURL({ dynamic: true }) })
                        .addFields(
                            {
                                name: `Sistema ON/OFF:`,
                                value: `${sistema || 'Não definido'}`,
                                inline: true
                            },
                            {
                                name: `Emojis Atuais:`,
                                value: `Emoji Concordo: \`${dbConfigs.get(`ticket.sugest.certo`) || 'Não configurado'}\`.\nEmoji Discordo: \`${dbConfigs.get(`ticket.sugest.errado`) || 'Não configurado'}\`.`,
                                inline: true
                            },
                            {
                                name: `Atual Canal de Sugestão:`,
                                value: `${channel || "`Não Definido`"}`
                            }
                        )
                    const row = new ActionRowBuilder()
                        .addComponents(
                            new ButtonBuilder()
                                .setStyle(dbConfigs.get(`ticket.sugest.sistema`) === "ON" ? 3 : 4)
                                .setCustomId(`sugestonoff`)
                                .setLabel(dbConfigs.get(`ticket.sugest.sistema`) === "ON" ? "Sistema (Ligado)" : "Sistema (Desligado)" || 'Não configurado')
                                .setEmoji(dbConfigs.get(`ticket.sugest.sistema`) === "ON" ? "<:on_mt:1232722645238288506>" : "<:off:1243274635748048937>" || '❌'),
                            new ButtonBuilder()
                                .setStyle(2)
                                .setCustomId(`sugestmudaemojicerto`)
                                .setLabel(`Mudar Emoji Concordo`)
                                .setEmoji(dbConfigs.get(`ticket.sugest.certo`) || '✔'),
                            new ButtonBuilder()
                                .setStyle(2)
                                .setCustomId(`sugestmudaemojidiscordo`)
                                .setLabel(`Mudar Emoji Discordo`)
                                .setEmoji(dbConfigs.get(`ticket.sugest.errado`) || '❌'),
                            new ButtonBuilder()
                                .setStyle(2)
                                .setCustomId(`sugestmudachannel`)
                                .setLabel(`Mudar Canal`)
                                .setEmoji("<:comentario:1245612394634543134>"),
                            new ButtonBuilder()
                                .setStyle(1)
                                .setCustomId(`configAutomaticas`)

                                .setEmoji(voltarEmoji)
                        )

                    interaction.message.edit({ embeds: [embed], components: [row] })
                })
            })
        }

        if (interaction.customId === "configticket") {
            await embedAndButtonConfig()
        }

        if (interaction.customId === "voltarconfigchannel") {
            await embedAndButtonConfig()
        }

        const rowVoltarConfigChannel = new ActionRowBuilder()
            .addComponents(
                new ButtonBuilder()
                    .setStyle(1)
                    .setCustomId(`voltarconfigchannel`)
                    .setEmoji(voltarEmoji)
            )

        if (interaction.isButton()) {
            const option = interaction.customId;

            if (option === "configpainel") {
                const paineldaitro = new EmbedBuilder()
                    .setAuthor({ name: `Configurando Painel Ticket`, iconURL: interaction.guild.iconURL({ dynamic: true }) })
                    .addFields(
                        {
                            name: `Veja as variáveis para você inserir na mensagem:`,
                            value: `\nMencionar quem abriu ticket: **{user}**\nExibir Codigo do Ticket: **{codigo}**\nMostrar quem Assumiu Ticket: **{assumido}**\nMostra o motivo do ticket: **{motivo}**\nMostra a descrição do ticket: **{desc}**\nMostra os horários do ticket: **{horario1}** e **{horario2}** **Ex:** [Horario 1](https://media.discordapp.net/attachments/1239421940624658543/1242999434695151686/image.png?ex=664fe0ef&is=664e8f6f&hm=dce9cee145702f6140bd769a9d76a90b90ac3f317674004f797d18bc6ea15b52&=&format=webp&quality=lossless&width=135&height=14), [Horario 2](https://media.discordapp.net/attachments/1239421940624658543/1242999423198302228/image.png?ex=664fe0ec&is=664e8f6c&hm=cf08c6111e0472d19f6dca06715e18bea3ddf720174077458a38552793a6ffff&=&format=webp&quality=lossless&width=56&height=12)`,
                            inline: false
                        },
                        {
                            name: `Mensagem do Painel Atual`,
                            value: `\n${dbConfigs.get(`ticket.painel.desc`)}`,
                            inline: false
                        }
                    )
                    .setColor(dbConfigs.get(`ticket.color`))

                const rogerio = new ActionRowBuilder()
                    .addComponents(
                        new ButtonBuilder()
                            .setStyle(2)
                            .setCustomId(`alterarmensagem_painel`)
                            .setLabel(`Alterar Mensagem`)
                            .setEmoji("<:copy7:1225478184330596575>"),
                        new ButtonBuilder()
                            .setStyle(2)
                            .setCustomId(`alterarimg_painel`)
                            .setLabel(`Alterar Imagens`)
                            .setEmoji("<:emoji_51:1242969823206441010>"),
                        new ButtonBuilder()
                            .setStyle(4)
                            .setCustomId(`reset_msg_painel`)
                            .setLabel(`Resetar`)
                            .setEmoji("<a:load:1241739159375188099>"),
                        new ButtonBuilder()
                            .setStyle(1)
                            .setCustomId(`voltarconfigchannel`)

                            .setEmoji("<:emoji_6:1239445960447361085>"),
                    )

                interaction.update({ embeds: [paineldaitro], components: [rogerio] })

            }

            if (option === "configlogs") {
                const select = new ActionRowBuilder()
                    .addComponents(
                        new ChannelSelectMenuBuilder()
                            .setChannelTypes(ChannelType.GuildText)
                            .setCustomId(`channel_select_logs`)
                            .setMaxValues(1)
                            .setPlaceholder(`Selecione um canal...`),
                    )
                interaction.update({
                    embeds: [
                        new EmbedBuilder()
                            .setAuthor({ name: `Configurando Canais`, iconURL: interaction.guild.iconURL({ dynamic: true }) })
                            .setDescription(`Selecione o canal que será definido como o canal de logs.`)
                            .setColor(dbConfigs.get(`ticket.color`) || "Default")
                    ], components: [select, rowVoltarConfigChannel]
                })
            }

            if (option === "configavaliacao") {
                const select = new ActionRowBuilder()
                    .addComponents(
                        new ChannelSelectMenuBuilder()
                            .setChannelTypes(ChannelType.GuildText)
                            .setCustomId(`channel_select_avalia`)
                            .setMaxValues(1)
                            .setPlaceholder(`Selecione um canal...`),
                    )
                interaction.update({
                    embeds: [
                        new EmbedBuilder()
                            .setAuthor({ name: `Configurando Canais`, iconURL: interaction.guild.iconURL({ dynamic: true }) })
                            .setDescription(`Selecione o canal que será definido como o canal de avaliação.`)
                            .setColor(dbConfigs.get(`ticket.color`) || "Default")
                    ], components: [select, rowVoltarConfigChannel]
                })
            }

            if (option === "cargostaff") {
                const select = new ActionRowBuilder()
                    .addComponents(
                        new RoleSelectMenuBuilder()
                            .setCustomId(`role_select_staff`)
                            .setMaxValues(1)
                            .setPlaceholder(`Selecione um cargo...`),
                    )
                interaction.update({
                    embeds: [
                        new EmbedBuilder()
                            .setAuthor({ name: `Configurando Canais`, iconURL: interaction.guild.iconURL({ dynamic: true }) })
                            .setDescription(`Selecione o cargo que será definido como o cargo staff.`)
                            .setColor(dbConfigs.get(`ticket.color`) || "Default")
                    ], components: [select, rowVoltarConfigChannel]
                })
            }

            if (option === "configcategoria") {
                const select = new ActionRowBuilder()
                    .addComponents(
                        new ChannelSelectMenuBuilder()
                            .setChannelTypes(ChannelType.GuildCategory)
                            .setCustomId(`channel_select_category`)
                            .setMaxValues(1)
                            .setPlaceholder(`Selecione uma categoria...`),
                    )
                interaction.update({
                    embeds: [
                        new EmbedBuilder()
                            .setAuthor({ name: `Configurando Canais`, iconURL: interaction.guild.iconURL({ dynamic: true }) })
                            .setDescription(`Selecione a categoria que será definido como a categoria padrão aonde os tickets serão abertos.`)
                            .setColor(dbConfigs.get(`ticket.color`) || "Default")
                    ], components: [select, rowVoltarConfigChannel]
                })
            }
        }

        if (interaction.customId === "reset_msg_painel") {
            const msg_resetada = ":bell: | Olá {user}! **Seja bem-vindo(a) ao seu ticket.**\n\n:zap: | Os **TICKETS** são totalmente privados, apenas membros da STAFF possuem acesso a este canal.\n\n:rotating_light: | Evite **MARCAÇÕES.** Aguarde até que um **STAFF** te atenda.\n\n:man_police_officer: | Staff que assumiu o ticket {assumido}\n:envelope_with_arrow: | Motivo do Ticket: __**{motivo}**__"
            dbConfigs.set(`ticket.painel.desc`, msg_resetada)

            interaction.reply({ content: `${dbEmojis.get(`6`)} | Mensagem resetada com sucesso!`, flags: MessageFlags.Ephemeral })
            const paineldaitro = new EmbedBuilder()
                .setAuthor({ name: `Configurando Painel Ticket`, iconURL: interaction.guild.iconURL({ dynamic: true }) })
                .addFields(
                    {
                        name: `Veja as variáveis para você inserir na mensagem:`,
                        value: `\nMencionar quem abriu ticket: **{user}**\nExibir Codigo do Ticket: **{codigo}**\nMostrar quem Assumiu Ticket: **{assumido}**\nMostra o motivo do ticket: **{motivo}**\nMostra a descrição do ticket: **{desc}**\nMostra os horários do ticket: **{horario1}** e **{horario2}** **Ex:** [Horario 1](https://media.discordapp.net/attachments/1239421940624658543/1242999434695151686/image.png?ex=664fe0ef&is=664e8f6f&hm=dce9cee145702f6140bd769a9d76a90b90ac3f317674004f797d18bc6ea15b52&=&format=webp&quality=lossless&width=135&height=14), [Horario 2](https://media.discordapp.net/attachments/1239421940624658543/1242999423198302228/image.png?ex=664fe0ec&is=664e8f6c&hm=cf08c6111e0472d19f6dca06715e18bea3ddf720174077458a38552793a6ffff&=&format=webp&quality=lossless&width=56&height=12)`,
                        inline: false
                    },
                    {
                        name: `Mensagem do Painel Atual`,
                        value: `\n${dbConfigs.get(`ticket.painel.desc`)}`,
                        inline: false
                    }
                )
                .setColor(dbConfigs.get(`ticket.color`))

            const rogerio = new ActionRowBuilder()
                .addComponents(
                    new ButtonBuilder()
                        .setStyle(2)
                        .setCustomId(`alterarmensagem_painel`)
                        .setLabel(`Alterar Mensagem`)
                        .setEmoji("<:copy7:1225478184330596575>"),
                    new ButtonBuilder()
                        .setStyle(2)
                        .setCustomId(`alterarimg_painel`)
                        .setLabel(`Alterar Imagens`)
                        .setEmoji("<:emoji_51:1242969823206441010>"),
                    new ButtonBuilder()
                        .setStyle(4)
                        .setCustomId(`reset_msg_painel`)
                        .setLabel(`Resetar`)
                        .setEmoji("<a:load:1241739159375188099>"),
                    new ButtonBuilder()
                        .setStyle(1)
                        .setCustomId(`voltarconfigchannel`)

                        .setEmoji("<:emoji_6:1239445960447361085>"),
                )

            interaction.message.edit({ embeds: [paineldaitro], components: [rogerio] })
        }

        if (interaction.customId === "alterarmensagem_painel") {
            const modal = new ModalBuilder().setCustomId("alterar_painel_msg").setTitle("Alterar Painel")

            const text = new TextInputBuilder()
                .setCustomId("text_modal")
                .setLabel("Edite a mensagem painel")
                .setPlaceholder("Digite aqui ✏")
                .setStyle(2)
                .setValue(`${dbConfigs.get(`ticket.painel.desc`)}`)

            modal.addComponents(new ActionRowBuilder().addComponents(text))

            interaction.showModal(modal)
        }

        if (interaction.isModalSubmit() && interaction.customId === "alterar_painel_msg") {
            const text = interaction.fields.getTextInputValue("text_modal")

            dbConfigs.set(`ticket.painel.desc`, text)

            interaction.reply({
                content: `${dbEmojis.get(`6`)} | Painel alterado com sucesso!`,
                flags: MessageFlags.Ephemeral
            })
            const paineldaitro = new EmbedBuilder()
                .setAuthor({ name: `Configurando Painel Ticket`, iconURL: interaction.guild.iconURL({ dynamic: true }) })
                .addFields(
                    {
                        name: `Veja as variáveis para você inserir na mensagem:`,
                        value: `\nMencionar quem abriu ticket: **{user}**\nExibir Codigo do Ticket: **{codigo}**\nMostrar quem Assumiu Ticket: **{assumido}**\nMostra o motivo do ticket: **{motivo}**\nMostra a descrição do ticket: **{desc}**\nMostra os horários do ticket: **{horario1}** e **{horario2}** **Ex:** [Horario 1](https://media.discordapp.net/attachments/1239421940624658543/1242999434695151686/image.png?ex=664fe0ef&is=664e8f6f&hm=dce9cee145702f6140bd769a9d76a90b90ac3f317674004f797d18bc6ea15b52&=&format=webp&quality=lossless&width=135&height=14), [Horario 2](https://media.discordapp.net/attachments/1239421940624658543/1242999423198302228/image.png?ex=664fe0ec&is=664e8f6c&hm=cf08c6111e0472d19f6dca06715e18bea3ddf720174077458a38552793a6ffff&=&format=webp&quality=lossless&width=56&height=12)`,
                        inline: false
                    },
                    {
                        name: `Mensagem do Painel Atual`,
                        value: `\n${dbConfigs.get(`ticket.painel.desc`)}`,
                        inline: false
                    }
                )
                .setColor(dbConfigs.get(`ticket.color`))

            const rogerio = new ActionRowBuilder()
                .addComponents(
                    new ButtonBuilder()
                        .setStyle(2)
                        .setCustomId(`alterarmensagem_painel`)
                        .setLabel(`Alterar Mensagem`)
                        .setEmoji("<:copy7:1225478184330596575>"),
                    new ButtonBuilder()
                        .setStyle(2)
                        .setCustomId(`alterarimg_painel`)
                        .setLabel(`Alterar Imagens`)
                        .setEmoji("<:emoji_51:1242969823206441010>"),
                    new ButtonBuilder()
                        .setStyle(4)
                        .setCustomId(`reset_msg_painel`)
                        .setLabel(`Resetar`)
                        .setEmoji("<a:load:1241739159375188099>"),
                    new ButtonBuilder()
                        .setStyle(1)
                        .setCustomId(`voltarconfigchannel`)

                        .setEmoji("<:emoji_6:1239445960447361085>"),
                )

            interaction.message.edit({ embeds: [paineldaitro], components: [rogerio] })
        }

        if (interaction.customId === "alterarimg_painel") {
            let banner;
            let thumb;
            if (dbConfigs.get(`ticket.painel.banner`)) {
                banner = `[Clique aqui para ver](${dbConfigs.get(`ticket.painel.banner`)})`
            } else {
                banner = "`Não Definido`"
            }
            if (dbConfigs.get(`ticket.painel.thumb`)) {
                thumb = `[Clique aqui para ver](${dbConfigs.get(`ticket.painel.thumb`)})`
            } else {
                thumb = "`Não Definido`"
            }
            const embed = new EmbedBuilder()
                .setAuthor({ name: `Configurando Painel Ticket (Imagens)`, iconURL: interaction.guild.iconURL({ dynamic: true }) })
                .addFields(
                    {
                        name: `Banner:`,
                        value: `${banner}`,
                        inline: true
                    },
                    {
                        name: `Thumbnail:`,
                        value: `${thumb}`,
                        inline: true
                    }
                )
                .setColor(dbConfigs.get(`ticket.color`))

            const row = new ActionRowBuilder()
                .addComponents(
                    new ButtonBuilder()
                        .setStyle(2)
                        .setCustomId(`alterarimg_banner`)
                        .setLabel(`Alterar Banner`),
                    new ButtonBuilder()
                        .setStyle(2)
                        .setCustomId(`alterarimg_thumb`)
                        .setLabel(`Alterar Thumbnail`),
                    new ButtonBuilder()
                        .setStyle(4)
                        .setCustomId(`reset_painel_img`)
                        .setLabel(`Resetar`)
                        .setEmoji("<a:load:1241739159375188099>"),
                    new ButtonBuilder()
                        .setStyle(1)
                        .setCustomId(`voltarconfigpainel`)

                        .setEmoji("<:emoji_6:1239445960447361085>"),
                )

            interaction.update({ embeds: [embed], components: [row] })
        }

        if (interaction.customId === "alterarimg_banner") {
            const modal = new ModalBuilder()
                .setCustomId("alterar_painel_banner")
                .setTitle("Alterar Banner")

            const text = new TextInputBuilder()
                .setCustomId("text_modal")
                .setLabel("Envie o link do novo banner")
                .setPlaceholder("Digite aqui ✏")
                .setStyle(1)

            modal.addComponents(new ActionRowBuilder().addComponents(text))

            interaction.showModal(modal)
        }

        if (interaction.isModalSubmit() && interaction.customId === "alterar_painel_banner") {
            const text = interaction.fields.getTextInputValue("text_modal")

            if (!text.startsWith("https://")) {
                interaction.reply({ content: `${dbEmojis.get(`13`)} | Link inválido!`, flags: MessageFlags.Ephemeral })
                return;
            }
            interaction.reply({ content: `${dbEmojis.get(`6`)} | Alterado!`, flags: MessageFlags.Ephemeral })
            dbConfigs.set(`ticket.painel.banner`, text)
            let banner;
            let thumb;
            if (dbConfigs.get(`ticket.painel.banner`)) {
                banner = `[Clique aqui para ver](${dbConfigs.get(`ticket.painel.banner`)})`
            } else {
                banner = "`Não Definido`"
            }
            if (dbConfigs.get(`ticket.painel.thumb`)) {
                thumb = `[Clique aqui para ver](${dbConfigs.get(`ticket.painel.thumb`)})`
            } else {
                thumb = "`Não Definido`"
            }
            const embed = new EmbedBuilder()
                .setAuthor({ name: `Configurando Painel Ticket (Imagens)`, iconURL: interaction.guild.iconURL({ dynamic: true }) })
                .addFields(
                    {
                        name: `Banner:`,
                        value: `${banner}`,
                        inline: true
                    },
                    {
                        name: `Thumbnail:`,
                        value: `${thumb}`,
                        inline: true
                    }
                )
                .setColor(dbConfigs.get(`ticket.color`))

            const row = new ActionRowBuilder()
                .addComponents(
                    new ButtonBuilder()
                        .setStyle(2)
                        .setCustomId(`alterarimg_banner`)
                        .setLabel(`Alterar Banner`),
                    new ButtonBuilder()
                        .setStyle(2)
                        .setCustomId(`alterarimg_thumb`)
                        .setLabel(`Alterar Thumbnail`),
                    new ButtonBuilder()
                        .setStyle(4)
                        .setCustomId(`reset_painel_img`)
                        .setLabel(`Resetar`)
                        .setEmoji("<a:load:1241739159375188099>"),
                    new ButtonBuilder()
                        .setStyle(1)
                        .setCustomId(`voltarconfigpainel`)

                        .setEmoji("<:emoji_6:1239445960447361085>"),
                )

            interaction.message.edit({ embeds: [embed], components: [row] })
        }

        if (interaction.customId === "alterarimg_thumb") {
            const modal = new ModalBuilder()
                .setCustomId("alterar_painel_thumb")
                .setTitle("Alterar Thumbnail")

            const text = new TextInputBuilder()
                .setCustomId("text_modal")
                .setLabel("Envie o link da nova thumbnail")
                .setPlaceholder("Digite aqui ✏")
                .setStyle(1)

            modal.addComponents(new ActionRowBuilder().addComponents(text))

            interaction.showModal(modal)
        }

        if (interaction.isModalSubmit() && interaction.customId === "alterar_painel_thumb") {
            const text = interaction.fields.getTextInputValue("text_modal")

            if (!text.startsWith("https://")) {
                interaction.reply({ content: `${dbEmojis.get(`13`)} | Link inválido!`, flags: MessageFlags.Ephemeral })
                return;
            }
            interaction.reply({ content: `${dbEmojis.get(`6`)} | Alterado!`, flags: MessageFlags.Ephemeral })
            dbConfigs.set(`ticket.painel.thumb`, text)
            let banner;
            let thumb;
            if (dbConfigs.get(`ticket.painel.banner`)) {
                banner = `[Clique aqui para ver](${dbConfigs.get(`ticket.painel.banner`)})`
            } else {
                banner = "`Não Definido`"
            }
            if (dbConfigs.get(`ticket.painel.thumb`)) {
                thumb = `[Clique aqui para ver](${dbConfigs.get(`ticket.painel.thumb`)})`
            } else {
                thumb = "`Não Definido`"
            }
            const embed = new EmbedBuilder()
                .setAuthor({ name: `Configurando Painel Ticket (Imagens)`, iconURL: interaction.guild.iconURL({ dynamic: true }) })
                .addFields(
                    {
                        name: `Banner:`,
                        value: `${banner}`,
                        inline: true
                    },
                    {
                        name: `Thumbnail:`,
                        value: `${thumb}`,
                        inline: true
                    }
                )
                .setColor(dbConfigs.get(`ticket.color`))

            const row = new ActionRowBuilder()
                .addComponents(
                    new ButtonBuilder()
                        .setStyle(2)
                        .setCustomId(`alterarimg_banner`)
                        .setLabel(`Alterar Banner`),
                    new ButtonBuilder()
                        .setStyle(2)
                        .setCustomId(`alterarimg_thumb`)
                        .setLabel(`Altar Thumbnail`),
                    new ButtonBuilder()
                        .setStyle(4)
                        .setCustomId(`reset_painel_img`)
                        .setLabel(`Resetar`)
                        .setEmoji("<a:load:1241739159375188099>"),
                    new ButtonBuilder()
                        .setStyle(1)
                        .setCustomId(`voltarconfigpainel`)

                        .setEmoji("<:emoji_6:1239445960447361085>"),
                )

            interaction.message.edit({ embeds: [embed], components: [row] })
        }

        if (interaction.customId === "reset_painel_img") {
            dbConfigs.delete(`ticket.painel.banner`)
            dbConfigs.delete(`ticket.painel.thumb`)
            interaction.reply({ content: `${dbEmojis.get(`6`)} | Resetado!`, flags: MessageFlags.Ephemeral })
            let banner;
            let thumb;
            if (dbConfigs.get(`ticket.painel.banner`)) {
                banner = `[Clique aqui para ver](${dbConfigs.get(`ticket.painel.banner`)})`
            } else {
                banner = "`Não Definido`"
            }
            if (dbConfigs.get(`ticket.painel.thumb`)) {
                thumb = `[Clique aqui para ver](${dbConfigs.get(`ticket.painel.thumb`)})`
            } else {
                thumb = "`Não Definido`"
            }
            const embed = new EmbedBuilder()
                .setAuthor({ name: `Configurando Painel Ticket (Imagens)`, iconURL: interaction.guild.iconURL({ dynamic: true }) })
                .addFields(
                    {
                        name: `Banner:`,
                        value: `${banner}`,
                        inline: true
                    },
                    {
                        name: `Thumbnail:`,
                        value: `${thumb}`,
                        inline: true
                    }
                )
                .setColor(dbConfigs.get(`ticket.color`))

            const row = new ActionRowBuilder()
                .addComponents(
                    new ButtonBuilder()
                        .setStyle(2)
                        .setCustomId(`alterarimg_banner`)
                        .setLabel(`Alterar Banner`),
                    new ButtonBuilder()
                        .setStyle(2)
                        .setCustomId(`alterarimg_thumb`)
                        .setLabel(`Altar Thumbnail`),
                    new ButtonBuilder()
                        .setStyle(4)
                        .setCustomId(`reset_painel_img`)
                        .setLabel(`Resetar`)
                        .setEmoji("<a:load:1241739159375188099>"),
                    new ButtonBuilder()
                        .setStyle(1)
                        .setCustomId(`voltarconfigpainel`)

                        .setEmoji("<:emoji_6:1239445960447361085>"),
                )

            interaction.message.edit({ embeds: [embed], components: [row] })
        }

        if (interaction.customId === "voltarconfigpainel") {
            const paineldaitro = new EmbedBuilder()
                .setAuthor({ name: `Configurando Painel Ticket`, iconURL: interaction.guild.iconURL({ dynamic: true }) })
                .addFields(
                    {
                        name: `Veja as variáveis para você inserir na mensagem:`,
                        value: `\nMencionar quem abriu ticket: **{user}**\nExibir Codigo do Ticket: **{codigo}**\nMostrar quem Assumiu Ticket: **{assumido}**\nMostra o motivo do ticket: **{motivo}**\nMostra a descrição do ticket: **{desc}**\nMostra os horários do ticket: **{horario1}** e **{horario2}** **Ex:** [Horario 1](https://media.discordapp.net/attachments/1239421940624658543/1242999434695151686/image.png?ex=664fe0ef&is=664e8f6f&hm=dce9cee145702f6140bd769a9d76a90b90ac3f317674004f797d18bc6ea15b52&=&format=webp&quality=lossless&width=135&height=14), [Horario 2](https://media.discordapp.net/attachments/1239421940624658543/1242999423198302228/image.png?ex=664fe0ec&is=664e8f6c&hm=cf08c6111e0472d19f6dca06715e18bea3ddf720174077458a38552793a6ffff&=&format=webp&quality=lossless&width=56&height=12)`,
                        inline: false
                    },
                    {
                        name: `Mensagem do Painel Atual`,
                        value: `\n${dbConfigs.get(`ticket.painel.desc`)}`,
                        inline: false
                    }
                )
                .setColor(dbConfigs.get(`ticket.color`))

            const rogerio = new ActionRowBuilder()
                .addComponents(
                    new ButtonBuilder()
                        .setStyle(2)
                        .setCustomId(`alterarmensagem_painel`)
                        .setLabel(`Alterar Mensagem`)
                        .setEmoji("<:copy7:1225478184330596575>"),
                    new ButtonBuilder()
                        .setStyle(2)
                        .setCustomId(`alterarimg_painel`)
                        .setLabel(`Alterar Imagens`)
                        .setEmoji("<:emoji_51:1242969823206441010>"),
                    new ButtonBuilder()
                        .setStyle(4)
                        .setCustomId(`reset_msg_painel`)
                        .setLabel(`Resetar`)
                        .setEmoji("<a:load:1241739159375188099>"),
                    new ButtonBuilder()
                        .setStyle(1)
                        .setCustomId(`voltarconfigchannel`)

                        .setEmoji("<:emoji_6:1239445960447361085>"),
                )

            interaction.update({ embeds: [paineldaitro], components: [rogerio] })
        }

        if (interaction.isRoleSelectMenu() && interaction.customId === "role_select_staff") {
            const cargos = interaction.values
            cargos.map(async (cargos) => {
                if (dbConfigs.get(`ticket.ticket.cargo_staff`)?.includes(cargos)) {
                    dbConfigs.pull(`ticket.ticket.cargo_staff`, (roleExist) => roleExist === cargos)
                    interaction.channel.send({ content: `${dbEmojis.get(`6`)} | Esse cargo já existia e foi removido:\n <@&${cargos}>` }).then(msg => {
                        setTimeout(() => {
                            msg.delete().catch(error => { })
                        }, 5000)
                    })
                } else {
                    dbConfigs.push(`ticket.ticket.cargo_staff`, cargos)
                    interaction.channel.send({ content: `${dbEmojis.get(`6`)} | Cargo staff adicionado com sucesso! Cargo adicionado:\n <@&${cargos}>` }).then(msg => {
                        setTimeout(() => {
                            msg.delete().catch(error => { })
                        }, 5000)
                    })
                }
                embedAndButtonConfig()
            })
        }

        async function embedAndButtonConfig() {
            const channellogs = interaction.guild.channels.cache.get(dbConfigs.get(`ticket.ticket.canal_logs`))
            const channelavalia = interaction.guild.channels.cache.get(dbConfigs.get(`ticket.ticket.canal_avalia`))
            const categoria = interaction.guild.channels.cache.get(dbConfigs.get(`ticket.ticket.categoria`))
            let cargostaff = ''
            const mapRoles = dbConfigs.all().filter(ticket => ticket.ID == "ticket")
            const findRoles = mapRoles.map((t) => t.data.ticket.cargo_staff)
            cargostaff = Object.entries(findRoles[0]).map(([key, value]) => `<@&${value}>`).join('\n');

            const embed = new EmbedBuilder()
                .setAuthor({ name: `Configurando Canais`, iconURL: interaction.guild.iconURL({ dynamic: true }) })
                .setDescription(`Selecione umas das opções abaixo para configurar os canais.`)
                .setColor(dbConfigs.get(`ticket.color`) || "Default")
                .addFields(
                    {
                        name: `Canal de Logs:`,
                        value: `${channellogs || "\`Não Definido\`"}`,
                        inline: true
                    },
                    {
                        name: `Canal de Avaliação`,
                        value: `${channelavalia || "\`Não Definido\`"}`,
                        inline: true
                    },
                    {
                        name: `Categoria Padrão Ticket`,
                        value: `${categoria || "\`Não Definido\`"}`,
                        inline: true
                    },
                    {
                        name: `Cargo Staff`,
                        value: `${cargostaff || "\`Não Definido\`"}`,
                        inline: true
                    }
                )

            // Primeira linha com 3 botões
            const row1 = new ActionRowBuilder()
                .addComponents(
                    new ButtonBuilder()
                        .setStyle(2)
                        .setCustomId(`configlogs`)
                        .setLabel(`Canal de Logs`)
                        .setEmoji(`<:lupa:1237266965974880257>`),
                    new ButtonBuilder()
                        .setStyle(2)
                        .setCustomId(`configavaliacao`)
                        .setLabel(`Canal de Avaliação`)
                        .setEmoji(`<:emoji_51:1242968988171112498>`),
                    new ButtonBuilder()
                        .setStyle(2)
                        .setCustomId(`configpainel`)
                        .setLabel(`Painel Ticket`)
                        .setEmoji(`<:emoji_52:1242969865686487171>`)
                )

            // Segunda linha com 2 botões de configuração e o botão de voltar
            const row2 = new ActionRowBuilder()
                .addComponents(
                    new ButtonBuilder()
                        .setStyle(2)
                        .setCustomId(`cargostaff`)
                        .setLabel(`Cargo Staff`)
                        .setEmoji(`<:suportee:1225478087660273826>`),
                    new ButtonBuilder()
                        .setStyle(2)
                        .setCustomId(`configcategoria`)
                        .setLabel(`Categoria Padrão`)
                        .setEmoji(`<:emoji_4:1239445904826695750>`),
                    new ButtonBuilder()
                        .setStyle(1)
                        .setCustomId(`voltarconfiginicio`)
                        .setEmoji("<:emoji_6:1239445960447361085>")
                )

            interaction.update({
                embeds: [embed],
                components: [row1, row2],
                files: []
            })
        }

        if (interaction.customId === "configbot") {
            const embed = new EmbedBuilder()
                .setAuthor({ name: `Configurando Bot`, iconURL: interaction.guild.iconURL({ dynamic: true }) })
                .setDescription(`Selecione uma das opções abaixo para configurar diretamente o seu bot.`)
                .addFields(
                    {
                        name: `Nome do BOT:`,
                        value: `${interaction.client.user.username}`,
                        inline: true
                    },
                    {
                        name: `Avatar:`,
                        value: `[Clique aqui para ver](${interaction.client.user.displayAvatarURL({ dynamic: true })})`,
                        inline: true
                    },
                    {
                        name: `Cor:`,
                        value: `\`${dbConfigs.get(`ticket.color`) != null ? `\`${dbConfigs.get(`ticket.color`)}\`` : `\`Não configurado.\``}\``
                    }
                )
                .setColor(dbConfigs.get(`ticket.color`) || "Default")

            const row2 = new ActionRowBuilder()
                .addComponents(
                    new ButtonBuilder().setStyle(2).setCustomId(`configname`).setLabel(`Alterar Nome`).setEmoji(`${editarEmoji}`),
                    new ButtonBuilder().setStyle(2).setCustomId(`configavatar`).setLabel(`Alterar Avatar`).setEmoji(`${userEmoji}`),
                    new ButtonBuilder().setStyle(2).setCustomId(`configcor`).setLabel(`Alterar Cor`).setEmoji(`${corEmoji}`),
                    new ButtonBuilder().setStyle(2).setCustomId(`changeBanner22`).setLabel(`Alterar Banner`).setEmoji(`${imagem}`).setDisabled(false),
                )

            // novo botão
            const row3 = new ActionRowBuilder()
                .addComponents(
                    new ButtonBuilder().setStyle(2).setCustomId(`changeThumbnail22`).setLabel(`Alterar Miniatura`).setEmoji(`${modalEmoji}`).setDisabled(false),
                    new ButtonBuilder().setStyle(2).setCustomId(`configstatus`).setLabel(`Alterar Status`).setEmoji(`${lupaEmoji}`),
                    new ButtonBuilder().setStyle(2).setCustomId(`configemojis`).setLabel(`Alterar Emojis`).setEmoji("<:emoji_47:1240119456236048476>"),
                )

            const row = new ActionRowBuilder()
                .addComponents(
                    new ButtonBuilder()
                        .setStyle(1)
                        .setCustomId(`voltarconfiginicio`)
                        .setEmoji(`<:voltar:1365849508059287633>`)
                )
            interaction.update({
                embeds: [embed],
                components: [row2, row3, row],
                files: []
            })
        }

        if (interaction.customId === "configAutomaticas") {
            interaction.update({
                embeds: [
                    new EmbedBuilder()
                        .setTitle(`Central de Sistemas Automáticos`)
                        .setColor(dbConfigs.get(`ticket.color`) || "Default")
                        .setDescription(`
            ### Bem-vindo(a) ${interaction.user} à Central de Automação!
            
            Transforme seu servidor em um ambiente inteligente e eficiente com nossos sistemas automatizados. Economize tempo, melhore a experiência dos usuários e mantenha seu servidor organizado sem esforço manual.
            
            **Recursos disponíveis:**
            
            📨 **Mensagens Automáticas**
            • Configure mensagens programadas para envio em canais específicos
            • Personalize conteúdo, horários e frequência das mensagens
            
            🔒 **Lock e Unlock Automático**
            • Programe horários para fechar e abrir canais automaticamente
            • Opção para limpar mensagens durante o fechamento
            • Ideal para manter canais organizados em períodos de inatividade
            
            😀 **Reações Automáticas**
            • Configure o bot para reagir automaticamente a mensagens em canais específicos
            • Personalize emojis para diferentes canais
            • Aumente o engajamento dos usuários de forma automática
            
            💡 **Sistema de Sugestão**
            • Canal dedicado para membros enviarem sugestões
            • Sistema de votação com reações automáticas
            • Aprovação/rejeição facilitada para a equipe de administração
            
            🎁 **Sistema de Sorteios**
            • Crie sorteios personalizados com duração programada
            • Defina requisitos de participação com controle por cargos
            • Seleção automática de vencedores e distribuição de prêmios
            • Notificações para vencedores e opção de cargo exclusivo
            
            **Selecione uma função abaixo para configurar:**
                        `)
                        .setFooter({ text: 'Dica: Todas as configurações podem ser alteradas a qualquer momento' })
                        .setTimestamp()
                ],
                components: [
                    // Primeira linha: 3 botões
                    new ActionRowBuilder()
                        .addComponents(
                            new ButtonBuilder()
                                .setStyle(2)
                                .setCustomId(`configmensagens`)
                                .setLabel(`Mensagens Automáticas`)
                                .setEmoji(`<:message:1371956437387051038>`),
                            new ButtonBuilder()
                                .setStyle(2)
                                .setCustomId(`configLockUnlock`)
                                .setLabel(`Lock e Unlock Automático`)
                                .setEmoji(`<:cadeado:1364987321576853626>`),
                            new ButtonBuilder()
                                .setStyle(2)
                                .setCustomId(`configReacao`)
                                .setLabel(`Reações Automáticas`)
                                .setEmoji(`<:emoji_51:1242968988171112498>`)
                        ),
                    // Segunda linha: 2 botões
                    new ActionRowBuilder()
                        .addComponents(
                            new ButtonBuilder()
                                .setStyle(2)
                                .setCustomId(`configsugestsistem`)
                                .setLabel(`Sistema de Sugestão`)
                                .setEmoji(`<:comentario:1245612394634543134>`),
                            new ButtonBuilder()
                                .setStyle(2)
                                .setCustomId(`configSorteio`)
                                .setLabel(`Sistema de Sorteios`)
                                .setEmoji(`<:gift:1371956210294591548>`),
                            new ButtonBuilder()
                                .setCustomId(`voltarconfiginicio`)
                                .setEmoji(`<:voltar:1365849508059287633>`)
                                .setStyle(1)
                        ),
                    // Terceira linha: botão de voltar
                    // new ActionRowBuilder()
                    //     .addComponents(
                    //         new ButtonBuilder()
                    //             .setCustomId(`voltarconfiginicio`)
                    //             .setEmoji(`<:voltar:1365849508059287633>`)
                    //             .setStyle(1)
                    //     )
                ],
                files: []
            });
        }



        if (interaction.customId === "voltarconfigbot") {
            const embed = new EmbedBuilder()
                .setAuthor({ name: `Configurando Bot`, iconURL: interaction.guild.iconURL({ dynamic: true }) })
                .setDescription(`Selecione uma das opções abaixo para configurar diretamente o seu bot.`)
                .addFields(
                    {
                        name: `Nome do BOT:`,
                        value: `${interaction.client.user.username}`,
                        inline: true
                    },
                    {
                        name: `Avatar:`,
                        value: `[Clique aqui para ver](${interaction.client.user.displayAvatarURL({ dynamic: true })})`,
                        inline: true
                    },
                    {
                        name: `Cor:`,
                        value: `\`${dbConfigs.get(`ticket.color`) != null ? `\`${dbConfigs.get(`ticket.color`)}\`` : `\`Não configurado.\``}\``
                    }
                )
                .setColor(dbConfigs.get(`ticket.color`) || "Default")

            const row2 = new ActionRowBuilder()
                .addComponents(
                    new ButtonBuilder()
                        .setStyle(2)
                        .setCustomId(`configname`)
                        .setLabel(`Alterar Nome`)
                        .setEmoji(`${editarEmoji}`),
                    new ButtonBuilder()
                        .setStyle(2)
                        .setCustomId(`configavatar`)
                        .setLabel(`Alterar Avatar`)
                        .setEmoji(`${userEmoji}`),
                    new ButtonBuilder()
                        .setStyle(2)
                        .setCustomId(`configstatus`)
                        .setLabel(`Alterar Status`)
                        .setEmoji(`${lupaEmoji}`),
                    new ButtonBuilder()
                        .setStyle(2)
                        .setCustomId(`configcor`)
                        .setLabel(`Alterar Cor`)
                        .setEmoji(`${corEmoji}`),
                    new ButtonBuilder()
                        .setStyle(2)
                        .setCustomId(`configemojis`)
                        .setLabel(`Alterar Emojis`)
                        .setEmoji("<:emoji_47:1240119456236048476>"),
                )

            const row = new ActionRowBuilder()
                .addComponents(
                    new ButtonBuilder()
                        .setStyle(1)
                        .setCustomId(`voltarconfig`)
                        .setEmoji("<:emoji_6:1239445960447361085>")
                )
            interaction.update({
                embeds: [embed],
                components: [row2, row]
            })
        }

        if (interaction.isButton()) {
            const option = interaction.customId;

            if (option === "configemojis") {
                var emojis = '';
                dbEmojis.all().map((entry, index) => { emojis += `${index + 1} - ${entry.data}\n`; })
                const Embed = new EmbedBuilder()
                    .setAuthor({ name: `Configurando Emojis`, iconURL: interaction.guild.iconURL({ dynamic: true }) })
                    .setDescription(`Selecione abaixo qual opção deseja alterar em seus emojis. É importante que você preste atenção nas configurações atuais para garantir que suas alterações sejam feitas corretamente.\n\n${emojis}`)
                    .setColor(dbConfigs.get(`ticket.color`))

                const row1 = new ActionRowBuilder()
                    .addComponents(
                        new ButtonBuilder()
                            .setStyle(2)
                            .setCustomId(`configemoji`)
                            .setLabel(`Editar Emoji`)
                            .setEmoji("<:emoji_11:1239446146015821925>"),
                        new ButtonBuilder()
                            .setStyle(1)
                            .setCustomId(`configbot`)
                            .setEmoji("<:emoji_6:1239445960447361085>")
                    )
                interaction.update({ embeds: [Embed], components: [row1] })
            }

            if (option === "configname") {
                const modal = new ModalBuilder()
                    .setCustomId("modalconfigname")
                    .setTitle("Alterar nome do BOT")
                const text = new TextInputBuilder()
                    .setCustomId("text")
                    .setLabel("Qual sera o novo nome do bot?")
                    .setStyle(1)
                    .setPlaceholder("Coloque o nome que você deseja")
                    .setRequired(true)

                modal.addComponents(new ActionRowBuilder().addComponents(text))
                await interaction.showModal(modal)
            }

            if (option === "configavatar") {
                const modal = new ModalBuilder()
                    .setCustomId("modalconfigavatar")
                    .setTitle("Alterar avatar do BOT")
                const text = new TextInputBuilder()
                    .setCustomId("text")
                    .setLabel("Qual sera o novo avatar do bot?")
                    .setStyle(1)
                    .setPlaceholder("Coloque a url que você deseja")
                    .setRequired(true)

                modal.addComponents(new ActionRowBuilder().addComponents(text))
                await interaction.showModal(modal)
            }

            if (option === "configstatus") {
                const modal = new ModalBuilder()
                    .setTitle("Alterar Status do seu BOT")
                    .setCustomId("modalconfigstatus")

                const text = new TextInputBuilder()
                    .setCustomId("presence")
                    .setRequired(true)
                    .setPlaceholder("Online, Ausente, Invisivel ou Ocupado")
                    .setLabel("ESCOLHA O TIPO DE PRESENÇA:")
                    .setStyle(1)

                const text1 = new TextInputBuilder()
                    .setCustomId("atividade")
                    .setRequired(true)
                    .setPlaceholder("Jogando, Assistindo, Competindo, Transmitindo, Ouvindo")
                    .setLabel("ESCOLHA O TIPO DE ATIVIDADE:")
                    .setStyle(1)

                const text2 = new TextInputBuilder()
                    .setCustomId("text_ativd")
                    .setRequired(true)
                    .setPlaceholder("Digite aqui")
                    .setLabel("ESCREVA O TEXTO DA ATIVIDADE:")
                    .setStyle(1)

                const text3 = new TextInputBuilder()
                    .setCustomId("url")
                    .setRequired(false)
                    .setLabel("URL DO CANAL:")
                    .setPlaceholder("Se a escolha foi Transmitindo, Coloque a Url aqui, ex: https://www.twitch.tv/discord")
                    .setStyle(2)

                modal.addComponents(new ActionRowBuilder().addComponents(text))
                modal.addComponents(new ActionRowBuilder().addComponents(text1))
                modal.addComponents(new ActionRowBuilder().addComponents(text2))
                modal.addComponents(new ActionRowBuilder().addComponents(text3))

                await interaction.showModal(modal)
            }

            if (option === "configcor") {
                const modal = new ModalBuilder()
                    .setCustomId("modalconfigcorrrr")
                    .setTitle("Alterar cor do BOT")
                const text = new TextInputBuilder()
                    .setCustomId("text")
                    .setLabel("Qual sera a nova cor do bot?")
                    .setStyle(1)
                    .setPlaceholder("Ex: #ff00b4")
                    .setRequired(true)

                modal.addComponents(new ActionRowBuilder().addComponents(text))
                await interaction.showModal(modal)
            }
        }

        if (interaction.customId === "configemoji") {
            const modal = new ModalBuilder()
                .setCustomId("modalconfigemoji")
                .setTitle("Alterar os emojis do BOT")
            const text = new TextInputBuilder()
                .setCustomId("text")
                .setLabel("Digite o id do emojis.")
                .setStyle(1)
                .setPlaceholder("Coloque o id do emoji aqui:")
                .setRequired(true)

            modal.addComponents(new ActionRowBuilder().addComponents(text))
            await interaction.showModal(modal)
        }

        if (interaction.isModalSubmit() && interaction.customId === "modalconfigcorrrr") {
            const text = interaction.fields.getTextInputValue("text")

            if (text.startsWith("#")) {
                dbConfigs.set(`ticket.color`, text)
                dbConfigs.set(`vendas.embeds.color`, text)
                interaction.reply({ content: `${dbEmojis.get(`6`)} | Cor alterada com sucesso!`, flags: MessageFlags.Ephemeral })
                const embed = new EmbedBuilder()
                    .setAuthor({ name: `Configurando Bot`, iconURL: interaction.guild.iconURL({ dynamic: true }) })
                    .setDescription(`Selecione uma das opções abaixo para configurar diretamente o seu bot.`)
                    .addFields(
                        {
                            name: `Nome do BOT:`,
                            value: `${interaction.client.user.username}`,
                            inline: true
                        },
                        {
                            name: `Avatar:`,
                            value: `[Clique aqui para ver](${interaction.client.user.displayAvatarURL({ dynamic: true })})`,
                            inline: true
                        },
                        {
                            name: `Cor:`,
                            value: `\`${dbConfigs.get(`ticket.color`) != null ? `\`${dbConfigs.get(`ticket.color`)}\`` : `\`Não configurado.\``}\``
                        }
                    )
                    .setColor(dbConfigs.get(`ticket.color`) || "Default")

                const row2 = new ActionRowBuilder()
                    .addComponents(
                        new ButtonBuilder()
                            .setStyle(2)
                            .setCustomId(`configname`)
                            .setLabel(`Alterar Nome`)
                            .setEmoji(`${editarEmoji}`),
                        new ButtonBuilder()
                            .setStyle(2)
                            .setCustomId(`configavatar`)
                            .setLabel(`Alterar Avatar`)
                            .setEmoji(`${userEmoji}`),
                        new ButtonBuilder()
                            .setStyle(2)
                            .setCustomId(`configstatus`)
                            .setLabel(`Alterar Status`)
                            .setEmoji(`${lupaEmoji}`),
                        new ButtonBuilder()
                            .setStyle(2)
                            .setCustomId(`configcor`)
                            .setLabel(`Alterar Cor`)
                            .setEmoji(`${corEmoji}`),
                        new ButtonBuilder()
                            .setStyle(2)
                            .setCustomId(`configemojis`)
                            .setLabel(`Alterar Emojis`)
                            .setEmoji("<:emoji_47:1240119456236048476>"),
                    )

                const row = new ActionRowBuilder()
                    .addComponents(
                        new ButtonBuilder()
                            .setStyle(1)
                            .setCustomId(`voltarconfig`)
                            .setEmoji("<:emoji_6:1239445960447361085>")
                    )
                interaction.message.edit({
                    embeds: [embed],
                    components: [row2, row]
                })
            } else {
                interaction.reply({ content: `${dbEmojis.get(`13`)} | Cor inválida!`, flags: MessageFlags.Ephemeral })
            }
        }

        if (interaction.isModalSubmit() && interaction.customId === "modalconfigemoji") {
            const text = interaction.fields.getTextInputValue("text")
            const emojiantigo = `${dbEmojis.get(`${text}`)}`;

            if (!isNaN(text)) {
                if (dbEmojis.has(text)) {
                    const embed = new EmbedBuilder()
                        .setTitle(`Configurando Emojis`)
                        .setDescription(`${dbEmojis.get(`16`)} | Envie abaixo o emoji que deseja substituir o emoji ${emojiantigo} (\`${text}\`), lembrando o BOT precisa estar no servidor em qual este emoji vai estar.`)
                    interaction.update({ embeds: [embed], components: [] }).then(msg => {
                        const filter = m => m.author.id === interaction.user.id;
                        const collector = interaction.message.channel.createMessageCollector({ filter, max: 1 })
                        collector.on("collect", message => {
                            message.delete()
                            const newt = message.content

                            const emojiRegex = /[\u{1F300}-\u{1F5FF}\u{1F600}-\u{1F64F}\u{1F680}-\u{1F6FF}\u{2600}-\u{26FF}\u{2700}-\u{27BF}]/u;

                            if (emojiRegex.test(newt)) {
                                dbEmojis.set(`${text}`, newt)
                                var emojis = '';
                                dbEmojis.all().map((entry, index) => { emojis += `${index + 1} - ${entry.data}\n`; })
                                const Embed = new EmbedBuilder()
                                    .setAuthor({ name: `Configurando Emojis`, iconURL: interaction.guild.iconURL({ dynamic: true }) })
                                    .setDescription(`Selecione abaixo qual opção deseja alterar em seus emojis. É importante que você preste atenção nas configurações atuais para garantir que suas alterações sejam feitas corretamente.\n\n${emojis}`)
                                    .setColor(dbConfigs.get(`ticket.color`))

                                const row1 = new ActionRowBuilder()
                                    .addComponents(
                                        new ButtonBuilder()
                                            .setStyle(2)
                                            .setCustomId(`configemoji`)
                                            .setLabel(`Editar Emoji`)
                                            .setEmoji("<:emoji_11:1239446146015821925>"),
                                        new ButtonBuilder()
                                            .setStyle(1)
                                            .setCustomId(`configbot`)
                                            .setEmoji("<:emoji_6:1239445960447361085>")
                                    )

                                msg.edit({ embeds: [Embed], components: [row1] })
                                interaction.channel.send({ content: `${dbEmojis.get(`6`)} | O emoji ${emojiantigo} (\`${text}\`) foi alterado para ${dbEmojis.get(`${text}`)}` }).then(msg => {
                                    setTimeout(() => {
                                        msg.delete().catch(err => { })
                                    }, 5000)
                                })
                            } else if (newt.startsWith("<")) {
                                dbEmojis.set(`${text}`, newt)
                                var emojis = '';
                                dbEmojis.all().map((entry, index) => { emojis += `${index + 1} - ${entry.data}\n`; })
                                const Embed = new EmbedBuilder()
                                    .setAuthor({ name: `Configurando Emojis`, iconURL: interaction.guild.iconURL({ dynamic: true }) })
                                    .setDescription(`Selecione abaixo qual opção deseja alterar em seus emojis. É importante que você preste atenção nas configurações atuais para garantir que suas alterações sejam feitas corretamente.\n\n${emojis}`)
                                    .setColor(dbConfigs.get(`ticket.color`))

                                const row1 = new ActionRowBuilder()
                                    .addComponents(
                                        new ButtonBuilder()
                                            .setStyle(2)
                                            .setCustomId(`configemoji`)
                                            .setLabel(`Editar Emoji`)
                                            .setEmoji("<:emoji_11:1239446146015821925>"),
                                        new ButtonBuilder()
                                            .setStyle(1)
                                            .setCustomId(`configbot`)
                                            .setEmoji("<:emoji_6:1239445960447361085>")
                                    )
                                msg.edit({ embeds: [Embed], components: [row1] })
                                interaction.channel.send({ content: `${dbEmojis.get(`6`)} | O emoji ${emojiantigo} (\`${text}\`) foi alterado para ${dbEmojis.get(`${text}`)}` }).then(msg => {
                                    setTimeout(() => {
                                        msg.delete().catch(err => { })
                                    }, 5000)
                                })
                            } else {
                                var emojis = '';
                                dbEmojis.all().map((entry, index) => { emojis += `${index + 1} - ${entry.data}\n`; })
                                const Embed = new EmbedBuilder()
                                    .setAuthor({ name: `Configurando Emojis`, iconURL: interaction.guild.iconURL({ dynamic: true }) })
                                    .setDescription(`Selecione abaixo qual opção deseja alterar em seus emojis. É importante que você preste atenção nas configurações atuais para garantir que suas alterações sejam feitas corretamente.\n\n${emojis}`)
                                    .setColor(dbConfigs.get(`ticket.color`))

                                const row1 = new ActionRowBuilder()
                                    .addComponents(
                                        new ButtonBuilder()
                                            .setStyle(2)
                                            .setCustomId(`configemoji`)
                                            .setLabel(`Editar Emoji`)
                                            .setEmoji("<:emoji_11:1239446146015821925>"),
                                        new ButtonBuilder()
                                            .setStyle(1)
                                            .setCustomId(`configbot`)
                                            .setEmoji("<:emoji_6:1239445960447361085>")
                                    )
                                msg.edit({ embeds: [Embed], components: [row1] })
                                interaction.channel.send({ content: `${dbEmojis.get(`13`)} | Mande um emoji válido!` }).then(msg => {
                                    setTimeout(() => {
                                        msg.delete().catch(err => { })
                                    }, 5000)
                                })
                            }

                        })
                    })
                } else {
                    var emojis = '';
                    dbEmojis.all().map((entry, index) => { emojis += `${index + 1} - ${entry.data}\n`; })
                    const Embed = new EmbedBuilder()
                        .setAuthor({ name: `Configurando Emojis`, iconURL: interaction.guild.iconURL({ dynamic: true }) })
                        .setDescription(`Selecione abaixo qual opção deseja alterar em seus emojis. É importante que você preste atenção nas configurações atuais para garantir que suas alterações sejam feitas corretamente.\n\n${emojis}`)
                        .setColor(dbConfigs.get(`ticket.color`))

                    const row1 = new ActionRowBuilder()
                        .addComponents(
                            new ButtonBuilder()
                                .setStyle(2)
                                .setCustomId(`configemoji`)
                                .setLabel(`Editar Emoji`)
                                .setEmoji("<:emoji_11:1239446146015821925>"),
                            new ButtonBuilder()
                                .setStyle(1)
                                .setCustomId(`configbot`)
                                .setEmoji("<:emoji_6:1239445960447361085>")
                        )
                    interaction.message.edit({ embeds: [Embed], components: [row1] })
                    interaction.channel.send({ content: `${dbEmojis.get(`13`)} | ID Inválido!` }).then(msg => {
                        setTimeout(() => {
                            msg.delete().catch(err => { })
                        }, 5000)
                    })
                }
            } else {
                var emojis = '';
                dbEmojis.all().map((entry, index) => { emojis += `${index + 1} - ${entry.data}\n`; })
                const Embed = new EmbedBuilder()
                    .setTitle(`Configurando Emojis`)
                    .setDescription(`Selecione abaixo qual opção deseja alterar em seus emojis. É importante que você preste atenção nas configurações atuais para garantir que suas alterações sejam feitas corretamente.\n\n${emojis}`)
                    .setColor(dbConfigs.get(`ticket.color`))

                const row1 = new ActionRowBuilder()
                    .addComponents(
                        new ButtonBuilder()
                            .setStyle(2)
                            .setCustomId(`configemoji`)
                            .setLabel(`Editar Emoji`)
                            .setEmoji(dbEmojis.get(`30`)),
                        new ButtonBuilder()
                            .setStyle(1)
                            .setCustomId(`configbot`)
                            .setEmoji(dbEmojis.get(`29`))
                    )
                interaction.message.edit({ embeds: [Embed], components: [row1] })
                interaction.channel.send({ content: `${dbEmojis.get(`13`)} | ID Inválido!` }).then(msg => {
                    setTimeout(() => {
                        msg.delete().catch(err => { })
                    }, 5000)
                })
            }
        }

        if (interaction.isModalSubmit() && interaction.customId === "modalconfigavatar") {
            const text = interaction.fields.getTextInputValue("text")

            if (text.startsWith('https')) {
                interaction.client.user.setAvatar(`${text}`)

                interaction.reply({ content: `${dbEmojis.get(`6`)} | Alterado com sucesso!`, flags: MessageFlags.Ephemeral })
                const embed = new EmbedBuilder()
                    .setAuthor({ name: `Configurando Bot`, iconURL: interaction.guild.iconURL({ dynamic: true }) })
                    .setDescription(`Selecione uma das opções abaixo para configurar diretamente o seu bot.`)
                    .addFields(
                        {
                            name: `Nome do BOT:`,
                            value: `${interaction.client.user.username}`,
                            inline: true
                        },
                        {
                            name: `Avatar:`,
                            value: `[Clique aqui para ver](${interaction.client.user.displayAvatarURL({ dynamic: true })})`,
                            inline: true
                        },
                        {
                            name: `Cor:`,
                            value: `\`${dbConfigs.get(`ticket.color`) != null ? `\`${dbConfigs.get(`ticket.color`)}\`` : `\`Não configurado.\``}\``
                        }
                    )
                    .setColor(dbConfigs.get(`ticket.color`) || "Default")

                const row2 = new ActionRowBuilder()
                    .addComponents(
                        new ButtonBuilder()
                            .setStyle(2)
                            .setCustomId(`configname`)
                            .setLabel(`Alterar Nome`)
                            .setEmoji("<:emoji_45:1240119390767419523>"),
                        new ButtonBuilder()
                            .setStyle(2)
                            .setCustomId(`configavatar`)
                            .setLabel(`Alterar Avatar`)
                            .setEmoji("<:emoji_44:1240119359930896414>"),
                        new ButtonBuilder()
                            .setStyle(2)
                            .setCustomId(`configstatus`)
                            .setLabel(`Alterar Status`)
                            .setEmoji("<:emoji_46:1240119428486660178>"),
                        new ButtonBuilder()
                            .setStyle(2)
                            .setCustomId(`configcor`)
                            .setLabel(`Alterar Cor`)
                            .setEmoji("<:emoji_46:1240119442722127872>"),
                        new ButtonBuilder()
                            .setStyle(2)
                            .setCustomId(`configemojis`)
                            .setLabel(`Alterar Emojis`)
                            .setEmoji("<:emoji_47:1240119456236048476>"),
                    )

                const row = new ActionRowBuilder()
                    .addComponents(
                        new ButtonBuilder()
                            .setStyle(1)
                            .setCustomId(`voltarconfig`)
                            .setEmoji("<:emoji_6:1239445960447361085>")
                    )
                interaction.message.edit({
                    embeds: [embed],
                    components: [row2, row]
                })
            } else {
                interaction.reply({ content: `${dbEmojis.get(`13`)} | Coloque um link válido!`, flags: MessageFlags.Ephemeral })
            }
        }

        if (interaction.isModalSubmit() && interaction.customId === "modalconfigname") {
            const text = interaction.fields.getTextInputValue("text")

            interaction.client.user.setUsername(`${text}`)

            interaction.reply({ content: `${dbEmojis.get(`6`)} | Alterado com sucesso!`, flags: MessageFlags.Ephemeral })
            const embed = new EmbedBuilder()
                .setAuthor({ name: `Configurando Bot`, iconURL: interaction.guild.iconURL({ dynamic: true }) })
                .setDescription(`Selecione uma das opções abaixo para configurar diretamente o seu bot.`)
                .addFields(
                    {
                        name: `Nome do BOT:`,
                        value: `${interaction.client.user.username}`,
                        inline: true
                    },
                    {
                        name: `Avatar:`,
                        value: `[Clique aqui para ver](${interaction.client.user.displayAvatarURL({ dynamic: true })})`,
                        inline: true
                    },
                    {
                        name: `Cor:`,
                        value: `\`${dbConfigs.get(`ticket.color`) != null ? `\`${dbConfigs.get(`ticket.color`)}\`` : `\`Não configurado.\``}\``
                    }
                )
                .setColor(dbConfigs.get(`ticket.color`) || "Default")

            const row2 = new ActionRowBuilder()
                .addComponents(
                    new ButtonBuilder()
                        .setStyle(2)
                        .setCustomId(`configname`)
                        .setLabel(`Alterar Nome`)
                        .setEmoji(`${editarEmoji}`),
                    new ButtonBuilder()
                        .setStyle(2)
                        .setCustomId(`configavatar`)
                        .setLabel(`Alterar Avatar`)
                        .setEmoji(`${userEmoji}`),
                    new ButtonBuilder()
                        .setStyle(2)
                        .setCustomId(`configstatus`)
                        .setLabel(`Alterar Status`)
                        .setEmoji(`${lupaEmoji}`),
                    new ButtonBuilder()
                        .setStyle(2)
                        .setCustomId(`configcor`)
                        .setLabel(`Alterar Cor`)
                        .setEmoji(`${corEmoji}`),
                    new ButtonBuilder()
                        .setStyle(2)
                        .setCustomId(`configemojis`)
                        .setLabel(`Alterar Emojis`)
                        .setEmoji("<:emoji_47:1240119456236048476>"),
                )

            const row = new ActionRowBuilder()
                .addComponents(
                    new ButtonBuilder()
                        .setStyle(1)
                        .setCustomId(`voltarconfig`)
                        .setEmoji("<:emoji_6:1239445960447361085>")
                )
            interaction.message.edit({
                embeds: [embed],
                components: [row2, row]
            })

        }

        if (interaction.isModalSubmit() && interaction.customId === "modalconfigstatus") {
            const text = interaction.fields.getTextInputValue("presence")
            const text1 = interaction.fields.getTextInputValue("atividade")
            const text2 = interaction.fields.getTextInputValue("text_ativd")
            const url = interaction.fields.getTextInputValue("url") || "https://www.twitch.tv/discord";

            const statusMap = {
                "online": "online",
                "ausente": "idle",
                "ocupado": "dnd",
                "invisivel": "invisible",
            }

            const activityMap = {
                "jogando": "Playing",
                "assistindo": "Watching",
                "competindo": "Competing",
                "transmitindo": "Streaming",
                "ouvindo": "Listening"
            }
            if (Object.keys(statusMap).includes(text.toLowerCase()) && Object.keys(activityMap).includes(text1.toLowerCase())) {
                if (text1.toLowerCase() === "transmitindo") {
                    try {
                        interaction.client.user.setPresence({
                            activities: [{
                                name: `${text2}`,
                                type: ActivityType[activityMap[text1.toLowerCase()]],
                                url: url
                            }]
                        })

                        interaction.client.user.setStatus(statusMap[text.toLowerCase()])
                        interaction.reply({
                            content: "Status Alterado com sucesso!",
                            flags: MessageFlags.Ephemeral
                        })
                    } catch (err) {
                        console.log(err)
                        interaction.reply({
                            content: "Ocorreu um erro ao tentar mudar os status do bot",
                            flags: MessageFlags.Ephemeral
                        })
                    }
                } else {
                    try {
                        interaction.client.user.setPresence({
                            activities: [{
                                name: `${text2}`,
                                type: ActivityType[activityMap[text1.toLowerCase()]],
                            }]
                        })
                        interaction.client.user.setStatus(statusMap[text.toLowerCase()])
                        interaction.reply({
                            content: "Status Alterado com sucesso!",
                            flags: MessageFlags.Ephemeral
                        })
                    } catch (err) {
                        console.log(err)
                        interaction.reply({
                            content: "Ocorreu um erro ao tentar mudar os status do bot",
                            flags: MessageFlags.Ephemeral
                        })
                    }
                }
            } else {
                interaction.reply({ content: "Desculpe, mas a atividade fornecida não é válida. Por favor, forneça uma das seguintes atividades: jogando, assistindo, competindo, transmitindo, ouvindo.", flags: MessageFlags.Ephemeral })
            }
        }


        //System Vendas
        if (interaction.isButton()) {
            if (buttonId == `showSecurityKey`) {
                if (interaction.user.id !== getCache(null, `owner`)) {
                    interaction.reply({ content: `❌ | Apenas o dono do bot pode executar esse comando.`, flags: MessageFlags.Ephemeral })
                    return
                }

                const securityKey = dbConfigs.get(`vendas.securityKey`)
                const embedSecurityKey = new EmbedBuilder()
                    .setAuthor({ name: client.user.username, iconURL: client.user.avatarURL() })
                    .setDescription(`⚠ | Por favor, mantenha esta chave em absoluto sigilo. Ela concede acesso direto à transferência de propriedade da aplicação **${client.user.username}** e não deve, sob hipótese alguma, ser compartilhada com qualquer outra pessoa.`)
                    .addFields(
                        { name: `🔑 | Chave de Segurança:`, value: `${securityKey}` }
                    )
                    .setColor(colorC !== "none" ? colorC : "#460580")
                    .setTimestamp()

                await interaction.reply({
                    embeds: [embedSecurityKey],
                    flags: MessageFlags.Ephemeral
                })
            }

            if (buttonId == `pixKey`) {
                await interaction.deferReply({ ephemeral: true })

                try {
                    // Obter dados do carrinho para calcular o valor total
                    const CartOn = await dbOpenedCarts.get(`${interaction.channel.id}`);
                    
                    if (!CartOn || !CartOn.products) {
                        await interaction.editReply({
                            content: `❌ | Carrinho não encontrado ou vazio.`,
                        });
                        return;
                    }

                    const productIds = Object.keys(CartOn.products);
                    let totalPrice = 0;
                    let productsList = [];

                    for (const pId of productIds) {
                        let productDetails = CartOn.products[pId];
                        totalPrice += Number(productDetails.productPrice) * Number(productDetails.purchaseAmount);
                        productsList.push(`${productDetails.productName} x${productDetails.purchaseAmount}`);
                    }

                    // Aplicar desconto do cupom se existir
                    const cupomDiscount = CartOn.purchaseCoupon?.couponDiscount || 0;
                    if (cupomDiscount > 0) {
                        totalPrice = totalPrice - (totalPrice * (cupomDiscount / 100));
                    }

                    // Converter para centavos (API espera valor em centavos)
                    const amountCents = Math.round(totalPrice * 100);

                    // Validar valor mínimo
                    if (amountCents < 100) {
                        await interaction.editReply({
                            content: `❌ | O valor mínimo para gerar um PIX é R$ 1,00.`,
                        });
                        return;
                    }

                    // Gerar ID externo único
                    const externalId = `cart-${interaction.channel.id}-${Date.now()}`;

                    // Criar cobrança PIX usando a API GGPIX
                    const pixResult = await createPixCharge(
                        amountCents,
                        `Compra: ${productsList.join(', ')}`,
                        interaction.user.username,
                        externalId
                    );

                    if (!pixResult.success) {
                        await interaction.editReply({
                            content: `❌ | Erro ao gerar PIX: ${pixResult.error}`,
                        });
                        return;
                    }

                    // Salvar dados do pagamento no carrinho para verificação automática
                    await dbOpenedCarts.set(`${interaction.channel.id}.paymentID`, pixResult.data.id);
                    await dbOpenedCarts.set(`${interaction.channel.id}.pixPaymentId`, pixResult.data.id);
                    await dbOpenedCarts.set(`${interaction.channel.id}.pixCopyPaste`, pixResult.data.pixCopyPaste);
                    await dbOpenedCarts.set(`${interaction.channel.id}.CopiaECola`, pixResult.data.pixCopyPaste);
                    await dbOpenedCarts.set(`${interaction.channel.id}.externalId`, externalId);
                    await dbOpenedCarts.set(`${interaction.channel.id}.status`, 'pending');
                    await dbOpenedCarts.set(`${interaction.channel.id}.paymentType`, 'skwallet');

                    // Enviar log do pedido
                    try {
                        const channelLog = await client.channels.fetch(dbConfigs.get(`vendas.channels.channelLogsPrivId`));
                        if (channelLog) {
                            let logmessage5 = '';
                            for (const pId of productIds) {
                                let productDetails = CartOn.products[pId];
                                logmessage5 += `\`${productDetails.purchaseAmount}x ${productDetails.productName} | ${Number(productDetails.productPrice).toLocaleString(global.lenguage.um, { style: 'currency', currency: global.lenguage.dois })}\`\n`;
                            }

                            const embedLog = new EmbedBuilder()
                                .setAuthor({ name: `Pedido solicitado`, iconURL: 'https://cdn.discordapp.com/emojis/1230562913790595133.webp?size=44&quality=lossless' })
                                .setColor('Yellow')
                                .setDescription(`Usuário <@!${interaction.user.id}> solicitou um pedido.`)
                                .setFields(
                                    { name: `Detalhes:`, value: logmessage5 },
                                    { name: `ID do Pedido`, value: `\`${pixResult.data.id}\`` },
                                    { name: `Forma de Pagamento`, value: `\`SkWallet (GGPIXAPI)\`` }
                                )
                                .setFooter({ text: `${interaction.guild.name}`, iconURL: interaction.guild.iconURL({ dynamic: true }) })
                                .setTimestamp();

                            let msgidLog = await channelLog.send({ embeds: [embedLog] });
                            await dbOpenedCarts.set(`${interaction.channel.id}.log`, { channel: channelLog.id, message: msgidLog.id });
                        }
                    } catch (logError) {
                        console.error('[pixKey] Erro ao enviar log:', logError);
                    }

                    // Enviar o código PIX cópia e cola
                    await interaction.editReply({
                        content: `**📋 PIX Copia e Cola**\n\n\`\`\`${pixResult.data.pixCopyPaste}\`\`\`\n\n💰 **Valor:** \`${Number(totalPrice).toLocaleString(global.lenguage.um, { style: 'currency', currency: global.lenguage.dois })}\`\n\n✅ **O pagamento será verificado automaticamente!**\nApós o pagamento ser confirmado, seu pedido será entregue automaticamente.\n\n-# Copie o código acima e cole no seu aplicativo de banco para efetuar o pagamento.`,
                    });

                } catch (error) {
                    console.error('[pixKey] Erro ao gerar PIX:', error);
                    await interaction.editReply({
                        content: `❌ | Ocorreu um erro ao gerar o PIX. Tente novamente.`,
                    });
                }
            }

            if (buttonId == `mobilePix`) {
                await interaction.deferReply({ ephemeral: true })

                // Tentar obter o PIX cópia e cola gerado anteriormente
                const pixCopyPaste = await dbOpenedCarts.get(`${interaction.channel.id}.pixCopyPaste`);

                if (pixCopyPaste) {
                    await interaction.editReply({
                        content: `${pixCopyPaste}`,
                    });
                } else {
                    // Fallback para chave PIX estática se não houver PIX gerado
                    const semiAutoPix = dbConfigs.get(`vendas.semiAuto.pix.key`);
                    await interaction.editReply({
                        content: `${semiAutoPix || 'PIX não disponível'}`,
                    });
                }
            }

            if (buttonId == `qrCode`) {
                await interaction.deferReply({ ephemeral: true })

                try {
                    // Verificar se já existe um PIX gerado para este carrinho
                    const pixCopyPaste = await dbOpenedCarts.get(`${interaction.channel.id}.pixCopyPaste`);

                    if (pixCopyPaste) {
                        // Gerar QR Code a partir do código PIX existente
                        const qrResult = await generateQRCodeBuffer(pixCopyPaste);

                        if (qrResult.success) {
                            const { AttachmentBuilder } = require('discord.js');
                            const attachment = new AttachmentBuilder(qrResult.buffer, { name: 'qrcode_pix.png' });

                            // Obter valor do carrinho
                            const CartOn = await dbOpenedCarts.get(`${interaction.channel.id}`);
                            let totalPrice = 0;

                            if (CartOn && CartOn.products) {
                                const productIds = Object.keys(CartOn.products);
                                for (const pId of productIds) {
                                    let productDetails = CartOn.products[pId];
                                    totalPrice += Number(productDetails.productPrice) * Number(productDetails.purchaseAmount);
                                }
                                const cupomDiscount = CartOn.purchaseCoupon?.couponDiscount || 0;
                                if (cupomDiscount > 0) {
                                    totalPrice = totalPrice - (totalPrice * (cupomDiscount / 100));
                                }
                            }

                            const embedQrCode = new EmbedBuilder()
                                .setTitle(`${client.user.username} | QR Code PIX`)
                                .setDescription(`Escaneie o QR Code abaixo para efetuar o pagamento.`)
                                .addFields(
                                    { name: `💰 Valor`, value: `\`${Number(totalPrice).toLocaleString(global.lenguage.um, { style: 'currency', currency: global.lenguage.dois })}\``, inline: true }
                                )
                                .setColor(colorC !== "none" ? colorC : "#460580")
                                .setImage('attachment://qrcode_pix.png')
                                .setFooter({ text: `${client.user.username} - Todos os direitos reservados.` })

                            await interaction.editReply({
                                embeds: [embedQrCode],
                                files: [attachment]
                            });
                        } else {
                            await interaction.editReply({
                                content: `❌ | Erro ao gerar QR Code. Tente novamente.`,
                            });
                        }
                    } else {
                        // Fallback para QR Code estático configurado
                        const semiAutoQRCode = dbConfigs.get(`vendas.semiAuto.qrCode`);

                        if (semiAutoQRCode == `none` || semiAutoQRCode == null) {
                            await interaction.editReply({
                                content: `❌ | QR Code não disponível. Clique em "Chave PIX" primeiro para gerar o código de pagamento.`,
                            });
                            return;
                        }

                        const embedQrCode = new EmbedBuilder()
                            .setTitle(`${client.user.username} | QR Code`)
                            .setColor(colorC !== "none" ? colorC : "#460580")
                            .setImage(semiAutoQRCode)
                            .setFooter({ text: `${client.user.username} - Todos os direitos reservados.` })

                        await interaction.editReply({
                            embeds: [embedQrCode],
                        });
                    }
                } catch (error) {
                    console.error('[qrCode] Erro ao gerar QR Code:', error);
                    await interaction.editReply({
                        content: `❌ | Ocorreu um erro ao gerar o QR Code. Tente novamente.`,
                    });
                }
            }

            if (buttonId == 'NubankMethod') {
                await PageNubank(client, interaction)
            }

            // SkWallet (GGPIXAPI) handlers
            if (buttonId === 'SkWalletMethod') {
                let message = await SkWalletMethod(client, interaction)
                await interaction.update(message)
            }

            if (buttonId === 'toggleSkWallet') {
                await toggleSkWallet()
                let message = await SkWalletMethod(client, interaction)
                await interaction.update(message)
            }

            if (buttonId === 'nubankStatus') {
                let status = dbConfigs.get(`vendas.payments.Nubank`)

                if (status == null || status == false) {
                    let typebank = dbConfigs.get(`vendas.payments.NubankType`)
                    if (typebank == null) {
                        await PageNubank(client, interaction);
                        return interaction.followUp({ content: `Você precisa selecionar um banco primeiro!`, ephemeral: true });
                    }
                    let email = dbConfigs.get(`vendas.payments.NubankEmail`)
                    let senha = dbConfigs.get(`vendas.payments.NubankSenha`)
                    if (email == null || senha == null) {
                        await PageNubank(client, interaction);
                        return interaction.followUp({ content: `Você precisa configurar o IMAP do Nubank primeiro!`, ephemeral: true });
                    } else {
                        let imapConfig = {
                            user: `${email}`,
                            password: `${senha}`,
                            host: 'imap.gmail.com',
                            port: 993,
                            tls: true,
                            tlsOptions: { rejectUnauthorized: false },
                            keepalive: true,
                            idleInterval: 10000,
                            forceNoop: true,
                            interval: 10000,
                        };
                        connectIMAP(typebank, imapConfig)

                        setTimeout(async () => {
                            await dbConfigs.set(`vendas.payments.Nubank`, global.statusImap)
                            await PageNubank(client, interaction);
                            if (global.statusImap == false) {
                                interaction.followUp({ content: `Ocorreu um erro ao configurar o seu Imap, sua senha ou email está incorreto.`, ephemeral: true });
                            }
                        }, 5000);

                    }
                } else if (status == true) {
                    console.log('[🔌] Desconectando do IMAP...')
                    disconnectIMAP();
                    await dbConfigs.set(`vendas.payments.Nubank`, status == null ? true : !status)
                    PageNubank(client, interaction)
                }

            }

            if (interaction.customId === 'nubankConfig') {


                let modal = new ModalBuilder()
                    .setCustomId('modalimapnubank')
                    .setTitle(`🥊 | Configurar Nubank & Picpay (Imap)`);

                let desc = new TextInputBuilder()
                    .setCustomId('email')
                    .setLabel("Qual seu email do imap?")
                    .setStyle(TextInputStyle.Short)
                    .setPlaceholder('Digite o email do imap.')
                    .setRequired(false);

                let cor = new TextInputBuilder()
                    .setCustomId('Senha')
                    .setLabel("Senha da aplicação (IMAP)?")
                    .setStyle(TextInputStyle.Short)
                    .setPlaceholder('Digite a senha da aplicação (IMAP).')
                    .setRequired(false);



                const descrição = new ActionRowBuilder().addComponents(desc);
                const color = new ActionRowBuilder().addComponents(cor);


                modal.addComponents(descrição, color);

                await interaction.showModal(modal);
            }





            if (buttonId.startsWith(`cancelPaymentManual`)) {
                await interaction.deferUpdate()

                const [_, userId] = buttonId.split('-')
                const guild = interaction.guild;
                const buyer = await guild.members.cache.get(userId);
                const channel = interaction.channel;

                dbOpenedCarts.delete(channel.id)

                await channel.delete()
                    .catch((err) => {
                        return;
                    })

                const closedDate = `<t:${Math.floor(moment().toDate().getTime() / 1000)}:f> (<t:${Math.floor(moment().toDate().getTime() / 1000)}:R>)`;

                const channelLogsPriv = guild.channels.cache.get(dbConfigs.get(`vendas.channels.channelLogsPrivId`))
                if (channelLogsPriv) {
                    await channelLogsPriv.send({
                        embeds: [new EmbedBuilder()
                            .setAuthor({ name: buyer ? `${buyer.username} - ${buyer.id}` : ` `, iconURL: buyer ? buyer.avatarURL({ dynamic: true }) : `https://sem-img.com` })
                            .setTitle(`${client.user.username} | Compra Cancelada`)
                            .addFields(
                                { name: `👤 | COMPRADOR(A):`, value: buyer ? `${buyer}` : `Não encontrado.` },
                                { name: `📜 | Motivo:`, value: `Cancelada por **${interaction.user.username}**.` },
                                { name: `⏰ | Data & Horário:`, value: `${closedDate}` }
                            )
                            .setThumbnail(buyer ? buyer.avatarURL({ dynamic: true }) : `https://sem-img.com`)
                            .setColor(`Red`)
                            .setTimestamp()
                        ]
                    })
                }
            }

            if (buttonId.startsWith(`refund`)) {
                const [_, paymentId] = buttonId.split('-')

                const allPurchases = dbPurchases.all()
                const allPaymentIds = allPurchases.map((entry) => entry.ID)

                if (paymentId && allPaymentIds.includes(paymentId)) {
                    if (!interaction.user.id === dbPerms.get('vendas')) return;
                    const tokenMp = dbConfigs.get(`vendas.payments.mpAcessToken`)
                    if (tokenMp != `none`) {
                        await axios.get(`https://api.mercadopago.com/v1/payments/search`, {
                            headers: {
                                "Authorization": `Bearer ${tokenMp}`
                            }
                        }).catch(async (err) => {
                            await interaction.reply({
                                content: `❌ | O Token MP que está configurado é inválido.`,
                                flags: MessageFlags.Ephemeral
                            })
                            return;
                        })
                    } else {
                        await interaction.reply({
                            content: `❌ | Configure um Token MP para utilizar este comando.`,
                            flags: MessageFlags.Ephemeral
                        })
                        return;
                    }

                    const mpClient = new MercadoPagoConfig({ accessToken: tokenMp })
                    const mpRefund = new PaymentRefund(mpClient)

                    const msgPurchase = interaction.message;
                    const channelPurchase = interaction.channel;

                    const modal = new ModalBuilder()
                        .setCustomId(`modalConfirm-${paymentId}`)
                        .setTitle(`🔁 | ${paymentId}`)

                    const inputConfirm = new TextInputBuilder()
                        .setCustomId('confirmText')
                        .setLabel(`Escreva "SIM" para continuar:`)
                        .setMaxLength(3)
                        .setPlaceholder(`SIM`)
                        .setRequired(true)
                        .setStyle(`Paragraph`)

                    const iConfirm = new ActionRowBuilder().addComponents(inputConfirm)
                    modal.addComponents(iConfirm)
                    await interaction.showModal(modal)
                    client.once("interactionCreate", async (iModal) => {
                        if (iModal.customId == `modalConfirm-${paymentId}`) {
                            await iModal.deferUpdate()
                            const insertedText = iModal.fields.getTextInputValue(`confirmText`)
                                .toLowerCase()

                            if (insertedText == `sim`) {
                                await mpRefund.create({
                                    payment_id: paymentId
                                }).then(async (refund) => {
                                    await msgPurchase.edit({
                                        components: [new ActionRowBuilder()
                                            .addComponents(
                                                new ButtonBuilder().setCustomId(`refund-${paymentId}`).setLabel(`Reembolsar`).setEmoji(`💳`).setStyle(`Primary`).setDisabled(true).setDisabled(true)
                                            )
                                        ]
                                    })

                                    const buyerPurchase = await dbPurchases.get(`${paymentId}.buyer`)
                                    const productsPurchase = await dbPurchases.get(`${paymentId}.productsNames`)
                                    const pricePurchase = await dbPurchases.get(`${paymentId}.pricePaid`)
                                    const buyerFetch = await client.users.fetch(buyerPurchase)
                                    const embedRefund = new EmbedBuilder()
                                        .setAuthor({ name: client.user.username, iconURL: client.user.avatarURL() })
                                        .setTitle(`${client.user.username} | Reembolso`)
                                        .addFields(
                                            { name: `${docEmoji} ID DO PEDIDO:`, value: `\`${paymentId}\`` },
                                            { name: `👤 | COMPRADOR(A):`, value: `${buyerFetch} | ${buyerFetch.username}` },
                                            { name: `🪐 | PRODUTO(S) REEMBOLSADO(S):`, value: `${productsPurchase.join(`\n`)}` },
                                            { name: `${carrinhoEmoji} VALOR REEMBOLSADO:`, value: `\`${Number(pricePurchase).toLocaleString(global.lenguage.um, { style: 'currency', currency: global.lenguage.dois })}\`` },
                                            { name: `🏷 | REEMBOLSADO POR:`, value: `${interaction.user} | ${interaction.user.username}` }
                                        )
                                        .setColor(colorC !== "none" ? colorC : "#460580")
                                        .setFooter({ text: `${client.user.username} - Todos os direitos reservados.` })

                                    await channelPurchase.send({
                                        content: `✅ | Pagamento ID: **${paymentId}** reembolsado com sucesso.`,
                                        embeds: [embedRefund]
                                    })
                                }).catch(async (err) => {
                                    await iModal.followUp({
                                        content: `❌ | Ocorreu um erro ao reembolsar o Pagamento ID: **${paymentId}**.`,
                                        flags: MessageFlags.Ephemeral
                                    })
                                })
                            }
                        }
                    })
                }
            }
        }


        //System Gerar-Pix
        if (interaction.customId === "configpayments") {
            interaction.reply({ content: `❕ | Sistema alterado, utilize **_/gerar-pix_** para configurar ou gerar pagamentos.`, flags: MessageFlags.Ephemeral })
            return
        }

        if (interaction.customId === "voltarConfigPayment") {
            var banksBloqued = '';
            dbConfigs.get(`pagamentos.blockbank`)?.map((entry, index) => { banksBloqued += `${entry}\n`; })
            if (dbConfigs.get("agamentos.blockbank")?.length <= 0) banksBloqued = "`Nenhum Banco foi Bloqueado`";

            const sampascorin = new EmbedBuilder()
                .setColor(dbConfigs.get(`ticket.color`) || "Default")
                .setAuthor({ name: `Configurando Pagamentos`, iconURL: interaction.guild.iconURL({ dynamic: true }) })
                .addFields(
                    {
                        name: `Sistema ON/OFF:`,
                        value: `${dbConfigs.get(`pagamentos.sistema`) !== 'ON' ? '\`🔴 Desligado\`' : '\`🟢 Ligado\`'}`,
                        inline: true
                    },
                    {
                        name: `Acess Token:`,
                        value: `||${dbConfigs.get(`pagamentos.acess_token`) || `Não Definido`}||`,
                        inline: true
                    },
                    {
                        name: `Bancos Bloqueados:`,
                        value: `${banksBloqued || 'Nenhum definido'}`
                    }
                )
            const sampasrowbah = new ActionRowBuilder()
                .addComponents(
                    new ButtonBuilder()
                        .setStyle(dbConfigs.get(`pagamentos.sistema`) === "ON" ? 3 : 4)
                        .setCustomId(`paymentsonoff`)
                        .setLabel(dbConfigs.get(`pagamentos.sistema`) === "ON" ? "Sistema (Ligado)" : "Sistema (Desligado)")
                        .setEmoji(dbConfigs.get(`pagamentos.sistema`) === "ON" ? "<:on_mt:1232722645238288506>" : "<:off:1243274635748048937>"),
                    new ButtonBuilder()
                        .setStyle(2)
                        .setCustomId(`sistema_semiauto`)
                        .setLabel(`Sistema Semiauto`)
                        .setEmoji(`<:Pix:1239447475035570246>`),
                    new ButtonBuilder()
                        .setStyle(2)
                        .setCustomId(`alterar_acesstoken`)
                        .setLabel(`Alterar Acess Token`)
                        .setEmoji(`<:emoji_mp:1242924437351698432>`),
                    new ButtonBuilder()
                        .setStyle(2)
                        .setCustomId(`alterar_blockbank`)
                        .setLabel(`Bloquear Bancos`)
                        .setEmoji("<:emoji_50:1242924374915551293>")
                )
            interaction.reply({ embeds: [sampascorin], components: [sampasrowbah] })
        }

        if (interaction.customId === "paymentsonoff") {
            dbConfigs.get(`pagamentos.sistema`) !== 'OFF' ? await dbConfigs.set(`pagamentos.sistema`, "ON") : await dbConfigs.set(`pagamentos.sistema`, "OFF")

            var banksBloqued = '';
            dbConfigs.get(`pagamentos.blockbank`)?.map((entry, index) => { banksBloqued += `${entry}\n`; })
            if (dbConfigs.get("pagamentos.blockbank")?.length <= 0) banksBloqued = "`Nenhum Banco foi Bloqueado`";
            const embedRespond = new EmbedBuilder()
                .setColor(dbConfigs.get(`ticket.color`) || "Default")
                .setAuthor({ name: `Configurando Pagamentos`, iconURL: interaction.guild.iconURL({ dynamic: true }) })
                .addFields(
                    {
                        name: `Sistema ON/OFF:`,
                        value: `${dbConfigs.get(`pagamentos.sistema`) !== 'ON' ? '\`🔴 Desligado\`' : '\`🟢 Ligado\`'}`,
                        inline: true
                    },
                    {
                        name: `Acess Token:`,
                        value: `||${dbConfigs.get(`pagamentos.acess_token`) || `Não Definido`}||`,
                        inline: true
                    },
                    {
                        name: `Bancos Bloqueados:`,
                        value: `${banksBloqued || 'Não definido'}`
                    }
                )
            const sampasrowbah = new ActionRowBuilder()
                .addComponents(
                    new ButtonBuilder()
                        .setStyle(dbConfigs.get(`pagamentos.sistema`) === "ON" ? 3 : 4)
                        .setCustomId(`paymentsonoff`)
                        .setLabel(dbConfigs.get(`pagamentos.sistema`) === "ON" ? "Sistema (Ligado)" : "Sistema (Desligado)")
                        .setEmoji(dbConfigs.get(`pagamentos.sistema`) === "ON" ? "<:on_mt:1232722645238288506>" : "<:off:1243274635748048937>"),
                    new ButtonBuilder()
                        .setStyle(2)
                        .setCustomId(`sistema_semiauto`)
                        .setLabel(`Sistema Semiauto`)
                        .setEmoji(`<:Pix:1239447475035570246>`),
                    new ButtonBuilder()
                        .setStyle(2)
                        .setCustomId(`alterar_acesstoken`)
                        .setLabel(`Alterar Acess Token`)
                        .setEmoji(`<:emoji_mp:1242924437351698432>`),
                    new ButtonBuilder()
                        .setStyle(2)
                        .setCustomId(`alterar_blockbank`)
                        .setLabel(`Bloquear Bancos`)
                        .setEmoji("<:emoji_50:1242924374915551293>")
                )
            interaction.update({ embeds: [embedRespond], components: [sampasrowbah] })

        }

        if (interaction.customId === "alterar_acesstoken") {
            const modal = new ModalBuilder()
                .setCustomId("modal_alterar_acesstoken")
                .setTitle("Alterar Acess Token")

            const text = new TextInputBuilder()
                .setCustomId("text_modal")
                .setLabel("Edite o Acess Token do Mercado Pago")
                .setPlaceholder("Digite aqui")
                .setStyle(1)

            modal.addComponents(new ActionRowBuilder().addComponents(text))

            return interaction.showModal(modal)
        }

        if (interaction.customId === "alterar_blockbank") {
            var banksBloqued = '';
            dbConfigs.get(`pagamentos.blockbank`)?.map((entry, index) => { banksBloqued += `${entry}\n`; })
            if (dbConfigs.get("pagamentos.blockbank")?.length <= 0) banksBloqued = "`Nenhum Banco foi Bloqueado`";

            const embed = new EmbedBuilder()
                .setColor(dbConfigs.get(`ticket.color`) || "Default")
                .setAuthor({ name: `Configurando Pagamentos (Block Bank)`, iconURL: interaction.guild.iconURL({ dynamic: true }) })
                .addFields(
                    {
                        name: `Sistema ON/OFF:`,
                        value: `${dbConfigs.get(`pagamentos.sistema`) !== 'ON' ? '\`🔴 Desligado\`' : '\`🟢 Ligado\`'}`,
                        inline: true
                    },
                    {
                        name: `Acess Token:`,
                        value: `||${dbConfigs.get(`pagamentos.acess_token`) || `Não definido`}||`,
                        inline: true
                    },
                    {
                        name: `Bancos Bloqueados:`,
                        value: `${banksBloqued || 'Não definido'}`
                    }
                )
            const row2 = new ActionRowBuilder()
                .addComponents(
                    new ButtonBuilder()
                        .setStyle(2)
                        .setCustomId(`addblockbank`)
                        .setLabel(`Adicionar Banco`)
                        .setEmoji("<:mais:1225477811741921393>"),
                    new ButtonBuilder()
                        .setStyle(4)
                        .setCustomId(`removeblockbank`)
                        .setLabel(`Remover Banco`)
                        .setEmoji("<:menos2:1225477800425689210>"),
                    new ButtonBuilder()
                        .setStyle(1)
                        .setCustomId(`voltarconfigpay`)

                        .setEmoji("<:emoji_6:1239445960447361085>")
                )
            interaction.update({ embeds: [embed], components: [row2] })
        }

        if (interaction.customId === "addblockbank") {
            const modal = new ModalBuilder()
                .setCustomId("modal_add_blockbank")
                .setTitle("Adicionar Banco")

            const text = new TextInputBuilder()
                .setCustomId("text_modal")
                .setLabel("Fale o nome do banco")
                .setPlaceholder("Digite aqui ✏")
                .setStyle(1)

            modal.addComponents(new ActionRowBuilder().addComponents(text))

            return interaction.showModal(modal)
        }

        if (interaction.customId === "removeblockbank") {
            const modal = new ModalBuilder()
                .setCustomId("modal_remove_blockbank")
                .setTitle("Remover Banco")

            const text = new TextInputBuilder()
                .setCustomId("text_modal")
                .setLabel("Fale o nome do banco")
                .setPlaceholder("Digite aqui ✏")
                .setStyle(1)

            modal.addComponents(new ActionRowBuilder().addComponents(text))

            return interaction.showModal(modal)
        }

        if (interaction.customId === "voltarconfigpay") {
            var banksBloqued = '';
            dbConfigs.get(`pagamentos.blockbank`)?.map((entry, index) => { banksBloqued += `${entry}\n`; })
            if (dbConfigs.get("pagamentos.blockbank")?.length <= 0) banksBloqued = "`Nenhum Banco foi Bloqueado`";

            const sampascorin = new EmbedBuilder()
                .setColor(dbConfigs.get(`ticket.color`) || "Default")
                .setAuthor({ name: `Configurando Pagamentos`, iconURL: interaction.guild.iconURL({ dynamic: true }) })
                .addFields(
                    {
                        name: `Sistema ON/OFF:`,
                        value: `${dbConfigs.get(`pagamentos.sistema`) !== 'ON' ? '\`🔴 Desligado\`' : '\`🟢 Ligado\`'}`,
                        inline: true
                    },
                    {
                        name: `Acess Token:`,
                        value: `||${dbConfigs.get(`pagamentos.acess_token`) || `Não Definido`}||`,
                        inline: true
                    },
                    {
                        name: `Bancos Bloqueados:`,
                        value: `${banksBloqued || 'Não definido'}`
                    }
                )
            const sampasrowbah = new ActionRowBuilder()
                .addComponents(
                    new ButtonBuilder()
                        .setStyle(dbConfigs.get(`pagamentos.sistema`) === "ON" ? 3 : 4)
                        .setCustomId(`paymentsonoff`)
                        .setLabel(dbConfigs.get(`pagamentos.sistema`) === "ON" ? "Sistema (Ligado)" : "Sistema (Desligado)")
                        .setEmoji(dbConfigs.get(`pagamentos.sistema`) === "ON" ? "<:on_mt:1232722645238288506>" : "<:off:1243274635748048937>"),
                    new ButtonBuilder()
                        .setStyle(2)
                        .setCustomId(`sistema_semiauto`)
                        .setLabel(`Sistema Semiauto`)
                        .setEmoji(`<:Pix:1239447475035570246>`),
                    new ButtonBuilder()
                        .setStyle(2)
                        .setCustomId(`alterar_acesstoken`)
                        .setLabel(`Alterar Acess Token`)
                        .setEmoji(`<:emoji_mp:1242924437351698432>`),
                    new ButtonBuilder()
                        .setStyle(2)
                        .setCustomId(`alterar_blockbank`)
                        .setLabel(`Bloquear Bancos`)
                        .setEmoji("<:emoji_50:1242924374915551293>")
                )
            interaction.update({ embeds: [sampascorin], components: [sampasrowbah] })
        }

        if (interaction.customId === "sistema_semiauto") {
            let qrcode = "\`Não Definido\`"
            if (dbConfigs.get(`pagamentos.qrcode`)) {
                qrcode = `[Clique aqui para ver](${dbConfigs.get(`pagamentos.qrcode`)})`
            }
            const sampascorin = new EmbedBuilder()
                .setAuthor({ name: `Configurando Pagamentos Semiauto`, iconURL: interaction.guild.iconURL({ dynamic: true }) })
                .setColor(dbConfigs.get(`ticket.color`) || "Default")
                .setDescription(`Quando você preenche alguma informação aqui, o sistema de pagamentos automático não é mais a prioridade! Para voltar para o pagamento automático clique no botão **RESETAR**. Também o bloqueador de bancos para de funcionar.`)
                .addFields(
                    {
                        name: `Chave Pix:`,
                        value: `${dbConfigs.get(`pagamentos.chavepix`) || "\`Não Definido\`"}`,
                        inline: true
                    },
                    {
                        name: `QrCode:`,
                        value: `${qrcode}`,
                        inline: true
                    },
                )

            const sampasrowbah = new ActionRowBuilder()
                .addComponents(
                    new ButtonBuilder()
                        .setStyle(2)
                        .setCustomId(`alterar_chavepix`)
                        .setLabel(`Alterar Chave Pix`)
                        .setEmoji(`<:Pix:1239447475035570246>`),
                    new ButtonBuilder()
                        .setStyle(2)
                        .setCustomId(`alterar_qrcode`)
                        .setLabel(`Alterar QrCode`)
                        .setEmoji(`<:qrcode:1225477931447484456>`),
                    new ButtonBuilder()
                        .setStyle(2)
                        .setCustomId(`reset_semiauto`)
                        .setLabel(`Resetar`)
                        .setEmoji("<a:load:1225477784743186472>"),
                    new ButtonBuilder()
                        .setStyle(1)
                        .setCustomId(`voltarConfigPayment`)

                        .setEmoji(voltarEmoji)
                )
            interaction.update({ embeds: [sampascorin], components: [sampasrowbah] })
        }

        if (interaction.customId === "alterar_chavepix") {
            const modal = new ModalBuilder()
                .setCustomId("alterar_chavepix_modal")
                .setTitle("Alterar a Chave Pix")

            const text = new TextInputBuilder()
                .setCustomId("text_modal")
                .setLabel("Fale a chave pix")
                .setPlaceholder("Digite aqui ✏")
                .setStyle(1)

            modal.addComponents(new ActionRowBuilder().addComponents(text))

            return interaction.showModal(modal)
        }

        if (interaction.customId === "alterar_qrcode") {
            const modal = new ModalBuilder()
                .setCustomId("alterar_qrcode_modal")
                .setTitle("Alterar a Chave Pix")

            const text = new TextInputBuilder()
                .setCustomId("text_modal")
                .setLabel("Fale o link do seu qrcode")
                .setPlaceholder("Digite aqui ✏")
                .setStyle(1)

            modal.addComponents(new ActionRowBuilder().addComponents(text))

            return interaction.showModal(modal)
        }

        if (interaction.customId === "reset_semiauto") {
            dbConfigs.delete(`pagamentos.chavepix`)
            dbConfigs.delete(`pagamentos.qrcode`)
            let qrcode = "\`Não Definido\`"
            if (dbConfigs.get(`pagamentos.qrcode`)) {
                qrcode = `[Clique aqui para ver](${dbConfigs.get(`pagamentos.qrcode`)})`
            }
            const sampascorin = new EmbedBuilder()
                .setAuthor({ name: `Configurando Pagamentos Semiauto`, iconURL: interaction.guild.iconURL({ dynamic: true }) })
                .setColor(dbConfigs.get(`ticket.color`) || "Default")
                .setDescription(`Quando você preenche alguma informação aqui, o sistema de pagamentos automático não é mais a prioridade! Para voltar para o pagamento automático clique no botão **RESETAR**. Também o bloqueador de bancos para de funcionar.`)
                .addFields(
                    {
                        name: `Chave Pix:`,
                        value: `${dbConfigs.get(`pagamentos.chavepix`) || "\`Não Definido\`"}`,
                        inline: true
                    },
                    {
                        name: `QrCode:`,
                        value: `${qrcode}`,
                        inline: true
                    },
                )

            const sampasrowbah = new ActionRowBuilder()
                .addComponents(
                    new ButtonBuilder()
                        .setStyle(2)
                        .setCustomId(`alterar_chavepix`)
                        .setLabel(`Alterar Chave Pix`)
                        .setEmoji(`<:Pix:1239447475035570246>`),
                    new ButtonBuilder()
                        .setStyle(2)
                        .setCustomId(`alterar_qrcode`)
                        .setLabel(`Alterar QrCode`)
                        .setEmoji(`<:qrcode:1225477931447484456>`),
                    new ButtonBuilder()
                        .setStyle(2)
                        .setCustomId(`reset_semiauto`)
                        .setLabel(`Resetar`)
                        .setEmoji("<a:load:1225477784743186472>"),
                    new ButtonBuilder()
                        .setStyle(1)
                        .setCustomId(`voltarConfigPayment`)

                        .setEmoji(voltarEmoji)
                )
            interaction.update({ embeds: [sampascorin], components: [sampasrowbah] })
        }

        if (interaction.isModalSubmit()) {
            if (interaction.customId === "modal_alterar_acesstoken") {
                const text = interaction.fields.getTextInputValue("text_modal")

                if (text.startsWith("APP_USR-")) {
                    dbConfigs.set(`pagamentos.acess_token`, text)
                    interaction.reply({ content: `${dbEmojis.get(`6`)}  | Alterado com sucesso!`, flags: MessageFlags.Ephemeral })
                    var banksBloqued = '';
                    dbConfigs.get(`pagamentos.blockbank`)?.map((entry, index) => { banksBloqued += `${entry}\n`; })
                    if (dbConfigs.get("pagamentos.blockbank")?.length <= 0) banksBloqued = "`Nenhum Banco foi Bloqueado`";

                    const sampascorin = new EmbedBuilder()
                        .setColor(dbConfigs.get(`ticket.color`) || "Default")
                        .setAuthor({ name: `Configurando Pagamentos`, iconURL: interaction.guild.iconURL({ dynamic: true }) })
                        .addFields(
                            {
                                name: `Sistema ON/OFF:`,
                                value: `${dbConfigs.get(`pagamentos.sistema`) !== 'ON' ? '\`🔴 Desligado\`' : '\`🟢 Ligado\`'}`,
                                inline: true
                            },
                            {
                                name: `Acess Token:`,
                                value: `||${dbConfigs.get(`pagamentos.acess_token`) || `Não Definido`}||`,
                                inline: true
                            },
                            {
                                name: `Bancos Bloqueados:`,
                                value: `${banksBloqued || 'Não definido'}`
                            }
                        )
                    const sampasrowbah = new ActionRowBuilder()
                        .addComponents(
                            new ButtonBuilder()
                                .setStyle(dbConfigs.get(`pagamentos.sistema`) === "ON" ? 3 : 4)
                                .setCustomId(`paymentsonoff`)
                                .setLabel(dbConfigs.get(`pagamentos.sistema`) === "ON" ? "Sistema (Ligado)" : "Sistema (Desligado)")
                                .setEmoji(dbConfigs.get(`pagamentos.sistema`) === "ON" ? "<:on_mt:1232722645238288506>" : "<:off:1243274635748048937>"),
                            new ButtonBuilder()
                                .setStyle(2)
                                .setCustomId(`sistema_semiauto`)
                                .setLabel(`Sistema Semiauto`)
                                .setEmoji(`<:Pix:1239447475035570246>`),
                            new ButtonBuilder()
                                .setStyle(2)
                                .setCustomId(`alterar_acesstoken`)
                                .setLabel(`Alterar Acess Token`)
                                .setEmoji(`<:emoji_mp:1242924437351698432>`),
                            new ButtonBuilder()
                                .setStyle(2)
                                .setCustomId(`alterar_blockbank`)
                                .setLabel(`Bloquear Bancos`)
                                .setEmoji("<:emoji_50:1242924374915551293>")
                        )

                    interaction.message.edit({ embeds: [sampascorin], components: [sampasrowbah] })
                } else {
                    interaction.reply({ content: `${dbEmojis.get(`13`)}  | Coloque um Acess Token válido!`, flags: MessageFlags.Ephemeral })
                }
            }

            if (interaction.customId === "modal_add_blockbank") {
                const text = interaction.fields.getTextInputValue("text_modal")

                dbConfigs.push(`pagamentos.blockbank`, text)

                var banksBloqued = '';
                dbConfigs.get(`pagamentos.blockbank`)?.map((entry, index) => { banksBloqued += `${entry}\n`; })
                if (dbConfigs.get("pagamentos.blockbank")?.length <= 0) banksBloqued = "`Nenhum Banco foi Bloqueado`";

                const embed = new EmbedBuilder()
                    .setColor(dbConfigs.get(`ticket.color`) || "Default")
                    .setAuthor({ name: `Configurando Pagamentos (Block Bank)`, iconURL: interaction.guild.iconURL({ dynamic: true }) })
                    .addFields(
                        {
                            name: `Sistema ON/OFF:`,
                            value: `${dbConfigs.get(`pagamentos.sistema`) !== 'ON' ? '\`🔴 Desligado\`' : '\`🟢 Ligado\`'}`,
                            inline: true
                        },
                        {
                            name: `Acess Token:`,
                            value: `||${dbConfigs.get(`pagamentos.acess_token`) || `Não Definido`}||`,
                            inline: true
                        },
                        {
                            name: `Bancos Bloqueados:`,
                            value: `${banksBloqued || 'Não definido'}`
                        }
                    )
                const row2 = new ActionRowBuilder()
                    .addComponents(
                        new ButtonBuilder()
                            .setStyle(2)
                            .setCustomId(`addblockbank`)
                            .setLabel(`Adicionar Banco`)
                            .setEmoji("<:mais:1225477811741921393>"),
                        new ButtonBuilder()
                            .setStyle(4)
                            .setCustomId(`removeblockbank`)
                            .setLabel(`Remover Banco`)
                            .setEmoji("<:menos2:1225477800425689210>"),
                        new ButtonBuilder()
                            .setStyle(1)
                            .setCustomId(`voltarconfigpay`)

                            .setEmoji("<:emoji_6:1239445960447361085>")
                    )

                interaction.update({ embeds: [embed], components: [row2] })
            }

            if (interaction.customId === "modal_remove_blockbank") {
                const text = interaction.fields.getTextInputValue("text_modal")
                let banks = []
                dbConfigs.get(`pagamentos.blockbank`)?.map((entry) => {
                    banks.push(entry)
                })
                // Função para remover um banco da lista
                function removeBank(bankName) {
                    const index = banks.indexOf(bankName)
                    if (index !== -1) {
                        banks.splice(index, 1)
                    }
                }
                if (banks.length >= 1) {
                    if (dbConfigs.get("pagamentos.blockbank").includes(text)) {
                        removeBank(text)
                        dbConfigs.set(`pagamentos.blockbank`, banks)
                        interaction.reply({ content: `${dbEmojis.get(`6`)} | O banco \`${text}\` foi desbloqueado com sucesso!`, flags: MessageFlags.Ephemeral })
                    } else {
                        interaction.reply({ content: `${dbEmojis.get(`13`)} | Não foi possível encontrar o banco \`${text}\` nos registros!`, flags: MessageFlags.Ephemeral })
                    }
                } else {
                    interaction.reply({ content: `${dbEmojis.get(`13`)} | Não há nenhum banco bloqueado!`, flags: MessageFlags.Ephemeral })
                }

                var banksBloqued = '';
                dbConfigs.get(`pagamentos.blockbank`)?.map((entry, index) => { banksBloqued += `${entry}\n`; })
                if (dbConfigs.get("pagamentos.blockbank")?.length <= 0) banksBloqued = "`Nenhum Banco foi Bloqueado`";

                const embed = new EmbedBuilder()
                    .setColor(dbConfigs.get(`ticket.color`) || "Default")
                    .setAuthor({ name: `Configurando Pagamentos (Block Bank)`, iconURL: interaction.guild.iconURL({ dynamic: true }) })
                    .addFields(
                        {
                            name: `Sistema ON/OFF:`,
                            value: `${dbConfigs.get(`pagamentos.sistema`) !== 'ON' ? '\`🔴 Desligado\`' : '\`🟢 Ligado\`'}`,
                            inline: true
                        },
                        {
                            name: `Acess Token:`,
                            value: `||${dbConfigs.get(`pagamentos.acess_token`) || `Não Definido`}||`,
                            inline: true
                        },
                        {
                            name: `Bancos Bloqueados:`,
                            value: `${banksBloqued || 'Não definido'}`
                        }
                    )
                const row2 = new ActionRowBuilder()
                    .addComponents(
                        new ButtonBuilder()
                            .setStyle(2)
                            .setCustomId(`addblockbank`)
                            .setLabel(`Adicionar Banco`)
                            .setEmoji("<:mais:1225477811741921393>"),
                        new ButtonBuilder()
                            .setStyle(4)
                            .setCustomId(`removeblockbank`)
                            .setLabel(`Remover Banco`)
                            .setEmoji("<:menos2:1225477800425689210>"),
                        new ButtonBuilder()
                            .setStyle(1)
                            .setCustomId(`voltarconfigpay`)

                            .setEmoji("<:emoji_6:1239445960447361085>")
                    )

                interaction.message.edit({ embeds: [embed], components: [row2] })
            }

            if (interaction.customId === "alterar_chavepix_modal") {
                const text = interaction.fields.getTextInputValue("text_modal")

                dbConfigs.set(`pagamentos.chavepix`, text)

                let qrcode = "\`Não Definido\`"
                if (dbConfigs.get(`pagamentos.qrcode`)) {
                    qrcode = `[Clique aqui para ver](${dbConfigs.get(`pagamentos.qrcode`)})`
                }
                const sampascorin = new EmbedBuilder()
                    .setAuthor({ name: `Configurando Pagamentos Semiauto`, iconURL: interaction.guild.iconURL({ dynamic: true }) })
                    .setColor(dbConfigs.get(`ticket.color`) || "Default")
                    .setDescription(`Quando você preenche alguma informação aqui, o sistema de pagamentos automático não é mais a prioridade! Para voltar para o pagamento automático clique no botão **RESETAR**. Também o bloqueador de bancos para de funcionar.`)
                    .addFields(
                        {
                            name: `Chave Pix:`,
                            value: `${dbConfigs.get(`pagamentos.chavepix`) || "\`Não Definido\`"}`,
                            inline: true
                        },
                        {
                            name: `QrCode:`,
                            value: `${qrcode}`,
                            inline: true
                        },
                    )

                const sampasrowbah = new ActionRowBuilder()
                    .addComponents(
                        new ButtonBuilder()
                            .setStyle(2)
                            .setCustomId(`alterar_chavepix`)
                            .setLabel(`Alterar Chave Pix`)
                            .setEmoji(`<:Pix:1239447475035570246>`),
                        new ButtonBuilder()
                            .setStyle(2)
                            .setCustomId(`alterar_qrcode`)
                            .setLabel(`Alterar QrCode`)
                            .setEmoji(`<:qrcode:1225477931447484456>`),
                        new ButtonBuilder()
                            .setStyle(2)
                            .setCustomId(`reset_semiauto`)
                            .setLabel(`Resetar`)
                            .setEmoji("<a:load:1225477784743186472>"),
                        new ButtonBuilder()
                            .setStyle(1)
                            .setCustomId(`voltarConfigPayment`)

                            .setEmoji(voltarEmoji)
                    )
                interaction.update({ embeds: [sampascorin], components: [sampasrowbah] })

            }

            if (interaction.customId === "alterar_qrcode_modal") {
                const text = interaction.fields.getTextInputValue("text_modal")

                if (!text.startsWith("https://")) {
                    interaction.reply({ content: `${dbEmojis.get(`13`)} | Coloque um link válido!`, flags: MessageFlags.Ephemeral })
                    return;
                }
                dbConfigs.set(`pagamentos.qrcode`, text)

                let qrcode = "\`Não Definido\`"
                if (dbConfigs.get(`pagamentos.qrcode`)) {
                    qrcode = `[Clique aqui para ver](${dbConfigs.get(`pagamentos.qrcode`)})`
                }
                const sampascorin = new EmbedBuilder()
                    .setAuthor({ name: `Configurando Pagamentos Semiauto`, iconURL: interaction.guild.iconURL({ dynamic: true }) })
                    .setColor(dbConfigs.get(`ticket.color`) || "Default")
                    .setDescription(`Quando você preenche alguma informação aqui, o sistema de pagamentos automático não é mais a prioridade! Para voltar para o pagamento automático clique no botão **RESETAR**. Também o bloqueador de bancos para de funcionar.`)
                    .addFields(
                        {
                            name: `Chave Pix:`,
                            value: `${dbConfigs.get(`pagamentos.chavepix`) || "\`Não Definido\`"}`,
                            inline: true
                        },
                        {
                            name: `QrCode:`,
                            value: `${qrcode}`,
                            inline: true
                        }
                    )

                const sampasrowbah = new ActionRowBuilder()
                    .addComponents(
                        new ButtonBuilder()
                            .setStyle(2)
                            .setCustomId(`alterar_chavepix`)
                            .setLabel(`Alterar Chave Pix`)
                            .setEmoji(`<:Pix:1239447475035570246>`),
                        new ButtonBuilder()
                            .setStyle(2)
                            .setCustomId(`alterar_qrcode`)
                            .setLabel(`Alterar QrCode`)
                            .setEmoji(`<:qrcode:1225477931447484456>`),
                        new ButtonBuilder()
                            .setStyle(2)
                            .setCustomId(`reset_semiauto`)
                            .setLabel(`Resetar`)
                            .setEmoji("<a:load:1225477784743186472>"),
                        new ButtonBuilder()
                            .setStyle(1)
                            .setCustomId(`voltarConfigPayment`)

                            .setEmoji(voltarEmoji)
                    )
                interaction.update({ embeds: [sampascorin], components: [sampasrowbah] })
            }
        }


        if (interaction.isButton() && interaction.customId === "uploadEmojisSK") {
            await interaction.deferReply({ ephemeral: true });
            const fs = require('fs');
            const path = require('path');
            const emojiDir = path.join(__dirname, '../../../assets/emojis_pack');
            
            if (!fs.existsSync(emojiDir)) {
                return interaction.editReply({ content: "❌ | Pasta de emojis não encontrada no servidor do bot." });
            }

            const files = fs.readdirSync(emojiDir).filter(f => f.endsWith('.png'));
            let count = 0;
            const uploadedEmojis = dbConfigs.get('sk_emojis') || {};

            for (const file of files) {
                const emojiName = `sk_emoji_${path.parse(file).name.replace(/[^a-zA-Z0-9]/g, '_')}`;
                
                // Verificar se o emoji já existe no servidor
                const existingEmoji = interaction.guild.emojis.cache.find(e => e.name === emojiName);
                if (existingEmoji) {
                    uploadedEmojis[emojiName] = existingEmoji.toString();
                    continue;
                }

                try {
                    const emojiPath = path.join(emojiDir, file);
                    const emoji = await interaction.guild.emojis.create({ attachment: emojiPath, name: emojiName });
                    uploadedEmojis[emojiName] = emoji.toString();
                    count++;
                } catch (err) {
                    console.error(`Erro ao subir emoji ${file}:`, err);
                }
            }

            dbConfigs.set('sk_emojis', uploadedEmojis);
            return interaction.editReply({ content: `✅ | Instalação concluída! **${count}** novos emojis foram adicionados ao seu servidor e estão prontos para uso.` });
        }

        if (interaction.type == InteractionType.ModalSubmit && interaction.customId === "modalConfigAvancada") {
            const nomeBot = interaction.fields.getTextInputValue("nomeBot");
            const corEmbed = interaction.fields.getTextInputValue("corEmbed");
            const footerText = interaction.fields.getTextInputValue("footerText");

            if (nomeBot) client.user.setUsername(nomeBot).catch(() => {});
            if (corEmbed && /^#[0-9A-F]{6}$/i.test(corEmbed)) {
                dbConfigs.set("vendas.embeds.color", corEmbed);
                dbConfigs.set("color", corEmbed);
            }
            if (footerText) dbConfigs.set("vendas.footer", footerText);

            return interaction.reply({ content: "✅ | Configurações avançadas atualizadas com sucesso!", ephemeral: true });
        }
    }
};
