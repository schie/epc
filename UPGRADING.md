# Upgrading Guide

This document highlights breaking changes between published versions of `@schie/epc`.

## Upgrading to v1.0.0

- Renamed `encodeSgtin96FromGTIN12`/`FromGTIN13`/`FromGTIN8` (added in `v0.2.0`) to
  `encodeSgtin96FromGtin12`/`FromGtin13`/`FromGtin8`, matching the casing used everywhere
  else in the API (`Sgtin96`, `Gid96`, `Gtin12ToSgtin96Input`, `sgtin96ToGtin14`). Update
  any `0.2.0` usage of the all-caps names; the `encodeSgtin96FromUpcA`/`FromEan13`/`FromEan8`
  aliases are unaffected.
- Starting at `v1.0.0`, `@schie/epc` follows [Semantic Versioning](https://semver.org/):
  breaking changes only ship in a major version bump, and each one is documented here.

## When this will be updated

Future breaking changes will include:

- version-to-version upgrade steps
- renamed or removed exports
- behavioral changes in EPC encoding/decoding rules
