# Test Cases - MOD-03

1. Employee đăng nhập: không thấy Members, OKR-all.
2. Manager đăng nhập: thấy Members, OKR-all.
3. Manager vào Members: chỉ thấy objective ownerRoleAtCreation=EMPLOYEE và isSubmitted=true.
4. Tạo objective Employee: chỉ có type Personal.
5. Tạo objective Manager: có type Personal và Team.
6. Add KR lần 4: API trả lỗi max 3.
7. Submit objective khi chưa có KR: API trả lỗi.
8. Sau submit: add/delete KR bị chặn.
9. Draft objective của Employee không xuất hiện với Manager.
10. Sau submit vẫn update progress KR được.
