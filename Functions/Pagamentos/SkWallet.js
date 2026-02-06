/**
 * SkWallet - Integração com GGPIXAPI
 * Sistema de pagamentos via PIX usando a API ggapipix
 * 
 * Documentação: https://ggpixapi.com/docs
 * Base URL: https://ggpixapi.com/api/v1
 */

const axios = require("axios");
const QRCode = require("qrcode");

// Base URL da API GGPIXAPI
const GGPIXAPI_BASE_URL = "https://ggpixapi.com/api/v1";

// API Key fixa - NÃO ALTERAR
const SKWALLET_API_KEY = "gk_b237efe20ed07519fd0f729c3749701df3dc1ed71db925a3";

/**
 * Gera um CPF aleatório válido
 * @returns {string} - CPF válido com 11 dígitos (apenas números)
 */
function generateRandomCPF() {
    // Gera os 9 primeiros dígitos aleatórios
    const n = [];
    for (let i = 0; i < 9; i++) {
        n.push(Math.floor(Math.random() * 10));
    }

    // Calcula o primeiro dígito verificador
    let d1 = 0;
    for (let i = 0; i < 9; i++) {
        d1 += n[i] * (10 - i);
    }
    d1 = 11 - (d1 % 11);
    if (d1 >= 10) d1 = 0;
    n.push(d1);

    // Calcula o segundo dígito verificador
    let d2 = 0;
    for (let i = 0; i < 10; i++) {
        d2 += n[i] * (11 - i);
    }
    d2 = 11 - (d2 % 11);
    if (d2 >= 10) d2 = 0;
    n.push(d2);

    return n.join('');
}

/**
 * Cria uma cobrança PIX usando a API GGPIXAPI
 * @param {number} amountCents - Valor em centavos (mínimo: 100)
 * @param {string} description - Descrição da cobrança
 * @param {string} payerName - Nome do pagador
 * @param {string} externalId - ID externo único (opcional)
 * @returns {Promise<Object>} - Dados da cobrança criada
 */
async function createPixCharge(amountCents, description, payerName, externalId = null) {
    try {
        // Validar valor mínimo (R$ 1,00 = 100 centavos)
        if (amountCents < 100) {
            throw new Error("Valor mínimo é R$ 1,00 (100 centavos)");
        }

        // Validar valor máximo (R$ 500.000,00 = 50000000 centavos)
        if (amountCents > 50000000) {
            throw new Error("Valor máximo é R$ 500.000,00");
        }

        // Gerar CPF aleatório válido para a cobrança
        const randomCPF = generateRandomCPF();

        const payload = {
            amountCents: Math.round(amountCents),
            description: description,
            payerName: payerName,
            payerDocument: randomCPF, // CPF aleatório válido
        };

        // Adicionar externalId se fornecido
        if (externalId) {
            payload.externalId = externalId;
        }

        const response = await axios.post(
            `${GGPIXAPI_BASE_URL}/pix/in`,
            payload,
            {
                headers: {
                    "Content-Type": "application/json",
                    "X-API-Key": SKWALLET_API_KEY
                },
                timeout: 30000
            }
        );

        return {
            success: true,
            data: {
                id: response.data.id,
                status: response.data.status,
                amount: response.data.amount,
                pixCode: response.data.pixCode,
                pixCopyPaste: response.data.pixCopyPaste,
                externalId: response.data.externalId,
                createdAt: response.data.createdAt,
                fees: response.data.fees
            }
        };

    } catch (error) {
        console.error("[SkWallet] Erro ao criar cobrança PIX:", error.response?.data || error.message);
        
        let errorMessage = "Erro ao criar cobrança PIX";
        
        if (error.response) {
            switch (error.response.status) {
                case 400:
                    errorMessage = "Requisição inválida - verifique os parâmetros";
                    break;
                case 401:
                    errorMessage = "API Key inválida ou ausente";
                    break;
                case 403:
                    errorMessage = "Acesso negado - IP não autorizado";
                    break;
                case 409:
                    errorMessage = "Requisição duplicada (externalId já existe)";
                    break;
                case 429:
                    errorMessage = "Limite de requisições excedido - aguarde";
                    break;
                case 500:
                    errorMessage = "Erro interno do servidor GGPIXAPI";
                    break;
                default:
                    errorMessage = error.response.data?.message || errorMessage;
            }
        }

        return {
            success: false,
            error: errorMessage
        };
    }
}

/**
 * Consulta o status de uma transação
 * @param {string} transactionId - ID da transação
 * @returns {Promise<Object>} - Status da transação
 */
async function getTransactionStatus(transactionId) {
    try {
        const response = await axios.get(
            `${GGPIXAPI_BASE_URL}/transactions/${transactionId}`,
            {
                headers: {
                    "X-API-Key": SKWALLET_API_KEY
                },
                timeout: 15000
            }
        );

        return {
            success: true,
            data: {
                id: response.data.id,
                type: response.data.type,
                status: response.data.status,
                amount: response.data.amount,
                gatewayFee: response.data.gatewayFee,
                netAmount: response.data.netAmount,
                description: response.data.description,
                externalId: response.data.externalId,
                createdAt: response.data.createdAt,
                updatedAt: response.data.updatedAt,
                paidAt: response.data.paidAt
            }
        };

    } catch (error) {
        console.error("[SkWallet] Erro ao consultar transação:", error.response?.data || error.message);
        
        return {
            success: false,
            error: error.response?.data?.message || "Erro ao consultar transação"
        };
    }
}

/**
 * Consulta o saldo da conta
 * @returns {Promise<Object>} - Saldo da conta
 */
async function getBalance() {
    try {
        const response = await axios.get(
            `${GGPIXAPI_BASE_URL}/balance`,
            {
                headers: {
                    "X-API-Key": SKWALLET_API_KEY
                },
                timeout: 15000
            }
        );

        return {
            success: true,
            data: {
                balance: response.data.balance,
                balanceFormatted: response.data.balanceFormatted
            }
        };

    } catch (error) {
        console.error("[SkWallet] Erro ao consultar saldo:", error.response?.data || error.message);
        
        return {
            success: false,
            error: error.response?.data?.message || "Erro ao consultar saldo"
        };
    }
}

/**
 * Gera um QR Code em formato buffer a partir do código PIX
 * @param {string} pixCode - Código PIX copia e cola
 * @returns {Promise<Buffer>} - Buffer da imagem do QR Code
 */
async function generateQRCodeBuffer(pixCode) {
    try {
        const buffer = await QRCode.toBuffer(pixCode, {
            type: 'png',
            width: 300,
            errorCorrectionLevel: 'H',
            margin: 2
        });
        
        return {
            success: true,
            buffer: buffer
        };
    } catch (error) {
        console.error("[SkWallet] Erro ao gerar QR Code:", error.message);
        return {
            success: false,
            error: "Erro ao gerar QR Code"
        };
    }
}

/**
 * Gera um QR Code em formato base64 a partir do código PIX
 * @param {string} pixCode - Código PIX copia e cola
 * @returns {Promise<string>} - String base64 da imagem
 */
async function generateQRCodeBase64(pixCode) {
    try {
        const base64 = await QRCode.toDataURL(pixCode, {
            type: 'image/png',
            width: 300,
            errorCorrectionLevel: 'H',
            margin: 2
        });
        
        // Remove o prefixo "data:image/png;base64,"
        const base64Clean = base64.split(",")[1];
        
        return {
            success: true,
            base64: base64Clean
        };
    } catch (error) {
        console.error("[SkWallet] Erro ao gerar QR Code base64:", error.message);
        return {
            success: false,
            error: "Erro ao gerar QR Code"
        };
    }
}

module.exports = {
    createPixCharge,
    getTransactionStatus,
    getBalance,
    generateQRCodeBuffer,
    generateQRCodeBase64,
    generateRandomCPF,
    GGPIXAPI_BASE_URL
};
