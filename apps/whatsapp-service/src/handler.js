import { normalizeWhatsApp, getStaticPasscode, generateOTP } from './normalize.js';
import { findUserByWhatsApp, createUser, updatePasscode } from './db.js';
import { sendWhatsApp } from './sender.js';

export async function handleMessage(rawNumber, messageBody, displayName) {
  const whatsapp = normalizeWhatsApp(rawNumber);
  const body = (messageBody || '').trim();
  const upper = body.toUpperCase();

  console.log(`Message from ${whatsapp}: ${body}`);

  try {
    // REGISTER FLOW
    if (upper.startsWith('REGISTER')) {
      const namePart = body.slice(8).trim();
      const name = namePart || displayName || 'Friend';
      await handleRegister(whatsapp, name);
      return;
    }

    // PASSCODE FLOW
    if (upper === 'PASSCODE' || upper === 'LOGIN' || upper === 'OTP') {
      await handlePasscode(whatsapp, displayName);
      return;
    }

    // Unknown message - ignore silently
    console.log('Unknown message, ignoring');

  } catch (err) {
    console.error('Handler error:', err.message);
    // Never crash - just log
  }
}

async function handleRegister(whatsapp, name) {
  const existing = await findUserByWhatsApp(whatsapp);

  if (existing) {
    // User exists - send OTP
    const otp = generateOTP();
    await updatePasscode(whatsapp, otp, 2);
    await sendWhatsApp(whatsapp,
      `👋 Welcome back, ${existing.fname}!\n` +
      `🔢 Your one-time passcode is: ${otp}\n` +
      `⏰ Valid for 2 minutes only.`
    );
  } else {
    // New user - create account
    const passcode = getStaticPasscode(whatsapp);
    const user = await createUser(whatsapp, name, passcode);
    await sendWhatsApp(whatsapp,
      `Welcome to Saubh.Tech, ${name}!👋\n` +
      `Your sign-in credentials are:\n` +
      `🔗 URL: https://saubh.tech\n` +
      `👤 Login: ${whatsapp}\n` +
      `🔐 Passcode: ${passcode}`
    );
  }
}

async function handlePasscode(whatsapp, displayName) {
  const existing = await findUserByWhatsApp(whatsapp);

  if (existing) {
    // User exists - send OTP
    const otp = generateOTP();
    await updatePasscode(whatsapp, otp, 2);
    await sendWhatsApp(whatsapp,
      `👋 Welcome back, ${existing.fname}!\n` +
      `🔢 Your one-time passcode is: ${otp}\n` +
      `⏰ Valid for 2 minutes only.`
    );
  } else {
    // Not registered - register them
    const name = displayName || 'Friend';
    await handleRegister(whatsapp, name);
  }
}
