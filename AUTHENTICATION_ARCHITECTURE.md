# Authentication System - Architecture & Flow Diagrams

## System Architecture

```
┌─────────────────────────────────────────────────────────────────┐
│                      PRESENTATION LAYER                         │
│                                                                   │
│  POST /authentication/login                                      │
│  POST /authentication/refresh                                    │
│  POST /authentication/renew                                      │
│  POST /authentication/revoke                                     │
│  GET  /authentication/self                                       │
│                                                                   │
│              AuthController ← UseGuards(JwtGuard)                │
└─────────────────────────────────────────────────────────────────┘
                              ↓
┌─────────────────────────────────────────────────────────────────┐
│                   APPLICATION LAYER (Use Cases)                  │
│                                                                   │
│  LoginUseCase             RefreshTokenUseCase                    │
│  GetSelfUseCase           RevokeTokenUseCase                     │
│                           RenewTokenUseCase                      │
│                                                                   │
│  Business Logic & Orchestration                                  │
└─────────────────────────────────────────────────────────────────┘
                              ↓
┌─────────────────────────────────────────────────────────────────┐
│                  INFRASTRUCTURE LAYER (Repositories)             │
│                                                                   │
│  ┌─────────────────────┐      ┌──────────────────────────────┐  │
│  │  JwtRepository      │      │  TokenRepositoryImpl          │  │
│  ├─────────────────────┤      ├──────────────────────────────┤  │
│  │ generateAccessToken │      │ saveToken                    │  │
│  │ generateRefreshToken│      │ findByAccessToken            │  │
│  │ verifyAccessToken   │      │ findByRefreshToken           │  │
│  │ verifyRefreshToken  │      │ findBySessionId              │  │
│  │ hashToken           │      │ revokeToken                  │  │
│  └─────────────────────┘      │ revokeAllUserTokens          │  │
│                               │ updateToken                  │  │
│                               │ deleteExpiredTokens          │  │
│                               └──────────────────────────────┘  │
│                                                                   │
│  DTO Conversion Layer                                            │
│  LoginDto → RefreshTokenDto → RevokeTokenDto → TokenResponseDto │
└─────────────────────────────────────────────────────────────────┘
                              ↓
┌─────────────────────────────────────────────────────────────────┐
│                    DOMAIN LAYER (Entities)                       │
│                                                                   │
│  TokenModel              UserModel                               │
│  ├─ id                   ├─ id                                   │
│  ├─ user_id              ├─ email                                │
│  ├─ access_token         ├─ password                             │
│  ├─ refresh_token        ├─ first_name                           │
│  ├─ session_id           ├─ last_name                            │
│  ├─ is_revoked           ├─ is_active                            │
│  ├─ expires_at           └─ role_id                              │
│  ├─ refresh_expires_at   │                                       │
│  │                       │                                       │
│  ├─ isValid()            │ Business Rules & Validations         │
│  ├─ revoke()             │ • Token expiration checking          │
│  ├─ isAccessTokenExpired()                                       │
│  └─ isRefreshTokenValid()                                        │
└─────────────────────────────────────────────────────────────────┘
                              ↓
┌─────────────────────────────────────────────────────────────────┐
│                  PERSISTENCE LAYER (Database)                    │
│                                                                   │
│  PostgreSQL                                                      │
│  ┌──────────────────────────────────────────────────────────┐   │
│  │  token TABLE                                             │   │
│  ├──────────────────────────────────────────────────────────┤   │
│  │ id (UUID PK)                                             │   │
│  │ user_id (UUID FK → user)                                 │   │
│  │ access_token (TEXT)                                      │   │
│  │ refresh_token (TEXT)                                     │   │
│  │ session_id (UUID)                                        │   │
│  │ is_revoked (BOOLEAN, default: false)                     │   │
│  │ expires_at (TIMESTAMP)                                   │   │
│  │ refresh_expires_at (TIMESTAMP)                           │   │
│  │ created_at (TIMESTAMP)                                   │   │
│  │ updated_at (TIMESTAMP)                                   │   │
│  ├──────────────────────────────────────────────────────────┤   │
│  │ Indexes: user_id, session_id, access_token,              │   │
│  │          refresh_token, is_revoked, expires_at           │   │
│  └──────────────────────────────────────────────────────────┘   │
│                                                                   │
│  ┌──────────────────────────────────────────────────────────┐   │
│  │  user TABLE                                              │   │
│  ├──────────────────────────────────────────────────────────┤   │
│  │ id, email, password, first_name, last_name, ...         │   │
│  └──────────────────────────────────────────────────────────┘   │
└─────────────────────────────────────────────────────────────────┘
```

## Authentication Flow Sequences

### 1. Login Flow

```
Client                              Server                    Database
  │                                   │                           │
  ├──► POST /authentication/login     │                           │
  │    { email, password }            │                           │
  │                                   ├──► Hash & Verify Password │
  │                                   │                           │
  │                                   ├──► Generate Session ID    │
  │                                   │                           │
  │                                   ├──► Sign Access Token      │
  │                                   │    (exp: 15m)             │
  │                                   │                           │
  │                                   ├──► Sign Refresh Token     │
  │                                   │    (exp: 3d)              │
  │                                   │                           │
  │                                   ├──► Save Token Record      │
  │                                   │    to token table ────────┤
  │                                   │                           │
  │◄── 200 OK                         │                           │
  │    {                              │                           │
  │      access_token,                │                           │
  │      refresh_token,               │                           │
  │      expires_in: 900              │                           │
  │    }                              │                           │
```

### 2. Refresh Token Flow

```
Client                              Server                    Database
  │                                   │                           │
  ├──► POST /authentication/refresh   │                           │
  │    { refresh_token }              │                           │
  │                                   ├──► Verify Signature      │
  │                                   │    (check expiration)      │
  │                                   │                           │
  │                                   ├──► Query Token Record ───┤
  │                                   │◄──────────────────────────┤
  │                                   │    Check: not revoked     │
  │                                   │           not expired     │
  │                                   │                           │
  │                                   ├──► Generate New Access   │
  │                                   │    Token (15m)            │
  │                                   │                           │
  │                                   ├──► Generate New Refresh  │
  │                                   │    Token (3d) [optional]  │
  │                                   │                           │
  │                                   ├──► Save New Token ───────┤
  │                                   │    Revoke Old Token ──────┤
  │                                   │                           │
  │◄── 200 OK                         │                           │
  │    {                              │                           │
  │      access_token,                │                           │
  │      refresh_token (optional),    │                           │
  │      expires_in: 900              │                           │
  │    }                              │                           │
```

### 3. Token Renewal Flow (Security Rotation)

```
Client                              Server                    Database
  │                                   │                           │
  ├──► POST /authentication/renew     │                           │
  │    Authorization: Bearer token    │                           │
  │                                   ├──► Verify Token ────────┤
  │                                   │◄──────────────────────────┤
  │                                   │    Check: signature,      │
  │                                   │           expiration,     │
  │                                   │           revocation      │
  │                                   │                           │
  │                                   ├──► Generate New Tokens   │
  │                                   │    Access: 15m            │
  │                                   │    Refresh: 3d            │
  │                                   │                           │
  │                                   ├──► Save New Token ───────┤
  │                                   │    Revoke Current ────────┤
  │                                   │                           │
  │◄── 200 OK                         │                           │
  │    {                              │                           │
  │      access_token,                │                           │
  │      refresh_token,               │                           │
  │      expires_in: 900              │                           │
  │    }                              │                           │
```

### 4. Revoke Token Flow (Logout)

```
Client                              Server                    Database
  │                                   │                           │
  ├──► POST /authentication/revoke    │                           │
  │    Authorization: Bearer token    │                           │
  │    { revoke_all: true }           │                           │
  │                                   ├──► Validate User ───────┤
  │                                   │◄──────────────────────────┤
  │                                   │                           │
  │                                   ├──► Revoke All Tokens ───┤
  │                                   │    UPDATE token SET      │
  │                                   │    is_revoked = true ────┤
  │                                   │    WHERE user_id = ?     │
  │                                   │                           │
  │◄── 200 OK                         │                           │
  │    {                              │                           │
  │      message: "Logged out"        │                           │
  │    }                              │                           │
```

### 5. Protected Request Flow (with Revocation Check)

```
Client                              Server                    Database
  │                                   │                           │
  ├──► GET /protected-endpoint        │                           │
  │    Authorization: Bearer token    │                           │
  │                                   ├──► JwtGuard ────────────┤
  │                                   │    1. Extract token from  │
  │                                   │       Authorization header│
  │                                   │    2. Verify signature    │
  │                                   │       (using JWT_SECRET)  │
  │                                   │    3. Check expiration    │
  │                                   │                           │
  │                                   ├──► Query Token Status ──┤
  │                                   │◄──────────────────────────┤
  │                                   │    SELECT is_revoked      │
  │                                   │    FROM token            │
  │                                   │    WHERE session_id = ?   │
  │                                   │                           │
  │                                   ├──► If revoked:           │
  │                                   │    Throw Unauthorized    │
  │                                   │                           │
  │                                   ├──► If valid:             │
  │                                   │    Extract payload       │
  │                                   │    Query user in DB ────┤
  │                                   │◄──────────────────────────┤
  │                                   │                           │
  │◄── 200 OK                         │                           │
  │    { protected data }             │                           │
```

## Token State Machine

```
                    LOGIN
                     │
                     ▼
            ┌────────────────┐
            │  ACTIVE        │
            │                │
            │ ✓ Valid        │
            │ ✓ Not expired  │
            │ ✓ Not revoked  │
            └────────────────┘
                     │
        ┌────────────┼────────────┐
        │            │            │
   REVOKE      REFRESH      RENEW
        │            │            │
        ▼            ▼            ▼
    ┌─────┐    ┌─────────┐   ┌─────────┐
    │  REVOKED  │ REFRESHED   │ RENEWED │
    │           │            │         │
    │ ✗ Access  │ ✓ New token │ ✓ New  │
    │   Denied  │ issued      │ tokens  │
    └─────┘    └─────────┘   └─────────┘
        │            │            │
        ▼            ▼            ▼
    ┌──────────────────────────────────┐
    │  EXPIRED                         │
    │                                  │
    │  ✗ Must login again              │
    │  ✗ Cannot refresh                │
    └──────────────────────────────────┘
```

## Token Lifecycle Timeline

```
TIME                    EVENT                           DATABASE STATE
─────────────────────────────────────────────────────────────────────
T+0min      User Login
              • Access Token: Valid (15m remaining)
              • Refresh Token: Valid (3d remaining)    is_revoked: false

T+5min      Ongoing requests
              • Still valid                             is_revoked: false

T+10min     Refresh Initiated (optional rotation)
              • Old token: Revoked immediately         is_revoked: true
              • New token: Valid (15m remaining)       is_revoked: false
              • New refresh: Valid (3d remaining)

T+20min     Renew Token (security rotation)
              • Old token: Revoked                     is_revoked: true
              • New token: Valid (15m remaining)       is_revoked: false

T+30min     Logout (Revoke All)
              • All tokens: Revoked                    is_revoked: true
              • User must login again

T+50min     After Expiration (cleanup)
              • Tokens marked as expired               (deleted in cleanup)
              • Cleanup job removes old records
```

## Database Query Patterns

### Validate Token Revocation (O(1) with index)

```sql
SELECT is_revoked
FROM token
WHERE session_id = $1 AND user_id = $2
LIMIT 1;
```

### Find All Active Sessions

```sql
SELECT id, session_id, created_at, expires_at
FROM token
WHERE user_id = $1 AND is_revoked = false
ORDER BY created_at DESC;
```

### Revoke All Sessions

```sql
UPDATE token
SET is_revoked = true, updated_at = NOW()
WHERE user_id = $1;
```

### Cleanup Expired Tokens

```sql
DELETE FROM token
WHERE refresh_expires_at < NOW()
AND is_revoked = true;
```

## Error Handling Flow

```
┌─────────────────────────────────────┐
│  Request with Token                 │
└──────────────┬──────────────────────┘
               │
        ┌──────▼──────────────────────────────────┐
        │  Verify JWT Signature                   │
        └──────┬─────────────┬────────────────────┘
               │ INVALID     │ VALID
               │ SIGNATURE   │
        ┌──────▼──────┐  ┌───▼────────────────────────────┐
        │ 401          │  │  Check Token Expiration        │
        │ Unauthorized │  └──────┬──────────┬──────────────┘
        └──────────────┘         │ EXPIRED  │ VALID
                          ┌──────▼──────┐  ┌──▼──────────────────┐
                          │ 401          │  │  Query Database     │
                          │ Unauthorized │  │  for Revocation     │
                          └──────────────┘  └──┬────┬─────────────┘
                                              │    │ NOT FOUND
                                     REVOKED  │    │
                                    ┌─────────▼─┐  ┌▼──────────────┐
                                    │ 401       │  │  Query User   │
                                    │ Unauthorized   │  from DB       │
                                    └───────────┘  └──┬──────┬──────┘
                                                      │ OK   │ NOT FOUND
                                                 ┌────▼──┐┌─▼──────────┐
                                                 │ 200   ││ 401        │
                                                 │ OK    ││ Unauthorized
                                                 │ ✓     │└────────────┘
                                                 └───────┘
```

## Scalability Considerations

### Current Implementation (Single Server)

```
┌─────────┐
│  Client │
└────┬────┘
     │
┌────▼────────────┐
│  NestJS Server  │
│  (Single)       │
└────┬────────────┘
     │
┌────▼────────────┐
│  PostgreSQL DB  │
│  (Shared)       │
└─────────────────┘
```

### Horizontally Scaled (Multiple Servers)

```
┌─────────┐
│ Clients │
└────┬────┘
     │
  ┌──┴──┬───────┬────────┐
  │     │       │        │
┌─▼─┐ ┌─▼─┐ ┌──▼─┐ ┌──┬──────────────────┐
│S1 │ │S2 │ │S3 │ │LoadBalancer/API GW  │
└─┬─┘ └─┬─┘ └──┬─┘ └──┬──────────────────┘
  │     │      │      │
  └─────┴──────┴──────┘
        │
    ┌───▼──────────┐
    │ PostgreSQL   │
    │ (Shared DB)  │
    │ with Indexes │
    └──────────────┘
```

### With Redis Cache (For High Volume)

```
     Clients
        │
        ▼
   Load Balancer
    │   │   │
    ▼   ▼   ▼
   S1  S2  S3  (Stateless Servers)
    │   │   │
    └───┴───┘
        │
    ┌───┴──────┐
    │           │
    ▼           ▼
  Redis      PostgreSQL
  (Cache     (Audit &
   Hot       Archive)
   Data)
```
