import { Format } from "convict";
import { SecretConfig } from "./SecretConfig";
import { isSecretConfig } from "./types";

export const SecretConfigFormat: Format = {
  name: "secret-format",
  coerce: (value: unknown) => {
    if (typeof value === "string") {
      return SecretConfig(value);
    }

    return value;
  },
  validate: (value: unknown) => {
    if (!isSecretConfig(value)) {
      throw new TypeError(`secret configurations must be a SecretConfig type!`);
    }
  },
};
