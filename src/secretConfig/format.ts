import { Format } from "convict";
import { SecretConfig } from "./SecretConfig";
import { SecretFormatOptions, isSecretConfig } from "./types";

export const getSecretConfigFormat = (
  options?: SecretFormatOptions
): Format => {
  const formatName = options?.formatName ?? "secret-format";

  return {
    name: formatName,
    coerce: (value: unknown) => {
      if (typeof value === "string") {
        return SecretConfig(value, options?.censorFn);
      }

      return value;
    },
    validate: (value: unknown) => {
      if (!isSecretConfig(value)) {
        throw new TypeError(
          `secret configurations must be a SecretConfig type!`
        );
      }
    },
  };
};
