# 📄 BÁO CÁO CUỐI POC

## Ứng dụng AI trong lĩnh vực Transport

### Phương pháp phát triển phần mềm AI-driven (Agent-based)

**Đơn vị thực hiện:** FPT Software (NVI.MS, FHM.QAI, FAI.ABC)

---

# 1. 📌 Tổng quan

## 1.1 Mục tiêu

Trong dự án PoC này, chúng tôi kiểm chứng phương pháp phát triển phần mềm **AI-driven** dựa trên Generative AI với các mục tiêu:

* Tối ưu hóa quy trình phát triển từ **requirement → design → implementation**
* Định lượng hiệu quả giảm:

  * Thời gian (effort)
  * Chi phí
* Xây dựng nền tảng có thể:

  * Chuẩn hóa
  * Mở rộng sang các dự án khác

👉 Không chỉ là PoC, mà hướng tới **standard hóa SDLC trong tương lai**

---

## 1.2 Phạm vi thực hiện

* Thời gian: 27/02/2026 → 31/03/2026 
* Input:

  * 2 module từ tài liệu thực tế:

### Nội dung thực hiện:

* Thiết kế quy trình AI-driven SDLC
* Thực thi end-to-end:

  * Requirement → Design → Code → Test
* Validate:

  * AI generate document + code
* So sánh với phương pháp truyền thống

---

## 1.3 Phương pháp

### Kết hợp 2 approach chính:

* **SDD (Spec-Driven Development)**
* **TDD (Test-Driven Development)** 

### Key principle:

* Spec là nguồn chân lý (single source of truth)
* Code được generate từ spec
* Test validate output

---

## 1.4 Lý do chọn SDD

* Chuẩn hóa input cho AI
* Giảm mismatch giữa requirement và code
* Tăng traceability
* Phù hợp nhất với AI workflow 

---

# 2. 📊 Kết quả đánh giá

## 2.1 KPI & Phương pháp đo

### KPI chính

1. **Thời gian phát triển**

* Lead time end-to-end
* Effort theo phase

2. **AI Code Coverage**

* % code được generate từ AI
* Target: ≥ 80%

3. **Test Pass Rate**

* % test pass
* Target: 70–80%

---

## 2.2 Kết quả PoC

### ⏱️ Thời gian

* Trung bình: **2–4 giờ / module**
* Tổng:

  * 3 modules / 11 features
  * ~9.2 giờ 

👉 Cực kỳ nhanh so với dev truyền thống

---

### 📈 Requirement Coverage

* Tổng: **87.5%**
* Target: ~80%
  → **Đạt vượt mục tiêu**

---

### 🧪 Test Coverage

* Tổng: **93.1% pass rate**
* Target: 70–80%
  → **Chất lượng cao hơn kỳ vọng**

---

## 2.3 Insight

### 👍 Điểm tốt

* Tốc độ phát triển cực nhanh
* Coverage cao (requirement + test)
* Workflow AI hoạt động ổn định

### ⚠️ Hạn chế

* Chưa đánh giá sâu về:

  * Độ phức tạp
  * Chất lượng dài hạn
* Một số requirement chưa fully covered

---

# 3. ⚠️ Phân tích vấn đề & giải pháp

## 3.1 Vấn đề chung

### 1. Thiếu human review

* AI generate là chính
* Review chuyên gia còn hạn chế

👉 Giải pháp:

* Thiết lập **human review gate**

---

### 2. Context quá lớn

* Dễ bị overload → mất connection

👉 Giải pháp:

* Tách pipeline
* Dùng model context lớn hơn (Claude)

---

## 3.2 Vấn đề theo từng phase

### Requirement

* Thiếu domain knowledge

👉 Giải pháp:

* Tận dụng BA + knowledge base

---

### Design

* Document quá nhiều

👉 Giải pháp:

* AI đánh giá ưu tiên review

---

### Coding

* Code không đồng nhất giữa module

👉 Giải pháp:

* Cross-check bằng AI độc lập

---

### Testing

* Test AI khó validate

👉 Giải pháp:

* Human + AI double validation

---

# 4. 📈 Tổng kết

## 4.1 Giá trị mang lại

### 🚀 Tốc độ

* Spec creation nhanh hơn ~80% 

### 🎯 Chất lượng

* Consistency: ~87%
* Test coverage: ~93%

### 👥 Productivity

* Onboarding nhanh hơn
* Collaboration tốt hơn

### 🏢 Scalability

* Chuẩn hóa process
* Audit & compliance tốt hơn


---

# 5. 🚀 Đề xuất Next Phase

## 5.1 Chuẩn hóa

* Xây dựng:

  * Spec template
  * Knowledge base
  * Data governance

---

## 5.2 Process

* Define rõ:

  * Human review phase
  * Quality gate

---

## 5.3 Technology

* Improve:

  * Prompt
  * Agent
  * Workflow

* Kết nối:

  * Jira
  * Teams
  * CI/CD

---

## 5.4 Platform

* Xây dựng:

  * Agent platform
  * Reusable knowledge base

---

# 6. 👥 Vai trò con người trong AI SDLC

AI không thay thế hoàn toàn:

| Vai trò       | Lý do                   |
| ------------- | ----------------------- |
| Strategy      | AI không hiểu business  |
| Communication | cần con người           |
| Infra         | cần xử lý thủ công      |
| Integration   | AI không tối ưu toàn hệ |
| Final QA      | cần validation          |

👉 AI = accelerator, không phải replacement 

---

# 7. 🏁 Kết luận

> AI-driven development (SDD + TDD + Agent workflow) đã chứng minh:

* Tăng tốc mạnh mẽ SDLC
* Đảm bảo chất lượng ở mức cao
* Có tiềm năng trở thành **standard trong tương lai**

👉 Điều kiện tiên quyết:

* Spec phải rõ
* Có human governance
* Có process chuẩn
