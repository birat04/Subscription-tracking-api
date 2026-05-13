import { SignJWT, jwtVerify } from 'jose';

const secret = () => new TextEncoder().encode(process.env.JWT_SECRET ?? '');
const ALG = 'HS256';

export async function signToken(payload: { userId: string; email: string }) {
  const key = secret();
  if (!key.length) throw new Error('JWT_SECRET is not defined');
  return new SignJWT(payload)
    .setProtectedHeader({ alg: ALG })
    .setIssuedAt()
    .setExpirationTime(process.env.JWT_EXPIRES_IN ?? '7d')
    .sign(key);
}

export async function verifyToken(token: string) {
  const key = secret();
  if (!key.length) throw new Error('JWT_SECRET is not defined');
  const { payload } = await jwtVerify(token, key);
  return payload as { userId: string; email: string };
}
