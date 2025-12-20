import 'dotenv/config';
import { fetch } from 'undici';

async function checkPermissions() {
  try {
    const apiKey = process.env.HIRO_API_KEY;
    
    // Check account info
    console.log('🔍 Checking account info...');
    const accountRes = await fetch('https://api.mainnet.hiro.so/extended/', {
      headers: { 'x-hiro-api-key': apiKey }
    });
    
    console.log('Account API Status:', accountRes.status);
    const accountData = await accountRes.json();
    console.log('Account Data:', JSON.stringify(accountData, null, 2));
    
    // Check chainhooks endpoint
    console.log('\n🔍 Checking chainhooks endpoint...');
    const chainhooksRes = await fetch('https://api.mainnet.hiro.so/chainhooks/me', {
      headers: { 'x-hiro-api-key': apiKey }
    });
    
    console.log('Chainhooks API Status:', chainhooksRes.status);
    const chainhooksData = await chainhooksRes.json();
    console.log('Chainhooks Data:', JSON.stringify(chainhooksData, null, 2));
    
    // Check if we can enable a chainhook
    if (chainhooksData.results && chainhooksData.results.length > 0) {
      const hookId = chainhooksData.results[0].uuid;
      console.log('\n🔍 Checking chainhook details for:', hookId);
      
      const detailRes = await fetch(`https://api.mainnet.hiro.so/chainhooks/me/${hookId}`, {
        headers: { 'x-hiro-api-key': apiKey }
      });
      
      console.log('Detail API Status:', detailRes.status);
      const detailData = await detailRes.json();
      console.log('Detail Data:', JSON.stringify(detailData, null, 2));
    }
    
  } catch (error) {
    console.error('❌ Error:', error);
  }
}

checkPermissions();
