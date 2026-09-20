# CampusRate API Contract

Base path: `/api/v1` · Format: JSON (`application/json`) 

## 1. Conventions

| Topic | Decision | Justification |
|---|---|---|
| Resource names | `places`, `reviews` | English, plural, lowercase, nouns only |
| Versioning | `/api/v1` prefix on every route | Major version visible in the path, uniform |
| Path params | `id`, `placeId` | Imposed by the spec |
| Nesting | Nested to create/list reviews, flat for get/patch/delete | Nesting expresses the real relationship; review ids are globally unique, so flat URIs avoid redundant depth |
| Update method | `PATCH` only | The spec requires partial modification |
| Errors | `application/problem+json` | Required Problem Details format |

## 2. Endpoints

### Places

| Method | URI | Input | Success | Response | Errors |
|---|---|---|---|---|---|
| POST | `/places` | Body: `name`, `description`, `category`, `address`, `services?`, `status?` | 201 + `Location: /api/v1/places/{id}` | Place | 400 |
| GET | `/places` | Query: `category?`, `page?`, `limit?` | 200 | `{ data, pagination }` | 400 |
| GET | `/places/{id}` | Path: `id` | 200 | Place | 404 |
| PATCH | `/places/{id}` | Path: `id`. Body: any subset of POST fields | 200 | Updated Place | 400, 404 |
| DELETE | `/places/{id}` | Path: `id` | 204, empty body | none | 404, 409 (has reviews) |

### Reviews

| Method | URI | Input | Success | Response | Errors |
|---|---|---|---|---|---|
| POST | `/places/{placeId}/reviews` | Path: `placeId`. Body: `authorName`, `rating`, `comment` | 201 + `Location: /api/v1/reviews/{id}` | Review | 400, 404 (place) |
| GET | `/places/{placeId}/reviews` | Path: `placeId` | 200 | `{ data }` (empty: `[]`) | 404 (place) |
| GET | `/reviews/{id}` | Path: `id` | 200 | Review | 404 |
| PATCH | `/reviews/{id}` | Path: `id`. Body: any subset of `authorName`, `rating`, `comment` | 200 | Updated Review | 400, 404 |
| DELETE | `/reviews/{id}` | Path: `id` | 204, empty body | none | 404 |

Any endpoint can also return **500** (generic message, no stack trace, no local path, no raw file content).

## 3. Rules

- Server-only fields (`id`, `placeId`, `createdAt`, `updatedAt`, `averageRating`, `reviewCount`) are rejected with 400 if sent.
- Unknown properties are rejected with 400.
- Defaults: `services = []`, `status = ACTIVE`, `page = 1`, `limit = 10`.
- `limit` maximum is 50. Out-of-range `page` or `limit` returns 400.
- `category` filter and pagination can be combined.
- Creating, updating or deleting a review recalculates the place's `averageRating` and `reviewCount`.
- A place with no reviews has `averageRating: null` and `reviewCount: 0`.

## 4. Pagination shape

```json
{
  "data": [],
  "pagination": { "page": 1, "limit": 10, "totalItems": 0, "totalPages": 0 }
}
```

## 5. Status codes and errors

| Situation | Code | Problem `type` |
|---|---|---|
| Invalid input (body, query, format, unknown property, malformed JSON) | 400 | `/problems/validation-error` |
| Place or review not found | 404 | `/problems/not-found` |
| Deleting a place that has reviews | 409 | `/problems/conflict` |
| Unexpected error (including corrupt data file) | 500 | `/problems/internal-error` |

Every error body has `type`, `title`, `status`, `detail`, `instance`.

## 6. README justification table

| Topic | Choice | Why |
|---|---|---|
| Resource names | `places`, `reviews` | Plural English nouns, no verbs |
| Versioning | `/api/v1` | Visible and uniform |
| Nesting | Nested for create/list, flat for get/patch/delete | Expresses the relationship without redundant depth |
| POST | 201 + `Location` | New resource created, client learns its URI |
| PATCH | 200 with updated body | Client sees recalculated values |
| DELETE | 204, empty body | Success with no content |
| 404 vs 400 | 404 missing resource, 400 invalid input | Separates absent resource from bad request |
| 409 | Place with reviews cannot be deleted | Valid request, conflicts with current state |
| Empty collection | 200 with `[]` | Empty is not an error |