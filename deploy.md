# JanSetu — Google Cloud Run Deployment Guide

This guide provides the exact `gcloud` CLI commands to deploy JanSetu to Google Cloud Run as a containerized Digital Public Good.

---

## 1. Prerequisites
- Google Cloud SDK (`gcloud`) installed and authenticated.
- A GCP Project with billing enabled.
- A Gemini API Key from [Google AI Studio](https://aistudio.google.com/).

```bash
# 1. Login and set active project
gcloud auth login
gcloud config set project YOUR_PROJECT_ID

# 2. Enable necessary GCP APIs
gcloud services enable \
  run.googleapis.com \
  artifactregistry.googleapis.com \
  cloudbuild.googleapis.com \
  secretmanager.googleapis.com
```

---

## 2. Configure Gemini API Key as Secret

Store `GEMINI_API_KEY` securely in Google Secret Manager:

```bash
# Create the secret
gcloud secrets create gemini-api-key \
  --replication-policy="automatic"

# Add your Google AI Studio API key as the secret version
echo -n "YOUR_GEMINI_API_KEY_HERE" | gcloud secrets versions add gemini-api-key --data-file=-
```

---

## 3. Direct Source Deploy to Google Cloud Run

Deploy directly from source using Cloud Build and Cloud Run with:
- **Region**: `asia-south1` (Mumbai, India for minimal latency)
- **Min Instances**: `1` (prevents cold starts and retains local file store)
- **Max Instances**: `1` (ensures consistent in-memory state for prototype)
- **Memory**: `2Gi`
- **CPU**: `2`

```bash
gcloud run deploy jansetu \
  --source . \
  --region asia-south1 \
  --platform managed \
  --allow-unauthenticated \
  --min-instances 1 \
  --max-instances 1 \
  --memory 2Gi \
  --cpu 2 \
  --set-secrets GEMINI_API_KEY=gemini-api-key:latest \
  --set-env-vars GEMINI_MODEL=gemini-2.5-flash,GEMINI_EMBED_MODEL=text-embedding-004,NODE_ENV=production
```

---

## 4. Verification & Health Check

After deployment completes, `gcloud` will output your Service URL (e.g., `https://jansetu-xyz-el.a.run.app`).

Test the service health check endpoint:
```bash
curl https://YOUR_SERVICE_URL/api/health
```

Expected response:
```json
{
  "status": "ok",
  "timestamp": "2026-09-30T12:00:00.000Z",
  "gemini": {
    "configured": true,
    "model": "gemini-2.5-flash",
    "embedModel": "text-embedding-004",
    "mode": "live"
  },
  "store": {
    "states_count": 3,
    "projects_count": 69,
    "requests_count": 160
  }
}
```

---

## 5. Local Docker Testing (Optional)

To test the container image locally before pushing:

```bash
# Build local container
docker build -t jansetu:latest .

# Run container on port 8080
docker run -p 8080:8080 \
  -e GEMINI_API_KEY="YOUR_KEY_HERE" \
  -e GEMINI_MODEL="gemini-2.5-flash" \
  -e GEMINI_EMBED_MODEL="text-embedding-004" \
  jansetu:latest

# Open in browser: http://localhost:8080
```
