// --- Theme toggle --------------------------------------------------------

const themeToggle = document.getElementById('themeToggle');

function applyTheme(theme) {
  if (theme === 'light') {
    document.documentElement.setAttribute('data-theme', 'light');
    themeToggle.textContent = '☀️';
  } else {
    document.documentElement.removeAttribute('data-theme');
    themeToggle.textContent = '🌙';
  }
}

applyTheme(localStorage.getItem('theme') === 'light' ? 'light' : 'dark');

themeToggle.addEventListener('click', () => {
  const isLight = document.documentElement.getAttribute('data-theme') === 'light';
  const next = isLight ? 'dark' : 'light';
  localStorage.setItem('theme', next);
  applyTheme(next);
});

let state = null;

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
  if (!state) return;

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

// --- Backend connection -----------------------------------------------

let socket = null;

function connect() {
  socket = new WebSocket(`ws://${window.location.host}`);

  socket.addEventListener('message', (event) => {
    const msg = JSON.parse(event.data);
    if (msg.type === 'state') {
      state = msg.state;
      updateUI();
    }
  });

  socket.addEventListener('close', () => {
    setTimeout(connect, 1000);
  });
}

function send(command) {
  if (socket && socket.readyState === WebSocket.OPEN) {
    socket.send(JSON.stringify(command));
  }
}

// --- User interactions --------------------------------------------------

elements.gearButtons.forEach((button) => {
  button.addEventListener('click', () => send({ type: 'setGear', gear: button.dataset.gear }));
});

elements.steeringRange.addEventListener('input', (event) => {
  send({ type: 'setSteering', value: Number(event.target.value) });
});

elements.acToggle.addEventListener('click', () => send({ type: 'toggleAC' }));

elements.heaterToggle.addEventListener('click', () => send({ type: 'toggleHeater' }));

elements.tempDown.addEventListener('click', () => send({ type: 'adjustTemp', amount: -1 }));

elements.tempUp.addEventListener('click', () => send({ type: 'adjustTemp', amount: 1 }));

elements.prevTrack.addEventListener('click', () => send({ type: 'cycleTrack', direction: -1 }));

elements.nextTrack.addEventListener('click', () => send({ type: 'cycleTrack', direction: 1 }));

elements.playPause.addEventListener('click', () => send({ type: 'togglePlayPause' }));

elements.radioStation.addEventListener('change', (event) => {
  send({ type: 'changeRadio', value: event.target.value });
});

elements.appleCarplay.addEventListener('change', () => send({ type: 'toggleCarplay' }));

elements.androidAuto.addEventListener('change', () => send({ type: 'toggleAndroidAuto' }));

elements.seatFL.addEventListener('click', () => send({ type: 'toggleSeat', seat: 'fl' }));

elements.seatFR.addEventListener('click', () => send({ type: 'toggleSeat', seat: 'fr' }));

elements.seatRL.addEventListener('click', () => send({ type: 'toggleSeat', seat: 'rl' }));

elements.seatRR.addEventListener('click', () => send({ type: 'toggleSeat', seat: 'rr' }));

connect();
