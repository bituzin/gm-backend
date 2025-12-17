// Prosty in-memory counter (resetuje się przy redeploy, ale lepsze niż nic)
let gmCounter = {
  total: 0,
  today: 0,
  lastUpdate: Date.now()
};

let messageCounter = {
  total: 0,
  today: 0,
  lastUpdate: Date.now()
};

export default async function handler(req, res) {
  // CORS headers
  res.setHeader('Access-Control-Allow-Origin', '*');
  res.setHeader('Access-Control-Allow-Methods', 'POST, OPTIONS');
  res.setHeader('Access-Control-Allow-Headers', 'Content-Type');
  
  // Handle preflight OPTIONS request
  if (req.method === 'OPTIONS') {
    return res.status(200).end();
  }
  
  // Log everything first for debugging
  console.log('🔔 Webhook called!');
  console.log('Method:', req.method);
  console.log('Headers:', JSON.stringify(req.headers, null, 2));
  console.log('Body:', JSON.stringify(req.body, null, 2));
  
  if (req.method !== 'POST') {
    return res.status(405).json({ error: 'Only POST allowed' });
  }
  
  // NO AUTH CHECK - accepting all requests for testing
  
  try {
    const payload = req.body;
    
    // Log the entire payload structure
    console.log('Full payload:', JSON.stringify(payload, null, 2));
    
    const events = payload.apply || [];
    
    console.log(`📨 Received ${events.length} events`);
    
    // Rozpoznaj typ eventu po contract_identifier
    let eventType = 'unknown';
    if (events.length > 0 && events[0].contract_identifier) {
      const contractId = events[0].contract_identifier;
      if (contractId.includes('gm-unlimited')) {
        eventType = 'gm';
      } else if (contractId.includes('postMessage')) {
        eventType = 'post-message';
      }
    }
    
    console.log(`🏷️ Event type: ${eventType}`);
    
    // Aktualizuj odpowiedni counter
    if (eventType === 'gm') {
      gmCounter.total += events.length;
      gmCounter.today += events.length;
      gmCounter.lastUpdate = Date.now();
      
      for (const event of events) {
        console.log('☀️ GM from:', event.sender);
        console.log('   TX:', event.transaction_id);
      }
      console.log(`📊 GM Counter updated: total=${gmCounter.total}, today=${gmCounter.today}`);
    } else if (eventType === 'post-message') {
      messageCounter.total += events.length;
      messageCounter.today += events.length;
      messageCounter.lastUpdate = Date.now();
      
      for (const event of events) {
        console.log('📧 Message from:', event.sender);
        console.log('   TX:', event.transaction_id);
        // Spróbuj wyciągnąć treść wiadomości z eventu
        if (event.data) {
          console.log('   Content:', event.data);
        }
      }
      console.log(`📊 Message Counter updated: total=${messageCounter.total}, today=${messageCounter.today}`);
    }
    
    res.status(200).json({ 
      success: true, 
      processed: events.length,
      eventType: eventType,
      counters: {
        gm: gmCounter,
        messages: messageCounter
      }
    });
    
  } catch (error) {
    console.error('❌ Error:', error);
    res.status(500).json({ error: error.message });
  }
}

// Export counters dla innych endpointów (jeśli potrzeba)
export { gmCounter, messageCounter };
