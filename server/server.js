const path = require('path');
const express = require('express');
const { WebSocketServer, WebSocket } = require('ws');

const PORT = process.env.PORT || 3000;

const state = {
  speed: 0,
  gear: 'P',
  brake: true,
  steering: 0,
  tires: { fl: 34, fr: 33, rl: 32, rr: 32 },
  ac: false,
  heater: false,
  cabinTemp: 22,
  music: {
    playlist: [
      { track: 'Himalaya Drive', artist: 'Nepali Electronic' },
      { track: 'Kathmandu Pulse', artist: 'Urban Sherpa' },
      { track: 'Sunrise on Pashupatinath', artist: 'Temple Wave' },
    ],
    index: 0,
    playing: false,
  },
  radio: 'Yarlung FM',
  appleCarplay: false,
  androidAuto: false,
  seats: { fl: true, fr: false, rl: true, rr: false },
};

function publicState() {
  const track = state.music.playlist[state.music.index];
  return { ...state, music: { ...state.music, track: track.track, artist: track.artist } };
}

// Command handlers mutate `state`; each takes the raw client message.
const handlers = {
  setGear(msg) {
    state.gear = msg.gear;
    state.brake = msg.gear === 'P' || msg.gear === 'N';
    if (msg.gear === 'P') state.speed = 0;
  },
  setSteering(msg) {
    state.steering = Math.max(-45, Math.min(45, Number(msg.value) || 0));
  },
  toggleAC() {
    state.ac = !state.ac;
    if (state.ac) state.heater = false;
  },
  toggleHeater() {
    state.heater = !state.heater;
    if (state.heater) state.ac = false;
  },
  adjustTemp(msg) {
    state.cabinTemp = Math.min(30, Math.max(16, state.cabinTemp + Number(msg.amount)));
  },
  cycleTrack(msg) {
    const len = state.music.playlist.length;
    state.music.index = (state.music.index + Number(msg.direction) + len) % len;
  },
  togglePlayPause() {
    state.music.playing = !state.music.playing;
  },
  changeRadio(msg) {
    state.radio = msg.value;
  },
  toggleCarplay() {
    state.appleCarplay = !state.appleCarplay;
    if (state.appleCarplay) state.androidAuto = false;
  },
  toggleAndroidAuto() {
    state.androidAuto = !state.androidAuto;
    if (state.androidAuto) state.appleCarplay = false;
  },
  toggleSeat(msg) {
    if (msg.seat in state.seats) state.seats[msg.seat] = !state.seats[msg.seat];
  },
};

function simulateVehicle() {
  if (state.gear === 'D' && !state.brake) {
    state.speed = Math.min(120, state.speed + Math.round(Math.random() * 4));
  } else if (state.gear === 'R' && !state.brake) {
    state.speed = Math.min(30, state.speed + Math.round(Math.random() * 3));
  } else {
    state.speed = Math.max(0, state.speed - Math.round(Math.random() * 5));
  }
}

function randomizeTires() {
  state.tires.fl = 33 + Math.round(Math.random() * 2);
  state.tires.fr = 33 + Math.round(Math.random() * 2);
  state.tires.rl = 32 + Math.round(Math.random() * 2);
  state.tires.rr = 32 + Math.round(Math.random() * 2);
}

const app = express();
app.use(express.json());
app.use(express.static(path.join(__dirname, '..')));

// REST fallback for consumers that can't hold a WebSocket open (health checks, debugging, future CAN adapters).
app.get('/api/state', (req, res) => {
  res.json(publicState());
});

const server = app.listen(PORT, () => {
  console.log(`Nepal Drive OS server listening on http://localhost:${PORT}`);
});

const wss = new WebSocketServer({ server });

function broadcast() {
  const payload = JSON.stringify({ type: 'state', state: publicState() });
  wss.clients.forEach((client) => {
    if (client.readyState === WebSocket.OPEN) client.send(payload);
  });
}

wss.on('connection', (ws) => {
  ws.send(JSON.stringify({ type: 'state', state: publicState() }));

  ws.on('message', (raw) => {
    let msg;
    try {
      msg = JSON.parse(raw);
    } catch {
      return;
    }
    const handler = handlers[msg.type];
    if (!handler) return;
    handler(msg);
    broadcast();
  });
});

setInterval(() => {
  simulateVehicle();
  broadcast();
}, 1400);

setInterval(() => {
  randomizeTires();
  broadcast();
}, 12000);
