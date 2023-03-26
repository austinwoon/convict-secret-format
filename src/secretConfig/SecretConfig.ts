import { CensorFunction, SecretConfigProps } from "./types";

export function SecretConfig(
  value: string,
  censorFn: CensorFunction = (_val) => "REDACTED"
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
