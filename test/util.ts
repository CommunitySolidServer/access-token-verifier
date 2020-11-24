import parseJwk from 'jose/jwk/parse'
import fromKeyLike from 'jose/jwk/from_key_like'
import { decode as base64Decode, encode as base64Encode } from 'jose/util/base64url'
import { TextDecoder } from 'util'
import type { DPoPJWK, DPoPPublicJWK, EncodeDPoPOptions } from '../src/type';
import { privateKeyProperties } from '../src/type';
import { v4 } from 'uuid'
import { isEncodeDPoPOptions } from '../src/type-guard';
import SignJWT from 'jose/webcrypto/jwt/sign';

export function decode(input: string): JSON {
    return JSON.parse(new TextDecoder().decode(base64Decode(input)));
}

export function decodeJWT(jwt: string) {
    const { 0: encodedHeader, 1: encodedPayload, 2: signature, length } = jwt.split('.');

    if (length !== 3) {
        throw new TypeError('Invalid JWT');
    }

    return { header: decode(encodedHeader), payload: decode(encodedPayload), signature: signature };
}

export function encode(input: JSON | string): string {
    if(typeof input === 'string') {
        return base64Encode(input);
    }
    return base64Encode(JSON.stringify(input));
}

export function encodeJWT(header: JSON, payload: JSON, signature: string = "") {
    return encode(header).concat('.').concat(encode(payload)).concat('.').concat(encode(signature));
}

/**
 * Retrieve Public JWK from Private JWK
 */
function publicJWK(dpop: DPoPJWK): DPoPPublicJWK {
  return Object.entries(dpop).reduce((prev, [key, value]) => ({...prev, ...(!privateKeyProperties.has(key as any) && { [key]: value }) }), {}) as DPoPPublicJWK;
}

/**
 * Create encoded DPoP JWS
 * The DPoP JWT binds tokens to a specific HTTP method and URL that need to be specified
 */
export async function encodeDPoP(options: EncodeDPoPOptions): Promise<string> {
  isEncodeDPoPOptions(options);

  const { alg, htm, htu, iat = Math.floor(Date.now() / 1000), jti = v4(), jwk } = options;

  return new SignJWT({ htm: htm, htu: htu })
    .setProtectedHeader({ alg: alg, jwk: publicJWK(jwk), typ: 'dpop+jwt' })
    .setIssuedAt()
    .setJti(jti)
    .sign((jwk as any));
}
