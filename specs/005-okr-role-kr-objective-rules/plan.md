# Implementation Plan

## Backend
- Tạo DataStoreService chứa data mẫu và rule engine.
- Expose API objectives/members/auth.
- Enforce rule server-side cho max KR, submit constraint, post-submit lock, draft visibility, type permission.

## Frontend
- React Router layout + sidebar theo role.
- Dashboard + Members + Create + Detail.
- Form Create Objective không có Owner, thêm Type theo role.
- Disable actions add/delete KR sau submit/approve.

## Validation
- Build/test command cho backend/frontend.
- Smoke flow: Manager và Employee.
