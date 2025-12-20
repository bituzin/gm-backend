import { fetch } from 'undici';

async function testWebhook() {
  try {
    const webhookUrl = 'https://gm-backend-seven.vercel.app/api/webhook';
    
    console.log('Testing webhook accessibility...');
    console.log('URL:', webhookUrl);
    
    // Test OPTIONS
    console.log('\n1. Testing OPTIONS (CORS preflight)...');
    const optionsRes = await fetch(webhookUrl, { method: 'OPTIONS' });
    console.log('Status:', optionsRes.status);
    console.log('Headers:', Object.fromEntries(optionsRes.headers.entries()));
    
    // Test GET (should return 405)
    console.log('\n2. Testing GET (should be 405)...');
    const getRes = await fetch(webhookUrl);
    console.log('Status:', getRes.status);
    const getText = await getRes.text();
    console.log('Response:', getText);
    
    // Test POST with mock payload
    console.log('\n3. Testing POST with mock payload...');
    const mockPayload = {
      chainhook: { name: 'Test' },
      apply: [{
        contract_identifier: 'SP12XVTT769QRMK2TA2EETR5G57Q3W5A4HPA67S86.gm-unlimited',
        transaction_id: '0xtest123',
        sender: 'SP000000000000000000002Q6VF78'
      }]
    };
    
    const postRes = await fetch(webhookUrl, {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify(mockPayload)
    });
    
    console.log('Status:', postRes.status);
    const postText = await postRes.text();
    console.log('Response:', postText);
    
    if (postRes.status === 200) {
      console.log('\n✅ Webhook is accessible and responding correctly!');
    } else {
      console.log('\n⚠️ Webhook responded but with unexpected status');
    }
    
  } catch (error) {
    console.error('\n❌ Webhook is NOT accessible:', error.message);
  }
}

testWebhook();
