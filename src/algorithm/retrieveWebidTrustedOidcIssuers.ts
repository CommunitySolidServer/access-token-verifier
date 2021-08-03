import { DataFactory, Store } from "n3";
import rdfDereferencer from "rdf-dereference";
import type { Quad, Stream } from "rdf-js";
import { WebidDereferencingError } from "../error";
import type { RetrieveOidcIssuersFunction } from "../type";

async function dereferenceWebid(webid: string): Promise<Stream<Quad>> {
  try {
    return (await rdfDereferencer.dereference(webid)).quads;
  } catch (e: unknown) {
    throw new WebidDereferencingError(webid);
  }
}

export async function retrieveWebidTrustedOidcIssuers(
  webid: string,
  getIssuers?: RetrieveOidcIssuersFunction
): ReturnType<RetrieveOidcIssuersFunction> {
  if (typeof getIssuers !== "undefined" && getIssuers !== null) {
    return getIssuers(webid);
  }

  const quadStream = await dereferenceWebid(webid);
  const store = new Store();
  const issuer: string[] = [];

  return new Promise((resolve) => {
    store.import(quadStream).on("end", () => {
      store
        .match(
          DataFactory.namedNode(webid),
          DataFactory.namedNode("http://www.w3.org/ns/solid/terms#oidcIssuer")
        )
        .on("data", (quad: Quad) => {
          issuer.push(quad.object.value);
        })
        .on("end", () => resolve(issuer));
    });
  });
}
