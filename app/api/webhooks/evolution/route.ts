import { NextRequest, NextResponse } from 'next/server';

export async function POST(req: NextRequest) {
  try {
    const body = await req.json();

    const data = body?.data;
    if (!data) return NextResponse.json({ ok: true });

    // 1️⃣ Ignore messages sent by the bot itself (VERY IMPORTANT)
    if (data.key?.fromMe === true) {
      return NextResponse.json({ ok: true });
    }

    // 2️⃣ Extract text from ALL possible message types
    const message =
      data.message?.conversation ||
      data.message?.extendedTextMessage?.text ||
      data.message?.text;

    if (!message) {
      console.log('❌ No text message found');
      return NextResponse.json({ ok: true });
    }

    const text = message.trim();
    const from = data.key?.remoteJid;

    if (!from) return NextResponse.json({ ok: true });

    console.log('📩 Incoming message:', text, 'from:', from);

    // 3️⃣ REGISTER command (case-insensitive)
    if (text.toUpperCase().startsWith('REGISTER')) {
      const name = text.replace(/REGISTER/i, '').trim();

      if (!name) {
        await sendMessage(
          from,
          '❌ Invalid format.\nUse: REGISTER Your Full Name'
        );
        return NextResponse.json({ ok: true });
      }

      // 4️⃣ Generate credentials
      const userId = `USR${Date.now().toString().slice(-6)}`;
      const password = Math.random().toString(36).slice(-8);

      // 5️⃣ Send reply
      await sendMessage(
        from,
        `✅ Registration Successful!\n\nName: ${name}\nUser ID: ${userId}\nPassword: ${password}\n\nLogin:\nhttps://saubh.tech/login`
      );
    }

    return NextResponse.json({ ok: true });
  } catch (error) {
    console.error('🔥 Webhook error:', error);
    // ⚠️ Never throw 500 – Evolution retries & creates chaos
    return NextResponse.json({ ok: true });
  }
}

// 🔥 Helper to send WhatsApp message via Evolution API
async function sendMessage(to: string, text: string) {
  const url = `${process.env.EVOLUTION_API_URL}/message/sendText/${process.env.EVOLUTION_INSTANCE_NAME}`;

  await fetch(url, {
    method: 'POST',
    headers: {
      'Content-Type': 'application/json',
      apikey: process.env.EVOLUTION_INSTANCE_TOKEN!,
    },
    body: JSON.stringify({
      number: to.replace('@s.whatsapp.net', ''),
      text,
    }),
  });
}
