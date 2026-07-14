# DevPulse AI MVP REST API Design

## Overview

This document defines the REST API for the DevPulse AI hackathon MVP.

The API is intentionally simple, versioned, and authentication-free. All endpoints operate on a single seeded Demo User resolved server-side through `DEMO_USER_ID` or a stable `demoKey`. Clients must not send `userId`.

The MVP API supports:

- Dashboard summaries
- Daily wellness entry CRUD
- AI coach chat
- Insight snapshots

Backend services calculate recovery score, burnout risk score, risk level, trends, and rule-based recommendations deterministically. OpenAI is used only to explain backend-calculated results, generate coaching responses, and generate insight text.

## API Principles

- **MVP only:** Do not add authentication, external integrations, admin APIs, teams, or notifications.
- **Demo User scoped:** The backend resolves the Demo User internally for every request.
- **RESTful and predictable:** Use resource-oriented URLs and standard HTTP methods.
- **Consistent envelopes:** Return standard success and error response shapes.
- **Deterministic scoring:** Risk and recovery scores are never calculated by OpenAI.
- **Minimal AI context:** Send summarized metrics and computed scores to OpenAI, not full raw history by default.
- **No medical claims:** API responses that include AI-generated text must remain coaching-oriented and non-diagnostic.

## Versioning

All MVP endpoints should be served under:

```text
/api/v1
```

Versioning recommendations:

- Keep `/api/v1` stable for the hackathon MVP.
- Add `/api/v2` only for breaking changes.
- Prefer additive changes within `/api/v1`, such as adding optional response fields.
- Include deprecated fields only when needed for frontend compatibility.

## Health Check Endpoint

## `GET /api/v1/health`

### Purpose

Provides a lightweight health check endpoint for deployment platforms such as Render, Railway, Docker, uptime monitors, and local development.

### Characteristics

- Deterministic
- Does not call OpenAI
- Returns HTTP `200 OK` when the API process is healthy
- Should not require authentication, database access, or external provider availability

### Request Body

None.

### Response Body

```json
{
  "success": true,
  "data": {
    "status": "ok",
    "service": "DevPulse AI API",
    "version": "v1"
  }
}
```

### Error Responses

- `500 INTERNAL_ERROR` only if the API process cannot handle the request.

## Standard Response Formats

### Success Response

```json
{
  "success": true,
  "data": {},
  "meta": {}
}
```

Rules:

- `success` is always `true`.
- `data` contains the endpoint payload.
- `meta` is optional and should be used for pagination, periods, generated flags, or diagnostic-safe metadata.

### Error Response

```json
{
  "success": false,
  "error": {
    "code": "VALIDATION_ERROR",
    "message": "One or more fields are invalid.",
    "details": {
      "sleepHours": "Must be between 0 and 24."
    }
  }
}
```

Rules:

- `success` is always `false`.
- `error.code` is stable and machine-readable.
- `error.message` is human-readable.
- `error.details` is optional and may contain field-level validation details.
- Do not expose internal stack traces, Prisma errors, OpenAI provider traces, API keys, or prompts.

## Common Error Responses

| HTTP Status | Error Code | When To Use |
| --- | --- | --- |
| `400 Bad Request` | `BAD_REQUEST` | Invalid JSON, malformed query parameters, or invalid date format. |
| `404 Not Found` | `NOT_FOUND` | Requested entry, insight, or conversation does not exist for the Demo User. |
| `409 Conflict` | `ENTRY_DATE_CONFLICT` | A wellness entry already exists for the same Demo User and date. |
| `422 Unprocessable Entity` | `VALIDATION_ERROR` | Request body is valid JSON but fails business validation. |
| `429 Too Many Requests` | `RATE_LIMITED` | Client exceeds rate limit, especially for AI endpoints. |
| `500 Internal Server Error` | `INTERNAL_ERROR` | Unexpected server failure. |
| `503 Service Unavailable` | `AI_UNAVAILABLE` | OpenAI is unavailable and no safe fallback can be produced. |

## Shared Types and Enums

### `RiskLevel`

```text
LOW | MODERATE | HIGH | CRITICAL
```

### `InsightPeriod`

```text
DAILY | WEEKLY
```

### `AiMessageRole`

```text
USER | ASSISTANT | SYSTEM
```

Persisted MVP chat responses should normally expose only `USER` and `ASSISTANT` messages.

### `WellnessEntry`

```json
{
  "id": "entry_123",
  "entryDate": "2026-07-14",
  "sleepHours": 6.5,
  "sleepQuality": 3,
  "steps": 4200,
  "exerciseMinutes": 20,
  "moodScore": 3,
  "energyScore": 2,
  "workHours": 9.5,
  "codingMinutes": 360,
  "breakCount": 3,
  "notes": "Late debugging session before a deadline.",
  "createdAt": "2026-07-14T09:00:00.000Z",
  "updatedAt": "2026-07-14T09:00:00.000Z"
}
```

### `InsightSnapshot`

```json
{
  "id": "insight_123",
  "period": "DAILY",
  "periodStart": "2026-07-14",
  "periodEnd": "2026-07-14",
  "recoveryScore": 62,
  "burnoutRiskScore": 48,
  "riskLevel": "MODERATE",
  "summary": "Your recovery looks slightly strained today after a long coding block and below-target sleep.",
  "recommendedAction": "Take two short movement breaks and avoid extending work late tonight.",
  "createdAt": "2026-07-14T09:05:00.000Z"
}
```

## Demo User Assumption

The MVP uses one seeded Demo User.

Implementation expectations:

- The backend resolves the Demo User internally.
- The frontend never sends `userId`.
- All database reads and writes are scoped to the Demo User.
- When authentication is added later, Demo User resolution can be replaced by authenticated `userId` resolution without changing most resource shapes.

## Dashboard APIs

## `GET /api/v1/dashboard/summary`

### Purpose

Returns the current dashboard state for the Demo User, including the latest wellness entry, deterministic scores, trend summaries, rule-based recommendations, and the latest insight snapshot if one exists.

### Deterministic vs OpenAI

- Deterministic: yes
- Calls OpenAI: no

### Request Body

None.

### Query Parameters

| Parameter | Type | Required | Notes |
| --- | --- | --- | --- |
| `windowDays` | `number` | No | Optional trend window. Defaults to `7`. Valid values: `7` or `30`. |

### Response Body

```json
{
  "success": true,
  "data": {
    "demoUser": {
      "displayName": "Demo Developer",
      "role": "SOFTWARE_ENGINEER"
    },
    "latestEntry": {
      "id": "entry_123",
      "entryDate": "2026-07-14",
      "sleepHours": 6.5,
      "sleepQuality": 3,
      "steps": 4200,
      "exerciseMinutes": 20,
      "moodScore": 3,
      "energyScore": 2,
      "workHours": 9.5,
      "codingMinutes": 360,
      "breakCount": 3,
      "notes": "Late debugging session before a deadline.",
      "createdAt": "2026-07-14T09:00:00.000Z",
      "updatedAt": "2026-07-14T09:00:00.000Z"
    },
    "scores": {
      "recoveryScore": 62,
      "burnoutRiskScore": 48,
      "riskLevel": "MODERATE"
    },
    "summaries": {
      "sleep": {
        "averageHours": 6.4,
        "targetHours": 7.5,
        "trend": "DOWN"
      },
      "activity": {
        "averageSteps": 5100,
        "targetSteps": 8000,
        "trend": "FLAT"
      },
      "workload": {
        "averageWorkHours": 8.8,
        "averageCodingMinutes": 330,
        "trend": "UP"
      },
      "moodEnergy": {
        "averageMoodScore": 3.2,
        "averageEnergyScore": 2.9,
        "trend": "DOWN"
      }
    },
    "recommendations": [
      "Take two short movement breaks today.",
      "Avoid extending work late tonight after below-target sleep."
    ],
    "latestInsight": {
      "id": "insight_123",
      "period": "DAILY",
      "summary": "Your recovery looks slightly strained today after a long coding block and below-target sleep.",
      "recommendedAction": "Take two short movement breaks and avoid extending work late tonight.",
      "createdAt": "2026-07-14T09:05:00.000Z"
    }
  },
  "meta": {
    "windowDays": 7,
    "computedAt": "2026-07-14T09:10:00.000Z"
  }
}
```

### Validation Rules

- `windowDays` must be `7` or `30` if provided.
- If the Demo User has no entries, return empty summaries with scores calculated from missing-data defaults.

### Error Responses

- `400 BAD_REQUEST` for invalid query parameters.
- `500 INTERNAL_ERROR` for unexpected failures.

## Daily Wellness Entry APIs

## `GET /api/v1/wellness/entries`

### Purpose

Lists daily wellness entries for the Demo User, optionally filtered by date range.

### Deterministic vs OpenAI

- Deterministic: yes
- Calls OpenAI: no

### Request Body

None.

### Query Parameters

| Parameter | Type | Required | Notes |
| --- | --- | --- | --- |
| `from` | `string` | No | Inclusive start date in `YYYY-MM-DD` format. |
| `to` | `string` | No | Inclusive end date in `YYYY-MM-DD` format. |
| `limit` | `number` | No | Defaults to `30`. Maximum `100`. |

### Response Body

```json
{
  "success": true,
  "data": {
    "entries": [
      {
        "id": "entry_123",
        "entryDate": "2026-07-14",
        "sleepHours": 6.5,
        "sleepQuality": 3,
        "steps": 4200,
        "exerciseMinutes": 20,
        "moodScore": 3,
        "energyScore": 2,
        "workHours": 9.5,
        "codingMinutes": 360,
        "breakCount": 3,
        "notes": "Late debugging session before a deadline.",
        "createdAt": "2026-07-14T09:00:00.000Z",
        "updatedAt": "2026-07-14T09:00:00.000Z"
      }
    ]
  },
  "meta": {
    "count": 1,
    "from": "2026-07-08",
    "to": "2026-07-14"
  }
}
```

### Validation Rules

- `from` and `to` must be valid `YYYY-MM-DD` dates when provided.
- `from` must be less than or equal to `to`.
- `limit` must be between `1` and `100`.

### Error Responses

- `400 BAD_REQUEST` for invalid dates or limit.
- `500 INTERNAL_ERROR` for unexpected failures.

## `GET /api/v1/wellness/entries/:id`

### Purpose

Fetches one wellness entry for the Demo User.

### Deterministic vs OpenAI

- Deterministic: yes
- Calls OpenAI: no

### Request Body

None.

### Response Body

```json
{
  "success": true,
  "data": {
    "entry": {
      "id": "entry_123",
      "entryDate": "2026-07-14",
      "sleepHours": 6.5,
      "sleepQuality": 3,
      "steps": 4200,
      "exerciseMinutes": 20,
      "moodScore": 3,
      "energyScore": 2,
      "workHours": 9.5,
      "codingMinutes": 360,
      "breakCount": 3,
      "notes": "Late debugging session before a deadline.",
      "createdAt": "2026-07-14T09:00:00.000Z",
      "updatedAt": "2026-07-14T09:00:00.000Z"
    }
  }
}
```

### Validation Rules

- `id` must be present.
- Entry lookup must be scoped to the Demo User.

### Error Responses

- `404 NOT_FOUND` if the entry does not exist for the Demo User.
- `500 INTERNAL_ERROR` for unexpected failures.

## `POST /api/v1/wellness/entries`

### Purpose

Creates a daily wellness entry for the Demo User.

### Deterministic vs OpenAI

- Deterministic: yes
- Calls OpenAI: no

### Request Body

```json
{
  "entryDate": "2026-07-14",
  "sleepHours": 6.5,
  "sleepQuality": 3,
  "steps": 4200,
  "exerciseMinutes": 20,
  "moodScore": 3,
  "energyScore": 2,
  "workHours": 9.5,
  "codingMinutes": 360,
  "breakCount": 3,
  "notes": "Late debugging session before a deadline."
}
```

### Response Body

```json
{
  "success": true,
  "data": {
    "entry": {
      "id": "entry_123",
      "entryDate": "2026-07-14",
      "sleepHours": 6.5,
      "sleepQuality": 3,
      "steps": 4200,
      "exerciseMinutes": 20,
      "moodScore": 3,
      "energyScore": 2,
      "workHours": 9.5,
      "codingMinutes": 360,
      "breakCount": 3,
      "notes": "Late debugging session before a deadline.",
      "createdAt": "2026-07-14T09:00:00.000Z",
      "updatedAt": "2026-07-14T09:00:00.000Z"
    }
  }
}
```

### Validation Rules

- `entryDate` is required and must be `YYYY-MM-DD`.
- One entry is allowed per Demo User per date.
- `sleepHours` and `workHours` must be between `0` and `24` when provided.
- `sleepQuality`, `moodScore`, and `energyScore` must be integers from `1` to `5` when provided.
- `steps`, `exerciseMinutes`, `codingMinutes`, and `breakCount` must be non-negative integers when provided.
- `notes` is optional and should be length-limited.

### Error Responses

- `400 BAD_REQUEST` for malformed JSON or invalid date format.
- `409 ENTRY_DATE_CONFLICT` if an entry already exists for the date.
- `422 VALIDATION_ERROR` for invalid field values.
- `500 INTERNAL_ERROR` for unexpected failures.

## `PATCH /api/v1/wellness/entries/:id`

### Purpose

Partially updates an existing daily wellness entry for the Demo User using HTTP PATCH semantics.

### Deterministic vs OpenAI

- Deterministic: yes
- Calls OpenAI: no

### Request Body

The request body accepts the same fields as `POST /api/v1/wellness/entries`. Only provided fields are updated; omitted fields remain unchanged.

```json
{
  "sleepHours": 7,
  "sleepQuality": 4,
  "steps": 6800,
  "exerciseMinutes": 30,
  "energyScore": 4,
  "notes": "Felt better after a walk."
}
```

### Response Body

```json
{
  "success": true,
  "data": {
    "entry": {
      "id": "entry_123",
      "entryDate": "2026-07-14",
      "sleepHours": 7,
      "sleepQuality": 4,
      "steps": 6800,
      "exerciseMinutes": 30,
      "moodScore": 3,
      "energyScore": 4,
      "workHours": 9.5,
      "codingMinutes": 360,
      "breakCount": 3,
      "notes": "Felt better after a walk.",
      "createdAt": "2026-07-14T09:00:00.000Z",
      "updatedAt": "2026-07-14T10:00:00.000Z"
    }
  }
}
```

### Validation Rules

- `id` must be present.
- Entry lookup must be scoped to the Demo User.
- If `entryDate` is updated, it must remain unique for the Demo User.
- Field validation matches create-entry validation.

### Error Responses

- `400 BAD_REQUEST` for malformed JSON or invalid date format.
- `404 NOT_FOUND` if the entry does not exist for the Demo User.
- `409 ENTRY_DATE_CONFLICT` if the updated date conflicts with another entry.
- `422 VALIDATION_ERROR` for invalid field values.
- `500 INTERNAL_ERROR` for unexpected failures.

## `DELETE /api/v1/wellness/entries/:id`

### Purpose

Deletes a daily wellness entry for the Demo User.

### Deterministic vs OpenAI

- Deterministic: yes
- Calls OpenAI: no

### Request Body

None.

### Response Body

Return `204 No Content` with no response body.

### Validation Rules

- `id` must be present.
- Entry lookup must be scoped to the Demo User.

### Error Responses

- `404 NOT_FOUND` if the entry does not exist for the Demo User.
- `500 INTERNAL_ERROR` for unexpected failures.

## AI Coach Chat APIs

## `POST /api/v1/ai/chat`

### Purpose

Sends a user question to the AI coach. The backend loads summarized Demo User metrics, calculates deterministic scores, builds a compact AI context, calls OpenAI, stores the conversation turn, and returns the assistant response.

### Deterministic vs OpenAI

- Deterministic: partially, because context and scores are computed by backend services first.
- Calls OpenAI: yes

### Request Body

```json
{
  "message": "Why am I feeling tired this week?",
  "conversationId": "conv_123"
}
```

`conversationId` is optional. If omitted, the backend creates a new conversation.

### Response Body

```json
{
  "success": true,
  "data": {
    "conversationId": "conv_123",
    "userMessage": {
      "id": "msg_user_123",
      "role": "USER",
      "content": "Why am I feeling tired this week?",
      "createdAt": "2026-07-14T09:20:00.000Z"
    },
    "assistantMessage": {
      "id": "msg_ai_123",
      "role": "ASSISTANT",
      "content": "Your recent tiredness appears connected to below-target sleep and longer coding sessions. Your burnout risk score is moderate, so today is a good day to reduce late work and add short recovery breaks.",
      "createdAt": "2026-07-14T09:20:05.000Z"
    },
    "contextMetadata": {
      "windowDays": 7,
      "recoveryScore": 62,
      "burnoutRiskScore": 48,
      "riskLevel": "MODERATE",
      "usedRawHistory": false
    }
  },
  "meta": {
    "openAiCalled": true,
    "fallbackUsed": false
  }
}
```

### Validation Rules

- `message` is required.
- `message` must be a non-empty string.
- `message` should be length-limited, recommended maximum `1000` characters.
- `conversationId` is optional.
- If `conversationId` is provided, it must exist for the Demo User.
- The backend should send summarized metrics and computed scores to OpenAI by default.

### Error Responses

- `400 BAD_REQUEST` for malformed JSON.
- `404 NOT_FOUND` if `conversationId` does not exist for the Demo User.
- `422 VALIDATION_ERROR` for an empty or too-long message.
- `429 RATE_LIMITED` if AI chat rate limits are exceeded.
- `503 AI_UNAVAILABLE` if OpenAI fails and no safe fallback can be produced.
- `500 INTERNAL_ERROR` for unexpected failures.

## `GET /api/v1/ai/conversations/:id`

### Purpose

Fetches one AI coach conversation and its messages for the Demo User.

### Deterministic vs OpenAI

- Deterministic: yes
- Calls OpenAI: no

### Request Body

None.

### Response Body

```json
{
  "success": true,
  "data": {
    "conversation": {
      "id": "conv_123",
      "title": "Weekly fatigue check",
      "createdAt": "2026-07-14T09:20:00.000Z",
      "updatedAt": "2026-07-14T09:20:05.000Z",
      "messages": [
        {
          "id": "msg_user_123",
          "role": "USER",
          "content": "Why am I feeling tired this week?",
          "createdAt": "2026-07-14T09:20:00.000Z"
        },
        {
          "id": "msg_ai_123",
          "role": "ASSISTANT",
          "content": "Your recent tiredness appears connected to below-target sleep and longer coding sessions.",
          "createdAt": "2026-07-14T09:20:05.000Z"
        }
      ]
    }
  }
}
```

### Validation Rules

- `id` must be present.
- Conversation lookup must be scoped to the Demo User.

### Error Responses

- `404 NOT_FOUND` if the conversation does not exist for the Demo User.
- `500 INTERNAL_ERROR` for unexpected failures.

## Insight Snapshot APIs

## `GET /api/v1/insights`

### Purpose

Lists stored insight snapshots for the Demo User.

### Deterministic vs OpenAI

- Deterministic: yes
- Calls OpenAI: no

### Request Body

None.

### Query Parameters

| Parameter | Type | Required | Notes |
| --- | --- | --- | --- |
| `period` | `InsightPeriod` | No | `DAILY` or `WEEKLY`. |
| `limit` | `number` | No | Defaults to `10`. Maximum `50`. |

### Response Body

```json
{
  "success": true,
  "data": {
    "insights": [
      {
        "id": "insight_123",
        "period": "DAILY",
        "periodStart": "2026-07-14",
        "periodEnd": "2026-07-14",
        "recoveryScore": 62,
        "burnoutRiskScore": 48,
        "riskLevel": "MODERATE",
        "summary": "Your recovery looks slightly strained today after a long coding block and below-target sleep.",
        "recommendedAction": "Take two short movement breaks and avoid extending work late tonight.",
        "createdAt": "2026-07-14T09:05:00.000Z"
      }
    ]
  },
  "meta": {
    "count": 1,
    "period": "DAILY"
  }
}
```

### Validation Rules

- `period` must be `DAILY` or `WEEKLY` when provided.
- `limit` must be between `1` and `50`.

### Error Responses

- `400 BAD_REQUEST` for invalid query parameters.
- `500 INTERNAL_ERROR` for unexpected failures.

## `GET /api/v1/insights/latest`

### Purpose

Fetches the latest stored insight snapshot for the Demo User and optional period.

### Deterministic vs OpenAI

- Deterministic: yes
- Calls OpenAI: no

### Request Body

None.

### Query Parameters

| Parameter | Type | Required | Notes |
| --- | --- | --- | --- |
| `period` | `InsightPeriod` | No | `DAILY` or `WEEKLY`. Defaults to latest of any period if omitted. |

### Response Body

```json
{
  "success": true,
  "data": {
    "insight": {
      "id": "insight_123",
      "period": "DAILY",
      "periodStart": "2026-07-14",
      "periodEnd": "2026-07-14",
      "recoveryScore": 62,
      "burnoutRiskScore": 48,
      "riskLevel": "MODERATE",
      "summary": "Your recovery looks slightly strained today after a long coding block and below-target sleep.",
      "recommendedAction": "Take two short movement breaks and avoid extending work late tonight.",
      "createdAt": "2026-07-14T09:05:00.000Z"
    }
  }
}
```

### Validation Rules

- `period` must be `DAILY` or `WEEKLY` when provided.

### Error Responses

- `400 BAD_REQUEST` for invalid query parameters.
- `404 NOT_FOUND` if no matching insight exists.
- `500 INTERNAL_ERROR` for unexpected failures.

## `POST /api/v1/insights/generate`

### Purpose

Generates or refreshes an insight snapshot for the Demo User. The backend calculates recovery score, burnout risk score, risk level, trends, and recommendation candidates deterministically, then calls OpenAI to generate user-facing summary text.

Before generating a new AI insight, the backend should first check whether a valid `InsightSnapshot` already exists for the requested Demo User, period, `periodStart`, and `periodEnd`. If `forceRefresh` is `false` and a valid cached insight exists, return the cached insight without calling OpenAI.

This cache-first behavior reduces API cost, latency, and unnecessary OpenAI usage while keeping the demo responsive.

If OpenAI fails, the backend should return a deterministic fallback insight whenever possible.

### Deterministic vs OpenAI

- Deterministic: partially, because scores and summaries are computed before AI generation.
- Calls OpenAI: yes, unless a valid cached insight is returned

### Request Body

```json
{
  "period": "DAILY",
  "periodStart": "2026-07-14",
  "periodEnd": "2026-07-14",
  "forceRefresh": false
}
```

### Response Body

```json
{
  "success": true,
  "data": {
    "insight": {
      "id": "insight_123",
      "period": "DAILY",
      "periodStart": "2026-07-14",
      "periodEnd": "2026-07-14",
      "recoveryScore": 62,
      "burnoutRiskScore": 48,
      "riskLevel": "MODERATE",
      "summary": "Your recovery looks slightly strained today after a long coding block and below-target sleep.",
      "recommendedAction": "Take two short movement breaks and avoid extending work late tonight.",
      "createdAt": "2026-07-14T09:05:00.000Z"
    }
  },
  "meta": {
    "openAiCalled": true,
    "fallbackUsed": false,
    "generated": true
  }
}
```

If a valid cached insight is returned because `forceRefresh` is `false`, the response should use the same `data.insight` shape with metadata similar to:

```json
{
  "success": true,
  "data": {
    "insight": {
      "id": "insight_123",
      "period": "DAILY",
      "periodStart": "2026-07-14",
      "periodEnd": "2026-07-14",
      "recoveryScore": 62,
      "burnoutRiskScore": 48,
      "riskLevel": "MODERATE",
      "summary": "Your recovery looks slightly strained today after a long coding block and below-target sleep.",
      "recommendedAction": "Take two short movement breaks and avoid extending work late tonight.",
      "createdAt": "2026-07-14T09:05:00.000Z"
    }
  },
  "meta": {
    "openAiCalled": false,
    "fallbackUsed": false,
    "generated": false,
    "cached": true
  }
}
```

### Validation Rules

- `period` is required and must be `DAILY` or `WEEKLY`.
- `periodStart` and `periodEnd` are optional; if provided, they must be valid `YYYY-MM-DD` dates.
- `periodStart` must be less than or equal to `periodEnd`.
- For `DAILY`, the period should cover one day.
- For `WEEKLY`, the period should cover up to seven days.
- `forceRefresh` is optional and defaults to `false`.
- If `forceRefresh` is `false`, an existing valid insight for the same period and dates should be returned without calling OpenAI.

### Error Responses

- `400 BAD_REQUEST` for malformed JSON or invalid dates.
- `422 VALIDATION_ERROR` for invalid period rules.
- `429 RATE_LIMITED` if insight generation rate limits are exceeded.
- `503 AI_UNAVAILABLE` if OpenAI fails and no fallback can be produced.
- `500 INTERNAL_ERROR` for unexpected failures.

## Deterministic vs OpenAI Endpoint Behavior

| Endpoint | Deterministic Backend Logic | Calls OpenAI | Notes |
| --- | --- | --- | --- |
| `GET /api/v1/dashboard/summary` | Yes | No | Calculates scores, trends, summaries, and recommendations. |
| `GET /api/v1/wellness/entries` | Yes | No | Reads Demo User entries. |
| `GET /api/v1/wellness/entries/:id` | Yes | No | Reads one Demo User entry. |
| `POST /api/v1/wellness/entries` | Yes | No | Creates one manual entry. |
| `PATCH /api/v1/wellness/entries/:id` | Yes | No | Partially updates one manual entry. |
| `DELETE /api/v1/wellness/entries/:id` | Yes | No | Deletes one manual entry. |
| `POST /api/v1/ai/chat` | Partial | Yes | Backend computes scores and context before calling OpenAI. |
| `GET /api/v1/ai/conversations/:id` | Yes | No | Reads stored messages. |
| `GET /api/v1/insights` | Yes | No | Reads stored snapshots. |
| `GET /api/v1/insights/latest` | Yes | No | Reads latest stored snapshot. |
| `POST /api/v1/insights/generate` | Partial | Yes, unless cached | Backend checks for a cached insight first, then computes scores and asks OpenAI to explain only when generation is needed. |

OpenAI must never be the authority for `recoveryScore`, `burnoutRiskScore`, `riskLevel`, or trend calculations.

## Validation Rules

### Wellness Entry Validation

- `entryDate` must be `YYYY-MM-DD`.
- One wellness entry is allowed per Demo User per date.
- `sleepHours` must be between `0` and `24` when provided.
- `workHours` must be between `0` and `24` when provided.
- `sleepQuality` must be an integer from `1` to `5` when provided.
- `moodScore` must be an integer from `1` to `5` when provided.
- `energyScore` must be an integer from `1` to `5` when provided.
- `steps` must be a non-negative integer when provided.
- `exerciseMinutes` must be a non-negative integer when provided.
- `codingMinutes` must be a non-negative integer when provided.
- `breakCount` must be a non-negative integer when provided.
- `notes` is optional and should be length-limited, recommended maximum `1000` characters.

### AI Chat Validation

- `message` is required.
- `message` must be non-empty after trimming whitespace.
- `message` should be length-limited, recommended maximum `1000` characters.
- `conversationId` must belong to the Demo User when provided.

### Insight Validation

- `period` must be `DAILY` or `WEEKLY`.
- `periodStart` and `periodEnd` must use `YYYY-MM-DD` when provided.
- `periodStart` must be less than or equal to `periodEnd`.
- `forceRefresh` must be a boolean when provided.

### Score Response Rules

- `recoveryScore` must be returned as an integer from `0` to `100`.
- `burnoutRiskScore` must be returned as an integer from `0` to `100`.
- `riskLevel` must be one of `LOW`, `MODERATE`, `HIGH`, or `CRITICAL`.

## Express + TypeScript Implementation Notes

- Mount all routes under `/api/v1`.
- Keep route handlers thin; delegate business logic to services.
- Create a Demo User resolver utility or middleware that loads the configured Demo User for each request.
- Use request validation middleware before controllers.
- Keep deterministic scoring in a dedicated risk or dashboard service.
- Keep OpenAI calls isolated in an AI service.
- Build AI context from summarized metrics, computed scores, latest entry highlights, and rule-based recommendations.
- Do not send raw full wellness history to OpenAI by default.
- Do not expose OpenAI prompts or provider errors in API responses.
- Use a centralized error handler to produce the standard error envelope.
- Use Prisma queries scoped by the Demo User id.
- Convert Prisma `Decimal` values to plain numbers before returning API responses.
- Use rate limiting for `POST /api/v1/ai/chat` and `POST /api/v1/insights/generate`.
- Add future authentication by replacing Demo User resolution with authenticated user resolution, while preserving resource response shapes where possible.
