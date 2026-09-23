# CampusRate

CampusRate is a REST API that lets the campus community browse rated places and
services on campus, and submit reviews with a rating. It was built as a design
exercise in professional REST API conventions: consistent resource naming,
versioning, HTTP semantics, validation, and uniform error handling.

## Features

- Full CRUD on **places** (campus locations and services)
- Full CRUD on **reviews**, each tied to an existing place
- Filtering places by category, with pagination (`page`, `limit`)
- Automatic rating aggregation: a place's `averageRating` and `reviewCount`
  are always recalculated from its current reviews
- Strict input validation: unknown fields, invalid enums, and out-of-range
  values are rejected with `400`
- Uniform error responses using the Problem Details format
  (`application/problem+json`)
- Local JSON file persistence, isolated from business logic, that survives
  a server restart
- Complete OpenAPI/Swagger documentation, browsable without reading the code

## Tech stack

- [NestJS](https://nestjs.com/) (TypeScript)
- `class-validator` / `class-transformer` for DTO validation
- `@nestjs/swagger` for OpenAPI documentation
- JSON file storage via `node:fs/promises` (no database)

## Installation

```bash
npm ci
cp .env.example .env
```

## Configuration

Configuration is read from environment variables. Copy `.env.example` to
`.env` and adjust as needed. The app refuses to start if a required variable
is missing or invalid.

| Variable          | Required | Description                                  |
|-------------------|----------|-----------------------------------------------|
| `PORT`            | Yes      | Port the HTTP server listens on               |
| `DATA_FILE_PATH`  | Yes      | Path to the JSON file used for persistence    |

## Running the app

```bash
# development, with auto-reload
npm run start:dev

# production build, then run
npm run build
npm run start:prod
```

The API is served under the `/api/v1` prefix, e.g.
`http://localhost:3000/api/v1/places`.

## Lint and build

Run these before committing or submitting:

```bash
npm run lint
npm run build
```

## API documentation (Swagger UI)

Once the server is running, the full interactive documentation is available at:

```
http://localhost:3000/docs
```

It describes every resource, operation, parameter, request body, response
shape, error format, and example, so the API can be explored and tested
without reading the source code.

A Postman collection with 8–10 representative scenarios is also included at
`docs/postman/campusrate.postman_collection.json`.

## API contract overview

Base path: `/api/v1` · Format: JSON · Dates: ISO 8601 UTC

The full endpoint table and design rationale live in
[`docs/api-contract.md`](docs/api-contract.md). Summary of the main design
decisions:

| Topic | Choice | Why |
|---|---|---|
| Resource names | `places`, `reviews` | Plural English nouns, no verbs |
| Versioning | `/api/v1` prefix | Visible in the path and uniform across all routes |
| Nesting | Nested for creating/listing reviews under a place; flat for get/patch/delete | Expresses the real parent-child relationship without redundant depth once a review's own id is known |
| Update method | `PATCH` only | The API supports partial updates, not full replacement |
| POST success | `201` + `Location` header | A new resource was created; the client is told where to find it |
| PATCH success | `200` with the updated resource | The client sees the recalculated/updated values |
| DELETE success | `204`, empty body | Success with nothing to return |
| 404 vs 400 | `404` for a missing resource, `400` for invalid input | Separates "the resource doesn't exist" from "the request was malformed" |
| 409 | Deleting a place that still has reviews | The request is valid but conflicts with the resource's current state |
| Empty collection | `200` with `data: []` | An empty result set is not an error |
| Errors | `application/problem+json`, RFC 7807 shape (`type`, `title`, `status`, `detail`, `instance`) | One consistent error format across the whole API |

### Main endpoints

| Method | URI | Purpose |
|---|---|---|
| POST | `/places` | Create a place |
| GET | `/places` | List places (filter by `category`, paginate with `page`/`limit`) |
| GET | `/places/{id}` | Get one place |
| PATCH | `/places/{id}` | Partially update a place |
| DELETE | `/places/{id}` | Delete a place (`409` if it has reviews) |
| POST | `/places/{placeId}/reviews` | Create a review for a place |
| GET | `/places/{placeId}/reviews` | List reviews for a place |
| GET | `/reviews/{id}` | Get one review |
| PATCH | `/reviews/{id}` | Partially update a review |
| DELETE | `/reviews/{id}` | Delete a review |

## Known limitations

- No authentication or authorization; every endpoint is public.
- No database — data is persisted to a single local JSON file, which is not
  suited for concurrent writes at scale.
- No automated test suite; correctness is verified manually via Swagger UI
  and the provided Postman collection.
- Rating aggregates are recalculated on every read rather than cached, which
  is simple and always correct but not optimized for very large datasets.
