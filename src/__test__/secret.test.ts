import convict from "convict";
import { SecretConfig, SecretConfigFormat } from "../index";

describe("secret configuration tests", () => {
  convict.addFormat(SecretConfigFormat);

  describe("valid schema tests", () => {
    const DUMMY_SECRET_VALUE = "DUMMY_SECRET_VALUE" as const;

    process.env.SECRET = DUMMY_SECRET_VALUE;

    const config = convict({
      secret: {
        env: "SECRET",
        default: SecretConfig(""),
        format: "secret-format",
      },
      nestedSecret: {
        nestedSecret2: {
          default: SecretConfig(DUMMY_SECRET_VALUE),
          format: "secret-format",
        },
      },
    })
      .validate()
      .getProperties();

    it("JSON serialized value or string representation should not contain secret value at all", () => {
      expect(JSON.stringify(config)).not.toContain(DUMMY_SECRET_VALUE);
      expect(JSON.stringify(config)).toContain("REDACTED");
      expect(config + "").not.toContain(DUMMY_SECRET_VALUE);
    });

    it("getting secret values should return secret value", () => {
      expect(config.secret.getValue()).toEqual(DUMMY_SECRET_VALUE);

      expect(config.nestedSecret.nestedSecret2.getValue()).toEqual(
        DUMMY_SECRET_VALUE
      );
    });
  });

  it("secret format validation works if value passed was a random object", () => {
    const config = convict({
      secret: {
        default: { val: "test" },
        format: "secret-format",
      },
    });

    expect(() => config.validate()).toThrowError(
      `secret configurations must be a SecretConfig type!`
    );
  });
});
