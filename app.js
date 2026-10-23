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
let assistantRecognition;
let assistantListening = false;
let assistantQuestionMode = false;
let assistantSpeaking = false;
const assistantConversation = [];
let writingLanguage = "en";
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
    commands: "आवाज़ से कहें: “मिटाओ” · “पूरा बोर्ड मिटाओ”",
    assistantTitle: assistantQuestionMode ? "आवाज़ से सवाल पूछें" : "सवाल पूछें",
    intro: "किसी भी विषय पर सवाल पूछें या आगे का सवाल करें। आवाज़ से सवाल मोड शुरू करने के लिए कहें “मुझे एक सवाल पूछना है।”",
    question: "आसमान नीला क्यों दिखाई देता है?",
    speak: "सवाल बोलें",
    ask: "पूछें",
    back: "बोर्ड पर वापस जाएँ",
    mode: "आवाज़ से सवाल पूछने का मोड",
    modeStatus: "मैं सुन रहा हूँ। अपना सवाल पूछिए।",
    modeHint: "एक और सवाल पूछें या लिखने के लिए कहें “बोर्ड पर वापस जाएँ।”",
    voiceCommands: "बोलें: “पूरा बोर्ड मिटाओ” · “मिटाओ” · “मुझे एक सवाल पूछना है”",
    aiNote: "एआई के जवाब के लिए इंटरनेट और Shiksha AI चलाने वाले कंप्यूटर पर GEMINI_API_KEY सेट होना ज़रूरी है।",
  } : {
    heading: "Writing space.",
    subtitle: "Speak naturally. Your words appear on the board.",
    board: "CLASSROOM BOARD",
    eraseWord: "Erase last word",
    eraseWhole: "Erase whole board",
    placeholder: "Your lesson will appear here…\n\nTry saying, “This is an apple.”",
    ready: "Ready to write. Turn on the mic and start speaking.",
    commands: "VOICE COMMANDS: “ERASE” · “ERASE WHOLE”",
    assistantTitle: assistantQuestionMode ? "Voice question mode" : "Ask a question",
    intro: "Ask about any topic or follow up. Say “I want to ask a question” to start voice question mode.",
    question: "Why is the sky blue?",
    speak: "Speak question",
    ask: "Ask",
    back: "Back to board",
    mode: "VOICE QUESTION MODE",
    modeStatus: "I’m listening. Ask me anything.",
    modeHint: "Ask another question, or say “back to board” to continue writing.",
    voiceCommands: "Say: “Turn on Hindi mode” · “erase” · “erase whole” · “I want to ask a question”",
    aiNote: "AI answers need internet and GEMINI_API_KEY configured on the computer running Shiksha AI.",
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
  document.querySelector("#assistant-title").textContent = copy.assistantTitle;
  document.querySelector("#assistant-intro").textContent = copy.intro;
  document.querySelector("#assistant-question").placeholder = copy.question;
  document.querySelector("#assistant-question").lang = hindi ? "hi" : "en";
  document.querySelector("#assistant-voice").innerHTML = `${copy.speak} <span aria-hidden="true">◉</span>`;
  document.querySelector("#assistant-form .assistant-send").innerHTML = `${copy.ask} <span aria-hidden="true">↗</span>`;
  document.querySelector("#assistant-mode-banner > div > p").textContent = copy.mode;
  document.querySelector("#assistant-mode-status").textContent = copy.modeStatus;
  document.querySelector("#assistant-mode-banner > div > span").textContent = copy.modeHint;
  document.querySelector("#assistant-mode-exit").textContent = copy.back;
  document.querySelector(".board-footer > span").textContent = copy.voiceCommands;
  document.querySelector(".assistant-note").textContent = copy.aiNote;
  const firstAnswer = document.querySelector("#assistant-messages .assistant-answer p");
  if (firstAnswer && assistantConversation.length === 0) {
    firstAnswer.textContent = hindi
      ? "नमस्ते! मुझसे कुछ भी पूछें। मैं सरल और स्पष्ट तरीके से समझाने की कोशिश करूँगा।"
      : "Hi! Ask me anything. I’ll do my best to explain it clearly.";
  }
  document.querySelectorAll("[data-writing-language]").forEach((button) => {
    button.setAttribute("aria-pressed", String(button.dataset.writingLanguage === language));
  });
  if (assistantQuestionMode) {
    document.querySelector("#assistant-mode-banner").hidden = false;
    document.querySelector("#writing-view").classList.add("is-assistant-mode");
  }
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
  if (view !== "writing") setAssistantQuestionMode(false);
  if (updateHistory) history.replaceState({ view }, "", view === "welcome" ? "#welcome" : `#${view}`);
  if (view === "studio") {
    window.setTimeout(() => document.querySelector("#command-input").focus(), 50);
  } else if (view === "writing") {
    window.setTimeout(() => document.querySelector("#writing-board").focus(), 50);
  }
  if (voiceEnabled) {
    const prompt = {
      welcome: "Listening. Say “get started” to choose a teaching space.",
      chooser: "Listening. Say “3D figures” or “writing space”.",
      studio: "Listening. Say a shape and size.",
      writing: "Listening. Speak to write, or say “erase” or “erase whole”.",
    };
    announce(prompt[view]);
  }
}

function setAssistantQuestionMode(enabled, status = "I’m listening. Ask me anything.") {
  assistantQuestionMode = enabled;
  const writing = document.querySelector("#writing-view");
  const banner = document.querySelector("#assistant-mode-banner");
  writing.classList.toggle("is-assistant-mode", enabled);
  banner.hidden = !enabled;
  document.querySelector("#assistant-title").textContent = enabled
    ? (writingLanguage === "hi" ? "आवाज़ से सवाल पूछें" : "Voice question mode")
    : (writingLanguage === "hi" ? "सवाल पूछें" : "Ask a question");
  if (enabled) {
    document.querySelector("#assistant-mode-status").textContent = status;
    document.querySelector("#assistant-question").focus();
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
  return drawShape;
}

const drawShape = startStudioModel();
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
  return /\b(choose another space|back to spaces|show teaching spaces)\b/i.test(text);
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
  } else {
    appendWriting(text);
  }
}

function addAssistantMessage(message, isQuestion) {
  const article = document.createElement("article");
  article.className = `assistant-message ${isQuestion ? "assistant-question" : "assistant-answer"}`;
  const label = document.createElement("span");
  label.textContent = isQuestion ? "YOU" : "SHIKSHA";
  const paragraph = document.createElement("p");
  paragraph.textContent = message;
  article.append(label, paragraph);
  const messages = document.querySelector("#assistant-messages");
  messages.append(article);
  messages.scrollTop = messages.scrollHeight;
  return article;
}

function assistantQuestionFromCommand(text) {
  const patterns = [
    /^(?:hey\s+)?(?:ask\s+(?:(?:to\s+)?the\s+|to\s+)?(?:ai|shiksha)|question\s+for\s+(?:the\s+)?(?:ai|shiksha)|(?:hey|okay|ok)\s+(?:ai|shiksha))\b[\s,:-]*(.*)$/i,
    /^(?:i\s+(?:want|would like|need)\s+to\s+ask|can\s+i\s+ask|could\s+i\s+ask)\s+(?:a\s+question|(?:(?:the|to the|to)\s+)?(?:ai|shiksha)(?:\s+a\s+question)?)\b[\s,:-]*(.*)$/i,
    /^(?:i\s+have|i\s+want\s+to\s+ask|i\s+need\s+to\s+ask|can\s+i\s+ask|could\s+i\s+ask)\s+(?:a\s+)?(?:question|something)\b[\s,:-]*(.*)$/i,
    /^ask\s+(?:(?:the\s+)?(?:ai|shiksha)\s+)?(?:a\s+)?question\b[\s,:-]*(.*)$/i,
    /^(?:मुझे|मैं)\s+(?:एक\s+)?(?:सवाल|प्रश्न)\s+पूछना\s+(?:है|है\s+कि)[\s,:-]*(.*)$/i,
    /^(?:मुझे|मैं)\s+(?:एआई|शिक्षा\s+एआई)\s+से\s+(?:एक\s+)?(?:सवाल|प्रश्न)\s+पूछना\s+(?:है|है\s+कि)[\s,:-]*(.*)$/i,
    /^(?:एआई|शिक्षा\s+एआई)\s+से\s+(?:एक\s+)?(?:सवाल|प्रश्न)\s+पूछो[\s,:-]*(.*)$/i,
    /^(?:पूछो|सवाल\s+पूछो)(?:\s+(?:एआई|शिक्षा\s+एआई)\s+से)?[\s,:-]*(.*)$/i,
    /^(?:please\s+)?(?:turn\s+on|enable|start|open)\s+(?:the\s+)?(?:ai|shiksha\s+ai|question)\s+mode\b[\s,:-]*(.*)$/i,
    /^(?:i\s+want|i\s+need|can\s+i|could\s+i)\s+to\s+ask\s+(?:a\s+question\s+)?(?:to\s+)?(?:the\s+)?(?:ai|shiksha\s+ai)\b[\s,:-]*(.*)$/i,
    /^(?:i\s+(?:have|want|need)\s+a\s+question|i\s+want\s+to\s+ask\s+(?:you|someone))\b[\s,:-]*(.*)$/i,
    /^((?:what|why|how|when|where|who|which|is|are|can|does|do|did)\b.+)$/i,
    /^(.+(?:क्या|क्यों|कैसे|कब|कहाँ|कौन|किसने|किसका|किसकी|कितना|कितनी).*)[।?]?$/i,
    /^(?:मुझे|मैं)\s+(?:एआई|शिक्षा\s+एआई)\s+से\s+(?:एक\s+)?(?:सवाल|प्रश्न)\s+पूछना\s+है[\s,:-]*(.*)$/i,
    /^(?:मुझे|मैं)\s+(?:आपसे|एआई\s+से)\s+(?:कुछ\s+)?पूछना\s+है[\s,:-]*(.*)$/i,
    /^(?:मेरा\s+एक\s+सवाल\s+है|मुझे\s+एक\s+सवाल\s+पूछना\s+है)[\s,:-]*(.*)$/i,
    /^(?:एआई|शिक्षा\s+एआई)\s+(?:मोड\s+)?(?:चालू|शुरू)\s+करो[\s,:-]*(.*)$/i,
  ];
  for (const pattern of patterns) {
    const invocation = text.match(pattern);
    if (invocation) return invocation[1].trim();
  }
  return null;
}

function isBackToBoardCommand(text) {
  return /\b(back|return|go back|switch)\s+to\s+(the\s+)?(writing\s+)?board\b|\b(back|return|go back|switch)\s+to\s+(the\s+)?writing(?:\s+space)?\b|\b(stop|exit|leave)\s+(ai|question)\s+mode\b|\b(done|finished)\s+(asking|with questions)\b|(?:बोर्ड|लिखने\s+की\s+जगह)(?:\s+पर)?\s+(?:वापस(?:\s+(?:जाओ|चलो|जाएँ|जाइए|लौटें))?)|सवाल\s+मोड\s+बंद\s+करो/i.test(text);
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

function startAssistantQuestionMode() {
  if (document.body.dataset.view !== "writing") switchView("writing");
  setAssistantQuestionMode(true, voiceEnabled
    ? (writingLanguage === "hi" ? "मैं सुन रहा हूँ। अपना सवाल पूछिए।" : "I’m listening. Ask me anything.")
    : (writingLanguage === "hi" ? "सवाल मोड तैयार है। माइक चालू करके अपना सवाल पूछें।" : "Question mode is ready. Turn on the microphone, then ask me anything."));
}

async function handleAssistantQuestion(question) {
  const text = question.trim();
  if (!text) return;
  if (document.querySelector("#assistant-form button[type='submit']").disabled) return;
  addAssistantMessage(text, true);
  document.querySelector("#assistant-question").value = "";
  const pending = addAssistantMessage("Thinking…", false);
  if (assistantQuestionMode)   document.querySelector("#assistant-mode-status").textContent = writingLanguage === "hi" ? "आपके सवाल के बारे में सोच रहा हूँ…" : "Thinking about your question…";
  const askButton = document.querySelector("#assistant-form button[type='submit']");
  askButton.disabled = true;
  try {
    const history = assistantConversation.slice(-10);
    const response = await fetch("/api/ask", {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({ question: text, history, language: writingLanguage }),
    });
    const result = await response.json();
    if (!response.ok) throw new Error(result.error || "The AI could not answer right now.");
    pending.querySelector("p").textContent = result.answer;
    if (assistantQuestionMode) document.querySelector("#assistant-mode-status").textContent = writingLanguage === "hi"
      ? "जवाब तैयार है। अगला सवाल पूछें या कहें “बोर्ड पर वापस जाएँ।”"
      : "Answer ready. Ask another question, or say “back to board”.";
    assistantConversation.push(
      { role: "user", content: text },
      { role: "assistant", content: result.answer },
    );
    speakAssistantAnswer(result.answer);
  } catch (error) {
    const errorMessage = error.message || (writingLanguage === "hi"
      ? "शिक्शा एआई से संपर्क नहीं हो पाया। इंटरनेट कनेक्शन जाँचें।"
      : "Could not reach Shiksha AI. Check your connection and try again.");
    pending.querySelector("p").textContent = writingLanguage === "hi"
      ? errorMessage.replace("AI is not connected yet. Set the GEMINI_API_KEY environment variable on this computer, then restart Shiksha AI.", "AI अभी कनेक्ट नहीं है। इस कंप्यूटर पर GEMINI_API_KEY सेट करके Shiksha AI फिर से शुरू करें।")
      : errorMessage;
    document.querySelector("#writing-status").textContent = errorMessage;
    if (assistantQuestionMode) document.querySelector("#assistant-mode-status").textContent = writingLanguage === "hi"
      ? "जवाब नहीं मिल सका। फिर से पूछें या कहें “बोर्ड पर वापस जाएँ।”"
      : "I couldn’t get an answer. Try asking again, or say “back to board”.";
  } finally {
    askButton.disabled = false;
  }
}

function speakAssistantAnswer(answer) {
  if (!("speechSynthesis" in window)) return;
  window.speechSynthesis.cancel();
  const utterance = new SpeechSynthesisUtterance(answer);
  utterance.lang = writingLanguage === "hi" ? "hi-IN" : "en-US";
  const resumeListening = () => {
    assistantSpeaking = false;
    if (voiceEnabled && !recognitionActive) startRecognition();
  };
  utterance.onend = resumeListening;
  utterance.onerror = resumeListening;
  assistantSpeaking = true;
  if (voiceEnabled && recognitionActive) recognition.stop();
  window.speechSynthesis.speak(utterance);
}

function handleVoiceCommand(rawText) {
  const text = rawText.trim();
  if (!text) return;
  const language = isLanguageCommand(text);
  if (language) {
    setWritingLanguage(language);
    if (document.body.dataset.view !== "writing") switchView("writing");
    document.querySelector("#writing-status").textContent = language === "hi"
      ? "हिंदी मोड चालू है। अब हिंदी में बोलें। सवाल पूछने के लिए कहें “मुझे एक सवाल पूछना है।”"
      : "English mode is on. You can speak in English.";
    return;
  }
  if (document.body.dataset.view === "writing" && assistantQuestionMode && isBackToBoardCommand(text)) {
    setAssistantQuestionMode(false);
    document.querySelector("#writing-status").textContent = writingLanguage === "hi"
      ? "आप फिर से लेखन बोर्ड पर हैं। लिखने के लिए बोलें या सवाल पूछने के लिए कहें “मुझे एक सवाल पूछना है।”"
      : "Back at the writing board. Speak to continue writing, or say “I want to ask a question” to ask Shiksha AI.";
    return;
  }
  if (isHomeCommand(text)) {
    switchView("welcome");
    announce(`Heard “${text}”. Back at the welcome page.`);
    return;
  }
  if (isChooserCommand(text)) {
    switchView("chooser");
    return;
  }
  const aiQuestion = assistantQuestionFromCommand(text);
  if (aiQuestion !== null) {
    startAssistantQuestionMode();
    if (aiQuestion) {
      handleAssistantQuestion(aiQuestion);
    } else {
      document.querySelector("#assistant-mode-status").textContent = "I’m listening. What would you like to ask?";
    }
    return;
  }
  if (assistantQuestionMode) {
    handleAssistantQuestion(text);
    return;
  }
  const currentView = document.body.dataset.view;
  if (currentView === "welcome" && isStartCommand(text)) {
    switchView("chooser");
    return;
  }
  if (/\b(writing space|writing board|write space)\b/i.test(text)) {
    switchView("writing");
    return;
  }
  if (/\b(3d figures|3d shapes|shape studio|figures)\b/i.test(text)) {
    switchView("studio");
    return;
  }
  if (currentView === "welcome" || currentView === "chooser") {
    switchView("chooser");
    announce("Choose 3D figures or writing space, or say the name of a space.");
    return;
  }
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
      chooser: "Listening. Say “3D figures” or “writing space”.",
      studio: "Listening. Say a shape and size, for example “draw a cube size 8”.",
      writing: assistantQuestionMode
        ? "AI question mode is on. Ask anything, or say “back to board”."
        : "Listening. Speak to write, say “erase” or “erase whole”, or ask Shiksha AI a question.",
    };
    const hindiWritingPrompt = assistantQuestionMode
      ? "सवाल मोड चालू है। अपना सवाल पूछें या कहें “बोर्ड पर वापस जाएँ।”"
      : "मैं सुन रहा हूँ। हिंदी में बोलकर लिखें, “मिटाओ” कहें या Shiksha AI से सवाल पूछें।";
    announce(document.body.dataset.view === "writing" && writingLanguage === "hi"
      ? hindiWritingPrompt
      : prompts[document.body.dataset.view]);
    if (assistantQuestionMode) {
      document.querySelector("#assistant-mode-status").textContent = writingLanguage === "hi"
        ? "मैं सुन रहा हूँ। अपना सवाल पूछिए।"
        : "I’m listening. Ask me anything.";
    }
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
    if (voiceEnabled && !assistantSpeaking) window.setTimeout(startRecognition, 500);
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

function toggleAssistantRecognition() {
  if (!SpeechRecognition) {
    document.querySelector("#writing-status").textContent = "Voice input is not supported here. Type your question instead.";
    return;
  }
  if (assistantListening) {
    assistantRecognition.stop();
    return;
  }
  startAssistantQuestionMode();
  if (voiceEnabled || recognitionActive) stopRecognition();
  assistantRecognition = new SpeechRecognition();
  assistantRecognition.lang = writingLanguage === "hi" ? "hi-IN" : "en-US";
  assistantRecognition.continuous = false;
  assistantRecognition.interimResults = false;
  const button = document.querySelector("#assistant-voice");
  assistantRecognition.onstart = () => {
    assistantListening = true;
    button.classList.add("is-listening");
    button.textContent = writingLanguage === "hi" ? "सुन रहा हूँ…" : "Listening…";
    document.querySelector("#assistant-title").textContent = writingLanguage === "hi" ? "आपकी बात सुन रहा हूँ" : "Listening to you";
    document.querySelector("#assistant-mode-status").textContent = writingLanguage === "hi" ? "मैं सुन रहा हूँ। अपना सवाल पूछिए।" : "I’m listening. Ask me anything.";
  };
  assistantRecognition.onresult = (event) => {
    const question = event.results[0]?.[0]?.transcript;
    if (question) handleAssistantQuestion(question);
  };
  assistantRecognition.onerror = (event) => {
    if (event.error !== "no-speech" && event.error !== "aborted") {
      document.querySelector("#assistant-title").textContent = writingLanguage === "hi" ? "सवाल पूछें" : "Ask a question";
      document.querySelector("#writing-status").textContent = writingLanguage === "hi"
        ? "सवाल सुनाई नहीं दिया। माइक की अनुमति जाँचें या सवाल लिखें।"
        : "Could not hear your question. Check microphone permission or type it instead.";
    } else if (event.error === "no-speech") {
      document.querySelector("#writing-status").textContent = writingLanguage === "hi" ? "सवाल सुनाई नहीं दिया। फिर से बोलें या लिखें।" : "I didn't hear a question. Try speaking again or type it.";
    }
  };
  assistantRecognition.onend = () => {
    assistantListening = false;
    button.classList.remove("is-listening");
    button.innerHTML = `${writingLanguage === "hi" ? "सवाल बोलें" : "Speak question"} <span aria-hidden="true">◉</span>`;
    document.querySelector("#assistant-title").textContent = writingLanguage === "hi" ? "सवाल पूछें" : "Ask a question";
  };
  try {
    assistantRecognition.start();
  } catch (error) {
    document.querySelector("#writing-status").textContent = "Could not start the microphone. Check browser permission and try again.";
  }
}

["#header-mic", "#welcome-listen", "#voice-button"].forEach((selector) => {
  document.querySelector(selector).addEventListener("click", toggleRecognition);
});
document.querySelector("#get-started").addEventListener("click", () => switchView("chooser"));
document.querySelectorAll("[data-go]").forEach((element) => {
  element.addEventListener("click", (event) => {
    event.preventDefault();
    switchView(element.dataset.go);
  });
});
document.querySelector("#reset-view").addEventListener("click", () => {
  drawShape(activeShape, activeSize);
  announce("The model view has been reset.");
});
document.querySelector("#erase-word").addEventListener("click", eraseLastWord);
document.querySelector("#clear-board").addEventListener("click", () => {
  document.querySelector("#writing-board").value = "";
  document.querySelector("#writing-status").textContent = writingLanguage === "hi" ? "पूरा बोर्ड साफ़ हो गया है।" : "The whole board is clear.";
});
document.querySelector("#assistant-form").addEventListener("submit", (event) => {
  event.preventDefault();
  handleAssistantQuestion(document.querySelector("#assistant-question").value);
});
document.querySelector("#assistant-voice").addEventListener("click", toggleAssistantRecognition);
document.querySelector("#assistant-mode-exit").addEventListener("click", () => {
  setAssistantQuestionMode(false);
  document.querySelector("#writing-status").textContent = writingLanguage === "hi"
    ? "आप फिर से लेखन बोर्ड पर हैं। लिखने के लिए बोलें या सवाल पूछने के लिए कहें “मुझे एक सवाल पूछना है।”"
    : "Back at the writing board. Speak to continue writing, or say “I want to ask a question” to ask Shiksha AI.";
});
document.querySelectorAll("[data-writing-language]").forEach((button) => {
  button.addEventListener("click", () => setWritingLanguage(button.dataset.writingLanguage));
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