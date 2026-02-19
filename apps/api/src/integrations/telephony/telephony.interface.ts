/**
 * TelephonyProvider — abstract interface for telephony integrations.
 *
 * Each provider (Twilio, Exotel, Plivo, etc.) will implement this
 * interface so the rest of the app stays provider-agnostic.
 *
 * TODO Phase 2: Implement concrete providers.
 */
export interface CreateCallOptions {
  from: string;
  to: string;
  businessId: string;
  callbackUrl?: string;
  metadata?: Record<string, unknown>;
}

export interface CallResult {
  providerCallId: string;
  status: string;
}

export interface RecordingResult {
  url: string;
  durationSeconds: number;
  mimeType: string;
}

export interface TelephonyProvider {
  /** Provider identifier (e.g. 'twilio', 'exotel') */
  readonly name: string;

  /**
   * Initiate an outbound call.
   * TODO Phase 2: Implement per provider.
   */
  createCall(options: CreateCallOptions): Promise<CallResult>;

  /**
   * Hang up an active call.
   * TODO Phase 2: Implement per provider.
   */
  hangup(providerCallId: string): Promise<void>;

  /**
   * Fetch a call recording by provider call ID.
   * TODO Phase 2: Implement per provider.
   */
  fetchRecording(providerCallId: string): Promise<RecordingResult>;
}
