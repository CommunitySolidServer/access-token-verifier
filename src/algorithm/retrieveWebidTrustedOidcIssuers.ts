import type { Quad } from "@rdfjs/types";
import { DataFactory, Parser, Store } from "n3";
import fetch from "node-fetch";
import { WebidDereferencingError } from "../error/WebidDereferencingError";
import { WebidIriError } from "../error/WebidIriError";
import { WebidParsingError } from "../error/WebidParsingError";
import type { RetrieveOidcIssuersFunction } from "../type";

async function dereferenceWebid(
  webid: string,
): Promise<{ rdf: string; baseIRI: string }> {
  try {
    const response = await fetch(webid, {
      headers: {
        accept: "text/turtle",
      },
    });
    return { rdf: await response.text(), baseIRI: response.url };
  } catch (e: unknown) {
    throw new WebidDereferencingError(webid);
  }
}

function parseRdf(rdf: string, baseIRI: string): Store<Quad> {
  try {
    const store = new Store();
    store.addQuads(new Parser({ baseIRI }).parse(rdf));
    return store;
  } catch (e: unknown) {
    throw new WebidParsingError();
  }
}

export async function retrieveWebidTrustedOidcIssuers(
  webid: string,
  getIssuers?: RetrieveOidcIssuersFunction,
): ReturnType<RetrieveOidcIssuersFunction> {
  try {
    // eslint-disable-next-line no-new
    new URL(webid);
  } catch (e: unknown) {
    throw new WebidIriError(webid);
  }
  if (typeof getIssuers !== "undefined" && getIssuers !== null) {
    return getIssuers(webid);
  }

  const { rdf, baseIRI } = await dereferenceWebid(webid);
  const store = parseRdf(rdf, baseIRI);

  return store
    .getObjects(
      DataFactory.namedNode(webid),
      DataFactory.namedNode("http://www.w3.org/ns/solid/terms#oidcIssuer"),
      DataFactory.defaultGraph(),
    )
    .map((x) => x.value);
}
