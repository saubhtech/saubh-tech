import { NextRequest, NextResponse } from 'next/server';

export async function POST(req: NextRequest) {
  try {
    const body = await req.json();

    // ✅ 1. Only process messages.upsert
    if (body.event !== 'messages.upsert') {
      return NextResponse.json({ ok: true });
    }

    const data = body.data;
    if (!data) return NextResponse.json({ ok: true });

    // ✅ 2. Ignore bot's own messages
    if (data.key?.fromMe === true) {
      return NextResponse.json({ ok: true });
    }

    // ✅ 3. Extract text safely (REAL FIX)
    const message =
      data.message?.conversation ||
      data.message?.extendedTextMessage?.text ||
      data.message?.imageMessage?.caption ||
      data.message?.videoMessage?.caption;

    if (!message) {
      return NextResponse.json({ ok: true });
    }

    const text = message.trim();
    const from = data.key?.remoteJid;

    if (!from) return NextResponse.json({ ok: true });

    console.log('📩 Incoming message:', text, 'from:', from);

    // ✅ 4. REGISTER command
    if (text.toUpperCase().startsWith('REGISTER')) {
      const name = text.replace(/REGISTER/i, '').trim();

      if (!name) {
        await sendMessage(
          from,
          '❌ Invalid format.\nUse: REGISTER Your Full Name'
        );
        return NextResponse.json({ ok: true });
      }

      const userId = `USR${Date.now().toString().slice(-6)}`;
      const password = Math.random().toString(36).slice(-8);

      await sendMessage(
        from,
        `✅ Registration Successful!\n\nName: ${name}\nUser ID: ${userId}\nPassword: ${password}\n\nLogin:\nhttps://saubh.tech/login`
      );
    }

    return NextResponse.json({ ok: true });
  } catch (err) {
    console.error('🔥 Webhook error:', err);
    return NextResponse.json({ ok: true });
  }
}

async function sendMessage(to: string, text: string) {
  await fetch(
    `${process.env.EVOLUTION_API_URL}/message/sendText/${process.env.EVOLUTION_INSTANCE_NAME}`,
    {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
        apikey: process.env.EVOLUTION_INSTANCE_TOKEN!,
      },
      body: JSON.stringify({
        number: to, // 🔥 DO NOT MODIFY
        text,
      }),
    }
  );
}

