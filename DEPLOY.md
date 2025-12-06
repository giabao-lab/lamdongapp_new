# Deploy Guide - Lam Dong App

## Quick Deploy

### Frontend (Vercel)
1. Visit https://vercel.com
2. Sign in with GitHub
3. Click "New Project"
4. Import `giabao-lab/lamdongapp_new`
5. Deploy!

### Backend (Render)
1. Visit https://render.com
2. Sign in with GitHub
3. Click "New +" → "Web Service"
4. Connect `giabao-lab/lamdongapp_new`
5. Configure:
   - Root Directory: `backend`
   - Build Command: `npm install && npm run build`
   - Start Command: `npm start`
6. Add environment variables
7. Deploy!

### Database (Render PostgreSQL)
1. On Render → "New +" → "PostgreSQL"
2. Create database
3. Copy connection string
4. Add to backend environment variables

## Environment Variables

### Frontend (.env.production)
```
NEXT_PUBLIC_API_URL=https://your-backend.onrender.com/api/v1
NEXT_PUBLIC_CLOUDINARY_CLOUD_NAME=your-cloud-name
```

### Backend (.env.production)
```
NODE_ENV=production
PORT=5000
DATABASE_URL=postgresql://user:pass@host:5432/db
JWT_SECRET=your-secret-key
CLOUDINARY_CLOUD_NAME=your-cloud
CLOUDINARY_API_KEY=your-key
CLOUDINARY_API_SECRET=your-secret
```

## After Deploy

1. Update frontend API URL to point to backend
2. Import database schema to PostgreSQL
3. Test all endpoints
4. Setup custom domain (optional)

---

**URLs:**
- Frontend: https://lamdongapp.vercel.app
- Backend: https://lamdongapp-backend.onrender.com
- Database: Render PostgreSQL internal URL
