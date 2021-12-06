import { DataFactory } from "n3";
import rdfDereferencer from "rdf-dereference";
import type { Quad, Stream } from "rdf-js";
import { WebidDereferencingError } from "../error/WebidDereferencingError";
import type { RetrieveOidcIssuersFunction } from "../type";

const defaultGraph = DataFactory.defaultGraph();
const oidcIssuer = DataFactory.namedNode(
  "http://www.w3.org/ns/solid/terms#oidcIssuer"
);

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

  const issuers: string[] = [];
  const webidNode = DataFactory.namedNode(webid);
  const quadStream = await dereferenceWebid(webid);

  return new Promise((resolve, reject) => {
    quadStream
      .on("data", ({ subject, predicate, object, graph }: Quad) => {
        if (
          defaultGraph.equals(graph) &&
          object.termType === "NamedNode" &&
          oidcIssuer.equals(predicate) &&
          webidNode.equals(subject)
        ) {
          issuers.push(object.value);
        }
      })
      .on("end", () => resolve(issuers))
      .on("error", reject);
  });
}
