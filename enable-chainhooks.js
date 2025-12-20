import 'dotenv/config';
import { fetch } from 'undici';

async function enableChainhooks() {
  try {
    const apiKey = process.env.HIRO_API_KEY;
    const baseUrl = 'https://api.mainnet.hiro.so/chainhooks/me';
    
    const hooks = [
      '599b2110-a4f2-4760-b971-f763753e6f98', // GM
      '4994b95d-2b6a-4c65-b9d9-32ecc5eb5357'  // Post Message
    ];
    
    for (const uuid of hooks) {
      console.log(`🔄 Enabling chainhook: ${uuid}`);
      
      const res = await fetch(`${baseUrl}/${uuid}/enable`, {
        method: 'PUT',
        headers: {
          'x-hiro-api-key': apiKey,
          'Content-Type': 'application/json'
        },
        body: JSON.stringify({ enabled: true })
      });
      
      console.log('Status:', res.status);
      const text = await res.text();
      console.log('Response:', text);
      console.log('---');
    }
    
  } catch (error) {
    console.error('❌ Error:', error);
  }
}

enableChainhooks();
