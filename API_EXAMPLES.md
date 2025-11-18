# Exemples d'Appels API - Digital Play

Ce fichier contient des exemples concrets d'appels API que vous pouvez tester avec **Postman** ou **cURL**.

---

## 🧪 TESTER AVEC POSTMAN

### 1. Inscription d'un utilisateur

**Requête :**
\`\`\`
POST http://localhost:5000/api/auth/register
Content-Type: application/json

{
  "email": "test@example.com",
  "password": "Password123!",
  "fullName": "Test User"
}
\`\`\`

**Réponse attendue :**
\`\`\`json
{
  "user": {
    "id": "550e8400-e29b-41d4-a716-446655440000",
    "email": "test@example.com",
    "name": "Test User",
    "role": "customer"
  },
  "token": "eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9..."
}
\`\`\`

---

### 2. Connexion

**Requête :**
\`\`\`
POST http://localhost:5000/api/auth/login
Content-Type: application/json

{
  "email": "test@example.com",
  "password": "Password123!"
}
\`\`\`

**Réponse attendue :**
\`\`\`json
{
  "user": {
    "id": "550e8400-e29b-41d4-a716-446655440000",
    "email": "test@example.com",
    "name": "Test User",
    "role": "customer"
  },
  "token": "eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9..."
}
\`\`\`

---

### 3. Récupérer tous les produits

**Requête :**
\`\`\`
GET http://localhost:5000/api/products
\`\`\`

**Réponse attendue :**
\`\`\`json
[
  {
    "id": "650e8400-e29b-41d4-a716-446655440001",
    "name": "Netflix Premium 1 Mois",
    "slug": "netflix-premium-1-mois",
    "description": "Profitez de Netflix Premium...",
    "price": 8000,
    "stock": 50,
    "platform": "Web",
    "region": "Global",
    "type": "digital",
    "image_url": "/netflix.jpg",
    "is_featured": true,
    "category_id": "750e8400-e29b-41d4-a716-446655440010",
    "category_name": "Abonnements"
  }
]
\`\`\`

---

### 4. Ajouter un produit au panier (AUTH REQUISE)

**Requête :**
\`\`\`
POST http://localhost:5000/api/cart
Content-Type: application/json
Authorization: Bearer eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9...

{
  "product_id": "650e8400-e29b-41d4-a716-446655440001",
  "quantity": 2
}
\`\`\`

**Réponse attendue :**
\`\`\`json
{
  "items": [
    {
      "id": "850e8400-e29b-41d4-a716-446655440020",
      "product_id": "650e8400-e29b-41d4-a716-446655440001",
      "product_name": "Netflix Premium 1 Mois",
      "product_price": 8000,
      "product_image": "/netflix.jpg",
      "quantity": 2
    }
  ],
  "total": 16000
}
\`\`\`

---

### 5. Créer une commande (AUTH REQUISE)

**Requête :**
\`\`\`
POST http://localhost:5000/api/orders
Content-Type: application/json
Authorization: Bearer eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9...

{
  "items": [
    {
      "product_id": "650e8400-e29b-41d4-a716-446655440001",
      "quantity": 2,
      "price": 8000
    }
  ],
  "total_amount": 16000,
  "payment_method": "mobile_money",
  "phone_number": "+243123456789",
  "email": "test@example.com",
  "full_name": "Test User"
}
\`\`\`

**Réponse attendue :**
\`\`\`json
{
  "order_id": "950e8400-e29b-41d4-a716-446655440030",
  "order_number": "DP-2024-00001",
  "status": "pending",
  "message": "Order created successfully"
}
\`\`\`

---

### 6. Créer un produit (ADMIN UNIQUEMENT)

**Requête :**
\`\`\`
POST http://localhost:5000/api/products
Content-Type: application/json
Authorization: Bearer eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9...

{
  "name": "Spotify Premium 6 Mois",
  "slug": "spotify-premium-6-mois",
  "description": "Écoutez votre musique préférée sans publicité pendant 6 mois",
  "price": 28000,
  "stock": 50,
  "platform": "Web",
  "region": "Global",
  "type": "digital",
  "image_url": "/spotify.jpg",
  "is_featured": false,
  "category_id": "750e8400-e29b-41d4-a716-446655440010"
}
\`\`\`

**Réponse attendue :**
\`\`\`json
{
  "id": "a50e8400-e29b-41d4-a716-446655440040",
  "name": "Spotify Premium 6 Mois",
  "slug": "spotify-premium-6-mois",
  "description": "Écoutez votre musique préférée...",
  "price": 28000,
  "stock": 50,
  "platform": "Web",
  "region": "Global",
  "type": "digital",
  "image_url": "/spotify.jpg",
  "is_featured": false,
  "category_id": "750e8400-e29b-41d4-a716-446655440010",
  "category_name": "Abonnements",
  "created_at": "2024-01-15T14:30:00Z"
}
\`\`\`

---

## 🧪 TESTER AVEC cURL

### Inscription
\`\`\`bash
curl -X POST http://localhost:5000/api/auth/register \
  -H "Content-Type: application/json" \
  -d '{
    "email": "test@example.com",
    "password": "Password123!",
    "fullName": "Test User"
  }'
\`\`\`

### Connexion
\`\`\`bash
curl -X POST http://localhost:5000/api/auth/login \
  -H "Content-Type: application/json" \
  -d '{
    "email": "test@example.com",
    "password": "Password123!"
  }'
\`\`\`

### Récupérer les produits
\`\`\`bash
curl http://localhost:5000/api/products
\`\`\`

### Ajouter au panier (avec token)
\`\`\`bash
curl -X POST http://localhost:5000/api/cart \
  -H "Content-Type: application/json" \
  -H "Authorization: Bearer VOTRE_TOKEN_ICI" \
  -d '{
    "product_id": "650e8400-e29b-41d4-a716-446655440001",
    "quantity": 1
  }'
\`\`\`

---

## 🔍 CODES D'ERREUR

### Erreurs courantes

#### 400 Bad Request
\`\`\`json
{
  "error": "Invalid email format"
}
\`\`\`
**Solution :** Vérifiez le format des données envoyées

#### 401 Unauthorized
\`\`\`json
{
  "error": "Access token required"
}
\`\`\`
**Solution :** Ajoutez le header `Authorization: Bearer TOKEN`

#### 403 Forbidden
\`\`\`json
{
  "error": "Admin access required"
}
\`\`\`
**Solution :** Vous devez être admin pour cette action

#### 404 Not Found
\`\`\`json
{
  "error": "Product not found"
}
\`\`\`
**Solution :** Vérifiez que l'ID existe dans la base de données

#### 409 Conflict
\`\`\`json
{
  "error": "Email already exists"
}
\`\`\`
**Solution :** Utilisez un autre email

#### 500 Internal Server Error
\`\`\`json
{
  "error": "Database connection failed"
}
\`\`\`
**Solution :** Vérifiez la connexion à la base de données

---

## 📊 FORMATS DE DONNÉES

### Format des prix
Les prix sont en **centimes** (multiplier par 100).
- 8000 = 80 FCFA ou 80 CDF
- 15000 = 150 FCFA ou 150 CDF

### Format des dates
Les dates sont en **ISO 8601** :
\`\`\`
2024-01-15T14:30:00Z
\`\`\`

### Format des UUID
Les IDs sont des **UUID v4** :
\`\`\`
550e8400-e29b-41d4-a716-446655440000
\`\`\`

---

**Bonne chance avec votre API ! 🚀**
