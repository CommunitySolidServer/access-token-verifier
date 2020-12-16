import { DataFactory, Store } from "n3";
import { SOLID } from "nmspc";
import rdfDereferencer from "rdf-dereference";
import type { Quad, Stream } from "rdf-js";
import type { GetIssuersFunction } from "../types";

export const issuers: GetIssuersFunction = async function (
  webid: URL
): Promise<Array<string>> {
  const { quads: quadStream } = await rdfDereferencer.dereference(
    webid.toString()
  );
  const store = new Store();
  const issuer: string[] = [];

  return new Promise((resolve) => {
    store.import(quadStream as Stream).on("end", () => {
      store
        .match(
          DataFactory.namedNode(webid.toString()),
          DataFactory.namedNode(SOLID.oidcIssuer)
        )
        .on("data", (quad: Quad) => {
          issuer.push(quad.object.value);
        })
        .on("end", () => resolve(issuer));
    });
  });
};
