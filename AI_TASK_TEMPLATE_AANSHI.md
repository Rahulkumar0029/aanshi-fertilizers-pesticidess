# ⚡ AI TASK TEMPLATE — AANSHI FERTILIZERS & PESTICIDES

---

## 🧠 PROJECT CONTEXT (SHORT)

Project: Aanshi Fertilizers & Pesticides  
Type: Real production business website  
Stack: Next.js App Router + TypeScript + MongoDB + Tailwind  

---

## ⚠️ STRICT RULES (ALWAYS APPLY)

- No dummy or fake data
- No hacks or temporary fixes
- Do not break existing functionality
- Do not rewrite full files unless necessary
- Always work within current project structure
- Always produce production-ready code
- Maintain backend/frontend consistency
- Include proper error handling
- Follow clean and scalable architecture

---

## 🎯 TASK

[Clearly describe what you want]

Example:
Fix products not showing on frontend

---

## 📂 FILES INVOLVED

[List exact file paths]

Example:
- app/api/products/route.ts  
- app/products/page.tsx  
- models/Product.ts  

---

## 🧩 CURRENT PROBLEM

[Explain what is happening right now]

Example:
- API returns empty array
- UI shows no products
- No error visible

---

## ✅ EXPECTED RESULT

[What should happen after fix]

Example:
- Products fetched correctly from MongoDB
- Products display in UI
- Errors handled properly if API fails

---

## ⚙️ CONSTRAINTS

[Important technical conditions]

Example:
- Must use existing MongoDB connection
- Must not change schema unless required
- Must follow Next.js App Router
- Must keep current UI intact

---

## 🔍 DEBUG INSTRUCTIONS (IF APPLICABLE)

- Find ROOT cause first
- Do not guess blindly
- Check:
  - API logic
  - Database connection
  - Schema fields
  - Frontend fetch logic
- Fix issue without breaking other parts

---

## 🧠 CODE GENERATION RULES

- Use async/await
- Use proper TypeScript types
- Keep code modular
- Avoid duplication
- Add meaningful error messages
- Follow real-world production practices

---

## 🚀 OUTPUT FORMAT (VERY IMPORTANT)

- Give **file-level changes**
- Show **exact code to replace**
- Do NOT give unnecessary theory
- Do NOT rewrite entire project
- Keep response clean and structured

---

## 🔥 EXAMPLE FULL TASK

Task:
Fix products API returning empty data

Files:
- app/api/products/route.ts
- models/Product.ts

Current Problem:
- API returns []
- Products exist in DB

Expected Result:
- API returns actual products
- UI displays products correctly

Constraints:
- Do not change DB structure unnecessarily
- Keep API response format consistent