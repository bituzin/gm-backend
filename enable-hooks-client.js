import 'dotenv/config';
import { ChainhooksClient, CHAINHOOKS_BASE_URL } from '@hirosystems/chainhooks-client';

const client = new ChainhooksClient({
  baseUrl: CHAINHOOKS_BASE_URL.mainnet,
  apiKey: process.env.HIRO_API_KEY
});

async function enableHooks() {
  try {
    const hooks = [
      '2e346ec1-d452-4b81-97e2-bdaa61a283cf', // GM
      'efd1fd92-958f-4728-9393-007ad576607f'  // Post Message
    ];
    
    for (const uuid of hooks) {
      console.log(`🔄 Enabling: ${uuid}`);
      try {
        await client.enableChainhook(uuid, true);
        console.log('✅ Enabled!');
      } catch (error) {
        console.error('❌ Error:', error.message);
      }
    }
    
    // Check status
    console.log('\n📋 Checking status...');
    const { results } = await client.getChainhooks();
    for (const hook of results) {
      console.log(`\n${hook.definition.name}:`);
      console.log('  UUID:', hook.uuid);
      console.log('  Enabled:', hook.status.enabled);
      console.log('  Status:', hook.status.status);
      console.log('  Evaluated:', hook.status.evaluated_block_count);
    }
    
  } catch (error) {
    console.error('❌ Error:', error);
  }
}

enableHooks();
