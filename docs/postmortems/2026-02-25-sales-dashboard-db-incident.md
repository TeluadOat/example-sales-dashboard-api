# Postmortem: Prisma + Supabase Migration & Connectivity Failures

**Project:** Sales Dashboard API  
**Author:** Adeola Olubodun  
**Date:** Feburary 2026  
**Environment:** Development  

---

## 1. Summary

During development of the Sales Dashboard backend, repeated database connectivity failures and schema mismatches occurred while using Prisma ORM with Supabase (PostgreSQL).

The issues resulted in:
- API endpoints failing intermittently
- Seed scripts breaking
- Prisma migrations failing
- Frontend components crashing due to failed fetch requests

This document outlines what happened, why it happened, and how it was resolved.

---

## 2. Impact

- `/kpis`, `/revenues`, `/visitor-insights`, `/top-products`, and related endpoints failed intermittently.
- Frontend `kpis.map()` crashed due to API returning errors.
- Seed scripts failed repeatedly.
- Development time significantly slowed.

No production users were affected (development environment only).

---

## 3. Timeline of Events

### Phase 1 — Database Connectivity Failure

Error:
PrismaClientInitializationError: Can't reach database server at aws-1-eu-west-2.pooler.supabase.com:5432
Copy code

Behavior:
- First request failed.
- Subsequent refresh sometimes worked.
- Inconsistent behavior.

Cause:
- Supabase pooled connection instability.
- Possible cold start or temporary network interruptions.

---

### Phase 2 — Adding Required Fields to Existing Table

Schema update:
- Added `periodStart`
- Added `periodEnd`

Migration error:
Added required column without default value. There are existing rows in this table.
Copy code

Cause:
- Required fields were added to a table that already contained data.
- No default values were provided.
- Prisma could not safely execute migration.

---

### Phase 3 — Reset Without Proper Migration

Command executed:
npx prisma migrate reset
Copy code

Result:
- Database reset.
- Only initial migration applied.
- New schema changes were not migrated.

Seed error:
The column periodStart does not exist in the current database.
Copy code

Root cause:
- Schema was updated.
- No new migration was created.
- Database structure did not match Prisma schema.

---

### Phase 4 — Prisma Client EPERM Error (Windows)

Error:
EPERM: operation not permitted, rename query_engine-windows.dll.node
Copy code

Cause:
- Windows file locking issue.
- Prisma query engine was locked by running process.

Resolution:
- Stopped dev server.
- Deleted `node_modules/.prisma`
- Restarted project.

---

### Phase 5 — TypeScript Seed Error

Error:
'periodStart' does not exist in type 'SalesMapCreateManyInput'
Copy code

Cause:
- Prisma client was not regenerated after schema change.

Resolution:
npx prisma generate
Copy code

---

## 4. Root Causes

1. Adding required fields to populated tables without default values.
2. Running `migrate reset` without creating new migrations.
3. Not regenerating Prisma client after schema updates.
4. Supabase pooled connection instability.
5. Windows file locking during Prisma engine regeneration.

---

## 5. Resolution Steps

1. Reset database.
2. Recreated migration:
npx prisma migrate dev --name add-period-fields
Copy code

3. Regenerated Prisma client:
npx prisma generate
Copy code

4. Restarted backend server.
5. Verified database schema matches Prisma schema.
6. Reran seed successfully.

---

## 6. Preventive Measures

- Always run migration immediately after schema changes.
- Never add required fields to populated tables without:
- Default values, or
- Making them optional first.
- Always regenerate Prisma client after schema update.
- Restart dev server before running migrations (Windows).
- Avoid relying solely on pooled connection in development.
- Add defensive checks in frontend when mapping API data.

---

## 7. Lessons Learned

- Schema and database must always stay in sync.
- Reset does not create migrations.
- Prisma client must be regenerated after schema changes.
- Windows environment requires extra care with file locks.
- Backend instability directly impacts frontend reliability.

---

## 8. Status

System stabilized.  
Migrations aligned with schema.  
Seeding functional.  
API endpoints operational.

---

**End of Report**
