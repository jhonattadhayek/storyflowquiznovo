/**
 * Meta Ads Tracking Configuration
 * Configuração para tracking do Meta Ads (Facebook Pixel + Conversions API)
 */

// Configurações do Meta Pixel
const META_CONFIG = {
    // ID do Pixel do Facebook
    pixelId: '1876198866338063',
    
    // Access Token para Conversions API (Server-Side)
    accessToken: 'EAAK3NOarZCFsBPT5FzXrGhAbpthSsEZAlTq6duH6ZCPm93vfFXUOvxfD4nvX6unGjeVyGlW7L9L0SywNnka9ZBMYwqtCdR4xPcDXhzpJr6molPfhJEVnOzCJ3ThH9bQLtFVb187ytIZANPhtdlp86rLq9NXfh8oWPyM4WnS0eqB9IKqzps560KeFZBi21O2XgMgZDZD',
    
    // URL da Conversions API
    conversionsApiUrl: 'https://graph.facebook.com/v18.0/' + '1876198866338063' + '/events',
    
    // Configurações de eventos
    events: {
        viewoferta: {
            eventName: 'ViewContent',
            customEventName: 'viewoferta',
            contentName: 'StoryFlow Oferta Especial',
            contentCategory: 'oferta'
        },
        purchase: {
            eventName: 'CompleteRegistration',
            customEventName: 'concluir registro',
            contentName: 'StoryFlow Sistema Completo',
            contentCategory: 'checkout'
        }
    }
}

/**
 * Função para enviar eventos via Conversions API (Server-Side)
 * Esta função seria chamada do seu servidor/backend
 */
async function sendConversionsApiEvent(eventData, userData = {}) {
    try {
        const payload = {
            data: [{
                event_name: eventData.eventName,
                event_time: Math.floor(Date.now() / 1000),
                user_data: {
                    client_ip_address: userData.ip || '',
                    client_user_agent: userData.userAgent || navigator.userAgent,
                    fbc: getCookie('_fbc') || '',
                    fbp: getCookie('_fbp') || ''
                },
                custom_data: {
                    content_name: eventData.contentName,
                    content_category: eventData.contentCategory
                },
                event_source_url: window.location.href,
                action_source: 'website'
            }],
            access_token: META_CONFIG.accessToken
        }

        // Esta chamada seria feita do seu servidor, não diretamente do frontend
        // por questões de segurança (o token não deve ser exposto no frontend)
        console.log('Conversions API Payload:', payload)
        
        return payload
    } catch (error) {
        console.error('Erro ao preparar evento para Conversions API:', error)
        return null
    }
}

/**
 * Função auxiliar para obter cookies
 */
function getCookie(name) {
    const value = `; ${document.cookie}`;
    const parts = value.split(`; ${name}=`);
    if (parts.length === 2) return parts.pop().split(';').shift();
    return '';
}

/**
 * Função para trackear eventos personalizados
 */
function trackCustomEvent(eventType, additionalData = {}) {
    if (typeof fbq === 'undefined') {
        console.warn('Facebook Pixel não carregado')
        return
    }

    const eventConfig = META_CONFIG.events[eventType]
    if (!eventConfig) {
        console.warn(`Configuração de evento não encontrada: ${eventType}`)
        return
    }

    // Disparar evento personalizado
    fbq('track', eventConfig.customEventName, {
        content_name: eventConfig.contentName,
        content_category: eventConfig.contentCategory,
        ...additionalData
    })

    // Disparar evento padrão do Facebook
    fbq('track', eventConfig.eventName, {
        content_name: eventConfig.contentName,
        content_category: eventConfig.contentCategory,
        ...additionalData
    })

    console.log(`Evento ${eventType} disparado:`, {
        custom: eventConfig.customEventName,
        standard: eventConfig.eventName
    })
}

// Exportar funções para uso global
window.MetaTracking = {
    trackCustomEvent,
    sendConversionsApiEvent,
    config: META_CONFIG
}
