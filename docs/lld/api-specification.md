# REST API Specification — Bihar Sahayak (BSeva) 🇮🇳
**API Version:** `v1`  
**Base URL:** `/api/v1`  
**Data Format:** `application/json`  
**Authentication:** Bearer JWT in HttpOnly Cookie (`access_token`)

---

## 1. Authentication & Authorization

### `POST /api/v1/auth/register`
Creates a new citizen account.
- **Request Body:**
  ```json
  {
    "fullName": "Aarav Kumar",
    "phone": "9876543210",
    "email": "aarav@example.com",
    "password": "SecurePassword123!"
  }
  ```
- **Response `201 Created`:**
  ```json
  {
    "success": true,
    "user": {
      "id": "7b8d8102-1c2a-48d6-9568-7c87c093a201",
      "fullName": "Aarav Kumar",
      "phone": "9876543210",
      "role": "CITIZEN"
    }
  }
  ```

### `POST /api/v1/auth/login`
- **Request Body:**
  ```json
  {
    "identifier": "9876543210",
    "password": "SecurePassword123!"
  }
  ```
- **Response `200 OK`:** Sets `HttpOnly` cookie with JWT.

---

## 2. Citizen Profile Management

### `GET /api/v1/profile`
Retrieves current authenticated citizen's profile.

### `PUT /api/v1/profile`
Updates demographic and educational criteria for real-time eligibility evaluation.
- **Request Body:**
  ```json
  {
    "district": "Patna",
    "block": "Danapur",
    "age": 21,
    "gender": "MALE",
    "socialCategory": "EBC",
    "isBiharResident": true,
    "education": "12TH_PASS",
    "occupation": "STUDENT",
    "annualIncome": 120000.00,
    "landHoldingAcres": 0.0,
    "isDifferentlyAbled": false,
    "skills": ["Basic Computer", "Hindi Typing", "Python"],
    "interests": ["Information Technology", "Competitive Exams"]
  }
  ```

---

## 3. Scheme Intelligence & Discovery

### `GET /api/v1/schemes`
Lists schemes with pagination and faceted filtering.
- **Query Parameters:**
  - `page`: default 1
  - `limit`: default 20
  - `category`: category slug (e.g., `education`, `agriculture`)
  - `department`: department code (e.g., `EDU_DEPT`, `AGRI_DEPT`)
  - `search`: full-text search query (Hindi/English)

### `GET /api/v1/schemes/:slug`
Fetches comprehensive scheme details, step-by-step application instructions, documents, and verified official URLs.

---

## 4. Deterministic Eligibility Engine

### `POST /api/v1/eligibility/check`
Executes real-time deterministic eligibility matching across all active schemes against the citizen profile.
- **Request Body (Optional if authenticated, or guest profile payload):**
  ```json
  {
    "profile": {
      "district": "Gaya",
      "age": 19,
      "gender": "FEMALE",
      "socialCategory": "SC",
      "isBiharResident": true,
      "education": "12TH_PASS",
      "annualIncome": 90000.00
    }
  }
  ```
- **Response `200 OK`:**
  ```json
  {
    "success": true,
    "totalEvaluated": 25,
    "matches": [
      {
        "schemeId": "3fa85f64-5717-4562-b3fc-2c963f66afa6",
        "slug": "mukhyamantri-kanya-utthan-yojana-12th",
        "title": "मुख्यमंत्री कन्या उत्थान योजना (10+2 उत्तीर्ण)",
        "status": "POTENTIALLY_ELIGIBLE",
        "matchPercentage": 100,
        "passedRules": [
          "लिंग: केवल महिला (Passed)",
          "निवास: बिहार (Passed)",
          "शिक्षा: 12वीं पास (Passed)"
        ],
        "failedRules": [],
        "requiredDocuments": [
          "12वीं की मार्कशीट",
          "बिहार निवास प्रमाण पत्र",
          "आधार कार्ड",
          "बैंक पासबुक (बिहार स्थित बैंक)"
        ],
        "officialPortalUrl": "https://medhasoft.bih.nic.in"
      }
    ]
  }
  ```

---

## 5. Career Intelligence & Recommendations

### `POST /api/v1/careers/recommend`
Evaluates profile and generates career opportunities with skill gap analysis.

---

## 6. AI Grounded Assistant (RAG)

### `POST /api/v1/ai/chat`
- **Request Body:**
  ```json
  {
    "conversationId": "optional-uuid",
    "query": "12वीं पास छात्राओं के लिए कौन सी योजना है जिसमें 25000 मिलते हैं?",
    "language": "hi"
  }
  ```
- **Response `200 OK`:**
  ```json
  {
    "response": "मुख्यमंत्री कन्या उत्थान योजना के अंतर्गत बिहार विद्यालय परीक्षा समिति से 12वीं (इंटरमीडिएट) उत्तीर्ण अविवाहित छात्राओं को ₹25,000 की प्रोत्साहन राशि प्रदान की जाती है।",
    "confidence": 0.96,
    "citedSchemes": [
      {
        "name": "मुख्यमंत्री कन्या उत्थान योजना (10+2)",
        "department": "शिक्षा विभाग, बिहार सरकार",
        "officialUrl": "https://medhasoft.bih.nic.in",
        "verifiedDate": "2026-08-25"
      }
    ],
    "disclaimer": "यह जानकारी केवल मार्गदर्शन के लिए है। अंतिम पात्रता आधिकारिक विभाग द्वारा निर्धारित की जाती है।"
  }
  ```

---

## 7. Admin & Verification Endpoints

- `POST /api/v1/admin/schemes` (Create new scheme)
- `PUT /api/v1/admin/schemes/:id` (Update scheme details)
- `POST /api/v1/admin/schemes/:id/verify` (Mark scheme as verified with audit trail)
- `GET /api/v1/admin/audit-logs` (View full audit log stream)
