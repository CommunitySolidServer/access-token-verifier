import { DataFactory, Store } from "n3";
import rdfDereferencer from "rdf-dereference";
import type { Quad } from "rdf-js";
import type { RetrieveOidcIssuersFunction } from "../type";

export async function retrieveOidcIssuers(
  webid: string,
  getIssuers?: RetrieveOidcIssuersFunction
): Promise<Array<string>> {
  if (typeof getIssuers !== "undefined" && typeof getIssuers !== null) {
    return getIssuers(webid);
  }

  const { quads: quadStream } = await rdfDereferencer.dereference(webid);
  const store = new Store();
  const issuer: string[] = [];

  return new Promise((resolve) => {
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
}
