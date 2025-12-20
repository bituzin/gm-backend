import 'dotenv/config';
import { ChainhooksClient, CHAINHOOKS_BASE_URL } from '@hirosystems/chainhooks-client';

async function updateGMChainhookURL() {
  try {
    const client = new ChainhooksClient({
      baseUrl: CHAINHOOKS_BASE_URL.mainnet,
      apiKey: process.env.HIRO_API_KEY
    });
    
    const oldUUID = '8148a508-d5fc-4b23-8511-15abba4a364f';
    
    console.log('🗑️ Deleting old GM chainhook...');
    await client.deleteChainhook(oldUUID);
    console.log('✅ Deleted!');
    
    console.log('📤 Registering new GM Chainhook with updated URL...');
    
    const chainhook = await client.registerChainhook({
      name: 'GM Monitor',
      version: 1,
      chain: 'stacks',
      network: 'mainnet',
      filters: {
        events: [{
          type: 'contract_call',
          contract_identifier: 'SP12XVTT769QRMK2TA2EETR5G57Q3W5A4HPA67S86.gm-unlimited',
          method: 'say-gm'
        }]
      },
        action: {
          type: 'http_post',
          url: 'https://gm-backend-seven.vercel.app/api/webhook'
        }
    });
    
    console.log('✅ GM Chainhook registered!');
    console.log('   UUID:', chainhook.uuid);
    
    // Enable the chainhook
    console.log('🔄 Enabling chainhook...');
    await client.enableChainhook(chainhook.uuid, true);
    console.log('✅ GM Chainhook enabled!');
    
  } catch (error) {
    console.error('❌ Error:', error.message);
    console.error(error);
  }
}

updateGMChainhookURL();
