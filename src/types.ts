export interface SecretConfigProps {
  toJSON: () => string;
  toString: () => string;
  getSecretValue: () => string;
}

export const isSecretConfig = (val: unknown): val is SecretConfigProps => {
  const coercedVal = val as SecretConfigProps;

  return (
    coercedVal.getSecretValue !== undefined &&
    coercedVal.toJSON !== undefined &&
    coercedVal.toString !== undefined
  );
};
