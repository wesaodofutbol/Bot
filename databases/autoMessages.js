/**
 * Sistema de Mensagens Automáticas usando wio.db
 * Substitui o sequelize/sqlite3 para compatibilidade com Termux
 */

const { JsonDatabase } = require('wio.db');

// Banco de dados JSON para mensagens automáticas
const dbAutoMessages = new JsonDatabase({ databasePath: "./databases/dbAutoMessages.json" });

/**
 * Objeto que simula a interface do Sequelize para manter compatibilidade
 */
const dbMessageAuto = {
    /**
     * Busca todas as mensagens que correspondem aos critérios
     * @param {Object} options - Opções de busca
     * @returns {Array} - Array de mensagens encontradas
     */
    findAll: async (options = {}) => {
        try {
            const allMessages = dbAutoMessages.all();
            
            if (!options.where) {
                return allMessages.map(m => ({
                    ...m.data,
                    update: async (newData) => {
                        dbAutoMessages.set(m.ID, { ...m.data, ...newData });
                    }
                }));
            }
            
            // Filtrar por critérios
            const filtered = allMessages.filter(m => {
                let match = true;
                for (const key in options.where) {
                    if (m.data[key] !== options.where[key]) {
                        match = false;
                        break;
                    }
                }
                return match;
            });
            
            return filtered.map(m => ({
                ...m.data,
                update: async (newData) => {
                    dbAutoMessages.set(m.ID, { ...m.data, ...newData });
                }
            }));
        } catch (error) {
            console.error('[AutoMessages] Erro ao buscar mensagens:', error);
            return [];
        }
    },
    
    /**
     * Busca uma mensagem por ID
     * @param {Object} options - Opções de busca
     * @returns {Object|null} - Mensagem encontrada ou null
     */
    findOne: async (options = {}) => {
        try {
            if (options.where && options.where.messageID) {
                const message = dbAutoMessages.get(options.where.messageID);
                if (message) {
                    return {
                        ...message,
                        update: async (newData) => {
                            dbAutoMessages.set(options.where.messageID, { ...message, ...newData });
                        },
                        destroy: async () => {
                            dbAutoMessages.delete(options.where.messageID);
                        }
                    };
                }
            }
            return null;
        } catch (error) {
            console.error('[AutoMessages] Erro ao buscar mensagem:', error);
            return null;
        }
    },
    
    /**
     * Cria uma nova mensagem
     * @param {Object} data - Dados da mensagem
     * @returns {Object} - Mensagem criada
     */
    create: async (data) => {
        try {
            const messageData = {
                messageID: data.messageID,
                messageStyle: data.messageStyle || 'Texto',
                messageSend: data.messageSend || '',
                sendType: data.sendType || 0,
                sendHour: data.sendHour || '00:00',
                sendDelay: data.sendDelay || 0,
                On_Off: data.On_Off || 'OFF',
                embedTitle: data.embedTitle || 'none',
                embedDescription: data.embedDescription || 'none',
                embedColor: data.embedColor || '#FFFFFF',
                embedThumbnail: data.embedThumbnail || 'https://sem-img.com',
                embedImage: data.embedImage || 'https://sem-img.com',
                channelID: data.channelID || 'none'
            };
            
            dbAutoMessages.set(data.messageID, messageData);
            
            return {
                ...messageData,
                update: async (newData) => {
                    dbAutoMessages.set(data.messageID, { ...messageData, ...newData });
                },
                destroy: async () => {
                    dbAutoMessages.delete(data.messageID);
                }
            };
        } catch (error) {
            console.error('[AutoMessages] Erro ao criar mensagem:', error);
            return null;
        }
    },
    
    /**
     * Sincroniza o banco (não necessário para wio.db, mantido para compatibilidade)
     */
    sync: async () => {
        // Não necessário para wio.db
        return true;
    }
};

/**
 * Inicializa o banco de dados (mantido para compatibilidade)
 */
const initDatabase = async () => {
    try {
        // wio.db não precisa de inicialização especial
        console.log('[AutoMessages] Sistema de mensagens automáticas inicializado com sucesso!');
        return true;
    } catch (error) {
        console.error(`[AutoMessages] Erro ao inicializar: ${error}`);
        return false;
    }
};

module.exports = {
    dbMessageAuto,
    initDatabase,
    dbAutoMessages
};
