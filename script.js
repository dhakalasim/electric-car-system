const state = {
  speed: 0,
  gear: 'P',
  brake: false,
  steering: 0,
  tires: {
    fl: 34,
    fr: 33,
    rl: 32,
    rr: 32,
  },
  ac: false,
  heater: false,
  cabinTemp: 22,
  music: {
    track: 'Himalaya Drive',
    artist: 'Nepali Electronic',
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
  seats: {
    fl: true,
    fr: false,
    rl: true,
    rr: false,
  },
};

const elements = {
  speedValue: document.getElementById('speedValue'),
  gearValue: document.getElementById('gearValue'),
  brakeValue: document.getElementById('brakeValue'),
  steeringValue: document.getElementById('steeringValue'),
  tireFL: document.getElementById('tireFL'),
  tireFR: document.getElementById('tireFR'),
  tireRL: document.getElementById('tireRL'),
  tireRR: document.getElementById('tireRR'),
  acMode: document.getElementById('acMode'),
  heaterMode: document.getElementById('heaterMode'),
  tempValue: document.getElementById('tempValue'),
  musicTitle: document.getElementById('musicTitle'),
  musicArtist: document.getElementById('musicArtist'),
  musicTrack: document.getElementById('musicTrack'),
  radioStation: document.getElementById('radioStation'),
  appleCarplay: document.getElementById('appleCarplay'),
  androidAuto: document.getElementById('androidAuto'),
  seatFL: document.getElementById('seatFL'),
  seatFR: document.getElementById('seatFR'),
  seatRL: document.getElementById('seatRL'),
  seatRR: document.getElementById('seatRR'),
  acToggle: document.getElementById('acToggle'),
  heaterToggle: document.getElementById('heaterToggle'),
  tempDown: document.getElementById('tempDown'),
  tempUp: document.getElementById('tempUp'),
  prevTrack: document.getElementById('prevTrack'),
  playPause: document.getElementById('playPause'),
  nextTrack: document.getElementById('nextTrack'),
  steeringRange: document.getElementById('steeringRange'),
  gearButtons: document.querySelectorAll('[data-gear]'),
};

function updateUI() {
  elements.speedValue.textContent = `${state.speed} km/h`;
  elements.gearValue.textContent = state.gear;
  elements.brakeValue.textContent = state.brake ? 'Engaged' : 'Released';
  elements.steeringValue.textContent = `${state.steering}°`;
  elements.tireFL.textContent = `${state.tires.fl} PSI`;
  elements.tireFR.textContent = `${state.tires.fr} PSI`;
  elements.tireRL.textContent = `${state.tires.rl} PSI`;
  elements.tireRR.textContent = `${state.tires.rr} PSI`;
  elements.acMode.textContent = state.ac ? 'On' : 'Off';
  elements.heaterMode.textContent = state.heater ? 'On' : 'Off';
  elements.tempValue.textContent = `${state.cabinTemp}°C`;
  elements.musicTitle.textContent = state.music.track;
  elements.musicArtist.textContent = state.music.artist;
  elements.musicTrack.textContent = state.music.track;
  elements.radioStation.value = state.radio;
  elements.appleCarplay.checked = state.appleCarplay;
  elements.androidAuto.checked = state.androidAuto;
  elements.steeringRange.value = state.steering;

  elements.seatFL.classList.toggle('active', state.seats.fl);
  elements.seatFR.classList.toggle('active', state.seats.fr);
  elements.seatRL.classList.toggle('active', state.seats.rl);
  elements.seatRR.classList.toggle('active', state.seats.rr);

  elements.acToggle.textContent = state.ac ? 'Turn Off' : 'Turn On';
  elements.heaterToggle.textContent = state.heater ? 'Turn Off' : 'Turn On';
  elements.playPause.textContent = state.music.playing ? '❚❚' : '▶';

  elements.gearButtons.forEach((button) => {
    button.classList.toggle('active', button.dataset.gear === state.gear);
  });
}

function setGear(gear) {
  state.gear = gear;
  state.brake = gear === 'P' || gear === 'N';
  if (gear === 'P') {
    state.speed = 0;
  }
  updateUI();
}

function toggleAC() {
  state.ac = !state.ac;
  if (state.ac && state.heater) {
    state.heater = false;
  }
  updateUI();
}

function toggleHeater() {
  state.heater = !state.heater;
  if (state.heater && state.ac) {
    state.ac = false;
  }
  updateUI();
}

function adjustTemp(amount) {
  state.cabinTemp = Math.min(30, Math.max(16, state.cabinTemp + amount));
  updateUI();
}

function cycleTrack(direction) {
  state.music.index = (state.music.index + direction + state.music.playlist.length) % state.music.playlist.length;
  const next = state.music.playlist[state.music.index];
  state.music.track = next.track;
  state.music.artist = next.artist;
  updateUI();
}

function togglePlayPause() {
  state.music.playing = !state.music.playing;
  updateUI();
}

function changeRadio(event) {
  state.radio = event.target.value;
}

function randomizeTires() {
  state.tires.fl = 33 + Math.round(Math.random() * 2);
  state.tires.fr = 33 + Math.round(Math.random() * 2);
  state.tires.rl = 32 + Math.round(Math.random() * 2);
  state.tires.rr = 32 + Math.round(Math.random() * 2);
}

function simulateVehicle() {
  if (state.gear === 'D' && !state.brake) {
    state.speed = Math.min(120, state.speed + Math.round(Math.random() * 4));
  }
  if (state.gear === 'R' && !state.brake) {
    state.speed = Math.min(30, state.speed + Math.round(Math.random() * 3));
  }
  if (state.gear === 'P' || state.brake || state.gear === 'N') {
    state.speed = Math.max(0, state.speed - Math.round(Math.random() * 5));
  }
  updateUI();
}

function initialize() {
  setGear('P');
  updateUI();
  setInterval(simulateVehicle, 1400);
  setInterval(randomizeTires, 12000);
}

elements.gearButtons.forEach((button) => {
  button.addEventListener('click', () => setGear(button.dataset.gear));
});

elements.steeringRange.addEventListener('input', (event) => {
  state.steering = Number(event.target.value);
  updateUI();
});

elements.acToggle.addEventListener('click', toggleAC);

elements.heaterToggle.addEventListener('click', toggleHeater);

elements.tempDown.addEventListener('click', () => adjustTemp(-1));

elements.tempUp.addEventListener('click', () => adjustTemp(1));

elements.prevTrack.addEventListener('click', () => cycleTrack(-1));

elements.nextTrack.addEventListener('click', () => cycleTrack(1));

elements.playPause.addEventListener('click', togglePlayPause);

elements.radioStation.addEventListener('change', changeRadio);

elements.appleCarplay.addEventListener('change', (event) => {
  state.appleCarplay = event.target.checked;
  if (state.appleCarplay && state.androidAuto) {
    state.androidAuto = false;
  }
  updateUI();
});

elements.androidAuto.addEventListener('change', (event) => {
  state.androidAuto = event.target.checked;
  if (state.androidAuto && state.appleCarplay) {
    state.appleCarplay = false;
  }
  updateUI();
});

elements.seatFL.addEventListener('click', () => {
  state.seats.fl = !state.seats.fl;
  updateUI();
});

elements.seatFR.addEventListener('click', () => {
  state.seats.fr = !state.seats.fr;
  updateUI();
});

elements.seatRL.addEventListener('click', () => {
  state.seats.rl = !state.seats.rl;
  updateUI();
});

elements.seatRR.addEventListener('click', () => {
  state.seats.rr = !state.seats.rr;
  updateUI();
});

initialize();
