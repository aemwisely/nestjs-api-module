# Error Message

Custom exceptions use the existing payload structure:

```json
{
  "error_code": "E{module}X{type}F{field}",
  "error_message": "Readable error message",
  "data": {}
}
```

The global `HttpExceptionFilter` wraps that payload into the public API response:

```json
{
  "req_id": "request-id",
  "timestamp": "2026-05-06T00:00:00.000Z",
  "success": false,
  "status": 401,
  "error_code": "E02X300F01",
  "error_message": "Token is invalid or expired."
}
```

## Code Structure

| Segment | Description | Source |
| --- | --- | --- |
| `E` | Error prefix | Fixed value |
| `{module}` | Bounded context/module code | `EModule` |
| `{type}` | Error type code | `ErrorType` |
| `{field}` | Field or operation code | Module field enum |

## Modules

| Code | Module |
| --- | --- |
| `00` | Auth |
| `01` | User |
| `02` | Token |

## Error Types

| Code | Type | Typical HTTP Status |
| --- | --- | --- |
| `000` | Not found | `404` |
| `100` | Validation | `400` |
| `200` | Duplicate | `409` |
| `300` | Unauthorized | `401` |
| `400` | Server error | `500` |
| `500` | Forbidden | `403` |
| `600` | Bad request | `400` |

## Auth Errors

| Error Code | Exception | HTTP Status | Message |
| --- | --- | --- | --- |
| `E00X100F03` | `IncorrectPasswordException` | `400` | Invalid request. Please check your input and try again. |

## User Errors

| Error Code | Exception | HTTP Status | Message |
| --- | --- | --- | --- |
| `E01X000F01` | `UserIdNotFoundException` | `404` | The requested resource was not found. |
| `E01X000F02` | `UserEmailNotFoundException` | `404` | The requested resource was not found. |
| `E01X300F00` | `UserUnauthorizedException` | `401` | Unauthorized access. Please login and try again. |

## Token Errors

| Error Code | Exception | HTTP Status | Message |
| --- | --- | --- | --- |
| `E02X300F01` | `AccessTokenInvalidException` | `401` | Token is invalid or expired. |
| `E02X300F02` | `RefreshTokenInvalidException` | `401` | Token is invalid or expired. |
| `E02X300F03` | `TokenNotFoundException` | `401` | Token was not found or has been revoked. |
| `E02X500F04` | `TokenOwnerMismatchException` | `403` | Token does not belong to the current user. |
| `E02X400F05` | `TokenOperationFailedException` | `500` | Token operation failed. |
| `E02X300F06` | `TokenExpiredOrRevokedException` | `401` | Token is expired or revoked. |
| `E02X300F07` | `TokenAlreadyUsedException` | `401` | Token has already been used. |

## Default Errors

| Error Code | Exception | HTTP Status | Message |
| --- | --- | --- | --- |
| `E{module}X600F00` | `BadRequestDefault` | `400` | Invalid request. Please check your input and try again. |

## Notes

- Application/use-case code should throw a concrete exception class instead of passing custom string messages into generic exceptions.
- Infrastructure errors should be wrapped at the application boundary with a concrete operation exception, for example `TokenOperationFailedException`.
- Token-related authentication failures intentionally return `401` unless ownership is the problem, which returns `403`.
