import axios from 'axios';

const EVOLUTION_API_URL = process.env.EVOLUTION_API_URL || 'http://localhost:8090';
const API_KEY = process.env.EVOLUTION_API_KEY;
const INSTANCE_NAME = process.env.EVOLUTION_INSTANCE_NAME || 'default';

const evolutionApi = axios.create({
  baseURL: EVOLUTION_API_URL,
  headers: {
    'apikey': API_KEY,
    'Content-Type': 'application/json',
  },
});

export const evolutionApiService = {
  /**
   * Send a text message via WhatsApp
   * @param number - Phone number in international format (e.g., +919876543210)
   * @param text - Message text to send
   */
  async sendMessage(number: string, text: string) {
  try {
    // Remove '+' and add WhatsApp suffix
    const formattedNumber = number.replace(/^\+/, '') + '@s.whatsapp.net';
    
    const response = await evolutionApi.post(
      `/message/sendText/${INSTANCE_NAME}`,
      {
        number: formattedNumber, // Changed from 'number' to formatted
        text: text,
      }
    );
    return response.data;
  } catch (error) {
    console.error('Error sending message:', error);
    throw error;
  }
},
  /**
   * Send OTP verification code via WhatsApp
   * @param phoneNumber - Phone number in international format
   * @param otp - 6-digit OTP code
   */
  async sendOTP(phoneNumber: string, otp: string) {
    const message = `🔐 Your Saubh.Tech verification code is: ${otp}\n\nValid for 10 minutes. Do not share this code with anyone.`;
    return this.sendMessage(phoneNumber, message);
  },

  /**
   * Get instance connection status
   */
  async getInstanceStatus() {
    try {
      const response = await evolutionApi.get(`/instance/connectionState/${INSTANCE_NAME}`);
      return response.data;
    } catch (error) {
      console.error('Error getting instance status:', error);
      throw error;
    }
  },

  /**
   * Check if a number is registered on WhatsApp
   * @param number - Phone number to check
   */
  async checkNumberExists(number: string) {
    try {
      const response = await evolutionApi.post(
        `/chat/whatsappNumbers/${INSTANCE_NAME}`,
        {
          numbers: [number]
        }
      );
      return response.data;
    } catch (error) {
      console.error('Error checking number:', error);
      throw error;
    }
  },
};