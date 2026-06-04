# Stunting Detection Full Stack

Repository ini dideploy sebagai dua project Vercel terpisah dan memakai Hugging Face Space untuk model AI.

## Backend Vercel

- Root Directory: `backend`
- Framework: Express / Other
- Environment Variables untuk Production:

```env
AI_BASE_URL=https://abinugroh00-stunting-model-api.hf.space
SUPABASE_URL=...
SUPABASE_SERVICE_ROLE_KEY=...
```

Backend harus dapat diakses publik tanpa Vercel challenge karena frontend memanggil endpoint `/api/*` secara cross-origin.
Jika respons backend memiliki header `X-Vercel-Mitigated: challenge`, buka project backend di Vercel lalu nonaktifkan **Firewall > Bot Management > Attack Challenge Mode** atau buat bypass yang sesuai untuk API.

Tes setelah deploy:

```text
GET https://your-backend-project.vercel.app/
```

Respons yang benar:

```json
{"success":true,"message":"RESTful API berjalan"}
```

## Frontend Vercel

- Root Directory: `frontend`
- Framework Preset: Vite
- Environment Variable untuk Production:

```env
VITE_API_BASE_URL=https://your-backend-project.vercel.app/api
```

Setelah mengubah environment variable, lakukan redeploy. File `frontend/vercel.json` memastikan route SPA seperti `/login` dan `/dashboard` tetap dapat dibuka langsung.

## AI API

Health check:

```text
GET https://abinugroh00-stunting-model-api.hf.space/
```

Endpoint prediksi yang dipakai backend:

```text
POST https://abinugroh00-stunting-model-api.hf.space/predict
```
