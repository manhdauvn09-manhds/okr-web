# Feature Spec: 005-okr-role-kr-objective-rules

## Mục tiêu
Đảm bảo hệ thống OKR tuân thủ đầy đủ các thay đổi CR-0404/0405/0406 với enforcement cả frontend và backend.

## User Stories
1. Là Manager, tôi thấy được link Members và OKR-all.
2. Là Employee, tôi không thấy hai link đó.
3. Là Manager, tôi vào Members và chỉ xem OKR của member.
4. Là Creator, tôi chỉ được add tối đa 3 KR cho 1 Objective.
5. Là Creator, tôi chỉ submit được khi có tối thiểu 1 KR.
6. Khi Objective đã submit hoặc approved, creator chỉ update progress KR, không thể add/edit/delete KR.
7. Draft Objective chỉ creator nhìn thấy.
8. Form tạo objective không có Owner.
9. Employee chỉ chọn Personal, Manager chọn Personal hoặc Team.

## Out of Scope
- Workflow approve đầy đủ nhiều cấp.
- RBAC production với JWT thật.
