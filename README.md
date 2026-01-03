# blobman

manage S3 and S3-compatible buckets

## stack

- next.js 16, react 19, tailwind 4
- bun (runtime + S3 client)
- drizzle + postgres
- trpc, zod
- better-auth (google oauth)

## done

- [x] google auth
- [x] bucket table schema
- [x] bucket domain namespace (CRUD + S3 ops)
- [x] trpc router for buckets
- [x] credential encryption (AES-256-GCM)
- [x] list objects with pagination (10/page)
- [x] landing page
- [x] auth page
- [x] protected dashboard layout

## todo

- [ ] bucket management UI (add/list/delete)
- [ ] object browser UI
- [ ] file upload
- [ ] file download/presigned URLs
- [ ] delete objects

## run

```bash
bun install
bun run db:push
bun dev
```
