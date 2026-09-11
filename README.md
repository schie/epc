# @schie/epc

[![npm version](https://badge.fury.io/js/@schie%2Fepc.svg)](https://www.npmjs.com/package/@schie/epc)
[![CI](https://github.com/schie/epc/actions/workflows/ci.yml/badge.svg)](https://github.com/schie/epc/actions/workflows/ci.yml)
[![CodeQL](https://github.com/schie/epc/actions/workflows/github-code-scanning/codeql/badge.svg)](https://github.com/schie/epc/actions/workflows/github-code-scanning/codeql)
[![Super-Linter](https://github.com/schie/epc/actions/workflows/super-linter.yml/badge.svg)](https://github.com/schie/epc/actions/workflows/super-linter.yml)
[![TypeScript](https://img.shields.io/badge/TypeScript-007ACC?style=flat&logo=typescript&logoColor=white)](https://www.typescriptlang.org/)
[![codecov](https://codecov.io/gh/schie/epc/branch/main/graph/badge.svg)](https://codecov.io/gh/schie/epc)
[![code style: prettier][prettier-badge]][prettier]
[![Commitizen friendly][commitizen-badge]][commitizen]

A modern, type-safe TypeScript library for generating and parsing **EPC (Electronic Product Code)** identifiers used in UHF RFID tags.

> **📌 Stability**  
> As of v1.0.0, `@schie/epc` follows [Semantic Versioning](https://semver.org/). Breaking changes ship only in a major version and are documented in [UPGRADING.md](UPGRADING.md).

## ✨ Features

- 🧩 **EPC Generation** - Create EPCs from GS1 components
- 🔍 **Parsing** - Decode EPC hex into structured data
- 🔄 **GTIN/EAN/UPC Conversion** - Encode existing barcodes into SGTIN-96, or recover a GTIN-14 from one
- 🛡️ **Type Safe** - Full TypeScript support with comprehensive types
- 📦 **Zero Dependencies** - Lightweight and fast
- 🧪 **100% Test Coverage** - Enforced on every change

## 🚀 Quick Start

### Installation

```bash
npm install @schie/epc
```

### Basic Usage

```typescript
import { encodeSgtin96, parseEpc } from '@schie/epc';

const epc = encodeSgtin96({
  companyPrefix: '0614141',
  itemReference: '812345',
  serial: 6789,
  filter: 3,
});

console.log(epc.hex);
console.log(epc.uri);

const parsed = parseEpc(epc.hex);
console.log(parsed.scheme); // sgtin-96
```

Convert an existing GTIN/EAN/UPC into an SGTIN-96 EPC, or reverse an SGTIN-96 EPC back into a GTIN-14:

```typescript
import { encodeSgtin96FromGtin12, sgtin96ToGtin14 } from '@schie/epc';

// GTIN-12 (and its UPC-A barcode form) both work via encodeSgtin96FromGtin12 / encodeSgtin96FromUpcA
const fromGtin = encodeSgtin96FromGtin12({
  gtin12: '036000291452',
  companyPrefixLength: 6,
  serial: 987,
});

sgtin96ToGtin14(fromGtin); // '00036000291452'
```

`encodeSgtin96FromGtin13`/`encodeSgtin96FromEan13` and `encodeSgtin96FromGtin8`/`encodeSgtin96FromEan8` work the same way for 13- and 8-digit codes.

## 📦 Package Information

- **ES Modules**: Full ESM support with tree shaking
- **CommonJS**: CJS builds included for compatibility
- **TypeScript**: Complete type definitions included
- **Node.js**: Requires Node.js 20+

## 🧾 Supported Schemes

- **SGTIN-96** - encode/parse, plus conversion from GTIN-8, GTIN-12/UPC-A, and GTIN-13/EAN-13 codes (and back to a GTIN-14)
- **GID-96** - encode/parse for non-GS1 identifiers
- **GS1 check digits** - compute, append, and validate

## 🤝 Contributing

Contributions are welcome! This project uses:

- **TypeScript** for type safety
- **Jest** for testing
- **ESLint + Prettier** for code quality
- **Commitizen** for conventional commits

```bash
# Install dependencies
pnpm install

# Run tests
pnpm test

# Build
pnpm run build

# Lint
pnpm run lint
```

## 📄 License

MIT License - see [LICENSE](LICENSE) file for details.

## 🔗 Links

- [NPM Package](https://www.npmjs.com/package/@schie/epc)
- [Translation Steps](translation-steps.md)
- [GitHub Repository](https://github.com/schie/epc)

---

Made with ❤️ by [@schie](https://github.com/schie)

[prettier-badge]: https://img.shields.io/badge/code_style-prettier-ff69b4.svg
[prettier]: https://github.com/prettier/prettier
[commitizen-badge]: https://img.shields.io/badge/commitizen-friendly-brightgreen.svg
[commitizen]: http://commitizen.github.io/cz-cli/
