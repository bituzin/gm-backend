import 'dotenv/config';
import { fetch } from 'undici';

async function registerBothDirect() {
  try {
    const apiKey = process.env.HIRO_API_KEY;
    const baseUrl = 'https://api.mainnet.hiro.so/chainhooks/me';
    
    // First, delete all existing hooks
    console.log('🗑️ Deleting old chainhooks...');
    const listRes = await fetch(baseUrl, {
      headers: { 'x-hiro-api-key': apiKey }
    });
    const { results } = await listRes.json();
    
    for (const hook of results || []) {
      console.log(`🗑️ Deleting: ${hook.uuid}`);
      await fetch(`${baseUrl}/${hook.uuid}`, {
        method: 'DELETE',
        headers: { 'x-hiro-api-key': apiKey }
      });
    }
    
    // Register GM chainhook
    console.log('\n📤 Registering GM chainhook...');
    const gmPayload = {
      name: 'GM Unlimited Monitor',
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
    };
    
    console.log('GM Payload:', JSON.stringify(gmPayload, null, 2));
    
    const gmRes = await fetch(baseUrl, {
      method: 'POST',
      headers: {
        'x-hiro-api-key': apiKey,
        'Content-Type': 'application/json'
      },
      body: JSON.stringify(gmPayload)
    });
    
    const gmText = await gmRes.text();
    console.log('GM Response status:', gmRes.status);
    console.log('GM Response:', gmText);
    
    if (gmRes.ok) {
      const gmData = JSON.parse(gmText);
      console.log('✅ GM Chainhook registered:', gmData.uuid);
    }
    
    // Register Post Message chainhook
    console.log('\n📤 Registering Post Message chainhook...');
    const pmPayload = {
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
    
    console.log('PM Payload:', JSON.stringify(pmPayload, null, 2));
    
    const pmRes = await fetch(baseUrl, {
      method: 'POST',
      headers: {
        'x-hiro-api-key': apiKey,
        'Content-Type': 'application/json'
      },
      body: JSON.stringify(pmPayload)
    });
    
    const pmText = await pmRes.text();
    console.log('PM Response status:', pmRes.status);
    console.log('PM Response:', pmText);
    
    if (pmRes.ok) {
      const pmData = JSON.parse(pmText);
      console.log('✅ Post Message Chainhook registered:', pmData.uuid);
    }
    
    console.log('\n✅ Done!');
    
  } catch (error) {
    console.error('❌ Error:', error);
  }
}

registerBothDirect();
