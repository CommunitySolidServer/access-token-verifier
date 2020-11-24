import type { JWK } from 'jose/types'

/**
 * DPoP as defined in https://tools.ietf.org/html/draft-fett-oauth-dpop-04
 */
export type DPoP = {
    header: DPoPHeader,
    payload: DPoPBody,
    signature: string
}

export type DPoPHeader = {
    alg: DigitalSignatureAsymetricCryptographicAlgorithm,
    jwk: DPoPPublicJWK,
    typ: 'dpop+jwt'
}

export type DPoPBody = {
    htm: RequestMethod,
    htu: string,
    iat: number,
    jti: string
}


/**
 * DPoP Bound Access Token
 * (DPoP header.jwk.kid to match Access Token payload.cnf.jkt)
 * Specific to Solid
 */
export type AccessToken = {
    header: AccessTokenHeader,
    payload: AccessTokenBody,
    signature: string
}

export type AccessTokenHeader = {
    kid: string,
    alg: DigitalSignatureAsymetricCryptographicAlgorithm
}

export type AccessTokenBody = {
    aud: 'solid',
    azp: string,
    client_webid: string,
    cnf: { jkt: string },
    exp: number,
    iat: number,
    iss: string,
    jti: string,
    sub: string,
    webid: string
}


/**
 * Standard HTTP methods
 * As defined in:
 * - HTTP/1.1 Semantics and Content RFC7231 https://tools.ietf.org/html/rfc7231#section-4
 * - PATCH Method for HTTP RFC5789 https://tools.ietf.org/html/rfc5789
 */
export const requestMethod = new Set(['CONNECT', 'DELETE', 'GET', 'HEAD', 'OPTIONS', 'PATCH', 'POST', 'PUT', 'TRACE'] as const);
export type RequestMethod = typeof requestMethod extends Set<infer T> ? T : never;


/**
 * Digital Signature Asymetric Cryptographic Algorithm
 * Note:
 * - ES256 & RS256 are both recommended implementations in JWA libraries
 * - ES256 is likely to become required
 * - Web Cryptography API support (no RSA1_5)
 * See also:
 * - JSON Web Algorithms RFC7518 https://tools.ietf.org/html/rfc7518#section-3
 * - DPoP draft https://tools.ietf.org/html/draft-fett-oauth-dpop-04#section-4.1
 */
export const rsaAlgorithm = new Set(['RS256', 'RS384', 'RS512'] as const);
export type RSAAlgorithm = typeof rsaAlgorithm extends Set<infer T> ? T : never;
export const digitalSignatureAsymetricCryptographicAlgorithm = new Set(['ES256', 'ES384', 'ES512', 'PS256', 'PS384', 'PS512', ...rsaAlgorithm] as const);
export type DigitalSignatureAsymetricCryptographicAlgorithm = typeof digitalSignatureAsymetricCryptographicAlgorithm extends Set<infer T> ? T : never;


/**
 * JWK Key Type
 * Note:
 * - Web Cryptography API support (no OKP)
 * See also:
 * - JSON Web Algorithm Key Types https://tools.ietf.org/html/rfc7518#section-6.1
 */
export const asymmetricKeyType = new Set(['EC', 'RSA'] as const);
export type AsymmetricKeyType = typeof asymmetricKeyType extends Set<infer T> ? T : never;
export const symmetricKeyType = new Set(['oct'] as const);
export type SymmetricKeyType = typeof symmetricKeyType extends Set<infer T> ? T : never;
export const keyType = new Set([...asymmetricKeyType, ...symmetricKeyType] as const);
export type KeyType = AsymmetricKeyType | SymmetricKeyType;


/**
 * JWK EC Curve
 * Note:
 * - Web Cryptography API support (no secp256k1)
 */
export const curve = new Set(['P-256', 'P-384', 'P-521'] as const);
export type Curve = typeof curve extends Set<infer T> ? T : never;


/**
 * DPoP JWK as defined in https://tools.ietf.org/html/draft-fett-oauth-dpop-04
 * - Must be an Elliptic Curve or RSA public key
 */
export type DPoPJWK = ECJWK | RSAJWK;
export type DPoPPublicJWK = ECPublicJWK | RSAPublicJWK;

export const privateKeyProperties = new Set(['d', 'p', 'q', 'dp', 'dq', 'qi'] as const);
export type PrivateKeyProperties = typeof privateKeyProperties extends Set<infer T> ? T : never;

/**
 * Elliptic Curve JSON Web Key
 * - Must have kid, kty, crv, x, y & d
 * - d is the private part of the key, it must be ommited from the public embedded DPoP JWK
 */
export type ECJWK = Required<Pick<JWK, 'kid' | 'kty' | 'crv' | 'x' | 'y' | 'd'>> & {
    kid: string,
    kty: 'EC',
    crv: Curve,
    x: string,
    y: string,
    d: string
}

export type ECPublicJWK = Omit<ECJWK, PrivateKeyProperties>;

/**
 * RSA JSON Web Key
 * - Must have kid, kty, crv, x, y & d
 * - d is the private part of the key, it must be ommited from the public embedded DPoP JWK
 */
export type RSAJWK = Required<Pick<JWK, 'kid' | 'kty' | 'alg' | 'n' | 'e' | 'd' | 'p' | 'q' | 'dp' | 'dq' | 'qi'>> & {
    kid: string,
    kty: 'RSA',
    alg: RSAAlgorithm,
    n: string,
    e: string,
    d: string,
    p: string,
    q: string,
    dp: string,
    dq: string,
    qi: string
}

export type RSAPublicJWK = Omit<RSAJWK, PrivateKeyProperties>;


/**
 * DPoP Functions Options:
 * - Encode
 * - Decode
 * - Check Claims
 */
export type EncodeDPoPOptions = {
    alg: DigitalSignatureAsymetricCryptographicAlgorithm,
    htm: RequestMethod,
    htu: string,
    iat?: number,
    jti?: string,
    jwk: DPoPJWK
}

export type DecodeDPoPOptions = {
    clockTolerance?: number,
    encodedDPoP: string,
    maxTokenAge?: number
}

export type CheckDPoPClaimsOptions = {
    dpop: DPoP,
    htm: RequestMethod,
    htu: string,
    jtis?: Array<string>
}
