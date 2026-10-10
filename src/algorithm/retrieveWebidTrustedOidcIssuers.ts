import type { Quad } from "@rdfjs/types";
import { toRDF } from "jsonld";
import { DataFactory, Parser, Store } from "n3";
import fetch from "node-fetch";
import { IdDocumentDereferencingError } from "../error/IdDocumentDereferencingError";
import { IdDocumentParsingError } from "../error/IdDocumentParsingError";
import { IdentifierIriError } from "../error/IdentifierIriError";
import type { RetrieveOidcIssuersFunction } from "../type";

const OIDC_ISSUER = "http://www.w3.org/ns/solid/terms#oidcIssuer";
const OPENID_PROVIDER = "https://www.w3.org/ns/lws#OpenIdProvider";
const CID_CONTEXT = "https://www.w3.org/ns/cid/v1";

async function dereferenceIdDocument(
  identifier: string,
): Promise<{ document: string; baseIRI: string; contentType: string }> {
  try {
    const response = await fetch(identifier, {
      headers: {
        accept:
          "text/turtle, application/cid, application/ld+json, application/json",
      },
    });
    return {
      document: await response.text(),
      baseIRI: response.url,
      contentType: response.headers.get("content-type") ?? "",
    };
  } catch (e: unknown) {
    throw new IdDocumentDereferencingError(identifier);
  }
}

function parseRdf(rdf: string, baseIRI: string): Store<Quad> {
  try {
    const store = new Store();
    store.addQuads(new Parser({ baseIRI }).parse(rdf));
    return store;
  } catch (e: unknown) {
    throw new IdDocumentParsingError();
  }
}

function isRecord(value: unknown): value is Record<string, unknown> {
  return typeof value === "object" && value !== null && !Array.isArray(value);
}

function parseControlledIdentifierDocument(
  value: unknown,
  identifier: string,
): string[] {
  if (!isRecord(value) || value.id !== identifier) {
    throw new IdDocumentParsingError();
  }

  const services = Array.isArray(value.service)
    ? value.service
    : [value.service];

  return services.flatMap((service): string[] => {
    if (!isRecord(service)) {
      return [];
    }

    const types = Array.isArray(service.type) ? service.type : [service.type];
    if (!types.includes(OPENID_PROVIDER)) {
      return [];
    }

    const endpoints = Array.isArray(service.serviceEndpoint)
      ? service.serviceEndpoint
      : [service.serviceEndpoint];
    return endpoints.filter(
      (endpoint): endpoint is string => typeof endpoint === "string",
    );
  });
}

function isControlledIdentifierJsonLd(value: unknown): boolean {
  if (!isRecord(value)) {
    return false;
  }

  const context = value["@context"];
  const contexts = Array.isArray(context) ? context : [context];
  return (
    contexts.includes(CID_CONTEXT) || ("id" in value && "service" in value)
  );
}

function getRdfIssuers(store: Store<Quad>, identifier: string): string[] {
  return store
    .getObjects(
      DataFactory.namedNode(identifier),
      DataFactory.namedNode(OIDC_ISSUER),
      DataFactory.defaultGraph(),
    )
    .map((x) => x.value);
}

async function parseJsonLdWebId(
  value: Parameters<typeof toRDF>[0],
  baseIRI: string,
  identifier: string,
): Promise<string[]> {
  const nquads = await toRDF(value, {
    base: baseIRI,
    format: "application/n-quads",
  });
  return getRdfIssuers(parseRdf(nquads as string, baseIRI), identifier);
}

async function parseIdDocument(
  document: string,
  baseIRI: string,
  contentType: string,
  identifier: string,
): Promise<string[]> {
  const mediaType = contentType.split(";", 1)[0].trim().toLowerCase();
  if (mediaType === "application/cid" || mediaType === "application/json") {
    try {
      return parseControlledIdentifierDocument(
        JSON.parse(document),
        identifier,
      );
    } catch (e: unknown) {
      if (e instanceof IdDocumentParsingError) {
        throw e;
      }
      throw new IdDocumentParsingError();
    }
  }

  if (mediaType === "application/ld+json") {
    try {
      const value: unknown = JSON.parse(document);
      if (isControlledIdentifierJsonLd(value)) {
        return parseControlledIdentifierDocument(value, identifier);
      }
      return await parseJsonLdWebId(
        value as Parameters<typeof toRDF>[0],
        baseIRI,
        identifier,
      );
    } catch (e: unknown) {
      if (e instanceof IdDocumentParsingError) {
        throw e;
      }
      throw new IdDocumentParsingError();
    }
  }

  if (mediaType !== "text/turtle") {
    throw new IdDocumentParsingError();
  }

  return getRdfIssuers(parseRdf(document, baseIRI), identifier);
}

export async function retrieveIdDocumentTrustedOidcIssuers(
  identifier: string,
  getIssuers?: RetrieveOidcIssuersFunction,
): ReturnType<RetrieveOidcIssuersFunction> {
  try {
    // eslint-disable-next-line no-new
    new URL(identifier);
  } catch (e: unknown) {
    throw new IdentifierIriError(identifier);
  }
  if (typeof getIssuers !== "undefined" && getIssuers !== null) {
    return getIssuers(identifier);
  }

  const { document, baseIRI, contentType } =
    await dereferenceIdDocument(identifier);
  return parseIdDocument(document, baseIRI, contentType, identifier);
}

export { retrieveIdDocumentTrustedOidcIssuers as retrieveWebidTrustedOidcIssuers };
