import type { RequestMethod } from './type'
import { verify as verifyAuthorization } from './access-token'
import { verify as verifyDPoP } from './dpop'
import { asserts } from 'ts-guards'

/**
 * Verifies the validity of a DPoP bound access token
 * Validation based on the webid in the access token payload
 * @param authorizationHeader 
 * @param dpopHeader 
 * @param method 
 * @param url 
 * @param jtis 
 */
export async function verify(authorizationHeader: string, dpopHeader: string, method: RequestMethod, url: string, jtis: Array<string> = []): Promise<string> {
    const authorization = await verifyAuthorization(authorizationHeader)
    const dpop = await verifyDPoP(dpopHeader)

    // Check DPoP claims
    asserts.isLiteral(dpop.payload.htm, method)
    asserts.isLiteral(dpop.payload.htu, url)
    asserts.isLiteral(jtis.filter(jti => jti === dpop.payload.jti).length === 0, true)

    // Check DPoP bound
    asserts.isLiteral(dpop.header.jwk.kid, authorization.payload.cnf.jkt)

    return authorization.payload.webid
}
