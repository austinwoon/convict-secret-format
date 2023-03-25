import { SecretConfigProps } from "./types";

export function SecretConfig(value: string): SecretConfigProps {
  return {
    toJSON: () => {
      return "REDACTED";
    },

    toString: () => {
      return "REDACTED";
    },

    getValue: () => {
      return value;
    },
  };
}
