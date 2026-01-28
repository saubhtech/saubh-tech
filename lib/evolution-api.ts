// lib/evolution-api.ts
import axios from 'axios';

const EVOLUTION_API_URL = process.env.EVOLUTION_API_URL || 'http://localhost:8080';
const API_KEY = process.env.EVOLUTION_API_KEY;
const INSTANCE_NAME = process.env.EVOLUTION_INSTANCE_NAME || 'default';

const evolutionApi = axios.create({
  baseURL: EVOLUTION_API_URL,
  timeout: 8000,
  headers: {
    'apikey': API_KEY,
    'Content-Type': 'application/json',
  },
});

export const evolutionApiService = {
  async sendMessage(number: string, text: string) {
    try {
      const formattedNumber = number.replace(/^\+/, '') + '@s.whatsapp.net';
      
      const response = await evolutionApi.post(
        `/message/sendText/${INSTANCE_NAME}`,
        {
          number: formattedNumber,
          text: text,
        },
        { timeout: 7000 }
      );
      return response.data;
    } catch (error) {
      console.error('Error sending message:', error);
      throw error;
    }
  },

  async sendPassword(phoneNumber: string, userid: number, password: string) {
    const message = `🎉 Welcome to Saubh.Tech!

Your account has been created successfully.

📱 User ID: ${userid}
🔑 Password: ${password}

Use your WhatsApp number and this password to login.
Keep your password secure and don't share it with anyone.`;
    
    return this.sendMessage(phoneNumber, message);
  },

  async sendOTP(phoneNumber: string, otp: string) {
    const message = `🔐 Your Saubh.Tech verification code is: ${otp}\n\nValid for 10 minutes. Do not share this code with anyone.`;
    return this.sendMessage(phoneNumber, message);
  },

  async getInstanceStatus() {
    try {
      const response = await evolutionApi.get(`/instance/connectionState/${INSTANCE_NAME}`);
      return response.data;
    } catch (error) {
      console.error('Error getting instance status:', error);
      throw error;
    }
  },

  async checkNumberExists(number: string) {
    try {
      const response = await evolutionApi.post(
        `/chat/whatsappNumbers/${INSTANCE_NAME}`,
        { numbers: [number] }
      );
      return response.data;
    } catch (error) {
      console.error('Error checking number:', error);
      throw error;
    }
  },
};