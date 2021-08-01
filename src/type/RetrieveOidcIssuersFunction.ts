export interface RetrieveOidcIssuersFunction {
  (webid: string): Promise<Array<string>>;
}
