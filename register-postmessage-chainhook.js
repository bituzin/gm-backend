import 'dotenv/config';
import { fetch } from 'undici';

async function registerPostMessageChainhook() {
  try {
    // Register chainhook for post-message contract
    const payload = {
      name: 'Post Message Monitor',
      version: 1,
      chain: 'stacks',
      network: 'mainnet',
      filters: {
        events: [{
          type: 'contract_call',
          contract_identifier: 'SP12XVTT769QRMK2TA2EETR5G57Q3W5A4HPA67S86.postMessage-cl4',
          method: 'post-message'
        }]
      },
      action: {
        type: 'http_post',
        url: 'https://gm-backend-seven.vercel.app/api/webhook'
      }
    };
    
    console.log('📤 Registering Post Message Chainhook:');
    console.log(JSON.stringify(payload, null, 2));
    
    const res = await fetch('https://api.mainnet.hiro.so/v1/ext', {
      method: 'POST',
      headers: {
        'x-api-key': process.env.HIRO_API_KEY,
        'Content-Type': 'application/json'
      },
      body: JSON.stringify(payload)
    });
    
    const text = await res.text();
    console.log('Response status:', res.status);
    console.log('Response:', text);
    
    if (res.ok) {
      const result = JSON.parse(text);
      console.log('✅ Post Message Chainhook registered!');
      console.log('   UUID:', result.uuid);
      
      // Enable it
      console.log('🔄 Enabling chainhook...');
      const enableRes = await fetch(`https://api.mainnet.hiro.so/v1/ext/${result.uuid}/enable`, {
        method: 'POST',
        headers: { 'x-api-key': process.env.HIRO_API_KEY }
      });
      console.log('Enable status:', enableRes.status);
      console.log('✅ Post Message Chainhook enabled!');
    } else {
      console.error('❌ Failed to register:', text);
    }
    
  } catch (error) {
    console.error('❌ Error:', error.message);
    console.error(error);
  }
}

registerPostMessageChainhook();
