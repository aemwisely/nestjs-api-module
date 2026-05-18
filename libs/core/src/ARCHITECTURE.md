# libs/core Hexagonal Structure

`libs/core` keeps the application core in a Hexagonal Architecture shape:

- `domain`: business models and domain rules. This layer should not depend on Nest, TypeORM, MinIO, JWT, or HTTP DTOs.
- `application`: use cases and abstract ports. Use cases depend on abstractions, not concrete infrastructure.
- `application/**/abstracts`: abstract classes/contracts that define what the application needs from the outside world.
- `application/**/ports`: compatibility barrels that re-export `abstracts` for older imports.
- `infrastructure/**/implements`: concrete adapters that implement application abstractions with TypeORM, JWT, MinIO, bcrypt, XLSX, or other external tools.
- `presentation`: Nest modules, guards, DTOs, and framework wiring. Presentation binds abstractions to implementations.

Dependency direction:

```text
presentation -> application -> domain
presentation -> infrastructure/implements -> application/abstracts
```

When adding a feature:

1. Put rules and models in `domain/<feature>`.
2. Put use cases in `application/<feature>`.
3. Put contracts in `application/<feature>/abstracts`.
4. Put adapters in `infrastructure/<feature>/implements`.
5. Bind abstract classes to implementations in `presentation/<feature>/<feature>.module.ts`.

Prefer importing contracts from `@libs/core/application/<feature>/abstracts` in new code.
Existing `ports` imports still work as compatibility barrels.
