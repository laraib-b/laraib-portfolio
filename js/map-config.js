var SVGNS = 'http://www.w3.org/2000/svg';
var MAP_W = 1000;
var MAP_H = 600;
var PROJECT_IDS = ['hk', 'sd', 'ih', 'nsort', 'bd', 'fc'];

var MAP_META = {
  hk: { label: 'Hamara Kisaan', type: 'project', jump: 'hk', note: 'probably my most meaningful project' },
  sd: { label: 'Self-Driving Car', type: 'project', jump: 'sd', note: 'my first robotics project' },
  ih: { label: 'InstaHealth', type: 'project', jump: 'ih' },
  bd: { label: 'Bulk Downloader', type: 'project', jump: 'bd' },
  fc: { label: 'FAST Cafe', type: 'project', jump: 'fc' },
  nsort: { label: 'AI Email Sorter', type: 'project', jump: 'nsort', note: 'first n8n project that actually worked' },
  tensorflow: { label: 'TensorFlow', type: 'skill' },
  cvision: { label: 'Computer Vision', type: 'skill' },
  react: { label: 'React', type: 'skill' },
  flask: { label: 'Flask', type: 'skill' },
  mysql: { label: 'MySQL', type: 'skill' },
  javascript: { label: 'JavaScript', type: 'skill' },
  chromeapi: { label: 'Chrome API', type: 'skill' },
  python: { label: 'Python', type: 'skill' },
  esp32: { label: 'ESP32', type: 'skill' },
  mqtt: { label: 'MQTT', type: 'skill' },
  n8n: { label: 'n8n', type: 'skill' },
  openai: { label: 'OpenAI', type: 'skill' },
  gmail: { label: 'Gmail API', type: 'skill' },
  discord: { label: 'Discord API', type: 'skill' }
};

var MAP_LAYOUT = {
  hk: { x: 205, y: 235 },
  sd: { x: 585, y: 178 },
  ih: { x: 178, y: 415 },
  nsort: { x: 275, y: 530 },
  bd: { x: 870, y: 338 },
  fc: { x: 625, y: 508 },
  tensorflow: { x: 118, y: 168 },
  cvision: { x: 345, y: 105 },
  react: { x: 158, y: 318 },
  flask: { x: 78, y: 262 },
  mysql: { x: 435, y: 292 },
  python: { x: 688, y: 128 },
  esp32: { x: 758, y: 202 },
  mqtt: { x: 708, y: 268 },
  n8n: { x: 168, y: 528 },
  openai: { x: 428, y: 522 },
  gmail: { x: 338, y: 512 },
  discord: { x: 508, y: 455 },
  javascript: { x: 762, y: 462 },
  chromeapi: { x: 822, y: 288 }
};

var MAP_LINKS = [
  ['hk', 'tensorflow'], ['hk', 'cvision'], ['hk', 'react'], ['hk', 'flask'], ['hk', 'mysql'],
  ['ih', 'flask'], ['ih', 'mysql'],
  ['fc', 'javascript'],
  ['bd', 'javascript'], ['bd', 'chromeapi'],
  ['sd', 'python'], ['sd', 'esp32'], ['sd', 'mqtt'], ['sd', 'cvision'],
  ['nsort', 'n8n'], ['nsort', 'openai'], ['nsort', 'gmail'], ['nsort', 'discord']
];
