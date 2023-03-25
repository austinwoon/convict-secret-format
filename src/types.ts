export interface SecretConfigProps {
  toJSON: () => string;
  toString: () => string;
  getValue: () => string;
}

export const isSecretConfig = (val: unknown): val is SecretConfigProps => {
  const coercedVal = val as SecretConfigProps;

  return (
    coercedVal.getValue !== undefined &&
    coercedVal.toJSON !== undefined &&
    coercedVal.toString !== undefined
  );
};
