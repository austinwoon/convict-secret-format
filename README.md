# convict-secret-format

[![Version](https://img.shields.io/npm/v/@austinwoon/convict-secret-format)](https://www.npmjs.com/package/@austinwoon/convict-secret-format)

## Description

Adds a new validation format for secrets to prevent secrets from being logged in stdout.

### Motivations

[node-convict](https://github.com/mozilla/node-convict) currently exposes a property to flag secrets as sensitive by stating `sensitive: true` during initialization. However, this only redacts sensitive information if you were to coerce the `convict` object to a string. Logging the the object from the return value of `convict().getProperties()` will output sensitive information.

This package serves to expose a new format (`secret-format`) and a function constructor `SecretConfig` to mask secrets from stdout when using calling `getProperties()`.

**Example of secret logging leaks**

The code snippet below exemplifies

```typescript
const config = convict({
  secret: {
    env: "SECRET",
    default: "secret-key-value",
    sensitive: true,
  },
});

// Both of these statements will include `secret-key-value` in logs
console.log(config.getProperties());

// Only when you coerce config to string, will will the value be changed to SENSITIVE
console.log(config.toString());
```

## Usage

Simply extend convict with the new `SecretConfigFormat`. Then, state `secret-format` as the format to use in your configs.

Note: The values in your `.env` file will automatically get coerced to the `SecretConfig` type.

```typescript
# extend convict format with SecretConfig
convict.addFormat(SecretConfigFormat);

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
console.log(config.getProperties.secret.getValue())
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
