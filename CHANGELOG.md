# Changelog

All notable changes to SO4 Market are documented in this file.

The format is based on [Keep a Changelog](https://keepachangelog.com/en/1.1.0/),
and this project adheres to [Semantic Versioning](https://semver.org/spec/v2.0.0.html).

## [Unreleased]

### Added

### Changed

### Deprecated

### Removed

### Fixed

### Security

## [0.1.0] - 2026-08-25

The first release captures the state of SO4 Market at the completion of the design system pass, the core trading infrastructure, and the developer documentation foundation.

### Added

- **Core Trading:** Long and short perpetual positions on Stellar/Soroban with market, limit, and trigger order types.
- **Chart:** Real-time price feed integration (Binance primary, GMX fallback) with candlestick charting (lightweight-charts v5), position entry and liquidation lines.
- **Positions Panel:** Real-time views of active positions, open orders, historical trades, and claimable rewards across tabs.
- **Pools:** Pool discovery, portfolio overview, and reward distribution interfaces for liquidity provision.
- **Earn & Referrals:** Portfolio management, additional earning opportunities, trader discount codes, and affiliate commission distributions.
- **Landing Page:** Market ticker snapshot, order book preview, protocol statistics, and trade entry points.
- **Responsive Design:** Full-featured UI across desktop and tablet viewports.
- **Theme Support:** Dark and light mode with zero flash on load, memory of user preference.
- **Design System:** Complete design tokens, component library, and documentation (DS-001 through DS-085).
- **Contract Clients:** Generated TypeScript clients for Soroban contract interaction (ExchangeRouter, DataStore, SyntheticsReader, OrderVault).
- **Developer Documentation:** Setup guides, architecture reference, and integration contracts reference.

[Unreleased]: https://github.com/SO4-Markets/interface/compare/v0.1.0...HEAD
[0.1.0]: https://github.com/SO4-Markets/interface/releases/tag/v0.1.0
