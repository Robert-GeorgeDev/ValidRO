# Changelog

All notable changes to this project are documented here. The format follows [Keep a Changelog](https://keepachangelog.com/) and the project uses [Semantic Versioning](https://semver.org/).

## [Unreleased]

## [0.1.0] - 2026-10-27

### Added

- `validateCnp` / `isValidCnp` with decoding (sex, birth date, county), including county code 70
- `validateCui` / `isValidCui`, with or without the `RO` prefix
- `validateIbanRo` / `isValidIbanRo`, with formatting and bank code
- Control-digit helpers: `cnpControlDigit`, `cuiControlDigit`, `ibanChecksumOk`
- Demo page that splits a code into its parts and explains each one
