# SRS - MOD-03 Objective/KR Role Rules

## Phạm vi
Triển khai các ràng buộc nghiệp vụ từ change-0404, 0405, 0406 cho màn hình sidebar, members, objective, key result.

## Yêu cầu chức năng chính
- Chỉ Manager nhìn thấy link Members và OKR-all.
- Members page chỉ hiển thị objective của member (EMPLOYEE), không hiển thị objective manager/team.
- Mỗi Objective tối đa 3 KR.
- Submit Objective yêu cầu có ít nhất 1 KR.
- Sau submit hoặc approved, không add/edit/delete KR.
- Objective chưa submit chỉ creator nhìn thấy.
- Form Create Objective bỏ Owner.
- Thêm Type: Personal/Team.
- Employee chỉ chọn Personal.
- Manager chọn Personal hoặc Team.

## Tiêu chí chấp nhận
- API và UI cùng enforce các rule trên.
- Không tồn tại đường đi UI để vi phạm rule.
