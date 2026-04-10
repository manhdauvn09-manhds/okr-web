# BD - MOD-03 Objective/KR Role Rules

## Thiết kế màn hình
- Sidebar: render condition theo role.
- Members page: gọi endpoint riêng `/members/objectives`.
- Create Objective: field Type hiển thị option theo role.
- Objective Detail: nút Add/Delete KR disable khi submitted/approved.

## Thiết kế API
- GET `/objectives`
- GET `/members/objectives`
- POST `/objectives`
- POST `/objectives/:id/key-results`
- DELETE `/objectives/:id/key-results/:krId`
- POST `/objectives/:id/submit`
- PATCH `/objectives/:id/key-results/:krId/progress`

## Rule mapping
- change-0404: sidebar + members filter.
- change-0405: max KR + submit rule + lock KR + draft visibility.
- change-0406: owner removed + type rules + approved lock KR.
