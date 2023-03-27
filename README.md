# convict-secret-format

[![Version](https://img.shields.io/npm/v/@austinwoon/convict-secret-format)](https://www.npmjs.com/package/@austinwoon/convict-secret-format)

## Description

Adds a new validation format for secrets to prevent secrets from being logged in stdout.

### Motivations

[node-convict](https://github.com/mozilla/node-convict) currently exposes a property to flag secrets as sensitive by stating `sensitive: true` during initialization. However, this only redacts sensitive information if you were to coerce the `convict` object to a string. Logging the the object from the return value of `convict().getProperties()` will output sensitive information.

This package serves to expose a new format to always mask secret values.

**Example of secret logging leaks**

The code snippet below exemplifies how a secret can get logged by accident even when its been marked as `sensitive`.

```typescript
const config = convict({
  secret: {
    env: "SECRET",
    default: "secret-key-value",
    sensitive: true,
  },
});

// This line will include `secret-key-value` in logs
console.log(config.getProperties());

// Only when you coerce config to string, will the value be changed to SENSITIVE
console.log(config.toString());
```

## Usage

Simply extend convict with the new format by calling `getSecretConfigFormat()`. Then, state the default format name, `secret-format` as the format to use in your configs.

Note: The values in your `.env` file will automatically get coerced to the `SecretConfig` type.

```typescript
# extend convict format with SecretConfig
convict.addFormat(getSecretConfigFormat());

# use the `secret-format` format. With the config below, the value of `SECRET` in your `.env` file will be coerced to `SecretConfig`
const config = convict({
  secret: {
    env: 'SECRET',
    default: SecretConfig(""),
    format: "secret-format",
  }
})

// All secrets will output REDACTED
console.log(config.getProperties())

// If you wish to get the value of the secret, call `getValue()`
console.log(config.getProperties().secret.getValue())
```

### Validation

This will not work as the default value does not conform to the `SecretConfigProps` type

```typescript
const config = convict({
  secret: {
    env: "SECRET",
    default: { value: "test" },
    format: "secret-format",
  },
});

// throws a TypeError since value does not conform to shape of `SecretConfigProps`
config.validate();
```

### Formatting options available

`getSecretConfigFormat` exposes options to customize the following:

1. `censorFn`: A callback function to change the `toString` or `toJSON` representation of the secret value.
2. `formatName`: The name of the format to pass to `format` property. Use this in event of format naming collisions with the default `secret-format` name.

**Example**

```typescript
convict.addFormat(
  getSecretConfigFormat({
    censorFn: () => "censored",
    formatName: "secret-format-2",
  })
);

// now you have to use secret-format-2 as the name in format instead
const config = convict({
  secret: {
    env: "SECRET",
    default: SecretConfig(""),
    format: "secret-format-2",
  },
})
  .validate()
  .getProperties();

// this will now output `censored`, instead of `REDACTED`
console.log(config.secret);
```
