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

> **⚠️ Early Development Notice**  
> This library is under active early development. Until v1.0.0 is released, consider all releases potentially breaking. The API may change significantly between versions as we refine the design based on user feedback and real-world usage patterns.

## ✨ Features

- 🧩 **EPC Generation** - Create EPCs from GS1 components
- 🔍 **Parsing** - Decode EPC hex into structured data
- 🛡️ **Type Safe** - Full TypeScript support with comprehensive types
- 📦 **Zero Dependencies** - Lightweight and fast
- 🧪 **Ready for Testing** - Built for easy unit test coverage

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

## 📦 Package Information

- **ES Modules**: Full ESM support with tree shaking
- **CommonJS**: CJS builds included for compatibility
- **TypeScript**: Complete type definitions included
- **Node.js**: Requires Node.js 20+

## 🧾 Supported Schemes

- SGTIN-96
- GID-96

## 🤝 Contributing

Contributions are welcome! This project uses:

- **TypeScript** for type safety
- **Jest** for testing
- **ESLint + Prettier** for code quality
- **Commitizen** for conventional commits

```bash
# Install dependencies
npm install

# Run tests
npm test

# Build
npm run build

# Lint
npm run lint
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
