# RideWatch — Real-Time Ride Price Comparison API

RideWatch is a Node.js backend that fetches, compares, and monitors ride prices from **Uber** and **Lyft** in real time. Users can watch a route and receive live WebSocket updates and push notifications whenever prices change, surges start or end, or the cheapest option switches.

---

## Features

- **Price comparison** — Fetches current price estimates and ETAs from both Uber and Lyft for any pickup/dropoff pair
- **Real-time monitoring** — WebSocket-based polling (every 30 seconds) detects price changes and pushes diffs to connected clients
- **Push notifications** — Web Push notifications (via VAPID) for price drops, surge events, cheapest-ride changes, and trip-end confirmations
- **Trip management** — Create, cancel, and end trip watches; all state stored in Redis with a 24-hour TTL
- **Notification queue** — BullMQ queue with per-event retry strategies and a rate limiter (100 jobs/sec, 25 concurrent)
- **Geocoding** — Google Maps Geocoding API converts addresses ↔ coordinates

---

## Tech Stack

| Layer | Technology |
|---|---|
| Runtime | Node.js |
| WebSockets | Socket.IO |
| Queue | BullMQ |
| Cache / State | Redis |
| Geocoding | Google Maps Geocoding API |
| Push notifications | `web-push` (VAPID) |
| HTTP client | Axios |

---

## Project Structure

```
├── config/
│   └── redis.js                # Redis client (shared across app)
├── controllers/
│   ├── compareController.js    # Builds price comparison from Uber + Lyft
│   └── tripController.js       # CRUD for trip watches
├── models/
│   └── trip.js                 # Redis-backed trip model
├── queues/
│   └── notificationQueue.js    # BullMQ queue + worker for push notifications
├── routes/
│   ├── compareRoutes.js        # POST /compare
│   └── tripRoutes.js           # Trip management endpoints
├── services/
│   ├── geoCodeService.js       # Address ↔ coordinates via Google Maps
│   ├── lyftService.js          # Lyft pricing + ETA fetcher (with OAuth token cache)
│   ├── notificationService.js  # Web Push sender + notification payload builders
│   ├── uberService.js          # Uber pricing + ETA fetcher
│   └── priceSocket.js          # Socket.IO event handlers + price diff logic
```

---

## API Reference

### Compare Prices

```
POST /compare
Content-Type: application/json

{ "pickup": "Times Square, NYC", "dropoff": "JFK Airport" }
```

**Response**

```json
{
  "pickup": "Times Square, NYC",
  "dropoff": "JFK Airport",
  "pickupCoords": { "lat": 40.758, "lng": -73.985 },
  "dropoffCoords": { "lat": 40.641, "lng": -73.778 },
  "cheapest": { "provider": "lyft", "type": "Lyft", "price": 38 },
  "uber": [ { "provider": "uber", "type": "UberX", "price_low": 44, "price_high": 56, "eta_minutes": 3, "surge": false, "surge_multiplier": 1, "currency": "USD" } ],
  "lyft": [ { "provider": "lyft", "type": "Lyft",  "price_low": 38, "price_high": 47, "eta_minutes": 4, "surge": false, "surge_multiplier": "0%", "currency": "USD" } ],
  "timestamp": "2025-05-25T10:00:00.000Z"
}
```

---

### Trip Management

| Method | Endpoint | Description |
|---|---|---|
| `POST` | `/trips/start` | Start watching a route |
| `POST` | `/trips/cancel` | Cancel a trip watch |
| `POST` | `/trips/end` | End a trip (sends push notification) |
| `GET` | `/trips/active` | List all active trip watches |
| `GET` | `/trips/:tripId` | Get status of a specific trip |

**Start a trip watch**

```
POST /trips/start

{
  "pickup": "Union Square, SF",
  "dropoff": "SFO Airport",
  "socketId": "abc123",
  "pushSubscription": { ... }   // optional — Web Push subscription object
}
```

---

### WebSocket Events

Connect via Socket.IO then emit `watch:prices` to begin real-time monitoring.

**Client → Server**

| Event | Payload | Description |
|---|---|---|
| `watch:prices` | `{ pickup, dropoff, tripId? }` | Start polling for price changes |
| `watch:stop` | — | Stop the current watcher |

**Server → Client**

| Event | Payload | Description |
|---|---|---|
| `prices:initial` | Full comparison result | Sent immediately on `watch:prices` |
| `prices:changed` | `{ changes, cheapestChanged, cheapest, uber, lyft, timestamp }` | Emitted when any price, surge, or ETA changes |
| `prices:heartbeat` | `{ timestamp }` | Emitted each poll cycle when nothing changed |
| `prices:stopped` | — | Confirms the watcher was stopped |
| `error` | `{ message }` | Any error during fetch or polling |

A **change object** inside `prices:changed.changes` looks like:

```json
{
  "provider": "uber",
  "type": "UberX",
  "previous": { "price_low": 44, "price_high": 56, "surge": false, "eta_minutes": 3 },
  "current":  { "price_low": 38, "price_high": 49, "surge": false, "eta_minutes": 5 }
}
```

---

### Push Notifications

Push notifications are sent via the BullMQ worker when a trip has a stored `pushSubscription`. The following notification types are supported:

| Type | Trigger |
|---|---|
| `price_drop` | Any ride's `price_low` decreases |
| `surge_started` | A ride transitions from no-surge to surge |
| `surge_ended` | A ride transitions from surge to no-surge |
| `cheapest_changed` | The cheapest provider/type changes |
| `trip_ended` | `POST /trips/end` is called |

Retry configuration per type:

| Type | Attempts | Strategy |
|---|---|---|
| `price_drop` | 3 | Exponential (2 s) |
| `cheapest_changed` | 3 | Exponential (2 s) |
| `surge_started` | 5 | Exponential (1 s) |
| `surge_ended` | 2 | Fixed (3 s) |
| `trip_ended` | 2 | Fixed (5 s) |

Expired subscriptions (HTTP 404/410) are automatically cleared from the trip record and no further notifications are attempted.

---

## Environment Variables

Create a `.env` file in the project root:

```env
# Redis
REDIS_URL=redis://localhost:6379
REDIS_HOST=localhost
REDIS_PORT=6379

# Google Maps
GOOGLE_MAPS_API_KEY=your_google_maps_key

# Uber
UBER_SERVER_TOKEN=your_uber_server_token

# Lyft
LYFT_CLIENT_ID=your_lyft_client_id
LYFT_CLIENT_SECRET=your_lyft_client_secret

# Web Push (VAPID)
VAPID_EMAIL=mailto:you@example.com
VAPID_PUBLIC_KEY=your_vapid_public_key
VAPID_PRIVATE_KEY=your_vapid_private_key
```

Generate VAPID keys with:

```bash
npx web-push generate-vapid-keys
```

---

## Getting Started

```bash
# Install dependencies
npm install

# Make sure Redis is running
redis-server

# Start the server
node index.js
```

---

## Notes

- All trip state is stored in Redis with a **24-hour TTL**. No database is required.
- The Lyft OAuth token is cached in memory and refreshed automatically before expiry.
- The BullMQ worker runs in the same process; concurrency is capped at 25 with a 100 jobs/sec rate limit.
- `pickup` and `dropoff` can be either a **plain address string** or a **`{ lat, lng }` coordinate object**.
