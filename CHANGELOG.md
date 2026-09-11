# Changelog

## [1.0.0](https://github.com/schie/epc/compare/v0.2.0...v1.0.0) (2026-09-11)


### ⚠ BREAKING CHANGES

* **sgtin:** `encodeSgtin96FromGTIN12`, `encodeSgtin96FromGTIN13`, and `encodeSgtin96FromGTIN8` are renamed to `encodeSgtin96FromGtin12`, `encodeSgtin96FromGtin13`, and `encodeSgtin96FromGtin8`.

### Bug Fixes

* **deps:** pin esbuild to &gt;=0.28.1 to patch path traversal vuln ([17bacaa](https://github.com/schie/epc/commit/17bacaae526fe2b774d35ebdb5062fb2b44de175))
* **sgtin:** rename encodeSgtin96FromGTIN12/13/8 to encodeSgtin96FromGtin12/13/8 ([7593503](https://github.com/schie/epc/commit/75935038751f4f82aaba721e4a78111fbeede166))

## [0.2.0](https://github.com/schie/epc/compare/v0.1.2...v0.2.0) (2026-08-11)


### Features

* **sgtin:** add GTIN conversion helpers ([9c9a7b7](https://github.com/schie/epc/commit/9c9a7b79513e7e919cac5babffe3065c83edd38a))

## [0.1.2](https://github.com/schie/epc/compare/v0.1.1...v0.1.2) (2026-08-07)


### Bug Fixes

* **package:** add runtime entry point fallbacks ([3398571](https://github.com/schie/epc/commit/3398571ece96441573e13a3b2c17ea78c866e3a2)), closes [#39](https://github.com/schie/epc/issues/39)

## [0.1.1](https://github.com/schie/epc/compare/v0.1.0...v0.1.1) (2026-07-20)


### Bug Fixes

* **_utils:** guard assertFitsDigits input and singularize its message ([0a65da2](https://github.com/schie/epc/commit/0a65da215b8d5e4ce810a016a6ee328d92e29eea))
* **_utils:** reject negative values in assertFitsDigits ([a2a5c0b](https://github.com/schie/epc/commit/a2a5c0bfcbcdeba0240d9e35271295fc7a224208))
* **sgtin-96:** reject decoded fields that overflow their partition digit width ([6f23d42](https://github.com/schie/epc/commit/6f23d42274e75c78cb7b547f4f3285852e62340e))

## 0.1.0 (2026-01-11)


### Features

* initial commit ([825dc68](https://github.com/schie/epc/commit/825dc687b4911f986381fc9ed336d4094af846c8))


### Miscellaneous Chores

* release 0.1.0 ([4ebb0d5](https://github.com/schie/epc/commit/4ebb0d5db6cf0f80534459316d45adfe2c73e0ce))
