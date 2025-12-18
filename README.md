```markdown
# ⚙️ Gaafisto API Backend

RESTful API built with Node.js, Express, and MongoDB.

## 🚀 Quick Start

```bash
npm install
cp .env.example .env
npm run dev
```

Server runs on: `http://localhost:3000`

## 📁 Project Structure

```
src/
├── config/              # Configuration files
│   ├── database.ts     # MongoDB connection
│   └── multer.ts       # File upload config
├── middleware/          # Express middleware
│   ├── auth.ts         # Authentication
│   ├── role.ts         # Authorization
│   └── error.ts        # Error handling
├── models/             # Mongoose models
│   ├── User.ts
│   ├── Product.ts
│   ├── Order.ts
│   └── ...
├── controllers/        # Route controllers
│   ├── auth.controller.ts
│   ├── product.controller.ts
│   └── ...
├── routes/             # API routes
│   ├── auth.routes.ts
│   ├── product.routes.ts
│   └── index.ts
├── services/           # Business logic
│   ├── auth.service.ts
│   └── ...
├── utils/              # Helper functions
│   ├── jwt.util.ts
│   └── bcrypt.util.ts
└── app.ts              # Express app entry
```

## 🌐 API Endpoints

### Authentication
```
POST   /api/auth/register
POST   /api/auth/login
GET    /api/auth/me
POST   /api/auth/logout
```

### Products
```
GET    /api/products
GET    /api/products/:id
POST   /api/products          [Auth: Admin]
PUT    /api/products/:id      [Auth: Admin]
DELETE /api/products/:id      [Auth: Admin]
```

### Orders
```
GET    /api/orders            [Auth: User]
POST   /api/orders            [Auth: User]
GET    /api/orders/:id        [Auth: User]
PUT    /api/orders/:id        [Auth: Admin]
```

## 🔐 Authentication

- **Type**: JWT (JSON Web Tokens)
- **Header**: `Authorization: Bearer <token>`
- **Expiry**: 7 days

## 📦 Environment Variables

```env
NODE_ENV=development
PORT=3000
MONGODB_URI=mongodb://localhost:27017/gaafisto
JWT_SECRET=your-secret-key
JWT_EXPIRES_IN=7d
MAX_FILE_SIZE=5242880
UPLOAD_PATH=./uploads
```

## 🗄️ Database Schema

### User
```typescript
{
  username: string
  password: string (hashed)
  email: string
  role: 'admin' | 'seller' | 'user'
  createdAt: Date
}
```

### Product
```typescript
{
  name: string
  description: string
  price: number
  stock: number
  category: ObjectId
  images: string[]
  rating: number
}
```

## 🛠️ Development

### Scripts
```bash
npm run dev       # Start dev server with hot reload
npm run build     # Build TypeScript to JavaScript
npm start         # Start production server
```

### Database Setup
```bash
# Start MongoDB
mongod

# Create database
mongosh
use gaafisto
```

## 📤 File Upload

- **Max Size**: 5MB
- **Allowed Types**: JPG, PNG, GIF
- **Storage**: Local filesystem
- **Path**: `/uploads`

## 🔒 Security

- Password hashing with bcrypt
- JWT authentication
- Input validation
- XSS protection
- Rate limiting
- CORS enabled

## 🧪 Testing

```bash
npm test              # Run all tests
npm run test:unit     # Unit tests
npm run test:integration  # Integration tests
```

## 📊 Error Handling

```json
{
  "success": false,
  "message": "Error message",
  "errors": []
}
```

## 📚 Dependencies

### Production
- `express` - Web framework
- `mongoose` - MongoDB ODM
- `bcryptjs` - Password hashing
- `jsonwebtoken` - JWT authentication
- `multer` - File uploads
- `cors` - CORS middleware

### Development
- `typescript` - TypeScript support
- `ts-node-dev` - Dev server
- `@types/node` - Node.js types

---

Built with Node.js ⚡
```

---