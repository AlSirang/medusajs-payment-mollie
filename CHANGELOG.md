# medusajs-payment-mollie

## 0.2.0

### Minor Changes

- 0672f0f: fix: update payment status check for cancelPayment

## 0.1.4

### Patch Changes

- d950fca: update package.json

## 0.1.3

### Patch Changes

- ca09361: chore: add git repo url

## 0.1.2

### Patch Changes

- a2ab553: update readme

## 0.1.1

### Patch Changes

- f99f88a: update Readme.md

## 0.1.0

### Minor Changes

- 7b0e016: Refactor Mollie payment provider and webhook handling

  - Renamed `id` to `providerId` in `MollieOptions` for consistency with other payment providers.
  - Updated error messages to provide more clarity about missing options (`apiKey`, `providerId`).
  - Refactored `MollieProviderService` constructor to use `MollieOptions` type.
  - Updated `constructMollieWebhookUrl` to include both `providerId` and `identifier` for constructing the correct webhook URL.

## 0.0.4

### Patch Changes

- 00c0f28: update workflows

## 0.0.3

### Patch Changes

- 6bf9f5e: chore: update version workflow

## 0.0.2

### Patch Changes

- chore: update changeset config
