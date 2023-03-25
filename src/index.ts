import type { Format } from "convict";
import { SecretConfigProps, isSecretConfig } from "./types";

export function SecretConfig(
  value: string,
  censorFn: (val: string) => string = (_val) => "REDACTED"
): SecretConfigProps {
  return {
    toJSON: () => {
      return censorFn(value);
    },

    toString: () => {
      return censorFn(value);
    },

    getValue: () => {
      return value;
    },
  };
}

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
