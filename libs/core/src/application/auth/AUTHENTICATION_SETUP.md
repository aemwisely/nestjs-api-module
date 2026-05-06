# Authentication System - Setup & Usage Guide

## Quick Start

### 1. Run Database Migration

```bash
npm run migration:run
```

This creates the `token` table with proper indexes and foreign key constraints.

### 2. Environment Configuration

Add to your `.env` file:

```env
# JWT Configuration
JWT_SECRET=your-super-secret-key-min-32-chars
JWT_REFRESH_SECRET=your-refresh-secret-key-min-32-chars
JWT_EXPIRATION=15m
JWT_REFRESH_EXPIRATION=3d
```

### 3. Start Application

```bash
npm run start:dev api-module
```

## API Usage Examples

### 1. User Login

Obtain initial access and refresh tokens:

```bash
curl -X POST http://localhost:3000/authentication/login \
  -H "Content-Type: application/json" \
  -d '{
    "email": "user@example.com",
    "password": "password123"
  }'
```

**Response**:

```json
{
  "result": {
    "access_token": "eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9...",
    "refresh_token": "eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9...",
    "token_type": "Bearer",
    "expires_in": 900
  }
}
```

**Token Lifespan**:

- Access Token: 15 minutes
- Refresh Token: 3 days

### 2. Refresh Access Token

Get a new access token before expiration:

```bash
curl -X POST http://localhost:3000/authentication/refresh \
  -H "Content-Type: application/json" \
  -d '{
    "refresh_token": "eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9...",
    "renew_refresh_token": true
  }'
```

**Parameters**:

- `refresh_token` (required): The refresh token from login or previous refresh
- `renew_refresh_token` (optional, default: true): If true, returns new refresh token (rotation)

**Response**:

```json
{
  "result": {
    "access_token": "eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9...",
    "refresh_token": "eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9...",
    "token_type": "Bearer",
    "expires_in": 900
  }
}
```

### 3. Renew Token (Rotation)

Manually rotate tokens for enhanced security:

```bash
curl -X POST http://localhost:3000/authentication/renew \
  -H "Authorization: Bearer eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9..." \
  -H "Content-Type: application/json"
```

**When to use**:

- After sensitive operations (password change, permission update)
- Periodic rotation for security (e.g., every 2 hours)
- After security incident detection

### 4. Revoke Token (Logout)

**Option 1: Logout from current device**

```bash
curl -X POST http://localhost:3000/authentication/revoke \
  -H "Authorization: Bearer eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9..." \
  -H "Content-Type: application/json" \
  -d '{}'
```

**Option 2: Logout from specific device**

```bash
curl -X POST http://localhost:3000/authentication/revoke \
  -H "Authorization: Bearer eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9..." \
  -H "Content-Type: application/json" \
  -d '{
    "token_id": "550e8400-e29b-41d4-a716-446655440000"
  }'
```

**Option 3: Logout from all devices**

```bash
curl -X POST http://localhost:3000/authentication/revoke \
  -H "Authorization: Bearer eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9..." \
  -H "Content-Type: application/json" \
  -d '{
    "revoke_all": true
  }'
```

**Response**:

```json
{
  "result": {
    "message": "All tokens revoked successfully"
  }
}
```

### 5. Get Current User

Fetch current authenticated user information:

```bash
curl -X GET http://localhost:3000/authentication/self \
  -H "Authorization: Bearer eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9..."
```

**Response**:

```json
{
  "result": {
    "id": "550e8400-e29b-41d4-a716-446655440000",
    "email": "user@example.com",
    "first_name": "John",
    "last_name": "Doe",
    "is_active": true,
    "role_id": "550e8400-e29b-41d4-a716-446655440001"
  }
}
```

## Frontend Implementation

### React Example

```typescript
import axios from 'axios';

const API_BASE_URL = 'http://localhost:3000';

class AuthService {
  private accessToken: string | null = null;
  private refreshToken: string | null = null;

  // Login
  async login(email: string, password: string) {
    const response = await axios.post(`${API_BASE_URL}/authentication/login`, {
      email,
      password,
    });

    this.accessToken = response.data.result.access_token;
    this.refreshToken = response.data.result.refresh_token;

    // Store tokens (use httpOnly cookies in production)
    localStorage.setItem('accessToken', this.accessToken);
    localStorage.setItem('refreshToken', this.refreshToken);

    return response.data.result;
  }

  // Refresh token automatically
  async refreshAccessToken() {
    try {
      const response = await axios.post(`${API_BASE_URL}/authentication/refresh`, {
        refresh_token: this.refreshToken,
      });

      this.accessToken = response.data.result.access_token;
      this.refreshToken = response.data.result.refresh_token;

      localStorage.setItem('accessToken', this.accessToken);
      localStorage.setItem('refreshToken', this.refreshToken);

      return this.accessToken;
    } catch (error) {
      // Refresh failed, redirect to login
      this.logout();
      throw error;
    }
  }

  // Logout
  async logout() {
    try {
      await axios.post(
        `${API_BASE_URL}/authentication/revoke`,
        { revoke_all: true },
        {
          headers: {
            Authorization: `Bearer ${this.accessToken}`,
          },
        },
      );
    } finally {
      this.accessToken = null;
      this.refreshToken = null;
      localStorage.removeItem('accessToken');
      localStorage.removeItem('refreshToken');
    }
  }

  // Get current user
  async getCurrentUser() {
    const response = await axios.get(`${API_BASE_URL}/authentication/self`, {
      headers: {
        Authorization: `Bearer ${this.accessToken}`,
      },
    });
    return response.data.result;
  }

  // Setup axios interceptor for auto-refresh
  setupInterceptor() {
    axios.interceptors.response.use(
      (response) => response,
      async (error) => {
        const originalRequest = error.config;

        if (error.response?.status === 401 && !originalRequest._retry) {
          originalRequest._retry = true;

          try {
            const newAccessToken = await this.refreshAccessToken();
            originalRequest.headers.Authorization = `Bearer ${newAccessToken}`;
            return axios(originalRequest);
          } catch (refreshError) {
            return Promise.reject(refreshError);
          }
        }

        return Promise.reject(error);
      },
    );
  }
}

export const authService = new AuthService();
authService.setupInterceptor();
```

## Mobile Implementation (React Native/Flutter)

### Token Storage Best Practices

**Secure Storage** (instead of AsyncStorage):

```typescript
// React Native with react-native-secure-storage
import { SecureStorage } from 'react-native-secure-storage';

// Save tokens
await SecureStorage.setItem('accessToken', token);
await SecureStorage.setItem('refreshToken', refreshToken);

// Retrieve tokens
const token = await SecureStorage.getItem('accessToken');

// Clear tokens on logout
await SecureStorage.removeItem('accessToken');
await SecureStorage.removeItem('refreshToken');
```

## Troubleshooting

### Issue: "Invalid or expired refresh token"

**Cause**: Refresh token has expired or been revoked  
**Solution**: User must login again

### Issue: "Token has been revoked"

**Cause**: Token was revoked (logout from all devices)  
**Solution**: Refresh page and login again

### Issue: "Unauthorized" on protected endpoints

**Possible causes**:

1. Access token expired → Use refresh endpoint
2. Token format incorrect → Must include "Bearer " prefix
3. Wrong secret key → Check JWT_SECRET in env
4. User account inactive → Contact admin

## Performance Tips

1. **Proactive Refresh**: Refresh token 1-2 minutes before expiration
2. **Background Refresh**: Refresh token in background before user needs it
3. **Batch Operations**: Group API calls to reduce refresh calls
4. **Cache User Data**: Cache user info, refresh only when needed
5. **Cleanup**: Implement background job to delete expired tokens

## Security Checklist

- [ ] Using HTTPS in production
- [ ] Environment variables for secrets (not hardcoded)
- [ ] Refresh tokens stored securely (httpOnly cookies)
- [ ] Implementing token rotation on sensitive operations
- [ ] Monitoring failed login attempts
- [ ] Regular token expiration (access: 15m, refresh: 3d)
- [ ] Immediate revocation on logout
- [ ] CORS configured properly
- [ ] Rate limiting on login/refresh endpoints
- [ ] Audit logging of token operations

## Database Queries

### Find all active sessions for a user

```sql
SELECT id, session_id, access_token, created_at, expires_at
FROM token
WHERE user_id = :userId AND is_revoked = false
ORDER BY created_at DESC;
```

### Find revoked tokens

```sql
SELECT * FROM token
WHERE is_revoked = true
ORDER BY updated_at DESC
LIMIT 100;
```

### Cleanup expired tokens

```sql
DELETE FROM token
WHERE refresh_expires_at < NOW()
AND created_at < NOW() - INTERVAL '30 days';
```

## Monitoring & Analytics

### Key Metrics to Track

- Token refresh rate
- Token revocation rate
- Average session duration
- Failed refresh attempts
- Concurrent sessions per user

### Example Query for Analytics

```sql
SELECT
  DATE(created_at) as date,
  COUNT(DISTINCT user_id) as unique_users,
  COUNT(*) as total_tokens,
  SUM(CASE WHEN is_revoked THEN 1 ELSE 0 END) as revoked_tokens
FROM token
GROUP BY DATE(created_at)
ORDER BY date DESC;
```
