import { JWK, JWS, JWT } from 'jose';
import { v4 } from 'uuid';
import { asserts} from 'ts-guards'
import { isObjectPropertyOf } from 'ts-guards/dist/standard-object'
import { isString } from 'ts-guards/dist/primitive-type'

import { digitalSignatureAsymetricCryptographicAlgorithm, isDigitalSignatureAsymetricCryptographicAlgorithm, isDPoP, isRequestMethod, } from './types'
import type { DPoP, DPoPBody, DPoPHeader, DigitalSignatureAsymetricCryptographicAlgorithm, RequestMethod } from './types'


/**
 * Create encoded DPoP JWS
 * The DPoP JWT binds tokens to a specific HTTP method and URL that need to be specified
 */
type EncodeDPoPOptions = {
  alg: DigitalSignatureAsymetricCryptographicAlgorithm,
  htm: RequestMethod,
  htu: string,
  iat?: number,
  jti?: string,
  jwk: JWK.Key
}

function isEncodeDPoPOptions(x: unknown): asserts x is EncodeDPoPOptions {
  asserts.isObject(x);
  asserts.requiredObjectPropertiesOf(x, [ 'alg', 'htm', 'htu', 'jwk' ]);
  isDigitalSignatureAsymetricCryptographicAlgorithm(x.alg);
  isRequestMethod(x.htm);
  asserts.isString(x.htu);
  if (isObjectPropertyOf(x, 'iat')) { asserts.isNumber(x.iat) }
  if (isObjectPropertyOf(x, 'jti')) { asserts.isString(x.jti) }
  //TODO: isKey
}

export async function encodeDPoP(options: EncodeDPoPOptions): Promise<string> {
  isEncodeDPoPOptions(options);

  const { alg, htm, htu, iat = Math.floor(Date.now() / 1000), jti = v4(), jwk } = options;

  return JWS.sign(
    JSON.stringify(<DPoPBody>{ htm: htm, htu: htu, iat: iat, jti: jti }),
    jwk,
    <DPoPHeader>{ alg: alg, jwk: jwk, typ: 'dpop+jwt' });
}

/**
 * Decode DPoP JWS
 * Requires an encoded DPoP and optionally a specific token age and tolerance
 */
type DecodeDPoPOptions = {
  clockTolerance?: number,
  encodedDPoP: string,
  maxTokenAge?: number
}

function isDecodeDPoPOptions(x: unknown): asserts x is DecodeDPoPOptions {
  asserts.isObject(x);
  asserts.requiredObjectPropertiesOf(x, [ 'encodedDPoP']);
  asserts.isString(x.encodedDPoP)
  if (isObjectPropertyOf(x, 'maxTokenAge')) { asserts.isNumber(x.maxTokenAge) }
  if (isObjectPropertyOf(x, 'clockTolerance')) { asserts.isNumber(x.clockTolerance) }
}

export async function decodeDPoP(options: DecodeDPoPOptions): Promise<DPoP> {
  isDecodeDPoPOptions(options);

  const { encodedDPoP, maxTokenAge = 60, clockTolerance = 5 } = options;

  /**
   * Verify:
   * - Signature of DPoP JWT/JWS matches the key embedded in the token header
   * - Claims of DPoP JWT
   *    - DPoP header alg claim to be one of the supported algorithms
   *    - DPoP header jwk claim to be a valid embedded key
   *    - DPoP header typ claim to be 'dpop+jwt'
   *    - DPoP body iat and its value not to be in the future taking clockTolerance into account,
   *      or too far in the past by maxTokenAge
   * Note:
   * - The maxTokenAge option makes the iat claim mandatory
   * - DPoP tokens can rely on iat+maxTokenAge to be invalidated since they are specific to a request
   *   (so the exp claim which is not required in DPoP tokens' bodys is also redundant)
   */
  const token = <{ header: DPoPHeader, payload: DPoPBody | object, signature: string }>JWT.verify(encodedDPoP, JWK.EmbeddedJWK, {
    typ: 'dpop+jwt',
    algorithms: Array.from(digitalSignatureAsymetricCryptographicAlgorithm),
    complete: true,
    maxTokenAge: `${maxTokenAge}s`,
    clockTolerance: `${clockTolerance}s`
  });

  isDPoP(token);

  return token;
}

/**
 * Verify decoded DPoP JWT claims 
 * - htm matches request HTTP method
 * - htu matches request URL
 * - jti is unique
 */
type CheckDPoPClaimsOptions = {
  dpop: DPoP,
  htm: RequestMethod,
  htu: string,
  jtis?: Array<string>
}

function isCheckDPoPClaimsOptions(x: unknown): asserts x is CheckDPoPClaimsOptions {
  asserts.isObject(x);
  asserts.requiredObjectPropertiesOf(x, [ 'htm', 'htu', 'dpop' ]);
  isRequestMethod(x.htm);
  asserts.isString(x.htu);
  if (isObjectPropertyOf(x, 'jtis')) { asserts.isArrayOf(x.jtis, isString) }
  isDPoP(x.dpop);
}

export async function checkDPoPClaims(options: CheckDPoPClaimsOptions): Promise<boolean> {
  isCheckDPoPClaimsOptions(options);

  const { htm, htu, jtis, dpop } = options;

  return (
    (htm === dpop.payload.htm)
    && (htu === dpop.payload.htu)
    && (!jtis || !jtis.includes(dpop.payload.jti))
  );
}
