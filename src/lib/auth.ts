import bcrypt from 'bcryptjs'
import { SignJWT, jwtVerify } from 'jose'

const JWT_SECRET = process.env.JWT_SECRET || 'your-super-secret-jwt-key-change-in-production'
const secret = new TextEncoder().encode(JWT_SECRET)

export async function hashPassword(password: string): Promise<string> {
  const salt = await bcrypt.genSalt(12)
  return bcrypt.hash(password, salt)
}

export async function verifyPassword(password: string, hashedPassword: string): Promise<boolean> {
  return bcrypt.compare(password, hashedPassword)
}

export async function createJWT(payload: { userId: string; email: string; role: string }): Promise<string> {
  return new SignJWT(payload)
    .setProtectedHeader({ alg: 'HS256' })
    .setIssuedAt()
    .setExpirationTime('7d')
    .sign(secret)
}

export async function verifyJWT(token: string): Promise<{ userId: string; email: string; role: string } | null> {
  try {
    const { payload } = await jwtVerify(token, secret)
    return payload as { userId: string; email: string; role: string }
  } catch (error) {
    console.error('JWT verification failed:', error)
    return null
  }
}

export function validateEmail(email: string): boolean {
  const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/
  return emailRegex.test(email)
}

export function validatePassword(password: string): { valid: boolean; message?: string } {
  if (password.length < 8) {
    return { valid: false, message: 'Password must be at least 8 characters long' }
  }
  
  if (!/(?=.*[a-z])(?=.*[A-Z])(?=.*\d)/.test(password)) {
    return { 
      valid: false, 
      message: 'Password must contain at least one uppercase letter, one lowercase letter, and one number' 
    }
  }
  
  return { valid: true }
}
