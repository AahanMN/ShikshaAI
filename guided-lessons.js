import { curriculum, curriculumGrades } from "./curriculum-topics.js";

const lessons = [
  {
    id: "water-cycle",
    title: "The water cycle",
    level: "Grades 5–8 · Earth science",
    objective: "Trace how water moves between Earth's surface and the atmosphere.",
    steps: [
      { heading: "1. Energy starts the cycle", body: "Energy from the Sun warms water in oceans, lakes, and soil. Some liquid water changes into invisible water vapour and rises. This change from liquid to gas is evaporation." },
      { heading: "2. Vapour cools", body: "Higher in the atmosphere, water vapour cools. It condenses into tiny liquid droplets or ice crystals, forming clouds." },
      { heading: "3. Water returns to Earth", body: "When droplets or ice crystals grow heavy enough, water falls as precipitation, such as rain, snow, or hail." },
      { heading: "4. Water collects and moves", body: "Water collects in rivers, lakes, oceans, and the ground. It can flow over land or soak into soil before the Sun warms it again. The cycle has no single starting point." },
    ],
    question: {
      prompt: "What provides most of the energy that drives evaporation in the water cycle?",
      answers: [
        { text: "Sunlight warming surface water", correct: true, feedback: "Correct. Solar energy warms liquid water and helps it evaporate." },
        { text: "Clouds cooling the air", correct: false, feedback: "Not quite. Cooling helps condensation. Think about what heats surface water." },
        { text: "Gravity pulling water into clouds", correct: false, feedback: "Not quite. Gravity helps precipitation fall. What supplies heat to water at the surface?" },
      ],
    },
  },
  {
    id: "plant-cell",
    title: "Inside a plant cell",
    level: "Grades 5–8 · Biology",
    objective: "Identify the main structures in a typical plant cell and their functions.",
    steps: [
      { heading: "1. A boundary protects the cell", body: "The cell wall is a firm outer layer that supports and protects the plant cell. Just inside it, the cell membrane controls what enters and leaves." },
      { heading: "2. The nucleus stores instructions", body: "The nucleus contains most of the cell's DNA. It helps direct cell activities, including growth and making proteins." },
      { heading: "3. Chloroplasts capture light", body: "Chloroplasts contain chlorophyll, a green pigment that absorbs light energy. The cell uses this energy for photosynthesis." },
      { heading: "4. The vacuole stores water", body: "A large central vacuole stores water and dissolved substances. Water in the vacuole helps keep the plant cell firm." },
    ],
    question: {
      prompt: "Which plant-cell structure contains chlorophyll and captures light for photosynthesis?",
      answers: [
        { text: "The cell wall", correct: false, feedback: "The cell wall provides support. Look for the structure containing the green pigment chlorophyll." },
        { text: "The chloroplast", correct: true, feedback: "Correct. Chloroplasts contain chlorophyll, which absorbs light energy." },
        { text: "The vacuole", correct: false, feedback: "The vacuole stores water and other substances. Which organelle contains chlorophyll?" },
      ],
    },
  },
  {
    id: "periodic-table",
    title: "Reading the periodic table",
    level: "Grades 6–8 · Chemistry",
    objective: "Use an element's atomic number, period, and group to read the periodic table.",
    steps: [
      { heading: "1. Find an element's identity", body: "Each element tile shows a chemical symbol and an atomic number. The atomic number equals the number of protons in the nucleus and identifies the element." },
      { heading: "2. Read across a period", body: "A horizontal row is called a period. As you move from left to right, the atomic number increases by one for each element." },
      { heading: "3. Read down a group", body: "A vertical column is called a group. Elements in the same group often have similar chemical properties because their atoms have similar outer-electron arrangements." },
      { heading: "4. Locate the inner transition metals", body: "The lanthanides and actinides are usually displayed in two separate rows below the main table to keep it compact. Their atomic numbers continue the sequence in periods 6 and 7." },
    ],
    question: {
      prompt: "An element has atomic number 6. How many protons does one of its atoms have?",
      answers: [
        { text: "6 protons", correct: true, feedback: "Correct. Atomic number is the number of protons; element 6 is carbon." },
        { text: "12 protons", correct: false, feedback: "Not quite. The atomic mass is not the atomic number. Use the atomic number to find the proton count." },
        { text: "It depends on the group", correct: false, feedback: "The group does not change the proton count. What does the atomic number tell you?" },
      ],
    },
  },
];

let currentLesson = lessons[0];
let currentStep = 0;
let showingQuestion = false;
let selectedGrade = 8;
let selectedSubject = "Mathematics";
let selectedTopic = curriculum[selectedGrade][selectedSubject][0];
let activeLesson = null;

const curriculumLessonTopics = new Map([
  ["6|Science|Water", "water-cycle"],
  ["8|Science|Cell: Structure and Functions", "plant-cell"],
  ["9|Science|Structure of the Atom", "periodic-table"],
]);

function speakCurrentStep() {
  if (!activeLesson) {
    document.querySelector("#lesson-status").textContent =
      "A prepared read-aloud lesson is not available for this topic yet.";
    return;
  }
  const step = currentLesson.steps[currentStep];
  if (!("speechSynthesis" in window) || !("SpeechSynthesisUtterance" in window)) {
    document.querySelector("#lesson-status").textContent = "Text-to-speech is not available in this browser. Read the lesson text on screen.";
    return;
  }
  window.speechSynthesis.cancel();
  const utterance = new SpeechSynthesisUtterance(`${currentLesson.title}. ${step.heading}. ${step.body}`);
  utterance.lang = "en-IN";
  window.speechSynthesis.speak(utterance);
}

function selectTopic(topic) {
  selectedTopic = topic;
  const lessonId = curriculumLessonTopics.get(`${selectedGrade}|${selectedSubject}|${topic}`);
  activeLesson = lessons.find((lesson) => lesson.id === lessonId) || null;
  currentStep = 0;
  showingQuestion = false;
  window.speechSynthesis?.cancel();
  render();
}

function selectGrade(grade) {
  selectedGrade = grade;
  document.querySelector("#lesson-grade").value = String(grade);
  renderSubjects();
  renderTopics();
  selectTopic(curriculum[selectedGrade][selectedSubject][0]);
}

function selectSubject(subject) {
  selectedSubject = subject;
  renderSubjects();
  renderTopics();
  selectTopic(curriculum[selectedGrade][selectedSubject][0]);
}

function renderSubjects() {
  const subjects = document.querySelector("#lesson-subjects");
  subjects.replaceChildren();
  Object.keys(curriculum[selectedGrade]).forEach((subject) => {
    const button = document.createElement("button");
    button.type = "button";
    button.className = "lesson-option";
    button.textContent = subject;
    button.setAttribute("aria-current", String(subject === selectedSubject));
    button.addEventListener("click", () => selectSubject(subject));
    subjects.append(button);
  });
}

function renderTopics() {
  const topics = document.querySelector("#lesson-topics");
  topics.replaceChildren();
  curriculum[selectedGrade][selectedSubject].forEach((topic, index) => {
    const button = document.createElement("button");
    button.type = "button";
    button.className = "lesson-topic";
    button.textContent = `Topic ${index + 1} · ${topic}`;
    button.setAttribute("aria-current", String(topic === selectedTopic));
    button.addEventListener("click", () => selectTopic(topic));
    topics.append(button);
  });
}

function render() {
  document.querySelectorAll("#lesson-subjects .lesson-option").forEach((button) => {
    button.setAttribute("aria-current", String(button.textContent === selectedSubject));
  });
  document.querySelectorAll("#lesson-topics .lesson-topic").forEach((button) => {
    button.setAttribute("aria-current", String(button.textContent.endsWith(selectedTopic)));
  });

  const category = document.querySelector("#lesson-category");
  const title = document.querySelector("#lesson-name");
  const objective = document.querySelector("#lesson-objective");
  const stepCount = document.querySelector("#lesson-step-count");
  const progress = document.querySelector("#lesson-progress");
  const heading = document.querySelector("#lesson-step-heading");
  const body = document.querySelector("#lesson-step-body");
  const question = document.querySelector("#lesson-question");
  const previous = document.querySelector("#lesson-previous");
  const next = document.querySelector("#lesson-next");
  const readAloud = document.querySelector("#lesson-read-aloud");
  const answers = document.querySelector("#lesson-answers");
  answers.replaceChildren();
  const feedback = document.querySelector("#lesson-feedback");
  feedback.textContent = "";
  feedback.className = "lesson-feedback";

  if (!activeLesson) {
    category.textContent = `CLASS ${selectedGrade} · ${selectedSubject.toUpperCase()} · CBSE/NCERT`;
    title.textContent = selectedTopic;
    objective.textContent = `Topic ${curriculum[selectedGrade][selectedSubject].indexOf(selectedTopic) + 1} in the Class ${selectedGrade} ${selectedSubject} CBSE/NCERT topic list.`;
    stepCount.textContent = "TOPIC SELECTED";
    progress.value = 0;
    progress.max = 1;
    heading.textContent = "Topic selected";
    body.textContent = `“${selectedTopic}” is included in this Class ${selectedGrade} CBSE/NCERT topic list. A step-by-step lesson and knowledge check for this topic have not been added yet. Choose another topic from the list, or select a topic with prepared lesson content.`;
    question.hidden = true;
    previous.disabled = true;
    next.disabled = true;
    readAloud.disabled = true;
    document.querySelector("#lesson-status").textContent = "Choose a class, subject, and topic. Prepared lessons are currently available for Water, Cell: Structure and Functions, and Structure of the Atom.";
    return;
  }

  currentLesson = activeLesson;
  const step = currentLesson.steps[currentStep];
  category.textContent = `CLASS ${selectedGrade} · ${selectedSubject.toUpperCase()} · CBSE/NCERT`;
  title.textContent = selectedTopic;
  objective.textContent = currentLesson.objective;
  stepCount.textContent = showingQuestion ? "KNOWLEDGE CHECK" : `STEP ${currentStep + 1} OF ${currentLesson.steps.length}`;
  progress.value = showingQuestion ? currentLesson.steps.length : currentStep + 1;
  progress.max = currentLesson.steps.length;
  heading.textContent = step.heading;
  body.textContent = step.body;
  question.hidden = !showingQuestion;
  document.querySelector("#lesson-question-prompt").textContent = currentLesson.question.prompt;
  previous.disabled = !showingQuestion && currentStep === 0;
  next.textContent = showingQuestion
    ? "Knowledge check"
    : currentStep === currentLesson.steps.length - 1
      ? "Knowledge check"
      : "Next step";
  next.disabled = showingQuestion;
  readAloud.disabled = false;
  currentLesson.question.answers.forEach((answer) => {
    const button = document.createElement("button");
    button.type = "button";
    button.className = "lesson-answer";
    button.textContent = answer.text;
    button.addEventListener("click", () => {
      feedback.textContent = answer.feedback;
      feedback.classList.toggle("is-correct", answer.correct);
      feedback.classList.toggle("is-incorrect", !answer.correct);
      answers.querySelectorAll("button").forEach((option) => {
        option.disabled = true;
        if (option === button) option.setAttribute("aria-pressed", "true");
      });
      document.querySelector("#lesson-status").textContent = answer.correct
        ? "Knowledge check complete. Choose another topic or review this one."
        : "Try another answer, or go back and review the lesson.";
      if (!answer.correct) {
        answers.querySelectorAll("button").forEach((option) => {
          option.disabled = false;
          option.removeAttribute("aria-pressed");
        });
      }
    });
    answers.append(button);
  });
  document.querySelector("#lesson-status").textContent = "Use Next step to continue, or read the lesson aloud.";
}

export function initializeGuidedLessons() {
  const gradeSelect = document.querySelector("#lesson-grade");
  curriculumGrades.forEach((grade) => {
    const option = document.createElement("option");
    option.value = String(grade);
    option.textContent = `Class ${grade}`;
    gradeSelect.append(option);
  });
  gradeSelect.value = String(selectedGrade);
  gradeSelect.addEventListener("change", () => selectGrade(Number(gradeSelect.value)));
  document.querySelector("#lesson-previous").addEventListener("click", previousStep);
  document.querySelector("#lesson-next").addEventListener("click", nextStep);
  document.querySelector("#lesson-read-aloud").addEventListener("click", speakCurrentStep);
  renderSubjects();
  renderTopics();
  render();
}

export function nextStep() {
  if (!activeLesson || showingQuestion) return;
  if (currentStep < currentLesson.steps.length - 1) {
    currentStep += 1;
  } else {
    showingQuestion = true;
    document.querySelector("#lesson-status").textContent = "Answer the question to check what you learned.";
  }
  render();
}

export function previousStep() {
  if (!activeLesson) return;
  if (showingQuestion) {
    showingQuestion = false;
  } else if (currentStep > 0) {
    currentStep -= 1;
  }
  render();
}

export function handleGuidedLessonCommand(text) {
  const command = text.trim().toLocaleLowerCase();
  if (/^(?:next|next step|continue|go forward)[.!?]*$/.test(command)) {
    nextStep();
    return true;
  }
  if (/^(?:back|previous|previous step|go back)[.!?]*$/.test(command)) {
    previousStep();
    return true;
  }
  if (/^(?:explain this|read this|read aloud|repeat)[.!?]*$/.test(command)) {
    speakCurrentStep();
    return true;
  }
  const lesson = lessons.find((item) =>
    command.includes(item.title.toLocaleLowerCase()) ||
    command.includes(item.id.replaceAll("-", " ")));
  if (lesson) {
    if (lesson.id === "water-cycle") {
      selectGrade(6);
      selectSubject("Science");
      selectTopic("Water");
    } else if (lesson.id === "plant-cell") {
      selectGrade(8);
      selectSubject("Science");
      selectTopic("Cell: Structure and Functions");
    } else {
      selectGrade(9);
      selectSubject("Science");
      selectTopic("Structure of the Atom");
    }
    return true;
  }
  const gradeMatch = command.match(/(?:class\s*)?(6|7|8|9|10)(?:th|st|nd|rd)?(?:\s+class)?/);
  if (gradeMatch) selectGrade(Number(gradeMatch[1]));
  const requestedSubject = Object.keys(curriculum[selectedGrade]).find((subject) =>
    command.includes(subject.toLocaleLowerCase()) ||
    (subject === "Mathematics" && /\bmaths?\b/.test(command)) ||
    (subject === "Social Science (SSC)" && /\bssc\b/.test(command)));
  if (requestedSubject) selectSubject(requestedSubject);
  const requestedTopic = curriculum[selectedGrade][selectedSubject]
    .find((topic) => command.includes(topic.toLocaleLowerCase()));
  if (requestedTopic) selectTopic(requestedTopic);
  if (!gradeMatch && !requestedSubject && !requestedTopic) {
    document.querySelector("#lesson-status").textContent =
      "Say a class, subject, topic name, “next step”, “go back”, or “explain this”.";
  }
  return true;
}
