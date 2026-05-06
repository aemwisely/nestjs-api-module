# Scalable Authentication System Documentation

## Overview

This document outlines the comprehensive authentication system implemented with the following features:

- **JWT-based Authentication** with Access and Refresh tokens
- **Token Refresh** mechanism with automatic token rotation
- **Token Renewal** with token rotation for enhanced security
- **Token Revocation** for logout and session management
- **Scalable Architecture** following Clean/Hexagonal Architecture with DDD

## Architecture

### Layer Structure

```
Presentation Layer (API Endpoints)
    ↓
Application Layer (Use Cases - Business Logic)
    ↓
Infrastructure Layer (Repositories - Data Persistence)
    ↓
Domain Layer (Entities - Business Rules)
    ↓
Common Layer (Shared Utilities - Guards, Decorators, Exceptions)
```

## Components

### 1. Domain Layer - Token Entity (`libs/core/src/domain/token/`)

**File**: `token.entity.ts`

The `TokenModel` represents the token domain entity with business logic:

```typescript
export class TokenModel {
  // Token validation methods
  isAccessTokenExpired(): boolean;
  isRefreshTokenExpired(): boolean;
  isValid(): boolean;
  isRefreshTokenValid(): boolean;

  // Token management
  revoke(): void;

  // Factory methods
  static create(props): TokenModel;
  static toDomain(entity): TokenModel;
  static toEntity(domain): TokenEntity;
}
```

**Key Responsibilities**:

- Manage token lifecycle
- Validate token expiration and revocation status
- Convert between domain and persistence entities

### 2. Persistence Layer - Token Entity (`libs/common/src/entities/`)

**File**: `token.entity.ts`

TypeORM entity for database persistence with optimized indexes:

- `user_id`: Foreign key to User
- `access_token`: JWT access token
- `refresh_token`: JWT refresh token
- `session_id`: Session identifier for managing multiple tokens per user
- `is_revoked`: Revocation status
- `expires_at`: Access token expiration
- `refresh_expires_at`: Refresh token expiration

**Indexes**: Created on `user_id`, `session_id`, `access_token`, `refresh_token`, `is_revoked`, `expires_at` for optimal query performance.

### 3. Application Layer - Use Cases

#### 3.1 RefreshTokenUseCase (`refresh-token.use-case.ts`)

**Purpose**: Allow users to obtain new access tokens using refresh tokens

**Methods**:

```typescript
async execute(
  refreshToken: string,
  renewRefreshToken: boolean = true
): Promise<{ access_token: string; refresh_token?: string }>
```

**Features**:

- Validates refresh token signature and expiration
- Checks token revocation status
- Supports token rotation (optional)
- Automatically rotates old tokens when renewal is enabled
- Updates user session with new tokens

**Flow**:

1. Verify refresh token signature
2. Check if token exists in database and is not revoked
3. Generate new access token
4. If renewal enabled: generate new refresh token and revoke old one
5. Update user's session and token records

#### 3.2 RevokeTokenUseCase (`revoke-token.use-case.ts`)

**Purpose**: Manage token revocation for logout and session management

**Methods**:

```typescript
async revokeToken(tokenId: string, context: IContext): Promise<void>
async revokeAllUserTokens(context: IContext): Promise<void>
async revokeByRefreshToken(refreshToken: string, context: IContext): Promise<void>
```

**Features**:

- Revoke individual tokens (logout from specific device)
- Revoke all user tokens (logout from all devices)
- Revoke by refresh token (typical logout flow)
- Ownership validation for security

#### 3.3 RenewTokenUseCase (`renew-token.use-case.ts`)

**Purpose**: Rotate tokens for security purposes

**Methods**:

```typescript
async renewCurrentToken(
  context: IContext,
  currentAccessToken: string
): Promise<{ access_token: string; refresh_token: string }>

async renewAllUserTokens(context: IContext): Promise<void>

async checkTokenExpiration(
  context: IContext,
  accessToken: string
): Promise<{ expires_soon: boolean; expires_at: Date; hours_until_expiration: number }>
```

**Use Cases**:

- Periodic token rotation for enhanced security
- Emergency token rotation after security incidents
- Check token expiration to proactively refresh

### 4. Infrastructure Layer

#### 4.1 TokenStorageRepository (`token-storage.repository.ts`)

**Port Interface** defining contracts for token persistence:

- `saveToken()` - Persist new token
- `findByAccessToken()` - Query by access token
- `findByRefreshToken()` - Query by refresh token
- `findBySessionId()` - Query by session
- `findById()` - Query by token ID
- `findActiveTokensByUserId()` - Get all active tokens for a user
- `revokeToken()` - Revoke specific token
- `revokeAllUserTokens()` - Revoke all user tokens
- `deleteExpiredTokens()` - Cleanup old tokens
- `updateToken()` - Update token record

#### 4.2 TokenRepositoryImpl (`token.repository.ts`)

**Implementation** of token storage using PostgreSQL:

- Full CRUD operations with TypeORM
- Efficient queries with proper indexing
- Automatic data conversion between domain and persistence layers

#### 4.3 JwtRepository Enhancement

**Updated** with additional verification methods:

```typescript
async verifyAccessToken(token: string): Promise<any>
async verifyRefreshToken(token: string): Promise<any>
```

**Configuration**:

- Access Token: 15 minutes (configurable via `JWT_EXPIRATION`)
- Refresh Token: 3 days (configurable via `JWT_REFRESH_EXPIRATION`)

### 5. Common Layer - Guards & Decorators

#### 5.1 JWT Strategy Enhancement (`jwt.stategy.ts`)

**Enhanced** to validate token revocation:

- Checks if token exists in database
- Verifies `is_revoked` status
- Rejects revoked tokens immediately
- Maintains session tracking through `session_id`

#### 5.2 AccessToken Decorator (`access-token.decorator.ts`)

**New** decorator to extract access token from Authorization header:

```typescript
@AccessToken() accessToken: string
```

### 6. API Endpoints

#### Endpoint Structure

```
POST   /authentication/login         - Login
POST   /authentication/refresh       - Refresh token
POST   /authentication/renew         - Renew token
POST   /authentication/revoke        - Revoke token
GET    /authentication/self          - Get current user
```

#### 6.1 Login

```http
POST /authentication/login
Content-Type: application/json

{
  "email": "user@example.com",
  "password": "password123"
}

Response:
{
  "result": {
    "access_token": "eyJhbGc...",
    "refresh_token": "eyJhbGc...",
    "token_type": "Bearer",
    "expires_in": 900
  }
}
```

#### 6.2 Refresh Token

```http
POST /authentication/refresh
Content-Type: application/json

{
  "refresh_token": "eyJhbGc...",
  "renew_refresh_token": true
}

Response:
{
  "result": {
    "access_token": "eyJhbGc...",
    "refresh_token": "eyJhbGc...",  // Optional, only if renew_refresh_token=true
    "token_type": "Bearer",
    "expires_in": 900
  }
}
```

#### 6.3 Renew Token

```http
POST /authentication/renew
Authorization: Bearer eyJhbGc...

Response:
{
  "result": {
    "access_token": "eyJhbGc...",
    "refresh_token": "eyJhbGc...",
    "token_type": "Bearer",
    "expires_in": 900
  }
}
```

#### 6.4 Revoke Token

```http
POST /authentication/revoke
Authorization: Bearer eyJhbGc...
Content-Type: application/json

// Logout from current device
{}

// Logout from specific device
{
  "token_id": "uuid"
}

// Logout from all devices
{
  "revoke_all": true
}

Response:
{
  "result": {
    "message": "Token revoked successfully"
  }
}
```

#### 6.5 Get Self

```http
GET /authentication/self
Authorization: Bearer eyJhbGc...

Response:
{
  "result": {
    "id": "uuid",
    "email": "user@example.com",
    "first_name": "John",
    "last_name": "Doe",
    "is_active": true
  }
}
```

## Database Migration

**File**: `migrations/table/1777000000000-create-token-table.js`

Creates `token` table with:

- Primary key: `id` (UUID)
- Indexes on: `user_id`, `session_id`, `access_token`, `refresh_token`, `is_revoked`, `expires_at`
- Foreign key constraint: `user_id` → `user.id` (CASCADE on delete)

## Configuration

Required environment variables:

```env
JWT_SECRET=your-secret-key
JWT_REFRESH_SECRET=your-refresh-secret-key
JWT_EXPIRATION=15m
JWT_REFRESH_EXPIRATION=3d
```

## Security Features

### 1. Token Rotation

- Refresh tokens are automatically rotated
- Old tokens are immediately revoked
- Prevents token reuse attacks

### 2. Token Revocation

- Immediate token invalidation on logout
- Multi-device logout support
- Efficient database queries with indexes

### 3. Session Management

- Unique session_id per login
- Track multiple sessions per user
- Revoke specific sessions on demand

### 4. Token Validation

- Access token signature verification
- Token expiration checking
- Revocation status validation
- User existence verification

### 5. Scalability

- Database indexes for fast queries
- Separate token storage repository
- Clean architecture supports horizontal scaling
- Stateless token validation (can run on multiple servers)

## Scalability Considerations

### 1. Token Storage

Current implementation uses PostgreSQL. For larger scale, consider:

- Redis cache for quick revocation lookup
- Hybrid approach: Redis for hot data, PostgreSQL for audit

### 2. Token Cleanup

- Implement background job to delete expired tokens
- Schedule cleanup during off-peak hours
- Use batch processing for large datasets

### 3. Load Balancing

- Stateless token validation
- Shared database for token revocation
- No server-specific session data

### 4. Caching Strategy

```typescript
// Implement with Redis for production
- Cache token revocation status
- TTL = token.expires_at
- Invalidate on revoke
```

## Migration Guide from Old System

### Before

```typescript
// Old: No refresh token management
async login() {
  const accessToken = generateAccessToken();
  // No revocation, no refresh capability
}
```

### After

```typescript
// New: Complete token lifecycle
async login() {
  const accessToken = generateAccessToken();
  const refreshToken = generateRefreshToken();
  const token = await tokenStorageRepository.saveToken();
  return { accessToken, refreshToken };
}

// Refresh when needed
async refresh(refreshToken) {
  const newAccessToken = generateNewAccessToken();
  // Optional: rotate refresh token too
  return { accessToken, refreshToken };
}

// Logout when done
async logout(context) {
  await revokeAllUserTokens(context);
}
```

## Best Practices

1. **Always use HTTPS** in production
2. **Store refresh tokens securely** (httpOnly cookies recommended)
3. **Rotate tokens periodically** using the renew endpoint
4. **Implement token rotation** on sensitive operations
5. **Monitor token usage** for suspicious patterns
6. **Clear expired tokens** regularly using background jobs
7. **Use short expiration** for access tokens (15m)
8. **Use longer expiration** for refresh tokens (3d)

## Future Enhancements

1. **OAuth2/OIDC Integration** - Support third-party providers
2. **Multi-Factor Authentication** - Add 2FA support
3. **Token History** - Audit trail of token changes
4. **Rate Limiting** - Prevent refresh token abuse
5. **Redis Caching** - Improve revocation lookup performance
6. **Webhook Support** - Notify on token revocation
7. **Device Management** - Track and manage devices per user
8. **Geo-blocking** - Detect and prevent suspicious access
