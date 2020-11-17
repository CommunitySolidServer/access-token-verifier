import type { JWK } from 'jose/types'
import { asserts } from 'ts-guards'
import { isObjectPropertyOf, areObjectPropertiesOf } from 'ts-guards/dist/standard-object';

/**
 * Standard HTTP methods
 * As defined in:
 * - HTTP/1.1 Semantics and Content RFC7231 https://tools.ietf.org/html/rfc7231#section-4
 * - PATCH Method for HTTP RFC5789 https://tools.ietf.org/html/rfc5789
 */
export type RequestMethod = typeof requestMethod extends Set<infer T> ? T : never;

export const requestMethod = new Set(['CONNECT', 'DELETE', 'GET', 'HEAD', 'OPTIONS', 'PATCH', 'POST', 'PUT', 'TRACE'] as const);

export function isRequestMethod(x: unknown): asserts x is RequestMethod {
    asserts.isString(x);
    if (!(requestMethod as Set<string>).has(x)) asserts.error('Digital signature asymetric cryptographic algorithm', x);
}

/**
 * Digital Signature Asymetric Cryptographic Algorithm
 * Note:
 * - ES256 & RS256 are both recommended implementations in JWA libraries
 * - ES256 is likely to become required
 * See also:
 * - JSON Web Algorithms RFC7518 https://tools.ietf.org/html/rfc7518#section-3
 * - DPoP draft https://tools.ietf.org/html/draft-fett-oauth-dpop-04#section-4.1
 */
export type DigitalSignatureAsymetricCryptographicAlgorithm = typeof digitalSignatureAsymetricCryptographicAlgorithm extends Set<infer T> ? T : never;

export const digitalSignatureAsymetricCryptographicAlgorithm = new Set(['ES256', 'ES384', 'ES512', 'PS256', 'PS384', 'PS512', 'RS256', 'RS384', 'RS512'] as const);

export function isDigitalSignatureAsymetricCryptographicAlgorithm(x: unknown): asserts x is DigitalSignatureAsymetricCryptographicAlgorithm {
    asserts.isString(x);
    if (!(digitalSignatureAsymetricCryptographicAlgorithm as Set<string>).has(x)) asserts.error('Digital signature asymetric cryptographic algorithm', x);
}

/**
 * JWK Key Type
 * See also:
 * - JSON Web Signature https://tools.ietf.org/html/rfc7515
 * - JSON Web Key https://tools.ietf.org/html/rfc7517
 */
export type KeyType = AsymetricKeyType | SymetricKeyType;

export type AsymetricKeyType = typeof asymetricKeyType extends Set<infer T> ? T : never;

export const asymetricKeyType = new Set(['EC', 'RSA'] as const);

export function isAsymetricKeyType(x: unknown): asserts x is AsymetricKeyType {
    asserts.isString(x);
    if (!(asymetricKeyType as Set<string>).has(x)) asserts.error('asymetric key type', x);
}

export type SymetricKeyType = "oct";

/**
 * JWK EC Curve
 */
export type Curve = typeof curve extends Set<infer T> ? T : never;

export const curve = new Set(['P-256', 'P-384', 'P-521'] as const);

export function isasymetricKeyType(x: unknown): asserts x is AsymetricKeyType {
    asserts.isString(x);
    if (!(curve as Set<string>).has(x)) asserts.error('asymetric key type', x);
}



/**
 * DPoP JWT as defined in https://tools.ietf.org/html/draft-fett-oauth-dpop-04
 */
export type DPoP = {
    header: DPoPHeader,
    payload: DPoPBody,
    signature: string
}

export function isDPoP(x: unknown): asserts x is DPoP {
    asserts.isObject(x);
    asserts.areObjectPropertiesOf(x, ['header', 'payload', 'signature']);
    isDPoPHeader(x.header);
    isDPoPBody(x.payload);
    asserts.isString(x.signature);
}

export type DPoPHeader = {
    alg: DigitalSignatureAsymetricCryptographicAlgorithm,
    jwk: JWK,
    typ: 'dpop+jwt'
}

export function isDPoPHeader(x: unknown): asserts x is DPoPHeader {
    asserts.isObject(x);
    asserts.areObjectPropertiesOf(x, ['alg', 'jwk', 'typ']);
    isDigitalSignatureAsymetricCryptographicAlgorithm(x.alg);
    // TODO: further key validation (not private, assymetric)
    asserts.isObject(x.jwk);
    if (x.typ !== 'dpop+jwt') asserts.error('dpop+jwt', x.typ);
}

export type DPoPBody = {
    htm: RequestMethod,
    htu: string,
    iat: number,
    jti: string
}

export function isDPoPBody(x: unknown): asserts x is DPoPBody {
    asserts.isObject(x);
    asserts.requiredObjectPropertiesOf(x, ['htm', 'htu', 'iat', 'jti']);
    isRequestMethod(x.htm);
    asserts.isString(x.htu);
    asserts.isNumber(x.iat);
    asserts.isString(x.jti);
}

/**
 * DPoP JWK as defined in https://tools.ietf.org/html/draft-fett-oauth-dpop-04
 * - Must have kty, kid & alg
 */
type DPoPJWK = ECDPoPJWK | RSADPoPJWK;

type ECDPoPJWK = Required<Pick<JWK, 'kty' | 'crv' | 'kid' | 'x' | 'y'>> & {
    kty: 'EC',
    crv: Curve,
    d?: string
}

function isECDPoPJWK(x: unknown): x is PublicECDPoPJWK {
    if(!areObjectPropertiesOf(x, ['kty', 'crv', 'kid', 'x', 'y']) || x.kty !== 'EC' || ) return false;
    return true;
}

type PublicECDPoPJWK = Omit<ECDPoPJWK, 'd'>;

function isPublicECDPoPJWK(x: unknown): x is PublicECDPoPJWK {
    if(!areObjectPropertiesOf(x, ['kty', 'crv', 'kid', 'x', 'y']) || isObjectPropertyOf(x, 'd')) return false;
    return true;
}

function isDPoPKey(x: any): x is DPoPJWK {
    return (
        (x.kty !== 'oct')
    );
}
