# Configuração do Meta Ads Tracking

## ✅ Implementação Concluída

### 1. Meta Pixel Code
- ✅ Adicionado no header do site principal (`index.html`)
- ✅ Adicionado no header da página de oferta (`oferta.html`)
- ✅ Pixel ID: `1876198866338063`

### 2. Eventos Personalizados Implementados

#### Evento "viewoferta"
- **Quando dispara**: Ao carregar a página de oferta
- **Dados enviados**:
  - `content_name`: "StoryFlow Oferta Especial"
  - `content_category`: "oferta"

#### Evento "concluir registro"
- **Quando dispara**: Ao clicar no botão de checkout
- **Dados enviados**:
  - `content_name`: "StoryFlow Sistema Completo"
  - `content_category`: "checkout"
  - `content_ids`: ["storyflow-sistema"]
  - `num_items`: 1
- **Evento padrão**: `CompleteRegistration`

### 3. Token API para Conversions API

**Token fornecido**: `EAAK3NOarZCFsBPT5FzXrGhAbpthSsEZAlTq6duH6ZCPm93vfFXUOvxfD4nvX6unGjeVyGlW7L9L0SywNnka9ZBMYwqtCdR4xPcDXhzpJr6molPfhJEVnOzCJ3ThH9bQLtFVb187ytIZANPhtdlp86rLq9NXfh8oWPyM4WnS0eqB9IKqzps560KeFZBi21O2XgMgZDZD`

## 🔧 Como Usar o Token API

### Onde Aplicar o Token

O token deve ser usado no **backend/servidor** para enviar eventos via **Conversions API**. **NÃO** deve ser exposto no frontend por questões de segurança.

### Implementação Recomendada

1. **No seu servidor/backend** (Node.js, PHP, Python, etc.):
   ```javascript
   // Exemplo em Node.js
   const axios = require('axios');
   
   async function sendConversionsApiEvent(eventData, userData) {
     const payload = {
       data: [{
         event_name: eventData.eventName,
         event_time: Math.floor(Date.now() / 1000),
         user_data: {
           client_ip_address: userData.ip,
           client_user_agent: userData.userAgent,
           fbc: userData.fbc,
           fbp: userData.fbp
         },
         custom_data: {
           content_name: eventData.contentName,
           content_category: eventData.contentCategory
         },
         event_source_url: userData.sourceUrl,
         action_source: 'website'
       }],
       access_token: 'SEU_TOKEN_AQUI'
     };
   
     try {
       const response = await axios.post(
         'https://graph.facebook.com/v18.0/1876198866338063/events',
         payload
       );
       console.log('Evento enviado:', response.data);
     } catch (error) {
       console.error('Erro ao enviar evento:', error);
     }
   }
   ```

2. **Endpoint no seu servidor** para receber eventos do frontend:
   ```javascript
   // Endpoint: POST /api/track-event
   app.post('/api/track-event', async (req, res) => {
     const { eventType, userData } = req.body;
     
     // Enviar via Conversions API
     await sendConversionsApiEvent(eventType, userData);
     
     res.json({ success: true });
   });
   ```

3. **No frontend**, chamar seu endpoint:
   ```javascript
   // No arquivo meta-tracking.js
   async function sendEventToServer(eventType, userData) {
     try {
       await fetch('/api/track-event', {
         method: 'POST',
         headers: { 'Content-Type': 'application/json' },
         body: JSON.stringify({ eventType, userData })
       });
     } catch (error) {
       console.error('Erro ao enviar evento:', error);
     }
   }
   ```

## 📊 Benefícios da Conversions API

1. **Maior precisão**: Eventos enviados diretamente do servidor
2. **Melhor atribuição**: Funciona mesmo com bloqueadores de anúncios
3. **Dados mais ricos**: Acesso a informações do servidor
4. **Conformidade**: Melhor para LGPD/GDPR

## 🔍 Verificação dos Eventos

### Facebook Events Manager
1. Acesse: https://business.facebook.com/events_manager
2. Selecione seu Pixel ID: `1876198866338063`
3. Vá em "Eventos" para ver os eventos sendo disparados
4. Use o "Teste de Eventos" para verificar em tempo real

### Console do Navegador
- Abra o DevTools (F12)
- Vá na aba "Console"
- Os eventos aparecerão com logs como:
  ```
  Evento viewoferta disparado
  Evento concluir registro disparado
  ```

## 🚀 Próximos Passos Recomendados

1. **Configurar Conversions API no servidor** (usando o token fornecido)
2. **Testar eventos** no Facebook Events Manager
3. **Configurar campanhas** no Facebook Ads Manager
4. **Otimizar** baseado nos dados coletados

## 📁 Arquivos Modificados

- `index.html` - Meta Pixel adicionado
- `oferta.html` - Meta Pixel + eventos personalizados
- `assets/js/meta-tracking.js` - Sistema de tracking organizado
- `META_TRACKING_SETUP.md` - Esta documentação

## ⚠️ Importante

- O token API é sensível e deve ser mantido seguro
- Nunca exponha o token no código frontend
- Use variáveis de ambiente no servidor
- Monitore o uso do token para evitar limites de API
