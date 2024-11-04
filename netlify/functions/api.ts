import { Handler } from '@netlify/functions';
import axios from 'axios';

const API_KEY = 'c0adfa1e-da7a-4628-bf5f-0b7a2f43e898';
const BASE_URL = 'https://www.oklink.com/api/v5';

const headers = {
  'Ok-Access-Key': API_KEY,
  'Content-Type': 'application/json'
};

const handler: Handler = async (event) => {
  if (!event.path) {
    return {
      statusCode: 400,
      body: JSON.stringify({ error: 'Invalid request' })
    };
  }

  try {
    const path = event.path.replace('/.netlify/functions/api/', '');
    const [action, ...params] = path.split('/');

    switch (action) {
      case 'check-networks': {
        const [address] = params;
        const networks = ['eth', 'bsc', 'polygon', 'arbitrum', 'optimism', 'base', 'zksync', 'linea', 'scroll'];
        const results = await Promise.all(
          networks.map(async (network) => {
            try {
              const response = await axios.get(
                `${BASE_URL}/explorer/address/transaction-list?address=${address}&chainShortName=${network}&limit=1`,
                { headers }
              );
              return response.data?.data?.[0]?.transactionLists?.length > 0 ? network : null;
            } catch {
              return null;
            }
          })
        );
        return {
          statusCode: 200,
          body: JSON.stringify({
            networks: results.filter(Boolean)
          })
        };
      }

      case 'transactions': {
        const [network, address] = params;
        const response = await axios.get(
          `${BASE_URL}/explorer/address/transaction-list?address=${address}&chainShortName=${network}&limit=50`,
          { headers }
        );
        return {
          statusCode: 200,
          body: JSON.stringify(response.data)
        };
      }

      case 'balance': {
        const [network, address] = params;
        const response = await axios.get(
          `${BASE_URL}/explorer/address/balance?address=${address}&chainShortName=${network}`,
          { headers }
        );
        return {
          statusCode: 200,
          body: JSON.stringify(response.data)
        };
      }

      default:
        return {
          statusCode: 404,
          body: JSON.stringify({ error: 'Not found' })
        };
    }
  } catch (error) {
    console.error('API Error:', error);
    return {
      statusCode: 500,
      body: JSON.stringify({ error: 'Internal server error' })
    };
  }
};

export { handler };