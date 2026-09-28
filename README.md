# Gaze

Gaze is a photography portfolio / gallery web app. When photos are uploaded, the backend automatically extracts EXIF data, generates a BlurHash placeholder, stores the original file in AWS S3, and serves it through CloudFront. Photos can be organized with two kinds of tags — **Category** and **Series** — and browsed as a gallery wall on the frontend.

> ⚠️ This project is a work in progress. The sign-up page, personal page, and access control are not finished yet.

## Features

- **Batch photo upload**: upload multiple files to S3, with automatic extraction of EXIF data (shutter speed, aperture, ISO, lens, etc.) and actual image dimensions
- **BlurHash lazy loading**: a BlurHash is generated on upload, so the frontend shows a blurred placeholder before loading the full image
- **Category / Series tags**: each photo can have multiple categories and series; tags are created automatically if they don't exist
- **Gallery**: browse all photos, click to view full screen
- **Management / Content**: list all photos, edit photographer and tags
- **Sign in**: bcrypt-hashed passwords, JWT (httpOnly cookie)
- **Rate limiting**: 50 requests per IP per 15 minutes

## Tech Stack

| Part | Technologies |
| --- | --- |
| Frontend | React 18, TypeScript, Vite, MUI, React Router, react-blurhash |
| Backend | Node.js, Express, TypeScript, mysql2, multer, sharp, blurhash, jpeg-exif, Joi, jsonwebtoken, bcrypt |
| Infrastructure | MySQL, AWS S3, CloudFront, EC2 |

## Project Structure

```
.
├── client/                 # React frontend (Vite)
│   └── src/
│       ├── components/     # Nav, Layout, CategorizeForm
│       ├── routes/         # Gallery, Upload, Management, Content, Signin…
│       └── types/
└── server/                 # Express API
    └── src/
        ├── index.ts        # Entry point: CORS, rate limit, route mounting
        ├── routes/         # upload, photo, user, variant, gallery, private
        ├── validation.ts   # Joi validation
        └── verifyToken.ts  # JWT middleware
```

## Getting Started

### Prerequisites

- Node.js 20+
- MySQL 8+ (queries use the `ROW_NUMBER()` window function)
- An S3 bucket and a CloudFront distribution pointing to it

### 1. Set up the database

The repo has no migrations. The schema below is a minimal version inferred from the queries in the code:

```sql
CREATE TABLE users (
  id INT AUTO_INCREMENT PRIMARY KEY,
  username VARCHAR(255) NOT NULL,
  email VARCHAR(255) NOT NULL UNIQUE,
  password VARCHAR(255) NOT NULL
);

CREATE TABLE photos (
  id INT AUTO_INCREMENT PRIMARY KEY,
  url TEXT NOT NULL,
  photographer VARCHAR(255),
  original_name VARCHAR(255),
  exif JSON,
  blurhash VARCHAR(255)
);

CREATE TABLE categories (
  id INT AUTO_INCREMENT PRIMARY KEY,
  title VARCHAR(255) NOT NULL
);

CREATE TABLE series (
  id INT AUTO_INCREMENT PRIMARY KEY,
  title VARCHAR(255) NOT NULL
);

-- Links photos to categories / series
CREATE TABLE variants (
  id INT AUTO_INCREMENT PRIMARY KEY,
  photo_id INT NOT NULL,
  category_id INT,
  series_id INT,
  FOREIGN KEY (photo_id) REFERENCES photos(id),
  FOREIGN KEY (category_id) REFERENCES categories(id),
  FOREIGN KEY (series_id) REFERENCES series(id)
);
```

### 2. Start the backend

```bash
cd server
cp .env.example .env   # fill in DB, JWT, and AWS settings
npm install
npm run dev            # nodemon + ts-node, defaults to http://localhost:3000
```

For production:

```bash
npm run build
npm start
```

### 3. Start the frontend

```bash
cd client
cp .env.example .env   # point VITE_ServerHostName to the backend
npm install
npm run dev            # defaults to http://localhost:5173
```

## Environment Variables

### server/.env

| Variable | Description |
| --- | --- |
| `PORT` | API port, defaults to `3000` |
| `ClientHostName` | Frontend URL, used for CORS |
| `JWT_ACCESS_TOKEN_SECRET` | JWT signing secret; use a long random string |
| `DB_HOSTNAME` / `DB_USERNAME` / `DB_PASSWORD` / `DB_DATABASE` | MySQL connection settings |
| `maxAllowedFiles` | Max number of files per upload |
| `BUCKET_NAME` / `BUCKET_REGION` | S3 bucket |
| `ACCESS_KEY` / `SECRET_ACCESS_KEY` | IAM credentials with `s3:PutObject` permission |
| `CLOUDFRONT_URL` | CloudFront URL (must end with `/`), used to build photo URLs |

### client/.env

| Variable | Description |
| --- | --- |
| `VITE_ServerHostName` | Backend API URL |
| `VITE_maxAllowedFiles` | Frontend upload limit (should match the backend) |

## API

All routes are under `/api`.

| Method | Path | Description |
| --- | --- | --- |
| `POST` | `/api/upload` | Upload photos (`multipart/form-data`, fields `image`, `photographer`) |
| `GET` | `/api/photo/all` | Get all photos |
| `GET` | `/api/photo/details?id=` | Get a single photo |
| `POST` | `/api/photo/edit?id=` | Update photographer |
| `POST` | `/api/variant/insert` | Set a photo's categories and series |
| `GET` | `/api/variant/get_category` | All categories |
| `GET` | `/api/variant/get_series` | All series |
| `GET` | `/api/variant/get_photo_tag?id=` | Categories and series of a photo |
| `GET` | `/api/gallery/all` | Gallery (one row per photo) |
| `GET` | `/api/gallery/category` | Photos grouped by category |
| `GET` | `/api/gallery/series` | Photos grouped by series |
| `POST` | `/api/user/register` | Register |
| `POST` | `/api/user/signin` | Sign in; returns an `accessToken` cookie |
| `GET` | `/api/private` | Current user's data (requires `auth-token` header) |

## Deployment

Build the frontend, sync it to S3, and invalidate the CloudFront cache (requires a configured AWS CLI):

```bash
cd client
npm run build
npm run sync        # aws s3 sync ./dist s3://<bucket>
npm run invalidate  # aws cloudfront create-invalidation
```

The backend runs on EC2 via `npm run build && npm start`. Using pm2 and an HTTPS reverse proxy is recommended.

## Roadmap

- [ ] Require authentication for upload, edit, and tagging APIs
- [ ] Sign-up and personal pages
- [ ] Public / private photo visibility
- [ ] Per-user categories and series
