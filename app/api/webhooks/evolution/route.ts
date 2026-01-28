// app/api/webhooks/evolution/route.ts
import { NextRequest, NextResponse } from 'next/server';
import { authService } from '@/lib/auth-service';
import { evolutionApiService } from '@/lib/evolution-api';
import { userQueries } from '@/lib/db';

export async function POST(request: NextRequest) {
  try {
    const data = await request.json();
    
    console.log('Webhook received:', JSON.stringify(data, null, 2));
    
    // Evolution API webhook structure
    const event = data.event;
    const instance = data.instance;
    
    // Only process message events
    if (event !== 'messages.upsert') {
      return NextResponse.json({ success: true, skipped: 'not a message event' });
    }

    const messageData = data.data;
    const key = messageData.key;
    const message = messageData.message;
    
    // Ignore messages from bot itself
    if (key.fromMe) {
      return NextResponse.json({ success: true, skipped: 'message from bot' });
    }

    // Extract phone number and message text
    const phoneNumber = key.remoteJid.replace('@s.whatsapp.net', '');
    const fullPhone = `+${phoneNumber}`;
    
    const text = message?.conversation || 
                 message?.extendedTextMessage?.text || 
                 message?.imageMessage?.caption || 
                 '';

    if (!text) {
      return NextResponse.json({ success: true, skipped: 'no text in message' });
    }

    console.log(`Message from ${fullPhone}: ${text}`);

    // Command: REGISTER <Name>
    if (text.toUpperCase().startsWith('REGISTER ')) {
      const fname = text.substring(9).trim();
      
      if (!fname) {
        await evolutionApiService.sendMessage(fullPhone, 
          '❌ Please provide your name.\n\nExample:\nREGISTER Yash Singh');
        return NextResponse.json({ success: true });
      }

      // Check if user already exists
      const existing = await userQueries.findByWhatsapp(fullPhone);
      if (existing) {
        await evolutionApiService.sendMessage(fullPhone, 
          `❌ You are already registered!

👤 Name: ${existing.fname}
📱 User ID: ${existing.userid}

To get your password, send: LOGIN
To login: https://saubh.tech/login`);
        return NextResponse.json({ success: true, action: 'already_registered' });
      }

      // Generate password
      const password = authService.generatePassword();
      
      // Create user
      const newUser = await userQueries.create(fname, fullPhone);
      
      // Store password in Redis
      await authService.storePassword(fullPhone, password);

      // Send success message
      await evolutionApiService.sendMessage(fullPhone,
        `🎉 Welcome to Saubh.Tech!

Your account has been created successfully.

👤 Name: ${fname}
📱 User ID: ${newUser.userid}
📞 Phone: ${fullPhone}
🔑 Password: ${password}

🌐 Login here: https://saubh.tech/login

Keep your password secure and don't share it with anyone.`);

      return NextResponse.json({ 
        success: true, 
        action: 'user_registered',
        userid: newUser.userid 
      });
    }

    // Command: LOGIN
    else if (text.toUpperCase() === 'LOGIN' || text.toUpperCase() === 'PASSWORD') {
      const user = await userQueries.findByWhatsapp(fullPhone);
      
      if (!user) {
        await evolutionApiService.sendMessage(fullPhone,
          `❌ You are not registered yet!

To create an account, send:
REGISTER Your Full Name

Example:
REGISTER Yash Singh`);
        return NextResponse.json({ success: true, action: 'user_not_found' });
      }

      // Generate new password (password reset)
      const password = authService.generatePassword();
      await authService.storePassword(fullPhone, password);

      await evolutionApiService.sendMessage(fullPhone,
        `🔐 Your Login Credentials

👤 Name: ${user.fname}
📱 User ID: ${user.userid}
📞 Phone: ${fullPhone}
🔑 New Password: ${password}

🌐 Login here: https://saubh.tech/login

This password has been reset. Use it to login now.`);

      return NextResponse.json({ 
        success: true, 
        action: 'password_sent' 
      });
    }

    // Command: HELP
    else if (text.toUpperCase() === 'HELP' || text.toUpperCase() === 'COMMANDS') {
      await evolutionApiService.sendMessage(fullPhone,
        `📋 Available Commands:

1️⃣ REGISTER <Your Name>
   Create a new account
   Example: REGISTER Yash Singh

2️⃣ LOGIN
   Get your login credentials
   (Also works with: PASSWORD)

3️⃣ HELP
   Show this message

Need assistance? Visit https://saubh.tech`);

      return NextResponse.json({ success: true, action: 'help_sent' });
    }

    // Unknown command
    else {
      await evolutionApiService.sendMessage(fullPhone,
        `👋 Hi there!

I didn't understand that command.

Send HELP to see available commands.

Quick options:
- REGISTER Your Name - Create account
- LOGIN - Get password
- HELP - Show all commands`);

      return NextResponse.json({ success: true, action: 'unknown_command' });
    }

  } catch (error: any) {
    console.error('Webhook error:', error);
    return NextResponse.json(
      { 
        success: false, 
        error: error.message,
        stack: process.env.NODE_ENV === 'development' ? error.stack : undefined
      }, 
      { status: 500 }
    );
  }
}

// Allow GET for webhook verification
export async function GET(request: NextRequest) {
  return NextResponse.json({ 
    status: 'ok',
    message: 'Saubh.Tech Evolution API Webhook',
    timestamp: new Date().toISOString()
  });
}

export const maxDuration = 30;