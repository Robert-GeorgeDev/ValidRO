# Changelog

All notable changes to this project are documented here. The format follows [Keep a Changelog](https://keepachangelog.com/) and the project uses [Semantic Versioning](https://semver.org/).

## [Unreleased]

### Added

- `validatePlate` / `isValidPlate` for Romanian registration plates, including county lookup and input normalization

## [0.1.0] - 2026-10-27

### Added

- `validateCnp` / `isValidCnp` with decoding (sex, birth date, county), including county code 70
- `validateCui` / `isValidCui`, with or without the `RO` prefix
- `validateIbanRo` / `isValidIbanRo`, with formatting and bank code
- Control-digit helpers: `cnpControlDigit`, `cuiControlDigit`, `ibanChecksumOk`
- `validatePostalCode` / `isValidPostalCode` for six-digit Romanian postal codes (thanks @jay23606, #12)
- Demo page that splits a code into its parts, explains each one and shows how the check digit is computed

[Unreleased]: https://github.com/Robert-GeorgeDev/ValidRO/compare/v0.1.0...HEAD
[0.1.0]: https://github.com/Robert-GeorgeDev/ValidRO/releases/tag/v0.1.0
