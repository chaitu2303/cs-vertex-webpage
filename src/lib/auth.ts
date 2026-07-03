import { SignJWT, jwtVerify } from 'jose'

function getKey() {
  const secretKey = (typeof process !== 'undefined' ? process.env.JWT_SECRET : undefined) || 'fallback_key_for_build_only_123'
  return new TextEncoder().encode(secretKey)
}

export async function encrypt(payload: any) {
  const key = getKey()
  return await new SignJWT(payload)
    .setProtectedHeader({ alg: 'HS256' })
    .setIssuedAt()
    .setExpirationTime('1d')
    .sign(key)
}

export async function decrypt(input: string): Promise<any> {
  const key = getKey()
  const { payload } = await jwtVerify(input, key, {
    algorithms: ['HS256'],
  })
  return payload
}
