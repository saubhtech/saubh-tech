import 'dotenv/config';
import express from 'express';
import { handleMessage } from './handler.js';

const app = express();
app.use(express.json());

// Health check
app.get('/health', (req, res) => {
  res.json({ status: 'ok' });
});

// Evolution API webhook
app.post('/webhook/evolution', async (req, res) => {
  // Always return 200 immediately
  res.json({ status: 'ok' });

  try {
    const body = req.body;

    // Only process messages.upsert events
    if (body.event !== 'messages.upsert') return;

    const data = body.data;
    if (!data) return;

    // Skip messages sent by us (fromMe)
    if (data.key?.fromMe) return;

    // Extract sender number
    const rawNumber = data.key?.remoteJid || '';
    if (!rawNumber || rawNumber.includes('g.us')) {
      return; // Skip group messages
    }

    // Extract message text
    const messageBody =
      data.message?.conversation ||
      data.message?.extendedTextMessage?.text ||
      '';

    // Extract display name
    const displayName = data.pushName || '';

    // Process asynchronously
    await handleMessage(rawNumber, messageBody, displayName);

  } catch (err) {
    console.error('Webhook error:', err.message);
  }
});

// WABA webhook (Meta) - verification
app.get('/webhook/waba', (req, res) => {
  const mode = req.query['hub.mode'];
  const token = req.query['hub.verify_token'];
  const challenge = req.query['hub.challenge'];

  if (mode === 'subscribe' && token === process.env.WEBHOOK_SECRET) {
    res.send(challenge);
  } else {
    res.sendStatus(403);
  }
});

// WABA webhook (Meta) - messages
app.post('/webhook/waba', async (req, res) => {
  res.json({ status: 'ok' });

  try {
    const entry = req.body?.entry?.[0];
    const change = entry?.changes?.[0]?.value;
    const message = change?.messages?.[0];

    if (!message) return;
    if (message.type !== 'text') return;

    const rawNumber = message.from;
    const messageBody = message.text?.body || '';
    const displayName = change.contacts?.[0]?.profile?.name || '';

    await handleMessage(rawNumber, messageBody, displayName);

  } catch (err) {
    console.error('WABA webhook error:', err.message);
  }
});

const PORT = process.env.PORT || 3010;
app.listen(PORT, () => {
  console.log(`WhatsApp service running on port ${PORT}`);
});
