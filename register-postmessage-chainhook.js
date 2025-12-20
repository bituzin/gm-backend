import 'dotenv/config';
import { ChainhooksClient, CHAINHOOKS_BASE_URL } from '@hirosystems/chainhooks-client';

async function registerPostMessageChainhook() {
  try {
    const client = new ChainhooksClient({
      baseUrl: CHAINHOOKS_BASE_URL.mainnet,
      apiKey: process.env.HIRO_API_KEY
    });
    
    console.log('📤 Registering Post Message Chainhook...');
    
    const chainhook = await client.registerChainhook({
      name: 'Post Message Monitor',
      version: 1,
      chain: 'stacks',
      network: 'mainnet',
      filters: {
        events: [{
          type: 'contract_call',
          contract_identifier: 'SP12XVTT769QRMK2TA2EETR5G57Q3W5A4HPA67S86.postMessage-cl4',
          methods: ['post-message']
        }]
      },
        action: {
          type: 'http_post',
          url: 'https://gm-backend-seven.vercel.app/api/webhook'
        }
    });
    
    console.log('✅ Post Message Chainhook registered!');
    console.log('   UUID:', chainhook.uuid);
    
    // Enable the chainhook
    console.log('🔄 Enabling chainhook...');
    await client.enableChainhook(chainhook.uuid, true);
    console.log('✅ Post Message Chainhook enabled!');
    
  } catch (error) {
    console.error('❌ Error:', error.message);
    console.error(error);
  }
}

registerPostMessageChainhook();
