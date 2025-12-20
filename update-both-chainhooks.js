import 'dotenv/config';
import { ChainhooksClient, CHAINHOOKS_BASE_URL } from '@hirosystems/chainhooks-client';

const client = new ChainhooksClient({
  baseUrl: CHAINHOOKS_BASE_URL.mainnet,
  apiKey: process.env.HIRO_API_KEY
});

async function updateBothChainhooks() {
  try {
    // UUID z check-chainhooks.js
    const gmUUID = 'df590c78-8210-4b3b-acd7-410cb1a65459';
    const postMessageUUID = 'a55ac878-00b7-41c5-89d3-e198d6163c38';
    
    console.log('📤 Updating GM Chainhook...');
    await client.deleteChainhook(gmUUID);
    console.log('🗑️ Deleted old GM chainhook');
    
    const gmHook = await client.registerChainhook({
      name: 'GM Monitor',
      version: 1,
      chain: 'stacks',
      network: 'mainnet',
      filters: {
        events: [{
          type: 'contract_call',
          contract_identifier: 'SP12XVTT769QRMK2TA2EETR5G57Q3W5A4HPA67S86.gm-unlimited',
          methods: ['say-gm']
        }]
      },
        action: {
          type: 'http_post',
          url: 'https://gm-backend-seven.vercel.app/api/webhook'
        }
    });
    
    console.log('✅ GM Chainhook registered with new UUID:', gmHook.uuid);
    await client.enableChainhook(gmHook.uuid, true);
    console.log('✅ GM Chainhook enabled!');
    
    console.log('\n📤 Updating Post Message Chainhook...');
    await client.deleteChainhook(postMessageUUID);
    console.log('🗑️ Deleted old Post Message chainhook');
    
    const postMessageHook = await client.registerChainhook({
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
    
    console.log('✅ Post Message Chainhook registered with new UUID:', postMessageHook.uuid);
    await client.enableChainhook(postMessageHook.uuid, true);
    console.log('✅ Post Message Chainhook enabled!');
    
    console.log('\n🎉 Both chainhooks updated successfully!');
    console.log('   GM UUID:', gmHook.uuid);
    console.log('   Post Message UUID:', postMessageHook.uuid);
    
  } catch (error) {
    console.error('❌ Error:', error.message);
    console.error(error);
  }
}

updateBothChainhooks();
