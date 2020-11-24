import { asserts } from 'ts-guards'
import { isString } from 'ts-guards/dist/primitive-type'
import { isObjectPropertyOf } from 'ts-guards/dist/standard-object'

import type { DPoP, DPoPHeader, DPoPBody, EncodeDPoPOptions, DecodeDPoPOptions, CheckDPoPClaimsOptions, DPoPJWK, DPoPPublicJWK, ECJWK, ECPublicJWK, RSAJWK, RSAPublicJWK, AccessToken, AccessTokenHeader, AccessTokenBody } from './type'
import { digitalSignatureAsymetricCryptographicAlgorithm, curve, requestMethod, rsaAlgorithm } from './type'

/**
 * Check valid DPoP JWT
 */
export function isDPoP(x: unknown): asserts x is DPoP {
    asserts.areObjectPropertiesOf(x, ['header', 'payload', 'signature']);
    isDPoPHeader(x.header);
    isDPoPBody(x.payload);
    asserts.isString(x.signature);
}

export function isDPoPHeader(x: unknown): asserts x is DPoPHeader {
    asserts.areObjectPropertiesOf(x, ['alg', 'jwk', 'typ']);
    asserts.isLiteralType(x.alg, digitalSignatureAsymetricCryptographicAlgorithm);
    isDPoPPublicJWK(x.jwk);
    asserts.isLiteral(x.typ, 'dpop+jwt' as const);
}

export function isDPoPBody(x: unknown): asserts x is DPoPBody {
    asserts.areObjectPropertiesOf(x, ['htm', 'htu', 'iat', 'jti']);
    asserts.isLiteralType(x.htm, requestMethod);
    asserts.isString(x.htu);
    asserts.isNumber(x.iat);
    asserts.isString(x.jti);
}

/**
 * Check valid Access Token
 */
export function isAccessToken(x: unknown): asserts x is AccessToken {
    asserts.areObjectPropertiesOf(x, ['header', 'payload', 'signature']);
    isAccessTokenHeader(x.header);
    isAccessTokenBody(x.payload);
    asserts.isString(x.signature);
}

export function isAccessTokenHeader(x: unknown): asserts x is AccessTokenHeader {
    asserts.areObjectPropertiesOf(x, ['alg', 'kid']);
    asserts.isLiteralType(x.alg, digitalSignatureAsymetricCryptographicAlgorithm);
    asserts.isString(x.kid);
}

export function isAccessTokenBody(x: unknown): asserts x is AccessTokenBody {
    asserts.areObjectPropertiesOf(x, ['aud', 'azp', 'client_webid', 'cnf', 'exp', 'iat', 'iss', 'jti', 'sub', 'webid']);
    asserts.isLiteral(x.aud, 'solid' as const);
    asserts.isString(x.azp);
    asserts.isString(x.client_webid);
    asserts.isObjectPropertyOf(x.cnf, 'jkt');
    asserts.isString(x.cnf.jkt);
    asserts.isNumber(x.exp);
    asserts.isNumber(x.iat);
    asserts.isString(x.iss);
    asserts.isString(x.jti);
    asserts.isString(x.sub);
    asserts.isString(x.webid);
}

/**
 * JWK Validation
 */
export function isDPoPJWK(x: unknown): asserts x is DPoPJWK {
    asserts.isObjectPropertyOf(x, 'kty');
    if (x.kty === 'EC') {
        isECJWK(x);
    }
    else if (x.kty === 'RSA') {
        isRSAJWK(x);
    }
    else {
        asserts.error('EC or RSA', x.kty);
    }
}

export function isDPoPPublicJWK(x: unknown): asserts x is DPoPPublicJWK {
    asserts.isObjectPropertyOf(x, 'kty');
    if (x.kty === 'EC') {
        isECPublicJWK(x);
    }
    else if (x.kty === 'RSA') {
        isRSAPublicJWK(x);
    }
    else {
        asserts.error('EC or RSA', x.kty);
    }
}

export function isECJWK(x: unknown): asserts x is ECJWK {
    isECPublicJWK(x);
    asserts.isObjectPropertyOf(x, 'd');
    asserts.isString(x.d);
}

export function isECPublicJWK(x: unknown): asserts x is ECPublicJWK {
    asserts.areObjectPropertiesOf(x, [ 'kid', 'kty', 'crv', 'x', 'y']);
    asserts.isString(x.kid);
    asserts.isLiteral(x.kty, 'EC' as const);
    asserts.isLiteralType(x.crv, curve);
    asserts.isString(x.x);
    asserts.isString(x.y);
}

export function isRSAJWK(x: unknown): asserts x is RSAJWK {
    isRSAPublicJWK(x);
    asserts.areObjectPropertiesOf(x, ['d', 'p', 'q', 'dp', 'dq', 'qi']);
    asserts.isString(x.d);
    asserts.isString(x.p);
    asserts.isString(x.q);
    asserts.isString(x.dp);
    asserts.isString(x.dq);
    asserts.isString(x.qi);
}

export function isRSAPublicJWK(x: unknown): asserts x is RSAPublicJWK {
    asserts.areObjectPropertiesOf(x, ['alg', 'kid', 'kty', 'n', 'e']);
    asserts.isLiteralType(x.alg, rsaAlgorithm);
    asserts.isString(x.kid);
    asserts.isLiteral(x.kty, 'RSA' as const);
    asserts.isString(x.n);
    asserts.isString(x.e);
}


/**
 * Check Valid DPoP Functions options
 */
export function isEncodeDPoPOptions(x: unknown): asserts x is EncodeDPoPOptions {
    asserts.areObjectPropertiesOf(x, ['alg', 'htm', 'htu', 'jwk']);
    asserts.isLiteralType(x.alg, digitalSignatureAsymetricCryptographicAlgorithm);
    asserts.isLiteralType(x.htm, requestMethod);
    asserts.isString(x.htu);
    if (isObjectPropertyOf(x, 'iat')) { asserts.isNumber(x.iat) }
    if (isObjectPropertyOf(x, 'jti')) { asserts.isString(x.jti) }
    isDPoPJWK(x);
}

export function isDecodeDPoPOptions(x: unknown): asserts x is DecodeDPoPOptions {
  asserts.areObjectPropertiesOf(x, [ 'encodedDPoP']);
  asserts.isString(x.encodedDPoP)
  if (isObjectPropertyOf(x, 'maxTokenAge')) { asserts.isNumber(x.maxTokenAge) }
  if (isObjectPropertyOf(x, 'clockTolerance')) { asserts.isNumber(x.clockTolerance) }
}

export function isCheckDPoPClaimsOptions(x: unknown): asserts x is CheckDPoPClaimsOptions {
  asserts.areObjectPropertiesOf(x, [ 'htm', 'htu', 'dpop' ]);
  asserts.isLiteralType(x.htm, requestMethod);
  asserts.isString(x.htu);
  if (isObjectPropertyOf(x, 'jtis')) { asserts.isArrayOf(x.jtis, isString) }
  isDPoP(x.dpop);
}
