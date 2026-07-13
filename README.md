# Outfit Assistant

Suggest relevant outfits according to user preferences, weather, and events.

## Architecture

The project follows **Clean Architecture** with **Domain-Driven Design**:

- `src/domain/` — Business logic, entities, and value objects
- `src/application-layer/` — Use cases and application services
- `src/interface-adapters/` — Controllers, presenters, gateways
- `src/infra/` — Databases, external APIs, persistence

Development is driven by **TDD**: each domain entity is implemented test-first, starting from the requirements in `design/requirements.md`.

## Current state

Scaffolding is in place. Layered error hierarchies (domain, application, adapter), a base `ValueObject` class, and a tested `Text` value object are implemented. Entity (`Garment`, `Closet`, `Outfit`, `User`, `Event`) are going to be implemented — implementations will follow test-first.

Also included are auxiliary files that won't be needed right away: a known-error type guard (`isKnownError`), an environment-aware dependency injection helper (`injectFor_ProductionDevelopment_Test`), and an `ApplicationError` hierarchy.

## Tech stack

- **Runtime:** Node.js with TypeScript
- **Testing:** Vitest
- **Formatting:** Prettier with automatic import sorting

## Commands

```sh
npm test            # Run all tests
npm run test:watch  # Run tests in watch mode (should always be running while writing code)
```
