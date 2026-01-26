import jwt from 'jsonwebtoken';
import { cookies } from 'next/headers';
import { NextRequest } from 'next/server';

// Ensure these are properly typed
const JWT_SECRET = process.env.JWT_SECRET || 'your-secret-key';
const JWT_EXPIRES_IN = process.env.JWT_EXPIRES_IN || '7d';

export interface TokenPayload {
  userId: string;
  phoneNumber: string;
  role?: string;
  name?: string;
}

export const authService = {
  /**
   * Generate JWT token
   * @param payload - User data to encode in token
   * @returns JWT token string
   */
  generateToken(payload: TokenPayload): string {
    // Use type assertion to bypass strict typing
    return jwt.sign(
      payload, 
      JWT_SECRET,
      {
        expiresIn: JWT_EXPIRES_IN,
        issuer: 'saubh-tech',
      } as any // Bypass strict typing temporarily
    );
  },

  /**
   * Verify and decode JWT token
   * @param token - JWT token to verify
   * @returns TokenPayload if valid, null if invalid
   */
  verifyToken(token: string): TokenPayload | null {
    try {
      const decoded = jwt.verify(
        token, 
        JWT_SECRET,
        {
          issuer: 'saubh-tech',
        } as any // Bypass strict typing temporarily
      ) as unknown as TokenPayload;
      return decoded;
    } catch (error) {
      console.error('Token verification failed:', error);
      return null;
    }
  },

  /**
   * Get user from request Authorization header (for API routes)
   * @param request - NextRequest object
   * @returns TokenPayload if valid token found, null otherwise
   */
  getUserFromRequest(request: NextRequest): TokenPayload | null {
    try {
      // Get authorization header
      const authHeader = request.headers.get('authorization');
      
      if (!authHeader || !authHeader.startsWith('Bearer ')) {
        return null;
      }

      // Extract token (remove "Bearer " prefix)
      const token = authHeader.substring(7);
      
      // Verify and return decoded token
      return this.verifyToken(token);
    } catch (error) {
      console.error('Error getting user from request:', error);
      return null;
    }
  },

  /**
   * Generate random 6-digit OTP
   * @returns 6-digit OTP string
   */
  generateOTP(): string {
    return Math.floor(100000 + Math.random() * 900000).toString();
  },

  /**
   * Validate phone number format
   * @param phoneNumber - Phone number to validate
   * @returns boolean - true if valid
   */
  validatePhoneNumber(phoneNumber: string): boolean {
    // E.164 format: +[country code][number]
    const phoneRegex = /^\+?[1-9]\d{1,14}$/;
    return phoneRegex.test(phoneNumber);
  },

  /**
   * Normalize phone number - removes all non-digits except +
   * @param phoneNumber - Phone number to normalize
   * @returns Normalized phone number
   */
  normalizePhoneNumber(phoneNumber: string): string {
    // Remove all non-digit characters except +
    return phoneNumber.replace(/[^\d+]/g, '');
  },

  /**
   * Format phone number to E.164 format
   * @param phoneNumber - Phone number to format
   * @returns Formatted phone number
   */
  formatPhoneNumber(phoneNumber: string): string {
    // Remove all non-digit characters except +
    let formatted = phoneNumber.replace(/[^\d+]/g, '');
    
    // Add + if not present
    if (!formatted.startsWith('+')) {
      // Assume India if no country code
      formatted = '+91' + formatted;
    }
    
    return formatted;
  },

  /**
   * Get current user from cookies (server-side)
   * @returns TokenPayload if authenticated, null otherwise
   */
  async getCurrentUser(): Promise<TokenPayload | null> {
    const cookieStore = await cookies();
    const token = cookieStore.get('auth-token')?.value;
    
    if (!token) {
      return null;
    }
    
    return this.verifyToken(token);
  },
};

/**
 * Middleware helper to protect routes
 */
export async function requireAuth(): Promise<TokenPayload> {
  const user = await authService.getCurrentUser();
  
  if (!user) {
    throw new Error('Unauthorized');
  }
  
  return user;
}