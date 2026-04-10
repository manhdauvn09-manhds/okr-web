# DD - MOD-03 Objective/KR Role Rules

## Backend class design
- `DataStoreService`: domain state + business constraints.
- `ObjectivesController`: objective + KR endpoints.
- `MembersController`: member objective endpoint with manager guard.
- `AuthController`: workshop login/users endpoint.

## Frontend component design
- `AppLayout`: sidebar + user switcher.
- `DashboardPage`: objective listing.
- `MembersPage`: manager-only data view.
- `CreateObjectivePage`: create form with type options theo role.
- `ObjectiveDetailPage`: add/delete KR + submit + progress update.

## Sequence
1. User chọn role/user.
2. Dashboard load objectives theo visibility rule.
3. Create objective theo type permission.
4. Add KR (<=3) rồi submit (>=1 KR).
5. Sau submit disable add/delete KR, chỉ update progress.
