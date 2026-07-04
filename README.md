# electric-car-system

A prototype infotainment and vehicle control dashboard for an electric car, designed with a Nepal-inspired modern UI.

## Features

- Vehicle telemetry: speed, gear, brake status, steering angle
- Tire monitoring for all four tires
- Climate controls: AC, heater, cabin temperature
- Media controls with playlist and radio station selection
- Apple CarPlay and Android Auto toggles
- Seat occupancy visualization for all four seats
- Responsive, polished dashboard layout for the front screen

## Files

- `index.html` — main dashboard UI
- `styles.css` — Nepal-inspired styling and layout
- `script.js` — thin client: renders state pushed from the backend and sends control commands
- `server/` — Node/Express backend: holds vehicle state, runs the telemetry simulation, and streams updates over WebSocket

## Usage

```
cd server
npm install
npm start
```

Then open http://localhost:3000 in a browser. The server serves the dashboard and streams live state over a WebSocket; a `GET /api/state` REST endpoint is also available as a fallback for consumers that can't hold a socket open.

> This is a prototype. The backend simulates telemetry in place of a real vehicle; wiring to an actual CAN bus would replace the simulation functions in `server/server.js` with a real hardware adapter feeding the same state/broadcast API.
