import { fetch } from 'undici';

async function testWebhookWithHiroFormat() {
  try {
    // Symulacja payloadu z Hiro dla postMessage
    const postMessagePayload = {
      chainhook: {
        uuid: 'test-uuid',
        name: 'Post Message Monitor All Methods'
      },
      apply: [{
        block_identifier: {
          index: 5408912,
          hash: '0xtest'
        },
        metadata: {},
        parent_block_identifier: {
          index: 5408911,
          hash: '0xparent'
        },
        timestamp: 1766249655,
        transactions: [{
          transaction_identifier: {
            hash: '0x7c4e73ebc30097b64bdf108d5ebab7648d8f6f30e8845bccda1a80f507213654'
          },
          operations: [],
          metadata: {
            success: true,
            result: 'ok',
            sender: 'SP12XVTT769QRMK2TA2EETR5G57Q3W5A4HPA67S86',
            fee: 1000,
            kind: {
              type: 'ContractCall',
              data: {
                contract_identifier: 'SP12XVTT769QRMK2TA2EETR5G57Q3W5A4HPA67S86.postMessage-cl4',
                method: 'post-message',
                args: []
              }
            }
          }
        }]
      }],
      rollback: []
    };
    
    console.log('Sending test payload to webhook...\n');
    console.log('Payload:', JSON.stringify(postMessagePayload, null, 2));
    
    const res = await fetch('https://gm-backend-seven.vercel.app/api/webhook', {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify(postMessagePayload)
    });
    
    console.log('\nResponse status:', res.status);
    const data = await res.json();
    console.log('Response:', JSON.stringify(data, null, 2));
    
  } catch (error) {
    console.error('Error:', error);
  }
}

testWebhookWithHiroFormat();
