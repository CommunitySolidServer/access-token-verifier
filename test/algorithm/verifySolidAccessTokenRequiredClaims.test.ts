import { verifySolidAccessTokenRequiredClaims } from "../../src/algorithm/verifySolidAccessTokenRequiredClaims";
import { RequiredClaimVerificationError } from "../../src/error";

describe("The verifySolidAccessTokenIssuer function", () => {
  it("Doesn't throw when the JSON object contains all required claims", () => {
    expect(() => {
      verifySolidAccessTokenRequiredClaims({
        webid: "",
        iss: "",
        aud: "",
        iat: "",
        exp: "",
        cnf: { jkt: "" },
        client_id: "",
      });
    }).not.toThrow();
  });

  it("Throws when not passed an object", () => {
    expect(() => {
      verifySolidAccessTokenRequiredClaims("");
    }).toThrow(RequiredClaimVerificationError);
  });

  it("Throws when passed the null value", () => {
    expect(() => {
      verifySolidAccessTokenRequiredClaims(null);
    }).toThrow(RequiredClaimVerificationError);
  });

  it("Throws when the webid claim is missing", () => {
    expect(() => {
      verifySolidAccessTokenRequiredClaims({
        iss: "",
        aud: "",
        iat: "",
        exp: "",
        cnf: { jkt: "" },
        client_id: "",
      });
    }).toThrow(RequiredClaimVerificationError);
  });

  it("Throws when the iss claim is missing", () => {
    expect(() => {
      verifySolidAccessTokenRequiredClaims({
        webid: "",
        aud: "",
        iat: "",
        exp: "",
        cnf: { jkt: "" },
        client_id: "",
      });
    }).toThrow(RequiredClaimVerificationError);
  });

  it("Throws when the aud claim is missing", () => {
    expect(() => {
      verifySolidAccessTokenRequiredClaims({
        webid: "",
        iss: "",
        iat: "",
        exp: "",
        cnf: { jkt: "" },
        client_id: "",
      });
    }).toThrow(RequiredClaimVerificationError);
  });

  it("Throws when the iat claim is missing", () => {
    expect(() => {
      verifySolidAccessTokenRequiredClaims({
        webid: "",
        iss: "",
        aud: "",
        exp: "",
        cnf: { jkt: "" },
        client_id: "",
      });
    }).toThrow(RequiredClaimVerificationError);
  });

  it("Throws when the exp claim is missing", () => {
    expect(() => {
      verifySolidAccessTokenRequiredClaims({
        webid: "",
        iss: "",
        aud: "",
        iat: "",
        cnf: { jkt: "" },
        client_id: "",
      });
    }).toThrow(RequiredClaimVerificationError);
  });
});
