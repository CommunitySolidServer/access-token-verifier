import { DataFactory, Store } from "n3";
import rdfDereferencer from "rdf-dereference";
import type { Quad } from "rdf-js";
import { IssuerVerificationError } from "../error";

/**
 * Verifies the Solid access token issuer claim against its WebID claim
 *
 * > The RS MUST check the WebID document for the existence of a statement matching ?webid <http://www.w3.org/ns/solid/terms#oidcIssuer> ?iss., where ?webid and ?iss are the values of the webid and iss claims respectively.
 * > -- https://solid.github.io/solid-oidc/#resource-access-validation
 *
 * @param webid The access token webid parameter
 * @param iss The access token iss parameter
 */
export async function verifySolidAccessTokenIssuer(
  webid: string,
  iss: string
): Promise<void> {
  const { quads: quadStream } = await rdfDereferencer.dereference(webid);
  const store = new Store();
  const issuer: string[] = [];

  const issuers: string[] = await new Promise((resolve) => {
    store.import(quadStream).on("end", () => {
      store
        .match(
          DataFactory.namedNode(webid.toString()),
          DataFactory.namedNode("http://www.w3.org/ns/solid/terms#oidcIssuer")
        )
        .on("data", (quad: Quad) => {
          issuer.push(quad.object.value);
        })
        .on("end", () => resolve(issuer));
    });
  });

  if (!issuers.includes(iss)) {
    throw new IssuerVerificationError(issuers.toString(), iss);
  }
}
