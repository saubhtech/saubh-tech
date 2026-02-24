import axios from 'axios';

const client = axios.create({
  baseURL: process.env.EVOLUTION_API_URL,
  headers: {
    'apikey': process.env.EVOLUTION_API_KEY,
    'Content-Type': 'application/json'
  },
  timeout: 10000
});

export async function sendWhatsApp(to, message) {
  try {
    const response = await client.post(
      `/message/sendText/${process.env.EVOLUTION_INSTANCE}`,
      {
        number: to,
        text: message
      }
    );
    console.log('Message sent to', to);
    return response.data;
  } catch (error) {
    console.error(
      'Failed to send message to', to,
      error.response?.data || error.message
    );
    // Never throw - log and continue
  }
}
