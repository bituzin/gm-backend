import 'dotenv/config';
import { fetch } from 'undici';

async function registerWithPredicate() {
  try {
    const apiKey = process.env.HIRO_API_KEY;
    const baseUrl = 'https://api.mainnet.hiro.so/chainhooks/me';
    
    // Delete old first
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
    
    // Try with empty filter - listen to ALL contract calls
    console.log('\n📤 Registering GM chainhook (all methods)...');
    const gmPayload = {
      name: 'GM Unlimited Monitor All Methods',
      version: 1,
      chain: 'stacks',
      network: 'mainnet',
      filters: {
        events: [{
          type: 'contract_call',
          contract_identifier: 'SP12XVTT769QRMK2TA2EETR5G57Q3W5A4HPA67S86.gm-unlimited'
        }]
      },
      action: {
        type: 'http_post',
        url: 'https://gm-backend-seven.vercel.app/api/webhook'
      }
    };
    
    const gmRes = await fetch(baseUrl, {
      method: 'POST',
      headers: {
        'x-hiro-api-key': apiKey,
        'Content-Type': 'application/json'
      },
      body: JSON.stringify(gmPayload)
    });
    
    console.log('GM Status:', gmRes.status);
    const gmData = await gmRes.json();
    console.log('GM UUID:', gmData.uuid);
    console.log('GM Status:', gmData.status);
    
    // Same for postMessage
    console.log('\n📤 Registering Post Message chainhook (all methods)...');
    const pmPayload = {
      name: 'Post Message Monitor All Methods',
      version: 1,
      chain: 'stacks',
      network: 'mainnet',
      filters: {
        events: [{
          type: 'contract_call',
          contract_identifier: 'SP12XVTT769QRMK2TA2EETR5G57Q3W5A4HPA67S86.postMessage-cl4'
        }]
      },
      action: {
        type: 'http_post',
        url: 'https://gm-backend-seven.vercel.app/api/webhook'
      }
    };
    
    const pmRes = await fetch(baseUrl, {
      method: 'POST',
      headers: {
        'x-hiro-api-key': apiKey,
        'Content-Type': 'application/json'
      },
      body: JSON.stringify(pmPayload)
    });
    
    console.log('PM Status:', pmRes.status);
    const pmData = await pmRes.json();
    console.log('PM UUID:', pmData.uuid);
    console.log('PM Status:', pmData.status);
    
    console.log('\n✅ Registered! Chainhooks will now listen to ALL methods on these contracts');
    console.log('Backend webhook.js will filter by method name');
    
  } catch (error) {
    console.error('❌ Error:', error);
  }
}

registerWithPredicate();
