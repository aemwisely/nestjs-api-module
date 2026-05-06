# Authentication System - Quick Reference & Deployment Checklist

## Quick API Reference

| Method | Endpoint                  | Auth | Description               |
| ------ | ------------------------- | ---- | ------------------------- |
| POST   | `/authentication/login`   | No   | Login with email/password |
| POST   | `/authentication/refresh` | No   | Get new access token      |
| POST   | `/authentication/renew`   | Yes  | Rotate tokens securely    |
| POST   | `/authentication/revoke`  | Yes  | Logout/revoke tokens      |
| GET    | `/authentication/self`    | Yes  | Get current user info     |

## Token Expiration Times

| Type          | Duration   | Use Case      |
| ------------- | ---------- | ------------- |
| Access Token  | 15 minutes | API requests  |
| Refresh Token | 3 days     | Token renewal |

## Request/Response Examples

### Login Request

```bash
POST /authentication/login
Content-Type: application/json

{
  "email": "user@example.com",
  "password": "password123"
}
```

### Login Response (200 OK)

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

### Error Response (401)

```json
{
  "message": "Incorrect password",
  "error": "Unauthorized",
  "statusCode": 401
}
```

## Environment Setup

### 1. Install Dependencies

```bash
npm install
```

### 2. Create .env File

```env
# Database
DB_HOST=localhost
DB_PORT=5432
DB_USERNAME=postgres
DB_PASSWORD=postgres
DB_NAME=api_db

# JWT
JWT_SECRET=your-super-secret-key-change-in-production-min-32-chars
JWT_REFRESH_SECRET=your-refresh-secret-key-change-in-production
JWT_EXPIRATION=15m
JWT_REFRESH_EXPIRATION=3d

# API
PORT=3000
NODE_ENV=development
```

### 3. Database Setup

```bash
# Create database
createdb api_db

# Run migrations
npm run migration:run

# Verify tables
psql api_db -c "\dt"
```

### 4. Start Development

```bash
npm run start:dev api-module
```

## File Structure

```
api-module/
├── apps/api-module/src/
│   └── auth/
│       ├── auth.controller.ts          (5 endpoints)
│       └── auth.module.ts
├── libs/
│   ├── common/
│   │   ├── src/
│   │   │   ├── authentication/
│   │   │   │   ├── jwt.guard.ts       (enhanced with revocation check)
│   │   │   │   └── jwt.stategy.ts
│   │   │   ├── decorator/
│   │   │   │   ├── jwt.decorator.ts   (extended IContext)
│   │   │   │   └── access-token.decorator.ts (NEW)
│   │   │   └── entities/
│   │   │       └── token.entity.ts    (NEW - TypeORM entity)
│   └── core/
│       ├── src/
│       │   ├── application/auth/
│       │   │   ├── login.use-case.ts
│       │   │   ├── get-self.use-case.ts
│       │   │   ├── refresh-token.use-case.ts (NEW)
│       │   │   ├── revoke-token.use-case.ts (NEW)
│       │   │   └── renew-token.use-case.ts (NEW)
│       │   ├── domain/token/
│       │   │   ├── entities/
│       │   │   │   └── token.entity.ts (NEW - domain entity)
│       │   │   └── index.ts
│       │   ├── infrastructure/
│       │   │   └── auth/
│       │   │       ├── jwt/
│       │   │       │   └── jwt.repository.ts (enhanced)
│       │   │       ├── token/
│       │   │       │   ├── token.repository.ts (NEW)
│       │   │       │   └── index.ts
│       │   │       └── dto/
│       │   │           ├── login.dto.ts
│       │   │           ├── refresh-token.dto.ts (NEW)
│       │   │           ├── revoke-token.dto.ts (NEW)
│       │   │           ├── token-response.dto.ts (NEW)
│       │   │           └── index.ts
│       │   ├── application/token/
│       │   │   └── ports/
│       │   │       ├── token.repository.ts
│       │   │       └── token-storage.repository.ts (NEW)
│       │   └── presentation/auth/
│       │       ├── auth.module.ts (enhanced)
│       │       └── jwt.module.ts (enhanced)
├── migrations/table/
│   └── 1777000000000-create-token-table.js (NEW)
├── AUTHENTICATION.md (NEW - Architecture docs)
├── AUTHENTICATION_SETUP.md (NEW - Setup & usage)
└── AUTHENTICATION_ARCHITECTURE.md (NEW - Diagrams)
```

## Implementation Timeline

| Phase   | Duration | Tasks                                         |
| ------- | -------- | --------------------------------------------- |
| Phase 1 | 30 min   | Create token domain entity and infrastructure |
| Phase 2 | 20 min   | Implement token storage repository            |
| Phase 3 | 25 min   | Create use cases (refresh, revoke, renew)     |
| Phase 4 | 15 min   | Create DTOs and decorators                    |
| Phase 5 | 10 min   | Update JWT strategy for revocation check      |
| Phase 6 | 15 min   | Update auth controller with new endpoints     |
| Phase 7 | 10 min   | Create database migration                     |
| Phase 8 | 10 min   | Create documentation                          |

## Deployment Checklist

### Pre-Deployment

- [ ] All tests passing
- [ ] Environment variables configured
- [ ] Database migration reviewed
- [ ] JWT secrets changed (not using defaults)
- [ ] HTTPS configured
- [ ] CORS settings verified
- [ ] Rate limiting configured

### Database

- [ ] Create backup
- [ ] Run migrations: `npm run migration:run`
- [ ] Verify token table created
- [ ] Verify indexes created
- [ ] Test query performance

### API Testing

- [ ] Test POST /login with valid credentials
- [ ] Test POST /login with invalid credentials
- [ ] Test POST /refresh with valid refresh token
- [ ] Test POST /refresh with invalid/expired token
- [ ] Test POST /renew with valid access token
- [ ] Test POST /revoke with revoke_all=true
- [ ] Test GET /self with valid token
- [ ] Test GET /self with revoked token
- [ ] Verify token expiration works

### Monitoring

- [ ] Set up logging for auth endpoints
- [ ] Monitor failed login attempts
- [ ] Monitor token refresh rate
- [ ] Alert on unusual revocation patterns
- [ ] Track response times

### Security

- [ ] Verify tokens in Authorization header (not URL)
- [ ] Verify HTTPS enforced
- [ ] Verify secure cookie settings (if using cookies)
- [ ] Verify CSRF protection (if applicable)
- [ ] Verify rate limiting on login

### Load Testing

- [ ] Test concurrent logins
- [ ] Test token refresh under load
- [ ] Test database query performance
- [ ] Identify bottlenecks
- [ ] Optimize indexes if needed

## Rollback Plan

If issues occur:

1. **Immediate**: Revert to previous version
2. **Database**: Keep token table (won't interfere with old system)
3. **Config**: Revert JWT environment variables
4. **Testing**: Verify all endpoints working

## Performance Metrics

### Expected Performance

- Login: < 200ms
- Token refresh: < 50ms
- Token revocation check: < 20ms (with indexes)
- Concurrent users: 1000+

### Monitoring

```sql
-- Check average query time
SELECT mean_exec_time, calls
FROM pg_stat_statements
WHERE query LIKE '%token%'
ORDER BY mean_exec_time DESC;

-- Check index usage
SELECT schemaname, tablename, indexname, idx_scan
FROM pg_stat_user_indexes
WHERE tablename = 'token'
ORDER BY idx_scan DESC;

-- Monitor token table size
SELECT
  schemaname,
  tablename,
  pg_size_pretty(pg_total_relation_size(schemaname||'.'||tablename)) AS size
FROM pg_tables
WHERE tablename = 'token';
```

## Troubleshooting Guide

### Login Fails with "User not found"

- **Cause**: User doesn't exist or wrong email
- **Solution**: Verify user exists in database
- **Query**: `SELECT * FROM "user" WHERE email = 'user@example.com';`

### Login Fails with "Incorrect password"

- **Cause**: Wrong password
- **Solution**: Verify password hash matches
- **Debug**: Check bcrypt comparison in code

### Refresh Returns "Invalid refresh token"

- **Cause**: Token signature invalid or expired
- **Solution**: User must login again
- **Check**: Token expiration time

### Protected Endpoint Returns 401

- **Possible Causes**:
  1. Token expired → User must refresh
  2. Token revoked → User must login again
  3. Wrong secret key → Verify JWT_SECRET
  4. Invalid format → Must be "Bearer <token>"

- **Debug Steps**:

```bash
# Check if token is revoked
SELECT * FROM token
WHERE access_token = 'token_value'
AND is_revoked = true;

# Check user exists
SELECT * FROM "user" WHERE id = 'user_id';

# Verify JWT secret
echo $JWT_SECRET
```

### Database Connection Fails

- **Cause**: DB not running or wrong credentials
- **Solution**: Check DB_HOST, DB_PORT, DB_USERNAME, DB_PASSWORD
- **Test**: `psql -h localhost -U postgres -d api_db`

### Migration Fails

- **Cause**: Token table already exists or migration conflict
- **Solution**: Check existing tables
- **Command**: `npm run migration:show`

## Support & Documentation

- **Architecture**: See [AUTHENTICATION_ARCHITECTURE.md](./AUTHENTICATION_ARCHITECTURE.md)
- **Setup Guide**: See [AUTHENTICATION_SETUP.md](./AUTHENTICATION_SETUP.md)
- **Full Documentation**: See [AUTHENTICATION.md](./AUTHENTICATION.md)

## Future Improvements

### Phase 2 (Optional)

- [ ] Redis integration for token revocation cache
- [ ] Rate limiting middleware
- [ ] Token history/audit trail
- [ ] Device management (track devices per user)
- [ ] Geo-blocking (detect suspicious locations)
- [ ] Multi-factor authentication (2FA)

### Phase 3 (Advanced)

- [ ] OAuth2/OIDC support
- [ ] Social login integration
- [ ] Passwordless authentication
- [ ] WebAuthn/FIDO2 support
- [ ] Risk assessment engine

## Contact & Escalation

For issues contact:

- Senior Backend Developer Team
- Infrastructure Team (for database issues)
- Security Team (for vulnerabilities)

---

**Last Updated**: May 2026
**Version**: 1.0
**Status**: Production Ready
