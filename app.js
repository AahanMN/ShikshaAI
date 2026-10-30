import * as THREE from "three";
import { OrbitControls } from "three/addons/controls/OrbitControls.js";

const welcomeCanvas = document.querySelector("#welcome-canvas");
const shapeCanvas = document.querySelector("#shape-canvas");
const welcomeView = document.querySelector("#welcome-view");
const chooserView = document.querySelector("#chooser-view");
const studioView = document.querySelector("#studio-view");
const writingView = document.querySelector("#writing-view");
const SpeechRecognition = window.SpeechRecognition || window.webkitSpeechRecognition;
let recognition;
let voiceEnabled = false;
let recognitionActive = false;
let writingLanguage = "en";
let mathMode = false;
let activeShape = "cube";
let activeSize = 5;

function setWritingLanguage(language) {
  const languageChanged = writingLanguage !== language;
  writingLanguage = language;
  const hindi = language === "hi";
  const copy = hindi ? {
    heading: "लिखने की जगह।",
    subtitle: "स्वाभाविक रूप से बोलें। आपके शब्द बोर्ड पर दिखाई देंगे।",
    board: "कक्षा का बोर्ड",
    eraseWord: "आख़िरी शब्द मिटाएँ",
    eraseWhole: "पूरा बोर्ड मिटाएँ",
    placeholder: "आपका पाठ यहाँ दिखाई देगा…\n\nबोलकर देखें, “यह एक सेब है।”",
    ready: "लिखने के लिए तैयार। माइक चालू करें और बोलना शुरू करें।",
    commands: "आवाज़ से कहें: “ऊपर स्क्रॉल करो” · “नीचे स्क्रॉल करो” · “मिटाओ”",
    voiceCommands: "बोलें: “maths mode on” · “ऊपर/नीचे स्क्रॉल करो” · “मिटाओ” · “पूरा बोर्ड मिटाओ”",
  } : {
    heading: "Writing space.",
    subtitle: "Speak naturally. Your words appear on the board.",
    board: "CLASSROOM BOARD",
    eraseWord: "Erase last word",
    eraseWhole: "Erase whole board",
    placeholder: "Your lesson will appear here…\n\nTry saying, “This is an apple.”",
    ready: "Ready to write. Turn on the mic and start speaking.",
    commands: "VOICE: “SCROLL UP” · “SCROLL DOWN” · “ERASE” · “ERASE WHOLE”",
    voiceCommands: "Say “turn math mode on” · “scroll up/down” · “erase” · “erase whole”",
  };
  document.documentElement.lang = hindi ? "hi" : "en";
  document.querySelector("#writing-title").innerHTML = `${copy.heading.split(" ")[0]} <em>${copy.heading.split(" ").slice(1).join(" ")}</em>`;
  document.querySelector(".writing-heading .studio-subtitle").textContent = copy.subtitle;
  document.querySelector(".board-panel").setAttribute("aria-label", copy.board);
  document.querySelector(".board-toolbar > span").lastChild.textContent = ` ${copy.board}`;
  document.querySelector("#erase-word").textContent = copy.eraseWord;
  document.querySelector("#clear-board").textContent = copy.eraseWhole;
  document.querySelector("#writing-board").placeholder = copy.placeholder;
  document.querySelector("#writing-board").lang = hindi ? "hi" : "en";
  document.querySelector("#writing-status").textContent = copy.ready;
  document.querySelector("#writing-command-hint").textContent = copy.commands;
  document.querySelector(".board-footer > span").textContent = copy.voiceCommands;
  document.querySelectorAll("[data-writing-language]").forEach((button) => {
    button.setAttribute("aria-pressed", String(button.dataset.writingLanguage === language));
  });
  if (languageChanged && voiceEnabled && recognitionActive) recognition.stop();
}

function announce(message, isError = false) {
  const target = document.querySelector("#form-status");
  target.textContent = message;
  target.classList.toggle("is-error", isError);
  document.querySelector("#welcome-status").textContent = message;
  document.querySelector("#welcome-status").classList.toggle("is-error", isError);
  const writingStatus = document.querySelector("#writing-status");
  if (document.body.dataset.view === "writing") {
    writingStatus.textContent = message;
    writingStatus.classList.toggle("is-error", isError);
  }
}

function switchView(view, updateHistory = true) {
  const views = { welcome: welcomeView, chooser: chooserView, studio: studioView, writing: writingView };
  if (!views[view]) view = "welcome";
  Object.entries(views).forEach(([name, element]) => {
    element.hidden = name !== view;
  });
  document.body.dataset.view = view;
  if (updateHistory) history.replaceState({ view }, "", view === "welcome" ? "#welcome" : `#${view}`);
  if (view === "studio") {
    window.setTimeout(() => document.querySelector("#command-input").focus(), 50);
  } else if (view === "writing") {
    window.setTimeout(() => document.querySelector("#writing-board").focus(), 50);
  }
  if (voiceEnabled) {
    const prompt = {
      welcome: "Listening. Say “get started” to choose a teaching space.",
      chooser: "Listening. Say “3D figures”, “Hindi mode”, “math mode”, or “English mode”.",
      studio: "Listening. Say a shape and size.",
      writing: mathMode
        ? "Math mode is on. Say a calculation, or say “turn math mode off” to dictate."
        : "Listening. Speak to write, or say “erase” or “erase whole”.",
    };
    announce(prompt[view]);
  }
}

function makeGeometry(shape, size) {
  switch (shape) {
    case "cuboid": return new THREE.BoxGeometry(size, size * 0.65, size * 0.65);
    case "sphere": return new THREE.SphereGeometry(size / 2, 48, 32);
    case "pyramid": return new THREE.ConeGeometry(size * 0.65, size, 4);
    case "tetrahedron": return new THREE.TetrahedronGeometry(size * 0.58);
    case "cone": return new THREE.ConeGeometry(size * 0.45, size, 48);
    case "cylinder": return new THREE.CylinderGeometry(size * 0.42, size * 0.42, size, 48);
    case "pentagonal_prism": return new THREE.CylinderGeometry(size * 0.45, size * 0.45, size, 5);
    case "hexagonal_prism": return new THREE.CylinderGeometry(size * 0.45, size * 0.45, size, 6);
    case "octagonal_prism": return new THREE.CylinderGeometry(size * 0.45, size * 0.45, size, 8);
    case "torus": return new THREE.TorusGeometry(size * 0.34, size * 0.11, 24, 64);
    default: return new THREE.BoxGeometry(size, size, size);
  }
}

function createRenderer(canvas) {
  const renderer = new THREE.WebGLRenderer({ canvas, antialias: true });
  renderer.setPixelRatio(Math.min(window.devicePixelRatio, 2));
  renderer.setClearColor(0x173327);
  return renderer;
}

function resizeRenderer(renderer, camera, canvas) {
  const width = Math.max(1, canvas.clientWidth);
  const height = Math.max(1, canvas.clientHeight);
  renderer.setSize(width, height, false);
  camera.aspect = width / height;
  camera.updateProjectionMatrix();
}

function startWelcomeModel() {
  const scene = new THREE.Scene();
  scene.background = new THREE.Color(0x173327);
  const camera = new THREE.PerspectiveCamera(38, 1, 0.1, 100);
  camera.position.set(5, 4, 7);
  const renderer = createRenderer(welcomeCanvas);
  const geometry = new THREE.IcosahedronGeometry(1.7, 0);
  const material = new THREE.MeshStandardMaterial({ color: 0xc9edbd, metalness: 0.12, roughness: 0.35, flatShading: true });
  const model = new THREE.Mesh(geometry, material);
  const edges = new THREE.LineSegments(
    new THREE.EdgesGeometry(geometry),
    new THREE.LineBasicMaterial({ color: 0xf5ffe9, transparent: true, opacity: 0.5 }),
  );
  model.add(edges);
  scene.add(model, new THREE.AmbientLight(0xffffff, 1.1));
  const keyLight = new THREE.DirectionalLight(0xfff1d7, 3);
  keyLight.position.set(5, 6, 4);
  scene.add(keyLight);
  const warmLight = new THREE.PointLight(0xed795e, 27, 15);
  warmLight.position.set(-4, -1, 3);
  scene.add(warmLight);
  new ResizeObserver(() => resizeRenderer(renderer, camera, welcomeCanvas)).observe(welcomeCanvas.parentElement);
  resizeRenderer(renderer, camera, welcomeCanvas);

  const clock = new THREE.Clock();
  function animate() {
    const elapsed = clock.getElapsedTime();
    model.rotation.set(elapsed * 0.12, elapsed * 0.2, Math.sin(elapsed * 0.3) * 0.08);
    model.position.y = Math.sin(elapsed * 0.65) * 0.11;
    renderer.render(scene, camera);
    requestAnimationFrame(animate);
  }
  animate();
}

function startStudioModel() {
  const scene = new THREE.Scene();
  scene.background = new THREE.Color(0x173327);
  const camera = new THREE.PerspectiveCamera(42, 1, 0.1, 1000);
  const renderer = createRenderer(shapeCanvas);
  const controls = new OrbitControls(camera, shapeCanvas);
  controls.enableDamping = true;
  controls.dampingFactor = 0.06;
  controls.minDistance = 2;
  controls.maxDistance = 250;
  scene.add(new THREE.AmbientLight(0xffffff, 1.05));
  const keyLight = new THREE.DirectionalLight(0xfff3dc, 2.6);
  keyLight.position.set(10, 14, 9);
  scene.add(keyLight);
  const fillLight = new THREE.DirectionalLight(0x9de2ab, 1.1);
  fillLight.position.set(-8, 4, -7);
  scene.add(fillLight);
  const floor = new THREE.Mesh(new THREE.PlaneGeometry(500, 500), new THREE.MeshBasicMaterial({ color: 0x173327 }));
  floor.rotation.x = -Math.PI / 2;
  floor.position.y = -0.015;
  scene.add(floor);
  const grid = new THREE.GridHelper(50, 25, 0x66816a, 0x344b3a);
  grid.position.y = 0.005;
  scene.add(grid);

  let model;
  let edgeLines;

  function drawShape(shape, size) {
    if (model) {
      scene.remove(model);
      model.geometry.dispose();
      model.material.dispose();
    }
    if (edgeLines) {
      scene.remove(edgeLines);
      edgeLines.geometry.dispose();
      edgeLines.material.dispose();
      edgeLines = null;
    }
    const geometry = makeGeometry(shape, size);
    const curved = ["sphere", "cone", "cylinder", "torus"].includes(shape);
    model = new THREE.Mesh(geometry, new THREE.MeshStandardMaterial({
      color: 0xc9edbd,
      metalness: 0.14,
      roughness: 0.37,
      flatShading: !curved,
    }));
    geometry.computeBoundingBox();
    model.position.y = -geometry.boundingBox.min.y;
    scene.add(model);
    if (!curved) {
      edgeLines = new THREE.LineSegments(
        new THREE.EdgesGeometry(geometry),
        new THREE.LineBasicMaterial({ color: 0xf4ffe7, transparent: true, opacity: 0.65 }),
      );
      edgeLines.position.copy(model.position);
      scene.add(edgeLines);
    }
    const center = new THREE.Vector3();
    geometry.boundingBox.getCenter(center);
    center.y += model.position.y;
    controls.target.copy(center);
    const distance = Math.max(size * 2.7, 4);
    camera.position.set(center.x + distance, center.y + distance * 0.72, center.z + distance);
    camera.near = Math.max(size * 0.005, 0.01);
    camera.far = Math.max(size * 100, 100);
    camera.updateProjectionMatrix();
    controls.update();
    activeShape = shape;
    activeSize = size;
    document.querySelector("#shape-title").textContent = shape.replaceAll("_", " ").toUpperCase();
    document.querySelector("#shape-size-label").textContent = `${size} UNITS`;
  }

  function moveView(direction) {
    const distance = Math.max(activeSize * 0.3, 0.5);
    const movement = direction === "up" ? distance : -distance;
    controls.target.y += movement;
    camera.position.y += movement;
    controls.update();
  }

  function zoomView(direction) {
    const offset = camera.position.clone().sub(controls.target);
    const factor = direction === "in" ? 0.8 : 1.25;
    const distance = THREE.MathUtils.clamp(offset.length() * factor, controls.minDistance, controls.maxDistance);
    camera.position.copy(controls.target).add(offset.setLength(distance));
    controls.update();
  }

  new ResizeObserver(() => resizeRenderer(renderer, camera, shapeCanvas)).observe(shapeCanvas.parentElement);
  resizeRenderer(renderer, camera, shapeCanvas);
  drawShape(activeShape, activeSize);
  function animate() {
    requestAnimationFrame(animate);
    if (model) {
      model.rotation.y += 0.002;
      if (edgeLines) edgeLines.rotation.y = model.rotation.y;
    }
    controls.update();
    renderer.render(scene, camera);
  }
  animate();
  return { drawShape, moveView, zoomView };
}

const studioModel = startStudioModel();
const drawShape = studioModel.drawShape;
const form = document.querySelector("#shape-form");
const shapeSelect = document.querySelector("#shape-select");
const commandInput = document.querySelector("#command-input");
const sizeRange = document.querySelector("#size-range");
const sizeNumber = document.querySelector("#size-number");
const sizeOutput = document.querySelector("#size-output");
const generateButton = document.querySelector("#generate-button");

function updateSize(value) {
  const size = Number(value);
  if (!Number.isFinite(size) || size <= 0) return;
  sizeNumber.value = String(size);
  sizeRange.value = String(Math.max(1, Math.min(20, size)));
  sizeOutput.value = `${size} units`;
}

const spokenNumberWords = {
  zero: 0, one: 1, two: 2, three: 3, four: 4, five: 5,
  six: 6, seven: 7, eight: 8, nine: 9, ten: 10,
  eleven: 11, twelve: 12, thirteen: 13, fourteen: 14,
  fifteen: 15, sixteen: 16, seventeen: 17, eighteen: 18,
  nineteen: 19, twenty: 20, thirty: 30, forty: 40,
  fifty: 50, sixty: 60, seventy: 70, eighty: 80, ninety: 90,
  hundred: 100, thousand: 1000, million: 1000000,
  billion: 1000000000, trillion: 1000000000000,
};

function inferShapeFromCommand(command) {
  if (!command) return shapeSelect.value;
  const normalized = command.toLowerCase();
  const mapping = {
    cube: /\b(cube|square)\b/,
    cuboid: /\b(cuboid|box|rectangle)\b/,
    sphere: /\b(sphere|ball|circle)\b/,
    pyramid: /\b(pyramid|triangle)\b/,
    tetrahedron: /\b(tetrahedron)\b/,
    cone: /\b(cone)\b/,
    cylinder: /\b(cylinder)\b/,
    pentagonal_prism: /\b(pentagonal|pentagon)\b/,
    hexagonal_prism: /\b(hexagonal|hexagon)\b/,
    octagonal_prism: /\b(octagonal|octagon)\b/,
    torus: /\b(torus|donut|doughnut)\b/,
  };
  const match = Object.entries(mapping).find(([, pattern]) => pattern.test(normalized));
  return match ? match[0] : shapeSelect.value;
}

function inferSizeFromCommand(command) {
  if (!command) return Number(sizeNumber.value);

  const directMatch = command.match(/\d+(?:\.\d+)?/);
  if (directMatch) return Number(directMatch[0]);

  let total = 0;
  let current = 0;
  let found = false;
  const words = command.toLowerCase().replace(/[^a-z\s-]/g, " ").split(/\s+/).filter(Boolean);

  for (const word of words) {
    if (word in spokenNumberWords) {
      found = true;
      const value = spokenNumberWords[word];
      if (value === 100) {
        current = (current || 1) * 100;
      } else if (value >= 1000) {
        total += (current || 1) * value;
        current = 0;
      } else {
        current += value;
      }
    } else if (found && !["and", "-"].includes(word)) {
      break;
    }
  }

  return found ? total + current : Number(sizeNumber.value);
}

sizeRange.addEventListener("input", () => updateSize(sizeRange.value));
sizeNumber.addEventListener("input", () => updateSize(sizeNumber.value));

async function submitShape(command = commandInput.value.trim()) {
  const request = { shape: shapeSelect.value, size: sizeNumber.value };
  if (command) request.command = command;
  generateButton.disabled = true;
  announce("Creating your model...");
  try {
    const response = await fetch("/api/shape", {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify(request),
    });
    const result = await response.json();
    if (!response.ok) throw new Error(result.error || "I couldn't create that model.");
    shapeSelect.value = result.shape;
    updateSize(result.size);
    drawShape(result.shape, result.size);
    commandInput.value = "";
    announce(`${result.title} created. You can rotate it or ask for another shape.`);
  } catch (error) {
    const fallbackShape = inferShapeFromCommand(command);
    const fallbackSize = inferSizeFromCommand(command);
    const localSize = Number(fallbackSize);
    if (fallbackShape && Number.isFinite(localSize) && localSize > 0) {
      shapeSelect.value = fallbackShape;
      updateSize(localSize);
      drawShape(fallbackShape, localSize);
      commandInput.value = "";
      announce(`Created a ${fallbackShape.replaceAll("_", " ")} at size ${localSize}. The local helper was unavailable.`);
      return;
    }
    announce(error.message || "The studio could not reach its Python backend.", true);
  } finally {
    generateButton.disabled = false;
  }
}

form.addEventListener("submit", (event) => {
  event.preventDefault();
  submitShape();
});

function isStartCommand(text) {
  return /\b(start|begin|let'?s go|get started|open studio|start teaching)\b/i.test(text);
}

function isHomeCommand(text) {
  return /\b(go home|back to welcome|main page)\b/i.test(text);
}

function isChooserCommand(text) {
  const normalized = text.toLowerCase().trim().replace(/[.!?]+$/, "");
  return /^(?:(?:please\s+)?(?:go\s+)?back|(?:please\s+)?back\s+to\s+(?:teaching\s+)?spaces|(?:please\s+)?(?:go\s+)?back\s+to\s+(?:the\s+)?(?:main\s+)?menu|(?:please\s+)?(?:open|show|go\s+to|return\s+to)\s+(?:the\s+)?(?:main\s+)?menu|(?:main\s+)?menu|(?:please\s+)?(?:choose|select)\s+another\s+space|(?:please\s+)?(?:change|switch)\s+(?:teaching\s+)?spaces|(?:please\s+)?show\s+teaching\s+spaces|another\s+space)$/i.test(normalized);
}

function handleStudioViewCommand(text) {
  const normalized = text.toLowerCase().trim();
  if (/\b(?:scroll|scrowl|move|pan)\s+(?:the\s+)?(?:view\s+)?up\b/.test(normalized)) {
    studioModel.moveView("up");
    announce("Moved the 3D view up.");
    return true;
  }
  if (/\b(?:scroll|scrowl|move|pan)\s+(?:the\s+)?(?:view\s+)?down\b/.test(normalized)) {
    studioModel.moveView("down");
    announce("Moved the 3D view down.");
    return true;
  }
  if (/\bzoom\s+in\b|\bmove\s+closer\b/.test(normalized)) {
    studioModel.zoomView("in");
    announce("Zoomed in on the 3D model.");
    return true;
  }
  if (/\bzoom\s+out\b|\bmove\s+(?:farther|further)\s+away\b/.test(normalized)) {
    studioModel.zoomView("out");
    announce("Zoomed out from the 3D model.");
    return true;
  }
  return false;
}

function appendWriting(text) {
  const board = document.querySelector("#writing-board");
  const addition = text.trim();
  if (!addition) return;
  const separator = board.value && !/\s$/.test(board.value) ? " " : "";
  board.value += `${separator}${addition}`;
  board.dispatchEvent(new Event("input", { bubbles: true }));
  document.querySelector("#writing-status").textContent = writingLanguage === "hi"
    ? `जोड़ा गया: “${addition}”`
    : `Added: “${addition}”`;
}

function setMathMode(enabled) {
  mathMode = enabled;
  const button = document.querySelector("#math-mode-toggle");
  button.textContent = `Math mode: ${enabled ? "on" : "off"}`;
  button.setAttribute("aria-pressed", String(enabled));
  document.querySelector("#writing-title").innerHTML = enabled
    ? "Math <em>mode.</em>"
    : writingLanguage === "hi" ? "लिखने की <em>जगह।</em>" : "Writing <em>space.</em>";
  document.querySelector("#writing-status").textContent = enabled
    ? "Math mode is on. Speak a calculation, for example “3 raised to the power of 3”."
    : "Math mode is off. Speak normally to write on the board.";
}

function calculateSpokenMath(text) {
  const numberWords = {
    zero: 0, oh: 0, one: 1, two: 2, three: 3, four: 4, five: 5, six: 6, seven: 7, eight: 8, nine: 9,
    ten: 10, eleven: 11, twelve: 12, thirteen: 13, fourteen: 14, fifteen: 15, sixteen: 16,
    seventeen: 17, eighteen: 18, nineteen: 19, twenty: 20, thirty: 30, forty: 40, fifty: 50,
    sixty: 60, seventy: 70, eighty: 80, ninety: 90, hundred: 100, thousand: 1000,
  };
  const normalized = text.toLowerCase()
    .replace(/[?,]/g, " ")
    .replace(/^(?:what is|what's|calculate|compute|solve|evaluate)\s+/, "")
    .replace(/\s+(?:equals?(?:\s+to)?|equal\s+to)(?:\s+.*)?$/, "")
    .replace(/^(?:add|sum)\s+(.+?)\s+and\s+(.+)$/, "$1 + $2")
    .replace(/^subtract\s+(.+?)\s+from\s+(.+)$/, "$2 - $1")
    .replace(/^multiply\s+(.+?)\s+by\s+(.+)$/, "$1 * $2")
    .replace(/^divide\s+(.+?)\s+by\s+(.+)$/, "$1 / $2")
    .replace(/\bsquare root of\b/g, "sqrt ")
    .replace(/\b(?:raised|raise)\s+to\s+(?:the\s+)?power(?:\s+of)?\b/g, "^")
    .replace(/\bto\s+(?:the\s+)?power(?:\s+of)?\b/g, "^")
    .replace(/\b([\w.]+)\s+squared\b/g, "$1 ^ 2")
    .replace(/\b([\w.]+)\s+cubed\b/g, "$1 ^ 3")
    .replace(/\b(?:multiplied|multiply)\s+by\b|\btimes\b/g, "*")
    .replace(/\b(?:divided|divide)\s+by\b/g, "/")
    .replace(/\bplus\b|\badd\b/g, "+")
    .replace(/\bminus\b|\bsubtract\b|\bnegative\b/g, "-")
    .replace(/\b(?:modulo|mod)\b/g, "%")
    .replace(/\bopen parenthesis\b/g, "(")
    .replace(/\bclose parenthesis\b/g, ")")
    .replace(/[×]/g, "*")
    .replace(/[÷]/g, "/")
    .replace(/[−–]/g, "-")
    .trim();
  const tokens = normalized.match(/\d+(?:\.\d+)?|[()+\-*/%^]|[a-z]+/g) || [];
  if (!tokens.length || !/[+\-*/%^]/.test(tokens.join("")) && !tokens.includes("sqrt")) return null;

  const parsedTokens = [];
  for (let index = 0; index < tokens.length;) {
    if (!(tokens[index] in numberWords)) {
      parsedTokens.push(tokens[index]);
      index += 1;
      continue;
    }
    let total = 0;
    let current = 0;
    while (index < tokens.length && (tokens[index] in numberWords || tokens[index] === "and")) {
      const word = tokens[index];
      if (word === "and") {
        index += 1;
        continue;
      }
      const value = numberWords[word];
      if (value === 100 || value === 1000) {
        current = Math.max(current, 1) * value;
        if (value === 1000) {
          total += current;
          current = 0;
        }
      } else {
        current += value;
      }
      index += 1;
    }
    parsedTokens.push(String(total + current));
  }

  let position = 0;
  function parsePrimary() {
    const token = parsedTokens[position++];
    if (token === "(") {
      const value = parseExpression();
      if (parsedTokens[position++] !== ")") throw new Error("Missing closing parenthesis");
      return value;
    }
    if (/^\d+(?:\.\d+)?$/.test(token || "")) return Number(token);
    throw new Error("Expected a number");
  }
  function parsePower() {
    const value = parsePrimary();
    if (parsedTokens[position] === "^") {
      position += 1;
      return value ** parseUnary();
    }
    return value;
  }
  function parseUnary() {
    if (parsedTokens[position] === "+") {
      position += 1;
      return parseUnary();
    }
    if (parsedTokens[position] === "-") {
      position += 1;
      return -parseUnary();
    }
    if (parsedTokens[position] === "sqrt") {
      position += 1;
      return Math.sqrt(parseUnary());
    }
    return parsePower();
  }
  function parseTerm() {
    let value = parseUnary();
    while (["*", "/", "%"].includes(parsedTokens[position])) {
      const operator = parsedTokens[position++];
      const right = parseUnary();
      if ((operator === "/" || operator === "%") && right === 0) throw new Error("Cannot divide by zero");
      value = operator === "*" ? value * right : operator === "/" ? value / right : value % right;
    }
    return value;
  }
  function parseExpression() {
    let value = parseTerm();
    while (["+", "-"].includes(parsedTokens[position])) {
      const operator = parsedTokens[position++];
      const right = parseTerm();
      value = operator === "+" ? value + right : value - right;
    }
    return value;
  }

  try {
    const result = parseExpression();
    if (position !== parsedTokens.length || !Number.isFinite(result)) return null;
    const expression = parsedTokens.map((token) => ({ "*": "×", "/": "÷", "-": "−", sqrt: "√" })[token] || token).join(" ");
    const roundedResult = Number(result.toPrecision(12));
    return `${expression} = ${roundedResult}`;
  } catch {
    return null;
  }
}

function eraseLastWord() {
  const board = document.querySelector("#writing-board");
  const trimmed = board.value.replace(/\s+$/, "");
  board.value = trimmed.replace(/\s*\S+$/, "");
  document.querySelector("#writing-status").textContent = writingLanguage === "hi"
    ? (trimmed === board.value ? "मिटाने के लिए कोई शब्द नहीं है।" : "आख़िरी शब्द मिटा दिया गया।")
    : (trimmed === board.value ? "There is nothing left to erase." : "Removed the last word.");
}

function handleWritingCommand(text) {
  if (/^(erase\s+(the\s+)?(whole|everything|all)(\s+board)?|पूरा\s+बोर्ड\s+(मिटाओ|साफ़?\s+करो)|सब\s+मिटाओ)[.!?।]*$/i.test(text)) {
    document.querySelector("#writing-board").value = "";
    document.querySelector("#writing-status").textContent = writingLanguage === "hi" ? "पूरा बोर्ड साफ़ हो गया है।" : "The whole board is clear.";
  } else if (/^(erase|erase\s+(the\s+)?(last\s+)?word|delete\s+(the\s+)?last\s+word|मिटाओ|आख़िरी\s+शब्द\s+मिटाओ|आखिरी\s+शब्द\s+मिटाओ)[.!?।]*$/i.test(text)) {
    eraseLastWord();
  } else if (mathMode) {
    const calculation = calculateSpokenMath(text);
    if (calculation) {
      appendWriting(calculation);
      document.querySelector("#writing-status").textContent = `Solved: ${calculation}`;
    } else {
      appendWriting(text);
    }
  } else {
    appendWriting(text);
  }
}

function isMathModeCommand(text) {
  const normalized = text.toLowerCase().trim().replace(/[.!?]+$/, "");
  const mode = "maths?";
  if (new RegExp(`^(?:(?:turn|switch)\\s+(?:on\\s+)?|enable\\s+|start\\s+)?(?:the\\s+)?${mode}\\s+mode\\s+(?:on|enable|start)$`).test(normalized)
    || new RegExp(`^(?:turn|switch)\\s+(?:the\\s+)?${mode}\\s+mode\\s+on$`).test(normalized)
    || new RegExp(`^(?:turn|switch)\\s+on\\s+(?:the\\s+)?${mode}\\s+mode$`).test(normalized)
    || new RegExp(`^(?:enable|start)\\s+(?:the\\s+)?${mode}\\s+mode$`).test(normalized)) return true;
  if (new RegExp(`^(?:(?:turn|switch)\\s+(?:off\\s+)?|disable\\s+|stop\\s+)?(?:the\\s+)?${mode}\\s+mode\\s+(?:off|disable|stop)$`).test(normalized)
    || new RegExp(`^(?:turn|switch)\\s+(?:the\\s+)?${mode}\\s+mode\\s+off$`).test(normalized)
    || new RegExp(`^(?:turn|switch)\\s+off\\s+(?:the\\s+)?${mode}\\s+mode$`).test(normalized)
    || new RegExp(`^(?:disable|stop)\\s+(?:the\\s+)?${mode}\\s+mode$`).test(normalized)) return false;
  return null;
}

function handleWritingScrollCommand(text) {
  const normalized = text.toLowerCase().trim();
  const scrollUp = /\b(?:scroll|scrowl)\s+(?:the\s+)?(?:board\s+)?up\b/.test(normalized)
    || /(?:बोर्ड\s+)?ऊपर\s+स्क्रॉल\s+(?:करो|करिए|करें|कर\s+दो)|बोर्ड\s+ऊपर\s+(?:करो|करिए|करें)/.test(normalized);
  const scrollDown = /\b(?:scroll|scrowl)\s+(?:the\s+)?(?:board\s+)?down\b/.test(normalized)
    || /(?:बोर्ड\s+)?नीचे\s+स्क्रॉल\s+(?:करो|करिए|करें|कर\s+दो)|बोर्ड\s+नीचे\s+(?:करो|करिए|करें)/.test(normalized);
  if (!scrollUp && !scrollDown) return false;

  const board = document.querySelector("#writing-board");
  const amount = Math.max(board.clientHeight * 0.75, 180);
  const maxScroll = board.scrollHeight - board.clientHeight;
  if (maxScroll > 1) {
    board.scrollBy({ top: scrollUp ? -amount : amount, behavior: "smooth" });
  } else {
    window.scrollBy({ top: scrollUp ? -amount : amount, behavior: "smooth" });
  }
  board.focus({ preventScroll: true });
  document.querySelector("#writing-status").textContent = writingLanguage === "hi"
    ? (scrollUp ? "बोर्ड ऊपर स्क्रॉल किया।" : "बोर्ड नीचे स्क्रॉल किया।")
    : (scrollUp ? "Scrolled the board up." : "Scrolled the board down.");
  return true;
}

function isLanguageCommand(text) {
  const normalized = text.toLowerCase().trim();
  const polite = "(?:please\\s+)?";
  if (new RegExp(`^${polite}(?:(?:turn|switch|change)\\s+on\\s+|enable\\s+|start\\s+|switch\\s+(?:to\\s+)?|change\\s+(?:to\\s+)?|write\\s+in\\s+)?(?:the\\s+)?(hindi|हिंदी|हिन्दी)(?:\\s+(?:writing\\s+)?(?:mode|language|भाषा|मोड))?[.!?।]*$`).test(normalized)) return "hi";
  if (new RegExp(`^${polite}(?:(?:turn|switch|change)\\s+on\\s+|enable\\s+|start\\s+|switch\\s+(?:to\\s+)?|change\\s+(?:to\\s+)?|write\\s+in\\s+)?(?:the\\s+)?(english|अंग्रेज़ी|अंग्रेजी)(?:\\s+(?:writing\\s+)?(?:mode|language|भाषा|मोड))?[.!?।]*$`).test(normalized)) return "en";
  if (/^(switch|change)\s+(to\s+)?(hindi|हिंदी|हिन्दी)(\s+mode)?[.!?।]*$/.test(normalized)) return "hi";
  if (/^(switch|change)\s+(to\s+)?(english|अंग्रेज़ी|अंग्रेजी)(\s+mode)?[.!?।]*$/.test(normalized)) return "en";
  if (/^(?:कृपया\s+)?(?:हिंदी|हिन्दी)\s+(?:(?:मोड|भाषा)\s+)?(?:चालू|शुरू)\s+(?:करो|करिए|करें|कर\s+दो)[.!?।]*$/.test(normalized)) return "hi";
  if (/^(?:कृपया\s+)?(?:अंग्रेज़ी|अंग्रेजी)\s+(?:(?:मोड|भाषा)\s+)?(?:चालू|शुरू)\s+(?:करो|करिए|करें|कर\s+दो)[.!?।]*$/.test(normalized)) return "en";
  if (/^(?:हिंदी|हिन्दी)\s+में\s+(?:लिखो|बोलो|बात\s+करो|लिखना\s+शुरू\s+करो)[.!?।]*$/.test(normalized)) return "hi";
  if (/^(?:अंग्रेज़ी|अंग्रेजी)\s+में\s+(?:लिखो|बोलो|बात\s+करो|लिखना\s+शुरू\s+करो)[.!?।]*$/.test(normalized)) return "en";
  return null;
}

function openWritingMode(mode) {
  const language = mode === "hindi" ? "hi" : "en";
  setWritingLanguage(language);
  setMathMode(mode === "math");
  switchView("writing");
  document.querySelector("#writing-status").textContent = mode === "math"
    ? "Math mode is on. Speak a calculation, for example “3 raised to the power of 3”."
    : language === "hi"
      ? "हिंदी मोड चालू है। अब हिंदी में बोलें।"
      : "English mode is on. You can speak in English.";
}

function handleVoiceCommand(rawText) {
  const text = rawText.trim();
  if (!text) return;
  const currentView = document.body.dataset.view;
  const language = isLanguageCommand(text);
  if (language) {
    openWritingMode(language === "hi" ? "hindi" : "english");
    return;
  }
  if (/^(?:please\s+)?maths?\s+mode[.!?]*$/i.test(text)) {
    if (currentView === "writing") setMathMode(true);
    else openWritingMode("math");
    return;
  }
  const mathModeCommand = isMathModeCommand(text);
  if (mathModeCommand !== null && (currentView === "welcome" || currentView === "chooser")) {
    openWritingMode(mathModeCommand ? "math" : "english");
    return;
  }
  if (currentView === "writing" && mathModeCommand !== null) {
    setMathMode(mathModeCommand);
    return;
  }
  if (currentView === "writing" && handleWritingScrollCommand(text)) return;
  if (isHomeCommand(text)) {
    switchView("welcome");
    announce(`Heard “${text}”. Back at the welcome page.`);
    return;
  }
  if (isChooserCommand(text)) {
    switchView("chooser");
    return;
  }
  if (currentView === "welcome" && isStartCommand(text)) {
    switchView("chooser");
    return;
  }
  if (/\b(writing space|writing board|write space)\b/i.test(text)) {
    openWritingMode("english");
    return;
  }
  if (/\b(3d figures|3d shapes|shape studio|figures)\b/i.test(text)) {
    switchView("studio");
    return;
  }
  if (currentView === "welcome" || currentView === "chooser") {
    switchView("chooser");
    announce("Choose 3D figures, Hindi, math, or English mode.");
    return;
  }
  if (currentView === "studio" && handleStudioViewCommand(text)) return;
  if (document.body.dataset.view === "writing") {
    handleWritingCommand(text);
    return;
  }
  commandInput.value = text;
  submitShape(text);
}

function setListeningState(isListening) {
  const headerButton = document.querySelector("#header-mic");
  const welcomeButton = document.querySelector("#welcome-listen");
  const studioButton = document.querySelector("#voice-button");
  [headerButton, welcomeButton, studioButton].forEach((button) => {
    button.classList.toggle("is-listening", isListening);
  });
  headerButton.textContent = isListening ? "Listening · turn off" : "Turn mic on";
  welcomeButton.innerHTML = isListening ? "Listening <span class=\"mic-glyph\" aria-hidden=\"true\">◉</span>" : "Turn mic on <span class=\"mic-glyph\" aria-hidden=\"true\">◉</span>";
  studioButton.textContent = isListening ? "Listening" : "Speak";
  studioButton.setAttribute("aria-label", isListening ? "Stop voice commands" : "Start voice command");
}

function startRecognition() {
  if (!SpeechRecognition) {
    announce("Voice input is not supported here. Use the text field or buttons instead.", true);
    return;
  }
  if (recognitionActive) return;
  recognition = new SpeechRecognition();
  recognition.lang = document.body.dataset.view === "writing" && writingLanguage === "hi" ? "hi-IN" : "en-IN";
  recognition.continuous = true;
  recognition.interimResults = false;
  recognition.onstart = () => {
    recognitionActive = true;
    voiceEnabled = true;
    setListeningState(true);
    const prompts = {
      welcome: "Listening. Say “get started” to choose a teaching space.",
      chooser: "Listening. Say “3D figures”, “Hindi mode”, “math mode”, or “English mode”.",
      studio: "Listening. Say a shape and size, for example “draw a cube size 8”.",
      writing: mathMode
        ? "Math mode is on. Say a calculation, or say “turn math mode off” to dictate."
        : "Listening. Speak to write, say “erase” or “erase whole”, or scroll the board.",
    };
    const hindiWritingPrompt = "मैं सुन रहा हूँ। हिंदी में बोलकर लिखें, “मिटाओ” कहें या बोर्ड स्क्रॉल करने को कहें।";
    announce(document.body.dataset.view === "writing" && writingLanguage === "hi"
      ? hindiWritingPrompt
      : prompts[document.body.dataset.view]);
  };
  recognition.onresult = (event) => {
    for (let index = event.resultIndex; index < event.results.length; index += 1) {
      if (event.results[index].isFinal) handleVoiceCommand(event.results[index][0].transcript);
    }
  };
  recognition.onerror = (event) => {
    if (event.error === "not-allowed" || event.error === "service-not-allowed") {
      voiceEnabled = false;
      announce("Microphone permission was not granted. You can still use the buttons and text field.", true);
    } else if (event.error !== "no-speech" && event.error !== "aborted") {
      announce("Voice recognition paused. Select Turn mic on to try again.", true);
    }
  };
  recognition.onend = () => {
    recognitionActive = false;
    setListeningState(false);
    if (voiceEnabled) window.setTimeout(startRecognition, 500);
  };
  try {
    recognition.start();
  } catch (error) {
    voiceEnabled = false;
    announce("Could not start the microphone. Check browser permission and try again.", true);
  }
}

function stopRecognition() {
  voiceEnabled = false;
  recognition?.stop();
  recognitionActive = false;
  setListeningState(false);
  announce("Microphone is off. You can still use the buttons and text field.");
}

function toggleRecognition() {
  if (voiceEnabled || recognitionActive) stopRecognition();
  else startRecognition();
}

["#header-mic", "#welcome-listen", "#voice-button"].forEach((selector) => {
  document.querySelector(selector).addEventListener("click", toggleRecognition);
});
document.querySelector("#get-started").addEventListener("click", () => switchView("chooser"));
document.querySelectorAll("[data-go]").forEach((element) => {
  element.addEventListener("click", (event) => {
    event.preventDefault();
    if (element.dataset.writingMode) openWritingMode(element.dataset.writingMode);
    else switchView(element.dataset.go);
  });
});
document.querySelector("#reset-view").addEventListener("click", () => {
  drawShape(activeShape, activeSize);
  announce("The model view has been reset.");
});
document.querySelector("#erase-word").addEventListener("click", eraseLastWord);
document.querySelector("#math-mode-toggle").addEventListener("click", () => setMathMode(!mathMode));
document.querySelector("#clear-board").addEventListener("click", () => {
  document.querySelector("#writing-board").value = "";
  document.querySelector("#writing-status").textContent = writingLanguage === "hi" ? "पूरा बोर्ड साफ़ हो गया है।" : "The whole board is clear.";
});
document.querySelectorAll("[data-writing-language]").forEach((button) => {
  button.addEventListener("click", () => {
    setMathMode(false);
    setWritingLanguage(button.dataset.writingLanguage);
  });
});
window.addEventListener("popstate", () => {
  const view = location.hash.slice(1);
  switchView(["welcome", "chooser", "studio", "writing"].includes(view) ? view : "welcome", false);
});

if (!SpeechRecognition) {
  document.querySelector("#welcome-status").textContent = "Voice input is not supported in this browser. Select Get started to continue with the controls.";
  document.querySelector("#voice-button").title = "Voice input is not supported by this browser";
}
if (["chooser", "studio", "writing"].includes(location.hash.slice(1))) switchView(location.hash.slice(1), false);
startWelcomeModel();