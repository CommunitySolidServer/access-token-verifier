# ts-dpop

Verify DPoP Bound Access Tokens; Get WebID.

## How to?

Use one simple async function returning the webid of the user initiating the request:

```javascript
import { verify } from 'ts-dpop'

async function test() {
    const authorizationHeader = "DPoP Bound Encoded JWT Access Token in 'authorization' header xxx"
    const dpopHeader = "DPoP proof encoded JWT in 'dpop' request header"
    const requestMethod = "The Request method which the DPoP htm claim is gonna be verified against, for example: GET"
    const requestURL = "The Request URL which the DPoP htu claim is gonna be verified against, for example: https://example.com/profile/card"
    const webid = await verify(authorizationHeader, dpopHeader, requestMethod, requestURL)
    console.log(webid)
}

test()
```

# See also

The [Solid OIDC Primer Request Flow](https://solid.github.io/authentication-panel/solid-oidc-primer/#request-flow).
