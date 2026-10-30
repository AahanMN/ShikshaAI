const diagrams = [
  { id: "water-cycle", title: "Water cycle", level: "Common", type: "water", description: "Water moves through evaporation, condensation, precipitation, and collection.", nodes: ["Evaporation", "Condensation", "Precipitation", "Collection"] },
  { id: "food-chain", title: "Food chain", level: "Common", type: "food-chain", description: "Energy passes from the Sun to producers and then to consumers.", nodes: ["Sun", "Grass", "Grasshopper", "Frog", "Snake"] },
  { id: "photosynthesis", title: "Photosynthesis", level: "Common", type: "photosynthesis", description: "Plants use light, water, and carbon dioxide to make glucose and oxygen.", nodes: ["Sunlight", "Water + CO₂", "Leaf / chlorophyll", "Glucose + O₂"] },
  { id: "plant-cell", title: "Plant cell", level: "Common", type: "cell", description: "A simplified plant cell showing its wall, membrane, nucleus, chloroplasts, and vacuole.", plant: true, parts: ["Cell wall", "Cell membrane", "Nucleus", "Chloroplast", "Large vacuole"] },
  { id: "human-heart", title: "Human heart", level: "Common", type: "anatomy", description: "Follow blood through the four chambers and the lungs.", nodes: ["Body", "Right atrium", "Right ventricle", "Lungs", "Left atrium", "Left ventricle", "Body"] },
  { id: "respiratory-system", title: "Respiratory system", level: "Common", type: "anatomy", description: "Air travels through the airways to the lungs, where gas exchange occurs.", nodes: ["Nose / mouth", "Trachea", "Bronchi", "Lungs", "Alveoli"] },
  { id: "digestive-system", title: "Digestive system", level: "Common", type: "anatomy", description: "Food passes through the digestive tract as it is broken down and nutrients are absorbed.", nodes: ["Mouth", "Oesophagus", "Stomach", "Small intestine", "Large intestine"] },
  { id: "solar-system", title: "Solar system", level: "Common", type: "solar", description: "The eight planets orbit the Sun at different distances.", nodes: ["Mercury", "Venus", "Earth", "Mars", "Jupiter", "Saturn", "Uranus", "Neptune"] },
  { id: "states-of-matter", title: "States of matter", level: "Common", type: "flow", description: "Heating and cooling change matter between solid, liquid, and gas.", nodes: ["Solid", "Melting →", "Liquid", "Evaporation →", "Gas"] },
  { id: "water-molecule", title: "Water molecule (H₂O)", level: "Common", type: "molecule", description: "One oxygen atom is bonded to two hydrogen atoms in a bent molecule.", atoms: [{ label: "O", x: 380, y: 210, kind: "oxygen" }, { label: "H", x: 280, y: 290, kind: "hydrogen" }, { label: "H", x: 480, y: 290, kind: "hydrogen" }], bonds: [[0, 1], [0, 2]] },
  { id: "flowering-plant-life-cycle", title: "Flowering plant life cycle", level: "Common", type: "cycle", description: "A flowering plant grows from a seed, flowers, and produces new seeds.", nodes: ["Seed", "Germination", "Seedling", "Adult plant", "Flower + fruit"] },
  { id: "rock-cycle", title: "Rock cycle", level: "Common", type: "cycle", description: "Igneous, sedimentary, and metamorphic rocks form through changing Earth processes.", nodes: ["Magma", "Igneous rock", "Sediments", "Sedimentary rock", "Metamorphic rock"] },
  { id: "electric-circuit", title: "Simple electric circuit", level: "Common", type: "circuit", description: "A closed conducting loop allows current to flow from a cell through a lamp.", nodes: ["Cell", "Switch", "Lamp"] },
  { id: "skeleton", title: "Human skeleton", level: "Common", type: "anatomy", description: "A simplified skeleton diagram marks major bones that support and protect the body.", nodes: ["Skull", "Rib cage", "Spine", "Pelvis", "Arm bones", "Leg bones"] },
  { id: "food-web", title: "Food web", level: "Intermediate", type: "network", description: "Several linked food chains show who eats whom in a grassland ecosystem.", nodes: ["Grass", "Seeds", "Grasshopper", "Mouse", "Frog", "Snake", "Hawk"], edges: [[0, 2], [0, 3], [1, 3], [2, 4], [2, 5], [3, 5], [3, 6], [4, 6], [5, 6]] },
  { id: "carbon-cycle", title: "Carbon cycle", level: "Intermediate", type: "cycle", description: "Carbon moves among the atmosphere, living things, oceans, and rocks.", nodes: ["Atmosphere CO₂", "Plants", "Animals", "Soil + fossils", "Oceans"] },
  { id: "nitrogen-cycle", title: "Nitrogen cycle", level: "Intermediate", type: "cycle", description: "Nitrogen moves between the atmosphere, soil, plants, animals, and decomposers.", nodes: ["Atmospheric N₂", "Soil bacteria", "Plant roots", "Animals", "Decomposition"] },
  { id: "neuron", title: "Neuron", level: "Intermediate", type: "anatomy", description: "A nerve cell receives signals at dendrites and sends an impulse along its axon.", nodes: ["Dendrites", "Cell body", "Axon", "Myelin sheath", "Axon terminals"] },
  { id: "human-eye", title: "Human eye", level: "Intermediate", type: "anatomy", description: "Light passes through the cornea and lens to form an image on the retina.", nodes: ["Cornea", "Pupil + iris", "Lens", "Retina", "Optic nerve"] },
  { id: "human-ear", title: "Human ear", level: "Intermediate", type: "anatomy", description: "Sound vibrations travel through the outer, middle, and inner ear.", nodes: ["Outer ear", "Ear canal", "Eardrum", "Ossicles", "Cochlea"] },
  { id: "earth-layers", title: "Layers of Earth", level: "Intermediate", type: "layers", description: "Earth has a crust, mantle, outer core, and inner core.", nodes: ["Crust", "Mantle", "Outer core", "Inner core"] },
  { id: "plate-tectonics", title: "Plate tectonics", level: "Intermediate", type: "plates", description: "Earth's plates move apart, collide, or slide past one another.", nodes: ["Divergent", "Convergent", "Transform"] },
  { id: "moon-phases", title: "Phases of the Moon", level: "Intermediate", type: "orbit", description: "The Moon's sunlit appearance changes as it orbits Earth.", nodes: ["New", "Waxing crescent", "First quarter", "Waxing gibbous", "Full", "Waning gibbous", "Last quarter", "Waning crescent"] },
  { id: "dna", title: "DNA double helix", level: "Intermediate", type: "helix", description: "Two DNA strands pair A with T and C with G in a twisted ladder.", nodes: ["A", "T", "C", "G", "T", "A", "G", "C"] },
  { id: "mitosis", title: "Mitosis", level: "Intermediate", type: "flow", description: "One cell divides through prophase, metaphase, anaphase, and telophase.", nodes: ["Prophase", "Metaphase", "Anaphase", "Telophase", "Two daughter cells"] },
  { id: "blood-circulation", title: "Double blood circulation", level: "Intermediate", type: "cycle", description: "Blood travels from the heart to the lungs and body, then returns to the heart.", nodes: ["Right heart", "Lungs", "Left heart", "Body"] },
  { id: "nephron", title: "Nephron", level: "Advanced", type: "anatomy", description: "A nephron filters blood and adjusts the fluid that becomes urine.", nodes: ["Glomerulus", "Bowman's capsule", "Proximal tubule", "Loop of Henle", "Distal tubule", "Collecting duct"] },
  { id: "greenhouse-effect", title: "Greenhouse effect", level: "Advanced", type: "flow", description: "Sunlight warms Earth while greenhouse gases absorb and re-emit some outgoing heat.", nodes: ["Sunlight in", "Earth absorbs energy", "Heat radiates upward", "Greenhouse gases", "Some heat returns"] },
  { id: "volcano", title: "Volcano cross-section", level: "Advanced", type: "volcano", description: "A cutaway shows magma rising through a conduit toward a volcanic crater.", nodes: ["Ash cloud", "Crater", "Main vent", "Side vent", "Magma chamber"] },
  { id: "hydrothermal-vent", title: "Hydrothermal vent ecosystem", level: "Advanced", type: "flow", description: "Chemosynthetic microbes support life around deep-ocean vents without sunlight.", nodes: ["Earth's interior", "Mineral-rich vent", "Chemosynthetic microbes", "Tube worms + animals"] },
  { id: "ocean-circulation", title: "Ocean circulation", level: "Advanced", type: "cycle", description: "Temperature and salinity differences help drive a global circulation of ocean water.", nodes: ["Warm surface current", "Cooling at high latitudes", "Cold deep current", "Upwelling"] },
  { id: "atom-structure", title: "Atomic structure", level: "Common", type: "illustration", description: "A simplified carbon atom with a compact nucleus and electrons in two energy levels.", nodes: ["Nucleus", "Protons", "Neutrons", "Electron shells"] },
  { id: "periodic-table", title: "Periodic table", level: "Common", type: "illustration", description: "All 118 elements are shown by atomic number and symbol in their standard groups and periods, with the lanthanides and actinides below.", nodes: ["118 elements", "Atomic number", "Element symbol", "Groups and periods"] },
  { id: "chemical-reaction", title: "Chemical reaction", level: "Common", type: "illustration", description: "Hydrogen and oxygen molecules rearrange to form water while conserving atoms.", nodes: ["Reactants", "Bond rearrangement", "Products", "Conservation of atoms"] },
  { id: "ph-scale", title: "The pH scale", level: "Intermediate", type: "illustration", description: "The logarithmic pH scale compares acidic, neutral, and basic aqueous solutions.", nodes: ["Acidic", "Neutral", "Basic"] },
  { id: "distillation", title: "Simple distillation", level: "Intermediate", type: "illustration", description: "A heated mixture evaporates; vapor condenses in a cooled tube and is collected.", nodes: ["Heat source", "Vapor", "Condenser", "Distillate"] },
  { id: "microscope", title: "Compound microscope", level: "Common", type: "illustration", description: "Light passes through a specimen and objective and ocular lenses to form a magnified image.", nodes: ["Ocular lens", "Objective lens", "Stage", "Light source"] },
  { id: "flower-anatomy", title: "Flower anatomy", level: "Common", type: "illustration", description: "A longitudinal section identifies the reproductive parts of a flowering plant.", nodes: ["Petal", "Anther", "Stigma", "Ovary"] },
  { id: "seed-germination", title: "Seed germination", level: "Common", type: "illustration", description: "A seed absorbs water, the radicle emerges, and the shoot grows toward light.", nodes: ["Seed coat", "Radicle", "Root", "Shoot"] },
  { id: "pollination", title: "Pollination", level: "Common", type: "illustration", description: "A pollinator transfers pollen grains from an anther to a flower's stigma.", nodes: ["Anther", "Pollen", "Pollinator", "Stigma"] },
  { id: "human-brain", title: "Human brain", level: "Intermediate", type: "illustration", description: "A lateral view shows the cerebrum, cerebellum, and brain stem.", nodes: ["Cerebrum", "Cerebellum", "Brain stem"] },
  { id: "kidney-cross-section", title: "Kidney cross-section", level: "Intermediate", type: "illustration", description: "A cutaway shows the kidney cortex, medulla, renal pelvis, and ureter.", nodes: ["Cortex", "Medulla", "Renal pelvis", "Ureter"] },
  { id: "skin-cross-section", title: "Skin cross-section", level: "Intermediate", type: "illustration", description: "The epidermis, dermis, and subcutaneous layer contain structures for protection and temperature control.", nodes: ["Epidermis", "Dermis", "Hair follicle", "Sweat gland"] },
  { id: "knee-joint", title: "Knee joint", level: "Intermediate", type: "illustration", description: "A simplified section shows the femur, tibia, patella, cartilage, and ligaments.", nodes: ["Femur", "Patella", "Cartilage", "Tibia"] },
  { id: "seasons", title: "Why Earth has seasons", level: "Common", type: "illustration", description: "Earth's axial tilt changes the angle and duration of sunlight during its orbit.", nodes: ["Axial tilt", "Direct sunlight", "Orbit", "Hemisphere seasons"] },
  { id: "solar-eclipse", title: "Solar eclipse", level: "Common", type: "illustration", description: "A solar eclipse occurs when the Moon passes between the Sun and Earth.", nodes: ["Sun", "Moon", "Umbra", "Earth"] },
  { id: "lunar-eclipse", title: "Lunar eclipse", level: "Common", type: "illustration", description: "A lunar eclipse occurs when Earth passes between the Sun and the full Moon.", nodes: ["Sunlight", "Earth", "Earth's shadow", "Moon"] },
  { id: "prism-spectrum", title: "Dispersion through a prism", level: "Common", type: "illustration", description: "A prism refracts white light by different amounts, separating it into a visible spectrum.", nodes: ["White light", "Prism", "Visible spectrum"] },
  { id: "sound-wave", title: "Sound waves", level: "Common", type: "illustration", description: "Sound travels through a medium as alternating compressions and rarefactions.", nodes: ["Compression", "Rarefaction", "Direction of travel"] },
  { id: "magnetic-field", title: "Magnetic field", level: "Common", type: "illustration", description: "Magnetic field lines form closed loops from a magnet's north pole to its south pole.", nodes: ["North pole", "Field lines", "South pole"] },
  { id: "water-filtration", title: "Water filtration", level: "Common", type: "illustration", description: "A simple filter removes suspended particles as water passes through layered materials.", nodes: ["Gravel", "Sand", "Charcoal", "Filtered water"] },
];

const colors = ["#4c8b65", "#df865d", "#6086a8", "#c5a14f", "#896ca8", "#4d9b9b"];
let selectDiagram = () => false;

function escapeText(value) {
  return String(value).replace(/[&<>"']/g, (character) => ({
    "&": "&amp;", "<": "&lt;", ">": "&gt;", '"': "&quot;", "'": "&apos;",
  })[character]);
}

function svgText(x, y, value, className = "diagram-label", anchor = "middle") {
  return `<text class="${className}" x="${x}" y="${y}" text-anchor="${anchor}">${escapeText(value)}</text>`;
}

function shell(diagram, content) {
  return `<svg class="diagram-svg" viewBox="0 0 760 440" role="img" aria-labelledby="svg-title svg-description"><title id="svg-title">${escapeText(diagram.title)}</title><desc id="svg-description">${escapeText(diagram.description)}</desc><defs><linearGradient id="sky" x2="0" y2="1"><stop stop-color="#b9dded"/><stop offset="1" stop-color="#f4f3df"/></linearGradient><linearGradient id="water" x2="0" y2="1"><stop stop-color="#65b4cf"/><stop offset="1" stop-color="#347c9b"/></linearGradient><linearGradient id="leaf" x2="1" y2="1"><stop stop-color="#91c879"/><stop offset=".55" stop-color="#4f9a61"/><stop offset="1" stop-color="#28654d"/></linearGradient><linearGradient id="tissue" x2="0" y2="1"><stop stop-color="#efa4a1"/><stop offset="1" stop-color="#bd5962"/></linearGradient><radialGradient id="sun"><stop stop-color="#fff5bb"/><stop offset=".7" stop-color="#f7bd55"/><stop offset="1" stop-color="#e78b4d"/></radialGradient><radialGradient id="planet"><stop stop-color="#fff1bc"/><stop offset=".65" stop-color="#f0a866"/><stop offset="1" stop-color="#ba674d"/></radialGradient><radialGradient id="earth"><stop stop-color="#8ec5d5"/><stop offset=".65" stop-color="#3986a0"/><stop offset="1" stop-color="#24506b"/></radialGradient><radialGradient id="cell-fill"><stop stop-color="#fffde7"/><stop offset="1" stop-color="#d8e6bf"/></radialGradient><radialGradient id="nucleus"><stop stop-color="#e7b6dc"/><stop offset="1" stop-color="#95629d"/></radialGradient><filter id="soft-shadow" x="-.25" y="-.25" width="1.5" height="1.5"><feDropShadow dx="0" dy="4" stdDeviation="4" flood-color="#334d3c" flood-opacity=".18"/></filter><pattern id="soil" width="24" height="18" patternUnits="userSpaceOnUse"><rect width="24" height="18" fill="#9d7855"/><circle cx="4" cy="5" r="1.4" fill="#705638"/><circle cx="18" cy="12" r="1.8" fill="#c19a6c"/></pattern><marker id="diagram-arrow" viewBox="0 0 10 10" refX="8" refY="5" markerWidth="7" markerHeight="7" orient="auto-start-reverse"><path d="M 0 0 L 10 5 L 0 10 z" fill="#55745e"/></marker><marker id="warm-arrow" viewBox="0 0 10 10" refX="8" refY="5" markerWidth="7" markerHeight="7" orient="auto"><path d="M0 0 L10 5 L0 10z" fill="#df865d"/></marker><marker id="cool-arrow" viewBox="0 0 10 10" refX="8" refY="5" markerWidth="7" markerHeight="7" orient="auto"><path d="M0 0 L10 5 L0 10z" fill="#6086a8"/></marker></defs><style>.diagram-title{fill:#274c3a;font-family:Arial,sans-serif;font-size:22px;font-weight:700}.diagram-label{fill:#304b3a;font-family:Arial,sans-serif;font-size:13px;font-weight:600}.diagram-small-label{fill:#40564a;font-family:Arial,sans-serif;font-size:12px;font-weight:600}.diagram-connector{fill:none;stroke:#718e79;stroke-width:2.5}.diagram-node{fill:#fbfcf8;stroke-width:2.5}.diagram-orbit{fill:none;stroke:#b7c7b5;stroke-width:1.5;stroke-dasharray:4 5}.diagram-sun-label,.diagram-atom-label,.diagram-layer-label{fill:#fff;font-family:Arial,sans-serif;font-size:12px;font-weight:700}.diagram-sun-label{font-size:10px}.diagram-atom-label{font-size:17px}.diagram-layer-label{font-size:14px}.diagram-base-label{fill:#314a3c;font-family:Arial,sans-serif;font-size:12px;font-weight:700}.diagram-bond{stroke:#647d69;stroke-width:9;stroke-linecap:round}.diagram-wire{fill:none;stroke:#567d60;stroke-width:5;stroke-linecap:round;stroke-linejoin:round}.diagram-rung{stroke:#d29a55;stroke-width:3}</style><rect width="760" height="440" rx="18" fill="#fffdf7"/>${content}</svg>`;
}

function renderWaterCycle(diagram) {
  const cloud = (x, y, scale = 1) => `<g transform="translate(${x} ${y}) scale(${scale})" fill="#fff" stroke="#90b5c3" stroke-width="2"><circle cx="24" cy="28" r="20"/><circle cx="48" cy="17" r="27"/><circle cx="75" cy="29" r="19"/><rect x="20" y="27" width="58" height="22" rx="11"/></g>`;
  const rain = (x, y) => [0, 1, 2].map((i) => `<path d="M ${x + i * 18} ${y} l -8 19" stroke="#4d9fc0" stroke-width="3" stroke-linecap="round"/>`).join("");
  return shell(diagram, `<rect width="760" height="285" fill="url(#sky)"/><circle cx="108" cy="104" r="39" fill="url(#sun)" filter="url(#soft-shadow)"/><path d="M0 319 Q115 264 221 302 T436 292 Q548 264 760 305 V440 H0Z" fill="#78a96f"/><path d="M0 352 Q150 325 279 350 T520 336 Q636 324 760 350 V440 H0Z" fill="url(#water)"/><path d="M0 350 Q150 323 279 350 T520 336 Q636 324 760 350" fill="none" stroke="#e7f2ce" stroke-width="5"/><path d="M48 316 Q72 291 96 316 M132 310 Q157 279 182 310 M210 320 Q235 289 260 320" fill="none" stroke="#46774f" stroke-width="6" stroke-linecap="round"/><path d="M91 343 C82 289 87 235 116 181" fill="none" stroke="#df865d" stroke-width="4" marker-end="url(#warm-arrow)"/><path d="M538 181 C577 236 582 287 561 336" fill="none" stroke="#6086a8" stroke-width="4" marker-end="url(#cool-arrow)"/><path d="M167 123 C284 66 431 67 535 128" fill="none" stroke="#6086a8" stroke-width="3" stroke-dasharray="8 7" marker-end="url(#cool-arrow)"/>${cloud(270, 73, .85)}${rain(525, 153)}${svgText(112, 221, "Evaporation", "diagram-small-label")}${svgText(369, 64, "Condensation", "diagram-small-label")}${svgText(563, 205, "Precipitation", "diagram-small-label")}${svgText(384, 403, "Collection", "diagram-small-label")} ${svgText(380, 34, diagram.title, "diagram-title")}`);
}

function renderFoodChain(diagram) {
  const text = svgText;
  return shell(diagram, `<rect width="760" height="440" fill="url(#sky)"/><circle cx="105" cy="90" r="36" fill="url(#sun)"/><path d="M0 299 Q105 270 214 304 T427 292 T760 299 V440 H0Z" fill="#91b676"/><path d="M0 351 Q150 324 300 352 T610 339 T760 351 V440 H0Z" fill="url(#soil)"/><path d="M90 295 l-8-30 m8 30 12-29 m-12 29 1-37 m96 34-7-27m7 27 13-27m-13 27 1-35" stroke="#4d8c50" stroke-width="4"/><g transform="translate(282 247)"><ellipse cx="0" cy="0" rx="24" ry="12" fill="#dfbd4c"/><circle cx="27" cy="-2" r="8" fill="#dfbd4c"/><path d="M-17 1l-20-15m20 19-20 14m28-20 22-18m-16 21 24 11" stroke="#51663e" stroke-width="3"/><path d="M-6-10l-8-18m16 18 7-18" stroke="#8a6e3c" stroke-width="2"/></g><g transform="translate(430 265)"><ellipse cx="0" cy="4" rx="31" ry="19" fill="#63a263"/><circle cx="26" cy="-10" r="15" fill="#78b76d"/><circle cx="20" cy="-16" r="3" fill="#17251d"/><path d="M-17 15l-18 17m34-15 17 17" stroke="#436b44" stroke-width="6" stroke-linecap="round"/><path d="M-26 0l-18-11m74 13 14-8" stroke="#b48b69" stroke-width="5"/></g><path d="M535 265 Q565 224 599 253 Q635 282 661 246" fill="none" stroke="#bd9b48" stroke-width="18" stroke-linecap="round"/><circle cx="659" cy="245" r="12" fill="#dfb34c"/><circle cx="664" cy="241" r="2" fill="#17251d"/><path d="M585 257l16 8m-31-5 14 9" stroke="#5b5940" stroke-width="3"/>${text(103, 180, "Sunlight", "diagram-small-label")}${text(104, 385, "Producer", "diagram-small-label")}${text(284, 365, "Primary consumer", "diagram-small-label")}${text(438, 374, "Secondary consumer", "diagram-small-label")}${text(611, 355, "Predator", "diagram-small-label")}<path class="diagram-connector" d="M145 274 H233" marker-end="url(#diagram-arrow)"/><path class="diagram-connector" d="M322 276 H381" marker-end="url(#diagram-arrow)"/><path class="diagram-connector" d="M474 276 H526" marker-end="url(#diagram-arrow)"/>${text(380, 33, diagram.title, "diagram-title")}`);
}

function renderPhotosynthesis(diagram) {
  return shell(diagram, `<rect width="760" height="440" fill="url(#sky)"/><circle cx="105" cy="112" r="44" fill="url(#sun)" filter="url(#soft-shadow)"/><path d="M0 352 Q200 328 408 352 T760 345 V440 H0Z" fill="url(#soil)"/><path d="M382 352 C377 292 382 232 379 167" fill="none" stroke="#47784e" stroke-width="13" stroke-linecap="round"/><path d="M380 235 C320 214 278 181 277 139 C330 134 374 155 381 207Z" fill="url(#leaf)" stroke="#386d4b" stroke-width="3" filter="url(#soft-shadow)"/><path d="M382 225 C429 197 476 173 510 181 C500 224 458 251 384 246Z" fill="url(#leaf)" stroke="#386d4b" stroke-width="3" filter="url(#soft-shadow)"/><path d="M286 148 Q331 177 370 207 M496 190 Q446 213 392 237" fill="none" stroke="#d3e6a8" stroke-width="3"/><path d="M105 169 L263 212" stroke="#dfad4e" stroke-width="3" stroke-dasharray="8 7" marker-end="url(#warm-arrow)"/><path d="M582 127 H456" fill="none" stroke="#6086a8" stroke-width="3" marker-end="url(#cool-arrow)"/>${svgText(636, 118, "CO₂", "diagram-label")}${svgText(111, 240, "Light energy", "diagram-small-label")}${svgText(378, 394, "Water absorbed by roots", "diagram-small-label")}${svgText(585, 218, "O₂ released", "diagram-small-label")}${svgText(380, 35, diagram.title, "diagram-title")}<path d="M382 350 V284" stroke="#6086a8" stroke-width="4" marker-end="url(#cool-arrow)"/>`);
}

function renderFlow(diagram) {
  const count = diagram.nodes.length;
  const width = Math.min(140, Math.floor(700 / count) - 16);
  const gap = (700 - width * count) / (count - 1);
  const start = 30;
  const nodes = diagram.nodes.map((label, index) => {
    const x = start + index * (width + gap);
    const color = colors[index % colors.length];
    return `<rect class="diagram-node" x="${x}" y="177" width="${width}" height="86" rx="14" stroke="${color}"/><circle cx="${x + width / 2}" cy="199" r="5" fill="${color}"/>${svgText(x + width / 2, 225, label)}`;
  }).join("");
  const arrows = diagram.nodes.slice(1).map((_, index) => {
    const x = start + index * (width + gap) + width + 3;
    return `<path class="diagram-connector" d="M ${x} 220 H ${x + gap - 7}" marker-end="url(#diagram-arrow)"/>`;
  }).join("");
  const backdrop = `<rect x="20" y="128" width="720" height="156" rx="26" fill="#eef2e5"/><path d="M35 275 Q150 255 265 275 T510 269 T725 275" fill="none" stroke="#b4c29f" stroke-width="2"/>`;
  const detailedNodes = diagram.nodes.map((label, index) => {
    const x = start + index * (width + gap);
    const color = colors[index % colors.length];
    const cx = x + width / 2;
    const icon = diagram.id === "states-of-matter"
      ? `<g fill="${color}" opacity=".82">${[0, 1, 2, 3].map((dot) => `<circle cx="${cx - 12 + (dot % 2) * 24}" cy="${157 + Math.floor(dot / 2) * 13}" r="${index === 0 ? 5 : index === 1 ? 7 : 9}"/>`).join("")}</g>`
      : `<circle cx="${cx}" cy="158" r="13" fill="${color}"/><text x="${cx}" y="162" text-anchor="middle" fill="#fff" font-family="Arial,sans-serif" font-size="10" font-weight="700">${index + 1}</text>`;
    return `<rect class="diagram-node" x="${x}" y="177" width="${width}" height="86" rx="8" stroke="${color}"/>${icon}${svgText(cx, 224, label)}`;
  }).join("");
  return shell(diagram, `${backdrop}${svgText(380, 83, diagram.title, "diagram-title")}${arrows}${detailedNodes}`);
}

function renderCycle(diagram) {
  if (diagram.id === "water-cycle") return renderWaterCycle(diagram);
  const centerX = 380;
  const centerY = 220;
  const radius = diagram.nodes.length > 4 ? 142 : 130;
  const count = diagram.nodes.length;
  const nodes = diagram.nodes.map((label, index) => {
    const angle = -Math.PI / 2 + index * Math.PI * 2 / count;
    const x = centerX + Math.cos(angle) * radius;
    const y = centerY + Math.sin(angle) * radius;
    const color = colors[index % colors.length];
    return `<rect class="diagram-node" x="${x - 67}" y="${y - 27}" width="134" height="54" rx="14" stroke="${color}"/><circle cx="${x - 49}" cy="${y}" r="5" fill="${color}"/>${svgText(x + 3, y + 5, label)}`;
  }).join("");
  const arrows = diagram.nodes.map((_, index) => {
    const a = -Math.PI / 2 + index * Math.PI * 2 / count;
    const b = -Math.PI / 2 + (index + 1) * Math.PI * 2 / count;
    const sx = centerX + Math.cos(a) * (radius - 61);
    const sy = centerY + Math.sin(a) * (radius - 61);
    const ex = centerX + Math.cos(b) * (radius - 61);
    const ey = centerY + Math.sin(b) * (radius - 61);
    return `<path class="diagram-connector" d="M ${sx} ${sy} Q ${centerX} ${centerY} ${ex} ${ey}" marker-end="url(#diagram-arrow)"/>`;
  }).join("");
  return shell(diagram, `${svgText(380, 28, diagram.title, "diagram-title")}${arrows}${nodes}`);
}

function renderSolar(diagram) {
  const centerX = 315;
  const centerY = 220;
  const radii = [43, 62, 82, 105, 138, 168, 194, 218];
  const planetFills = ["#9b795a", "#d9b677", "url(#earth)", "#c56f55", "#d8a36a", "#d7ba82", "#86bec2", "#547fa5"];
  const planets = diagram.nodes.map((name, index) => {
    const angle = -Math.PI / 2 + index * 0.67;
    const x = centerX + Math.cos(angle) * radii[index];
    const y = centerY + Math.sin(angle) * radii[index];
    const radius = [4, 6, 7, 5, 13, 11, 9, 9][index];
    const ring = index === 5 ? `<ellipse cx="${x}" cy="${y}" rx="19" ry="6" transform="rotate(-18 ${x} ${y})" fill="none" stroke="#d7c59f" stroke-width="4"/>` : "";
    const labelX = x > centerX + 30 ? x + radius + 5 : x - radius - 5;
    const anchor = x > centerX + 30 ? "start" : "end";
    return `${ring}<circle cx="${x}" cy="${y}" r="${radius}" fill="${planetFills[index]}" stroke="#fff" stroke-opacity=".38" stroke-width="1.5"/><ellipse cx="${x - radius * .28}" cy="${y - radius * .35}" rx="${radius * .27}" ry="${radius * .14}" transform="rotate(-35 ${x - radius * .28} ${y - radius * .35})" fill="#fff" opacity=".42"/>${svgText(labelX, y + 4, name, "diagram-small-label", anchor)}`;
  }).join("");
  const orbits = radii.map((radius) => `<ellipse class="diagram-orbit" cx="${centerX}" cy="${centerY}" rx="${radius * 1.15}" ry="${radius * .69}"/>`).join("");
  const stars = Array.from({ length: 42 }, (_, index) => {
    const x = (index * 173 + 37) % 754;
    const y = (index * 97 + 19) % 434;
    return `<circle cx="${x}" cy="${y}" r="${index % 7 === 0 ? 1.8 : 1}" fill="#f3edcf" opacity=".68"/>`;
  }).join("");
  return shell(diagram, `<rect width="760" height="440" rx="20" fill="#132c43"/>${stars}${orbits}<circle cx="${centerX}" cy="${centerY}" r="34" fill="url(#sun)" filter="url(#soft-shadow)"/><circle cx="${centerX}" cy="${centerY}" r="43" fill="none" stroke="#f1c96e" stroke-opacity=".33" stroke-width="6"/>${svgText(centerX, centerY + 5, "Sun", "diagram-sun-label")}${planets}${svgText(380, 30, "Planet sizes and distances are not to scale", "diagram-base-label")}`);
}

function renderCell(diagram) {
  const wall = diagram.plant
    ? `<path d="M92 110 Q92 88 122 88 H457 Q484 88 484 116 V319 Q484 344 455 344 H121 Q92 344 92 317Z" fill="#b7c894" stroke="#68834f" stroke-width="10" filter="url(#soft-shadow)"/><path d="M107 118 Q107 104 126 104 H451 Q468 104 468 122 V311 Q468 328 449 328 H126 Q107 328 107 310Z" fill="url(#cell-fill)" stroke="#eee9bd" stroke-width="4"/>`
    : `<ellipse cx="285" cy="218" rx="210" ry="138" fill="#dbeaf2" stroke="#6086a8" stroke-width="5" filter="url(#soft-shadow)"/><ellipse cx="285" cy="218" rx="198" ry="126" fill="url(#cell-fill)" stroke="#f9fcff" stroke-width="3"/>`;
  const organelles = diagram.plant
    ? `<path d="M293 141 C353 123 415 144 428 192 C441 239 403 286 344 287 C303 288 277 260 280 218 C282 185 260 158 293 141Z" fill="#86c8d1" stroke="#5aa0ae" stroke-width="3"/><circle cx="190" cy="180" r="35" fill="url(#nucleus)" stroke="#77518e" stroke-width="3"/><circle cx="198" cy="178" r="12" fill="#744b86"/><ellipse cx="365" cy="127" rx="39" ry="20" fill="#6ba66a" stroke="#427c4c" stroke-width="3"/><path d="M333 127 H397 M339 119 H391 M346 135 H385" stroke="#bedc90" stroke-width="3"/><ellipse cx="420" cy="280" rx="34" ry="18" fill="#6ba66a" stroke="#427c4c" stroke-width="3"/><path d="M394 280 H446 M401 272 H440 M407 288 H433" stroke="#bedc90" stroke-width="3"/><ellipse cx="146" cy="275" rx="32" ry="17" fill="#6ba66a" stroke="#427c4c" stroke-width="3"/><path d="M123 275 H169 M129 268 H163 M133 282 H158" stroke="#bedc90" stroke-width="3"/><path d="M132 223 C163 205 218 210 241 235 C219 255 173 258 145 244Z" fill="#e7c596" stroke="#c89562" stroke-width="3"/>`
    : `<circle cx="201" cy="188" r="40" fill="url(#nucleus)" stroke="#805987" stroke-width="4"/><circle cx="207" cy="184" r="13" fill="#82538d"/><path d="M309 136 C343 119 380 130 391 149 C378 167 341 176 311 161Z" fill="#e6bb75" stroke="#ba8b4d" stroke-width="3"/><path d="M315 143 Q349 160 382 143 M316 151 Q350 168 384 151" fill="none" stroke="#f6dfaa" stroke-width="2"/><path d="M344 257 C373 242 410 253 419 275 C404 294 368 300 340 283Z" fill="#e6bb75" stroke="#ba8b4d" stroke-width="3"/><path d="M349 265 Q380 282 410 267 M350 273 Q381 290 412 275" fill="none" stroke="#f6dfaa" stroke-width="2"/><path d="M128 230 C156 212 180 220 185 238 C171 255 143 259 123 246Z" fill="#8cae9c" stroke="#628c79" stroke-width="3"/><circle cx="267" cy="302" r="10" fill="#74a8bd"/><circle cx="292" cy="110" r="8" fill="#74a8bd"/>`;
  const labels = diagram.parts.map((part, index) => {
    const y = 116 + index * 49;
    const targetX = diagram.plant ? [125, 113, 190, 365, 370][index] : [105, 201, 345, 370, 168][index];
    const targetY = diagram.plant ? [100, 120, 180, 127, 280][index] : [160, 188, 145, 277, 267][index];
    return `<path d="M 492 ${y - 4} H 512 L ${targetX + 18} ${targetY}" fill="none" stroke="${colors[index % colors.length]}" stroke-width="1.7"/><circle cx="${targetX + 18}" cy="${targetY}" r="3" fill="${colors[index % colors.length]}"/>${svgText(524, y, part, "diagram-small-label", "start")}`;
  }).join("");
  return shell(diagram, `${svgText(380, 48, diagram.title, "diagram-title")}${wall}${organelles}${labels}`);
}

function renderMolecule(diagram) {
  const bonds = diagram.bonds.map(([from, to]) => {
    const a = diagram.atoms[from];
    const b = diagram.atoms[to];
    return `<line class="diagram-bond" x1="${a.x}" y1="${a.y}" x2="${b.x}" y2="${b.y}"/>`;
  }).join("");
  const atoms = diagram.atoms.map((atom) => `<circle cx="${atom.x}" cy="${atom.y}" r="${atom.kind === "oxygen" ? 43 : 32}" fill="${atom.kind === "oxygen" ? "#df865d" : "#7ca9d0"}"/>${svgText(atom.x, atom.y + 7, atom.label, "diagram-atom-label")}`).join("");
  return shell(diagram, `${svgText(380, 80, diagram.title, "diagram-title")}${bonds}${atoms}`);
}

function renderNetwork(diagram) {
  const points = [
    [120, 110], [365, 80], [610, 130], [220, 230], [500, 220], [150, 360], [430, 350],
  ].slice(0, diagram.nodes.length);
  const edges = diagram.edges.map(([from, to]) => {
    const a = points[from];
    const b = points[to];
    return `<path class="diagram-connector" d="M ${a[0]} ${a[1]} Q ${(a[0] + b[0]) / 2} ${(a[1] + b[1]) / 2 - 20} ${b[0]} ${b[1]}" marker-end="url(#diagram-arrow)"/>`;
  }).join("");
  const nodes = diagram.nodes.map((label, index) => {
    const [x, y] = points[index];
    return `<circle cx="${x}" cy="${y}" r="35" fill="${colors[index % colors.length]}"/>${svgText(x, y + 54, label, "diagram-small-label")}`;
  }).join("");
  return shell(diagram, `${svgText(380, 35, diagram.title, "diagram-title")}${edges}${nodes}`);
}

function renderAnatomy(diagram) {
  if (diagram.id === "human-heart") {
    return shell(diagram, `${svgText(380, 40, diagram.title, "diagram-title")}<path d="M385 351 C353 324 228 234 240 147 C248 91 317 77 363 126 C406 78 477 91 495 145 C525 230 419 321 385 351Z" fill="url(#tissue)" stroke="#984c59" stroke-width="5" filter="url(#soft-shadow)"/><path d="M253 134 C275 101 321 103 350 139 L348 206 L266 218 C248 191 243 161 253 134Z" fill="#709fc2" stroke="#47718e" stroke-width="4"/><path d="M350 139 C367 118 393 111 414 121 L421 203 L351 207Z" fill="#cf7677" stroke="#994e59" stroke-width="4"/><path d="M266 218 L348 206 L376 320 C342 299 294 264 266 218Z" fill="#568eb3" stroke="#47718e" stroke-width="4"/><path d="M351 207 L421 203 C421 252 399 291 376 320Z" fill="#c85460" stroke="#984c59" stroke-width="4"/><path d="M343 101 C327 69 337 49 359 55 L376 124 M411 104 C431 69 454 76 447 115 L422 153" fill="none" stroke="#d06c6e" stroke-width="19" stroke-linecap="round"/><path d="M344 99 C326 69 313 71 306 94 M447 105 C461 79 477 88 471 117" fill="none" stroke="#719fc2" stroke-width="16" stroke-linecap="round"/><path d="M277 175 C294 195 320 199 344 180 M371 178 C393 194 412 187 420 166 M303 244 C326 268 342 278 360 281 M397 240 C386 259 382 273 378 291" fill="none" stroke="#f5c2b5" stroke-width="4" marker-end="url(#warm-arrow)"/><path d="M372 220 V275" fill="none" stroke="#f8d7ca" stroke-width="3"/><path class="diagram-connector" d="M256 145 H118 M272 220 H113 M402 167 H573 M404 253 H576"/><text x="108" y="139" text-anchor="end" class="diagram-small-label">Right atrium</text><text x="108" y="214" text-anchor="end" class="diagram-small-label">Right ventricle</text><text x="584" y="161" class="diagram-small-label">Left atrium</text><text x="584" y="247" class="diagram-small-label">Left ventricle</text><text x="380" y="390" text-anchor="middle" class="diagram-base-label">Blue: lower-oxygen blood · Red: higher-oxygen blood</text>`);
  }
  if (diagram.id === "respiratory-system") {
    return shell(diagram, `${svgText(380, 39, diagram.title, "diagram-title")}<path d="M332 76 Q380 53 428 76 L449 142 Q467 195 451 300 L429 367 H331 L309 300 Q293 196 311 142Z" fill="#eef1e6" stroke="#c3cbbd" stroke-width="3"/><path d="M366 79 Q380 70 394 79 V116 L388 142 V173" fill="none" stroke="#b65b5e" stroke-width="13" stroke-linecap="round"/><path d="M372 170 C349 185 337 207 327 238 M388 170 C411 185 423 207 433 238" fill="none" stroke="#b65b5e" stroke-width="10" stroke-linecap="round"/><path d="M368 153 C337 139 305 157 290 189 C272 228 277 282 306 300 C328 313 347 290 354 262 C363 227 373 192 368 153Z" fill="#e99b9c" stroke="#b85e69" stroke-width="4" filter="url(#soft-shadow)"/><path d="M392 153 C423 139 455 157 470 189 C488 228 483 282 454 300 C432 313 413 290 406 262 C397 227 387 192 392 153Z" fill="#e99b9c" stroke="#b85e69" stroke-width="4" filter="url(#soft-shadow)"/><path d="M380 182 V250 M380 198 L341 229 M380 198 L419 229 M341 229 L318 260 M419 229 L442 260" fill="none" stroke="#f4d0c8" stroke-width="5" stroke-linecap="round"/><path class="diagram-connector" d="M350 102 H226 M329 230 H188 M427 240 H557 M432 287 H561"/><text x="216" y="97" text-anchor="end" class="diagram-small-label">Trachea</text><text x="178" y="225" text-anchor="end" class="diagram-small-label">Bronchus</text><text x="568" y="235" class="diagram-small-label">Lung</text><text x="572" y="282" class="diagram-small-label">Alveoli</text><g fill="#f3c6b7" stroke="#bd6b6d" stroke-width="2">${[0,1,2,3,4].map(i=>`<circle cx="${560 + (i%2)*18}" cy="${310 + Math.floor(i/2)*15}" r="8"/>`).join("")}</g><text x="380" y="387" text-anchor="middle" class="diagram-base-label">Air pathway: nose → trachea → bronchi → alveoli</text>`);
  }
  if (diagram.id === "digestive-system") {
    return shell(diagram, `${svgText(380, 39, diagram.title, "diagram-title")}<path d="M320 75 Q380 54 440 75 L457 128 Q468 164 451 209 L432 362 H328 L309 209 Q292 164 303 128Z" fill="#f4eee2" stroke="#c8b8a5" stroke-width="3"/><path d="M367 97 Q378 109 389 97 V158 C390 179 404 188 418 184" fill="none" stroke="#bf6c4a" stroke-width="12" stroke-linecap="round"/><path d="M320 156 C344 135 392 138 418 158 C406 184 357 191 323 177Z" fill="#885b45" stroke="#694634" stroke-width="3"/><path d="M395 187 C426 177 441 199 427 218 C417 231 399 226 395 215 C388 198 380 205 376 225" fill="none" stroke="#d17f63" stroke-width="18" stroke-linecap="round"/><path d="M333 204 C312 217 316 250 331 262 C313 278 323 301 340 306 C323 323 343 346 365 335 L405 335 C427 346 447 323 430 306 C447 301 457 278 439 262 C454 250 458 217 437 204" fill="none" stroke="#c96d58" stroke-width="16" stroke-linecap="round"/><path d="M342 224 C375 214 405 231 412 246 C400 261 365 259 347 251 C331 244 338 273 367 274 C396 275 415 262 422 282 C411 297 377 294 352 286 C330 279 339 310 366 310 C392 310 407 300 416 318" fill="none" stroke="#e5a56f" stroke-width="7" stroke-linecap="round"/><path class="diagram-connector" d="M380 112 H218 M322 160 H194 M420 201 H559 M432 283 H572"/><text x="208" y="107" text-anchor="end" class="diagram-small-label">Oesophagus</text><text x="184" y="155" text-anchor="end" class="diagram-small-label">Liver</text><text x="570" y="196" class="diagram-small-label">Stomach</text><text x="583" y="278" class="diagram-small-label">Small intestine</text><text x="380" y="389" text-anchor="middle" class="diagram-base-label">Food pathway: mouth → oesophagus → stomach → intestines</text>`);
  }
  if (diagram.id === "human-eye") {
    return shell(diagram, `${svgText(380, 41, diagram.title, "diagram-title")}<path d="M127 220 Q239 83 389 144 Q430 160 458 220 Q430 280 389 296 Q239 357 127 220Z" fill="#f8f2e7" stroke="#6b7c73" stroke-width="5" filter="url(#soft-shadow)"/><path d="M130 220 Q239 111 384 158 Q419 170 443 220 Q419 270 384 282 Q239 329 130 220Z" fill="#d9e8e4" stroke="#80a7a4" stroke-width="3"/><path d="M138 220 Q206 148 291 150 Q281 220 291 290 Q206 292 138 220Z" fill="#7fb5c2" opacity=".8"/><path d="M288 151 Q329 220 288 289 Q338 286 348 220 Q338 154 288 151Z" fill="#efe0b3" stroke="#c0a76f" stroke-width="4"/><ellipse cx="357" cy="220" rx="14" ry="33" fill="#304e56"/><path d="M431 162 Q456 220 431 278" stroke="#d86765" stroke-width="10" fill="none"/><path d="M450 220 H597" stroke="#df865d" stroke-width="4" marker-end="url(#warm-arrow)"/><path class="diagram-connector" d="M200 156 L146 105 M318 151 L337 95 M439 188 H550 M430 266 H551"/><text x="134" y="98" text-anchor="end" class="diagram-small-label">Cornea</text><text x="338" y="86" class="diagram-small-label">Lens</text><text x="560" y="182" class="diagram-small-label">Retina</text><text x="561" y="260" class="diagram-small-label">Optic nerve</text><text x="380" y="378" text-anchor="middle" class="diagram-base-label">Light enters the cornea and focuses on the retina</text>`);
  }
  if (diagram.id === "human-ear") {
    return shell(diagram, `${svgText(380, 41, diagram.title, "diagram-title")}<path d="M183 245 C152 191 176 115 235 99 C289 84 324 125 311 167 C303 193 271 201 276 231 C281 263 249 287 220 272 C204 264 202 248 208 234" fill="#e7ae89" stroke="#a56f59" stroke-width="5" filter="url(#soft-shadow)"/><path d="M277 183 C315 164 339 173 353 201" fill="none" stroke="#8a5b4d" stroke-width="12" stroke-linecap="round"/><path d="M356 184 Q375 205 357 226" fill="none" stroke="#d17d68" stroke-width="6"/><path d="M365 197 L391 178 L411 197 L431 178 L448 202" fill="none" stroke="#c89d50" stroke-width="9" stroke-linecap="round" stroke-linejoin="round"/><path d="M448 197 C492 181 509 220 482 242 C457 262 430 240 440 219 C448 203 469 208 470 222 C470 231 460 235 454 229" fill="none" stroke="#9e6da8" stroke-width="8"/><path d="M481 214 C530 193 550 226 572 205" fill="none" stroke="#6086a8" stroke-width="5"/><path class="diagram-connector" d="M204 124 L149 86 M297 190 H386 M409 164 V111 M482 258 L526 307"/><text x="140" y="80" text-anchor="end" class="diagram-small-label">Outer ear</text><text x="391" y="184" class="diagram-small-label">Eardrum</text><text x="409" y="101" class="diagram-small-label">Ossicles</text><text x="531" y="319" class="diagram-small-label">Cochlea</text><text x="380" y="374" text-anchor="middle" class="diagram-base-label">Sound vibrations travel toward the inner ear</text>`);
  }
  if (diagram.id === "neuron") {
    return shell(diagram, `${svgText(380, 40, diagram.title, "diagram-title")}<path d="M210 219 C182 176 155 160 125 148 M204 207 C171 206 146 192 120 181 M205 232 C172 255 148 278 121 300 M213 192 C196 158 193 135 190 109 M216 244 C198 279 192 302 187 331" fill="none" stroke="#638c69" stroke-width="8" stroke-linecap="round"/><path d="M203 202 C225 174 267 176 285 209 C302 241 274 268 241 266 C208 264 188 233 203 202Z" fill="url(#nucleus)" stroke="#805987" stroke-width="4"/><circle cx="244" cy="221" r="13" fill="#82538d"/><path d="M286 220 C360 220 445 220 610 220" fill="none" stroke="#d39558" stroke-width="12" stroke-linecap="round"/><path d="M316 201 Q341 183 366 201 V239 Q341 256 316 239Z M389 201 Q414 183 439 201 V239 Q414 256 389 239Z M463 201 Q488 183 513 201 V239 Q488 256 463 239Z" fill="#e8c99a" stroke="#b18c5a" stroke-width="3"/><path d="M610 220 C630 198 646 189 666 177 M610 220 C635 220 650 222 676 232 M610 220 C630 243 644 259 666 277" fill="none" stroke="#638c69" stroke-width="7" stroke-linecap="round"/><path d="M312 276 H601" stroke="#df865d" stroke-width="3" marker-end="url(#warm-arrow)"/><path class="diagram-connector" d="M150 140 L116 93 M241 178 V114 M414 183 V132 M642 185 L676 130"/><text x="108" y="86" text-anchor="end" class="diagram-small-label">Dendrites</text><text x="241" y="104" class="diagram-small-label">Cell body</text><text x="414" y="122" class="diagram-small-label">Myelin sheath</text><text x="681" y="124" class="diagram-small-label">Axon terminals</text><text x="380" y="345" text-anchor="middle" class="diagram-base-label">Direction of nerve impulse</text>`);
  }
  if (diagram.id === "nephron") {
    return shell(diagram, `${svgText(380, 40, diagram.title, "diagram-title")}<circle cx="173" cy="137" r="47" fill="#eaa09a" stroke="#ac5d62" stroke-width="4"/><path d="M149 142 C123 106 174 94 185 129 C197 157 142 175 147 133 C151 111 195 116 190 145" fill="none" stroke="#a63f52" stroke-width="6"/><path d="M219 138 C275 138 285 163 282 204 C279 248 310 247 313 207 C316 170 352 170 353 214 C354 271 329 306 359 325 C385 342 410 320 408 286 L406 170 C406 140 435 135 455 151 L488 176" fill="none" stroke="#dc8a62" stroke-width="15" stroke-linecap="round" stroke-linejoin="round"/><path d="M282 204 C280 254 310 259 313 211 M353 214 C356 275 330 306 359 325" fill="none" stroke="#6086a8" stroke-width="5" stroke-linecap="round"/><path d="M488 176 V353" fill="none" stroke="#c5a14f" stroke-width="17" stroke-linecap="round"/><path class="diagram-connector" d="M151 91 L119 65 M311 252 H234 M408 139 V94 M489 303 H566"/><text x="112" y="60" text-anchor="end" class="diagram-small-label">Glomerulus</text><text x="226" y="247" text-anchor="end" class="diagram-small-label">Loop of Henle</text><text x="408" y="83" class="diagram-small-label">Distal tubule</text><text x="575" y="308" class="diagram-small-label">Collecting duct</text><text x="380" y="397" text-anchor="middle" class="diagram-base-label">Filtrate moves through the tubule as water and solutes are reabsorbed</text>`);
  }
  if (diagram.id === "skeleton") {
    return shell(diagram, `${svgText(380, 39, diagram.title, "diagram-title")}<g fill="none" stroke="#d7c8a9" stroke-linecap="round" stroke-linejoin="round" filter="url(#soft-shadow)"><circle cx="380" cy="104" r="34" fill="#efe4c9" stroke="#af9d78" stroke-width="5"/><path d="M354 110 Q380 126 406 110 M362 124 Q380 133 398 124" stroke-width="3"/><path d="M380 139 V258" stroke-width="13"/><path d="M345 157 Q380 143 415 157 L407 210 Q380 229 353 210Z" stroke-width="8"/><path d="M356 158 C332 167 330 204 354 211 M404 158 C428 167 430 204 406 211" stroke-width="6"/>${[0,1,2,3,4].map(i=>`<path d="M ${380-i*4} ${163+i*10} Q ${337-i*3} ${168+i*10} ${350-i*2} ${186+i*10} M ${380+i*4} ${163+i*10} Q ${423+i*3} ${168+i*10} ${410+i*2} ${186+i*10}" stroke-width="4"/>`).join("")}<path d="M380 257 L347 276 L380 298 L413 276Z" stroke-width="8"/><path d="M350 171 L315 219 L299 271 M410 171 L445 219 L461 271" stroke-width="11"/><path d="M299 271 L283 316 M461 271 L477 316 M365 291 L350 351 L345 398 M395 291 L410 351 L415 398" stroke-width="13"/><path d="M345 398 L325 406 M415 398 L435 406" stroke-width="9"/><path d="M364 87 Q380 77 396 87 M369 93 H375 M385 93 H391" stroke-width="3"/></g><path class="diagram-connector" d="M346 104 H200 M350 182 H180 M346 274 H198 M350 350 H202 M413 351 H560"/><text x="190" y="99" text-anchor="end" class="diagram-small-label">Skull</text><text x="170" y="177" text-anchor="end" class="diagram-small-label">Rib cage</text><text x="188" y="269" text-anchor="end" class="diagram-small-label">Spine</text><text x="192" y="345" text-anchor="end" class="diagram-small-label">Pelvis</text><text x="569" y="346" class="diagram-small-label">Leg bones</text><text x="380" y="428" text-anchor="middle" class="diagram-base-label">Simplified anterior view of the adult skeleton</text>`);
  }
  const rows = diagram.nodes.map((label, index) => {
    const y = 93 + index * (260 / Math.max(diagram.nodes.length - 1, 1));
    const left = index % 2 === 0;
    const x = left ? 195 : 565;
    const startX = left ? 275 : 485;
    const color = colors[index % colors.length];
    return `<path class="diagram-connector" d="M ${startX} ${y} H ${left ? x + 60 : x - 60}"/> <circle cx="${x}" cy="${y}" r="22" fill="${color}" opacity=".88"/>${svgText(left ? 160 : 600, y + 5, label, "diagram-small-label", left ? "end" : "start")}`;
  }).join("");
  const spine = `<path d="M 380 73 C 354 111 406 139 380 176 C 354 213 406 241 380 278 C 354 314 402 342 380 372" fill="none" stroke="#9c7d68" stroke-width="16" stroke-linecap="round"/>`;
  return shell(diagram, `${svgText(380, 38, diagram.title, "diagram-title")}${spine}${rows}`);
}

function renderLayers(diagram) {
  const fills = ["#dfc99a", "#d98357", "#d66c4e", "#8d4a3e"];
  const layers = diagram.nodes.map((label, index) => {
    const y = 103 + index * 73;
    return `<rect x="115" y="${y}" width="380" height="68" rx="${index === 0 ? 28 : 10}" fill="${fills[index]}" opacity=".9"/>${svgText(305, y + 42, label, "diagram-layer-label")}`;
  }).join("");
  return shell(diagram, `${svgText(380, 55, diagram.title, "diagram-title")}${layers}${svgText(565, 166, "Surface", "diagram-small-label", "start")}${svgText(565, 312, "Deeper", "diagram-small-label", "start")}`);
}

function renderCircuit(diagram) {
  return shell(diagram, `${svgText(380, 65, diagram.title, "diagram-title")}<path class="diagram-wire" d="M 170 150 H 590 V 315 H 170 V 150"/><path class="diagram-wire" d="M 170 205 V 260 M 151 218 H 189 M 157 248 H 183"/><circle cx="380" cy="150" r="35" fill="#f7e9ba" stroke="#c5a14f" stroke-width="4"/><path d="M 380 123 L 364 153 H 379 L 369 178 L 397 143 H 382 Z" fill="#b88737"/><rect x="278" y="298" width="84" height="34" rx="8" fill="#dce8f0" stroke="#6086a8" stroke-width="3"/><path d="M 292 315 H 348" stroke="#6086a8" stroke-width="5"/>${svgText(170, 365, diagram.nodes[0])}${svgText(320, 365, diagram.nodes[1])}${svgText(380, 105, diagram.nodes[2])}`);
}

function renderOrbit(diagram) {
  const cx = 380;
  const cy = 220;
  const positions = diagram.nodes.map((label, index) => {
    const angle = -Math.PI / 2 + index * Math.PI * 2 / diagram.nodes.length;
    const x = cx + Math.cos(angle) * 175;
    const y = cy + Math.sin(angle) * 150;
    return `<circle cx="${x}" cy="${y}" r="28" fill="${index === 0 ? "#526b91" : "#a9c5df"}"/>${svgText(x, y + 48, label, "diagram-small-label")}`;
  }).join("");
  return shell(diagram, `<circle class="diagram-orbit" cx="${cx}" cy="${cy}" r="174"/> <circle cx="${cx}" cy="${cy}" r="48" fill="#df865d"/>${svgText(cx, cy + 6, "Earth", "diagram-sun-label")}${positions}${svgText(380, 34, "Sunlight →", "diagram-small-label")}`);
}

function renderHelix(diagram) {
  const left = [];
  const right = [];
  const rungs = [];
  for (let index = 0; index <= 16; index += 1) {
    const y = 72 + index * 18;
    const x1 = 330 + Math.sin(index * Math.PI / 4) * 100;
    const x2 = 430 - Math.sin(index * Math.PI / 4) * 100;
    left.push(`${index === 0 ? "M" : "L"} ${x1} ${y}`);
    right.push(`${index === 0 ? "M" : "L"} ${x2} ${y}`);
    if (index < diagram.nodes.length) rungs.push(`<line class="diagram-rung" x1="${x1}" y1="${y}" x2="${x2}" y2="${y}"/>${svgText((x1 + x2) / 2, y + 5, diagram.nodes[index], "diagram-base-label")}`);
  }
  return shell(diagram, `${svgText(380, 37, diagram.title, "diagram-title")}<path d="${left.join(" ")}" fill="none" stroke="#4c8b65" stroke-width="9" stroke-linecap="round"/><path d="${right.join(" ")}" fill="none" stroke="#6086a8" stroke-width="9" stroke-linecap="round"/>${rungs.join("")}`);
}

function renderVolcano(diagram) {
  return shell(diagram, `${svgText(380, 45, diagram.title, "diagram-title")}<path d="M 140 370 L 285 155 L 340 190 L 380 95 L 430 185 L 490 150 L 620 370 Z" fill="#b97955" stroke="#775849" stroke-width="5"/><path d="M 354 370 L 368 195 L 380 125 L 394 195 L 407 370 Z" fill="#df865d"/><ellipse cx="380" cy="369" rx="122" ry="35" fill="#e58a5b"/><path d="M 350 108 Q 370 80 350 60 M 380 97 Q 400 72 380 50 M 410 108 Q 430 84 411 64" fill="none" stroke="#89939a" stroke-width="10" stroke-linecap="round"/>${diagram.nodes.map((label, index) => {
    const y = 98 + index * 57;
    return `<path class="diagram-connector" d="M ${index % 2 ? 498 : 262} ${y} H ${index % 2 ? 560 : 200}"/>${svgText(index % 2 ? 574 : 186, y + 5, label, "diagram-small-label", index % 2 ? "start" : "end")}`;
  }).join("")}`);
}

function renderPlates(diagram) {
  const labels = diagram.nodes.map((label, index) => svgText(145 + index * 235, 350, label, "diagram-small-label")).join("");
  return shell(diagram, `${svgText(380, 48, diagram.title, "diagram-title")}<path d="M 55 255 L 260 255 L 330 279 L 380 279 L 430 255 L 705 255 L 705 370 L 55 370 Z" fill="#caa878"/><path d="M 55 255 L 260 255 L 330 279 L 380 279 L 430 255 L 705 255" fill="none" stroke="#7b6751" stroke-width="5"/><path d="M 260 242 V 172 M 500 242 V 172" stroke="#4c8b65" stroke-width="7" marker-end="url(#diagram-arrow)"/><path d="M 260 160 H 500" stroke="#55745e" stroke-width="3" marker-end="url(#diagram-arrow)"/><path d="M 500 188 H 260" stroke="#df865d" stroke-width="3" marker-end="url(#diagram-arrow)"/>${labels}`);
}

function renderScienceIllustration(diagram) {
  const title = svgText(380, 37, diagram.title, "diagram-title");
  const label = (x, y, text, anchor = "middle") => svgText(x, y, text, "diagram-small-label", anchor);
  const line = (x1, y1, x2, y2) => `<path d="M ${x1} ${y1} L ${x2} ${y2}" fill="none" stroke="#667b70" stroke-width="1.5"/>`;

  if (diagram.id === "atom-structure") {
    const nucleons = Array.from({ length: 12 }, (_, i) => {
      const x = 363 + (i % 4) * 13 + (Math.floor(i / 4) % 2) * 5;
      const y = 201 + Math.floor(i / 4) * 14;
      return `<circle cx="${x}" cy="${y}" r="8" fill="${i % 2 ? "#718ca7" : "#df865d"}" stroke="#fff" stroke-width="2"/>`;
    }).join("");
    const electrons = [[380,94],[510,220],[380,346],[250,220],[380,154],[446,220],[380,286],[314,220]];
    return shell(diagram, `${title}<ellipse cx="380" cy="220" rx="131" ry="76" fill="none" stroke="#9eaaa5" stroke-width="2"/><ellipse cx="380" cy="220" rx="65" ry="38" fill="none" stroke="#9eaaa5" stroke-width="2"/>${nucleons}${electrons.map(([x,y])=>`<circle cx="${x}" cy="${y}" r="7" fill="#527eae" stroke="#fff" stroke-width="2"/>`).join("")}${line(394,205,520,129)}${label(528,123,"Carbon-12 nucleus","start")}${line(510,220,541,275)}${label(548,283,"Electron shells","start")}${label(380,395,"6 protons · 6 neutrons · 6 electrons")}`);
  }
  if (diagram.id === "periodic-table") {
    const elementData = `H|Hydrogen He|Helium Li|Lithium Be|Beryllium B|Boron C|Carbon N|Nitrogen O|Oxygen F|Fluorine Ne|Neon Na|Sodium Mg|Magnesium Al|Aluminium Si|Silicon P|Phosphorus S|Sulfur Cl|Chlorine Ar|Argon K|Potassium Ca|Calcium Sc|Scandium Ti|Titanium V|Vanadium Cr|Chromium Mn|Manganese Fe|Iron Co|Cobalt Ni|Nickel Cu|Copper Zn|Zinc Ga|Gallium Ge|Germanium As|Arsenic Se|Selenium Br|Bromine Kr|Krypton Rb|Rubidium Sr|Strontium Y|Yttrium Zr|Zirconium Nb|Niobium Mo|Molybdenum Tc|Technetium Ru|Ruthenium Rh|Rhodium Pd|Palladium Ag|Silver Cd|Cadmium In|Indium Sn|Tin Sb|Antimony Te|Tellurium I|Iodine Xe|Xenon Cs|Caesium Ba|Barium La|Lanthanum Ce|Cerium Pr|Praseodymium Nd|Neodymium Pm|Promethium Sm|Samarium Eu|Europium Gd|Gadolinium Tb|Terbium Dy|Dysprosium Ho|Holmium Er|Erbium Tm|Thulium Yb|Ytterbium Lu|Lutetium Hf|Hafnium Ta|Tantalum W|Tungsten Re|Rhenium Os|Osmium Ir|Iridium Pt|Platinum Au|Gold Hg|Mercury Tl|Thallium Pb|Lead Bi|Bismuth Po|Polonium At|Astatine Rn|Radon Fr|Francium Ra|Radium Ac|Actinium Th|Thorium Pa|Protactinium U|Uranium Np|Neptunium Pu|Plutonium Am|Americium Cm|Curium Bk|Berkelium Cf|Californium Es|Einsteinium Fm|Fermium Md|Mendelevium No|Nobelium Lr|Lawrencium Rf|Rutherfordium Db|Dubnium Sg|Seaborgium Bh|Bohrium Hs|Hassium Mt|Meitnerium Ds|Darmstadtium Rg|Roentgenium Cn|Copernicium Nh|Nihonium Fl|Flerovium Mc|Moscovium Lv|Livermorium Ts|Tennessine Og|Oganesson`;
    const elements = elementData.split(" ").map((entry, index) => {
      const [symbol, name] = entry.split("|");
      return { number: index + 1, symbol, name };
    });
    const elementBySymbol = new Map(elements.map((element) => [element.symbol, element]));
    const periods = [
      ["H", "", "", "", "", "", "", "", "", "", "", "", "", "", "", "", "", "He"],
      ["Li", "Be", "", "", "", "", "", "", "", "", "", "", "B", "C", "N", "O", "F", "Ne"],
      ["Na", "Mg", "", "", "", "", "", "", "", "", "", "", "Al", "Si", "P", "S", "Cl", "Ar"],
      ["K", "Ca", "Sc", "Ti", "V", "Cr", "Mn", "Fe", "Co", "Ni", "Cu", "Zn", "Ga", "Ge", "As", "Se", "Br", "Kr"],
      ["Rb", "Sr", "Y", "Zr", "Nb", "Mo", "Tc", "Ru", "Rh", "Pd", "Ag", "Cd", "In", "Sn", "Sb", "Te", "I", "Xe"],
      ["Cs", "Ba", "Ln", "Hf", "Ta", "W", "Re", "Os", "Ir", "Pt", "Au", "Hg", "Tl", "Pb", "Bi", "Po", "At", "Rn"],
      ["Fr", "Ra", "An", "Rf", "Db", "Sg", "Bh", "Hs", "Mt", "Ds", "Rg", "Cn", "Nh", "Fl", "Mc", "Lv", "Ts", "Og"],
    ];
    const lanthanides = elements.slice(56, 71);
    const actinides = elements.slice(88, 103);
    const categories = [
      { name: "Alkali metal", color: "#e5aa79", numbers: [3,11,19,37,55,87] },
      { name: "Alkaline earth metal", color: "#e6ce8b", numbers: [4,12,20,38,56,88] },
      { name: "Transition metal", color: "#9bb6a2", numbers: [21,22,23,24,25,26,27,28,29,30,39,40,41,42,43,44,45,46,47,48,72,73,74,75,76,77,78,79,80,104,105,106,107,108,109,110,111,112] },
      { name: "Post-transition metal", color: "#a9c5b8", numbers: [13,31,49,50,81,82,83,113,114,115,116] },
      { name: "Metalloid", color: "#c5bd82", numbers: [5,14,32,33,51,52,84] },
      { name: "Reactive nonmetal", color: "#91b5c9", numbers: [1,6,7,8,15,16,34] },
      { name: "Halogen", color: "#b1a4c7", numbers: [9,17,35,53,85,117] },
      { name: "Noble gas", color: "#d0a6a0", numbers: [2,10,18,36,54,86,118] },
      { name: "Lanthanide", color: "#c8a9c5", numbers: lanthanides.map((element) => element.number) },
      { name: "Actinide", color: "#d5a992", numbers: actinides.map((element) => element.number) },
    ];
    const categoryByNumber = new Map(categories.flatMap((category) =>
      category.numbers.map((number) => [number, category])));
    const startX = 39;
    const columnStep = 38;
    const cellWidth = 36;
    const cellHeight = 29;
    const periodStep = 31;
    const elementTile = (element, column, y) => {
      const x = startX + (column - 1) * columnStep;
      const category = categoryByNumber.get(element.number);
      if (!category) throw new Error(`Missing periodic-table category for element ${element.number}.`);
      return `<g role="img" aria-label="${element.number} ${element.name} (${element.symbol})"><title>${element.number} · ${element.name} · ${category.name}</title><rect x="${x}" y="${y}" width="${cellWidth}" height="${cellHeight}" rx="3" fill="${category.color}" fill-opacity=".86" stroke="#66786e" stroke-width=".8"/><text x="${x+3}" y="${y+8}" fill="#314a3c" font-family="Arial,sans-serif" font-size="6.5">${element.number}</text><text x="${x+18}" y="${y+22}" text-anchor="middle" fill="#243b31" font-family="Arial,sans-serif" font-size="11" font-weight="700">${element.symbol}</text></g>`;
    };
    const groupLabels = Array.from({ length: 18 }, (_, index) =>
      svgText(startX + index * columnStep + cellWidth / 2, 60, String(index + 1), "diagram-base-label"));
    const periodRows = periods.map((symbols, periodIndex) => {
      const y = 68 + periodIndex * periodStep;
      const periodLabel = svgText(25, y + 19, String(periodIndex + 1), "diagram-base-label");
      const tiles = symbols.map((symbol, index) => {
        if (symbol === "Ln" || symbol === "An") {
          const range = symbol === "Ln" ? "57–71" : "89–103";
          return `<g role="img" aria-label="${symbol === "Ln" ? "Lanthanides" : "Actinides"}, elements ${range} shown below"><title>${symbol === "Ln" ? "Lanthanides" : "Actinides"} shown below</title><rect x="${startX + index * columnStep}" y="${y}" width="${cellWidth}" height="${cellHeight}" rx="3" fill="#eef0e9" stroke="#66786e" stroke-dasharray="3 2"/><text x="${startX + index * columnStep + cellWidth / 2}" y="${y + 18}" text-anchor="middle" fill="#40564a" font-family="Arial,sans-serif" font-size="8">${range}</text></g>`;
        }
        if (!symbol) return "";
        return elementTile(elementBySymbol.get(symbol), index + 1, y);
      }).join("");
      return `${periodLabel}${tiles}`;
    }).join("");
    const fBlockRows = [lanthanides, actinides].map((series, seriesIndex) => {
      const y = 291 + seriesIndex * 32;
      const seriesLabel = svgText(27, y + 19, seriesIndex === 0 ? "Ln" : "An", "diagram-base-label");
      const tiles = series.map((element, index) => elementTile(element, index + 4, y)).join("");
      return `${seriesLabel}${tiles}`;
    }).join("");
    const legend = categories.map((category, index) => {
      const x = 43 + (index % 5) * 142;
      const y = 374 + Math.floor(index / 5) * 17;
      return `<rect x="${x}" y="${y - 8}" width="9" height="9" rx="2" fill="${category.color}"/>${svgText(x + 14, y, category.name, "diagram-base-label", "start")}`;
    }).join("");
    return shell(diagram, `${title}${groupLabels.join("")}${periodRows}${fBlockRows}${legend}${svgText(380, 421, "All 118 elements · lanthanides (Ln) and actinides (An) shown separately", "diagram-base-label")}`);
  }
  if (diagram.id === "chemical-reaction") {
    const h2=x=>`<line x1="${x-18}" y1="205" x2="${x+18}" y2="205" class="diagram-bond"/>${atomCircle(x-20,205,"#718ca7","H")}${atomCircle(x+20,205,"#718ca7","H")}`;
    const atomCircle=(x,y,color,symbol)=>`<circle cx="${x}" cy="${y}" r="16" fill="${color}"/><text x="${x}" y="${y+6}" class="diagram-atom-label" text-anchor="middle">${symbol}</text>`;
    const oxygen=()=>`<line x1="296" y1="205" x2="332" y2="205" class="diagram-bond"/><line x1="296" y1="211" x2="332" y2="211" class="diagram-bond"/><circle cx="294" cy="208" r="16" fill="#df865d"/><circle cx="334" cy="208" r="16" fill="#df865d"/>${svgText(294,214,"O","diagram-atom-label")}${svgText(334,214,"O","diagram-atom-label")}`;
    const h2o=x=>`<line x1="${x-19}" y1="212" x2="${x}" y2="192" class="diagram-bond"/><line x1="${x}" y1="192" x2="${x+19}" y2="212" class="diagram-bond"/><circle cx="${x}" cy="192" r="19" fill="#df865d"/><circle cx="${x-21}" cy="214" r="15" fill="#718ca7"/><circle cx="${x+21}" cy="214" r="15" fill="#718ca7"/>${svgText(x,198,"O","diagram-atom-label")}${svgText(x-21,219,"H","diagram-atom-label")}${svgText(x+21,219,"H","diagram-atom-label")}`;
    return shell(diagram, `${title}${h2(140)}${h2(213)}${label(175,256,"2 H₂")}${oxygen()}${svgText(380,210,"→","diagram-title")}${h2o(476)}${h2o(565)}${label(520,265,"2 H₂O")}${svgText(380,344,"2H₂ + O₂ → 2H₂O","diagram-title")}${label(380,383,"Atoms are conserved as chemical bonds rearrange")}`);
  }
  if (diagram.id === "ph-scale") {
    const spectrum=["#bb4050","#d45c48","#e47d4d","#e9a553","#e4c15c","#c5c867","#91b96d","#68aa76","#509b8b","#4b929e","#5084a7","#6176a8","#78689a","#8a608e"];
    const blocks=spectrum.map((color,i)=>`<rect x="${72+i*44}" y="187" width="44" height="62" fill="${color}"/>${label(94+i*44,276,String(i))}`).join("");
    const beaker=(x,caption,fill)=>`<path d="M${x-30} 104 V154 L${x-43} 237 Q${x-46} 254 ${x-28} 257 H${x+28} Q${x+46} 254 ${x+43} 237 L${x+30} 154 V104" fill="#fff" fill-opacity=".45" stroke="#637b79" stroke-width="3"/><path d="M${x-34} 218 H${x+34} L${x+41} 240 Q${x+43} 251 ${x+27} 252 H${x-27} Q${x-42} 251 ${x-40} 240Z" fill="${fill}" fill-opacity=".72"/>${label(x,294,caption)}`;
    return shell(diagram, `${title}<rect x="72" y="187" width="616" height="62" rx="7" fill="#eee"/>${blocks}<path d="M72 257 H688" stroke="#56685f" stroke-width="2"/>${beaker(174,"pH 2 · lemon juice","#dc645b")}${beaker(380,"pH 7 · pure water","#8fc6d1")}${beaker(586,"pH 12 · soap","#7799cf")}${label(174,167,"Acidic")}${label(380,167,"Neutral")}${label(586,167,"Basic")}${label(380,374,"pH < 7 acidic · pH 7 neutral · pH > 7 basic")}`);
  }
  if (diagram.id === "distillation") {
    return shell(diagram, `${title}<path d="M132 145 H204 V190 C204 209 248 239 248 284 C248 321 220 344 168 344 C116 344 88 321 88 284 C88 239 132 209 132 190Z" fill="#d9eef0" fill-opacity=".6" stroke="#587d83" stroke-width="4"/><path d="M106 290 Q168 277 230 290 V314 Q221 336 168 336 Q115 336 106 314Z" fill="#d98970" fill-opacity=".75"/><path d="M168 145 V91 H326 L420 157" fill="none" stroke="#587d83" stroke-width="13" stroke-linecap="round" stroke-linejoin="round"/><path d="M310 76 L359 132 M291 99 L342 155 M330 62 L382 119" stroke="#6b9da7" stroke-width="3"/><path d="M410 151 L482 204" fill="none" stroke="#587d83" stroke-width="13" stroke-linecap="round"/><path d="M455 173 H585 V302 Q585 321 566 321 H474 Q455 321 455 302Z" fill="#d9eef0" fill-opacity=".5" stroke="#587d83" stroke-width="4"/><path d="M462 275 H578 V302 Q578 314 564 314 H475 Q462 314 462 302Z" fill="#72b5c5" fill-opacity=".75"/><path d="M103 369 H231 M116 359 L128 382 M153 359 L165 382 M190 359 L202 382" stroke="#df865d" stroke-width="6"/>${label(83,207,"Boiling flask","end")}${label(326,54,"Vapor path")}${label(438,81,"Cooled condenser","start")}${label(620,351,"Distillate","start")}${label(380,413,"The less volatile solute remains in the flask")}`);
  }
  if (diagram.id === "microscope") {
    return shell(diagram, `${title}<path d="M327 76 Q322 68 331 61 L359 47 Q369 43 375 53 L404 104 L386 116Z" fill="#7b8790" stroke="#4d5c62" stroke-width="4"/><path d="M391 110 C477 115 528 176 506 247 C494 285 460 304 422 298 L412 270 C454 273 478 244 475 211 C470 169 439 147 384 148Z" fill="#d3d9d4" stroke="#77847e" stroke-width="6"/><path d="M323 112 L373 88 L395 130 L345 155Z" fill="#a9b5b3" stroke="#566b6c" stroke-width="4"/><path d="M350 143 L380 195" stroke="#4a8d9f" stroke-width="13" stroke-linecap="round"/><path d="M271 238 H473" stroke="#667b7c" stroke-width="12" stroke-linecap="round"/><rect x="342" y="221" width="63" height="15" rx="4" fill="#bed7d9" stroke="#5b7f84" stroke-width="3"/><path d="M352 236 L322 323 H428 L398 236" fill="#e8eeee" stroke="#637574" stroke-width="4"/><path d="M297 323 H457 V348 H297Z" fill="#687c7a" stroke="#4d615f" stroke-width="4"/><circle cx="375" cy="366" r="20" fill="#e7c56e" stroke="#b48b3b" stroke-width="4"/>${line(350,66,270,72)}${label(263,77,"Ocular lens","end")}${line(363,133,277,137)}${label(269,142,"Objective lens","end")}${line(365,225,506,222)}${label(514,227,"Specimen slide","start")}${line(375,366,509,377)}${label(518,382,"Illuminator","start")}${label(380,410,"Compound light microscope · not to scale")}`);
  }
  if (diagram.id === "flower-anatomy" || diagram.id === "pollination") {
    const pollination=diagram.id==="pollination";
    const cx=pollination?210:380,cy=200;
    const petals=Array.from({length:6},(_,i)=>`<ellipse cx="${cx}" cy="${cy}" rx="${pollination?28:34}" ry="62" transform="rotate(${i*60} ${cx} ${cy})" fill="${pollination?"#d98f9e":"#d98f9e"}" fill-opacity=".76" stroke="#a9576a" stroke-width="2"/>`).join("");
    if (!pollination) return shell(diagram, `${title}${petals}<path d="M380 117 C372 151 374 179 380 211 V300 M380 174 C347 154 338 169 346 193 C356 207 372 203 380 191 M380 186 C405 164 421 175 414 195 C403 208 389 202 380 194" fill="none" stroke="#567e50" stroke-width="5"/><path d="M380 200 V268 M372 267 Q380 252 388 267 L402 296 Q380 318 358 296Z" fill="#a5bf68" stroke="#557e50" stroke-width="3"/><path d="M365 143 V190 M395 143 V190" stroke="#b57f3d" stroke-width="4"/><ellipse cx="365" cy="137" rx="9" ry="5" fill="#e6bb58"/><ellipse cx="395" cy="137" rx="9" ry="5" fill="#e6bb58"/><circle cx="380" cy="113" r="8" fill="#a14e69"/>${line(435,133,525,95)}${label(533,99,"Petal","start")}${line(395,138,505,153)}${label(513,157,"Anther","start")}${line(380,113,237,91)}${label(229,95,"Stigma","end")}${line(380,289,510,290)}${label(518,294,"Ovary","start")}${label(380,409,"Longitudinal section · reproductive structures simplified")}`);
    const grains=Array.from({length:12},(_,i)=>`<circle cx="${384+(i%4)*14}" cy="${157+Math.floor(i/4)*16}" r="3" fill="#e8bd54"/>`).join("");
    return shell(diagram, `${title}${petals}<circle cx="${cx}" cy="${cy}" r="20" fill="#e8bd54"/><path d="M210 220 V321 M210 310 Q217 296 224 310 L237 341 Q217 359 197 341Z M210 319 V378 M210 348 Q180 333 167 349 Q182 367 210 355 M210 355 Q240 336 258 350 Q246 369 210 364" fill="none" stroke="#557e50" stroke-width="5"/><path d="M455 180 C475 146 530 141 553 176 C572 206 550 240 516 239 C481 237 449 212 455 180Z" fill="#d8ae48" stroke="#5f5c45" stroke-width="3"/><path d="M486 153 Q503 189 489 230 M524 148 Q535 189 522 235 M464 174 Q502 184 557 175" fill="none" stroke="#5a5142" stroke-width="7"/><ellipse cx="484" cy="137" rx="23" ry="12" fill="#d9eef0" fill-opacity=".7" stroke="#72959a" stroke-width="2"/><ellipse cx="518" cy="130" rx="22" ry="11" fill="#d9eef0" fill-opacity=".7" stroke="#72959a" stroke-width="2"/>${grains}<path d="M390 157 C418 117 453 121 477 151" fill="none" stroke="#c5a14f" stroke-width="2.5" stroke-dasharray="5 6" marker-end="url(#diagram-arrow)"/>${label(110,125,"Anther")}${label(110,267,"Stigma")}${label(520,285,"Pollinator")}${label(380,408,"Pollen transfer enables fertilization in flowering plants")}`);
  }
  if (diagram.id === "seed-germination") {
    const xs=[130,295,460,625];
    const stages=xs.map((x,i)=>`<path d="M${x-65} 290 Q${x} 278 ${x+65} 290 V356 H${x-65}Z" fill="url(#soil)"/><ellipse cx="${x}" cy="284" rx="21" ry="14" transform="rotate(-25 ${x} 284)" fill="#b88750" stroke="#795b3e" stroke-width="3"/>${i?`<path d="M${x} 295 C${x+8} 316 ${x-8} 333 ${x+3} ${300+i*19}" fill="none" stroke="#eadcba" stroke-width="5"/>`:""}${i===3?`<path d="M${x} 271 Q${x-4} 232 ${x} 193 M${x} 223 Q${x-27} 210 ${x-34} 193 Q${x-12} 187 ${x} 213 M${x} 218 Q${x+24} 204 ${x+32} 187 Q${x+11} 187 ${x} 208" fill="#6f9c5e" stroke="#4e7850" stroke-width="4"/>`:""}`).join("");
    return shell(diagram, `${title}<path d="M65 290 H695" stroke="#5c7651" stroke-width="3"/>${stages}${label(130,389,"1 · Water uptake")}${label(295,389,"2 · Radicle emerges")}${label(460,389,"3 · Root growth")}${label(625,389,"4 · Seedling")}${label(380,423,"Roots grow downward; the shoot grows toward light")}`);
  }
  if (diagram.id === "human-brain") {
    return shell(diagram, `${title}<path d="M191 226 C167 200 181 158 209 148 C207 115 244 94 271 108 C292 74 333 77 351 104 C384 74 428 92 432 120 C471 111 498 140 487 171 C520 193 501 232 478 243 C474 280 444 300 413 286 C392 316 349 306 337 282 C302 302 270 280 266 253 C232 270 199 253 191 226Z" fill="#d99a96" stroke="#9f6266" stroke-width="4"/>${[0,1,2,3,4,5].map(i=>`<path d="M${215+i*42} ${135+(i%2)*30} Q${195+i*44} ${175+(i%3)*15} ${235+i*36} ${220+(i%2)*22}" fill="none" stroke="#f1c2b1" stroke-width="5" stroke-linecap="round"/>`).join("")}<path d="M350 277 C337 306 347 337 366 348 L367 383 H415 L414 342 C434 329 439 303 424 281" fill="#dfb6a1" stroke="#9f7265" stroke-width="4"/>${line(239,135,128,95)}${label(118,99,"Cerebrum","end")}${line(458,259,576,292)}${label(584,297,"Cerebellum","start")}${line(391,350,527,370)}${label(535,375,"Brain stem","start")}${label(380,414,"Lateral view · regions simplified for learning")}`);
  }
  if (diagram.id === "kidney-cross-section") {
    return shell(diagram, `${title}<path d="M318 99 C250 75 174 119 165 205 C156 289 220 348 294 328 C340 316 347 275 326 246 C307 219 308 187 337 165 C360 147 351 112 318 99Z" fill="#a95459" stroke="#723d45" stroke-width="5"/><path d="M309 116 C254 99 196 136 190 205 C184 272 229 322 286 309 C317 302 328 275 309 250 C282 213 287 176 318 151 C331 140 326 122 309 116Z" fill="#c97970" stroke="#f0c0a3" stroke-width="5"/><path d="M307 149 C269 161 254 189 272 217 C288 241 289 270 270 293 L309 289 C325 267 316 244 304 220 C292 194 299 177 322 160Z" fill="#e0a57b" stroke="#b56c60" stroke-width="3"/><path d="M319 162 L356 190 L319 225 L354 258 L311 295" fill="none" stroke="#ead5a9" stroke-width="14" stroke-linejoin="round"/><path d="M354 190 Q391 190 421 208 L421 269 Q390 282 354 258Z" fill="#e6d5aa" stroke="#9b8060" stroke-width="4"/><path d="M421 236 V357" stroke="#d4ae7d" stroke-width="18" stroke-linecap="round"/>${line(201,147,94,112)}${label(84,116,"Cortex","end")}${line(279,222,101,239)}${label(91,244,"Medulla","end")}${line(387,223,493,164)}${label(501,168,"Renal pelvis","start")}${line(421,322,512,344)}${label(520,349,"Ureter","start")}${label(380,409,"Urine drains from the collecting system into the ureter")}`);
  }
  if (diagram.id === "skin-cross-section") {
    const follicles=[208,338,492].map(x=>`<path d="M${x} 166 C${x-7} 220 ${x+9} 257 ${x} 313 Q${x-6} 339 ${x+8} 354" fill="none" stroke="#55463d" stroke-width="7"/><path d="M${x-15} 254 Q${x} 237 ${x+15} 254 Q${x+17} 289 ${x} 300 Q${x-17} 287 ${x-15} 254Z" fill="#c98673" stroke="#995c55" stroke-width="3"/>`).join("");
    return shell(diagram, `${title}<rect x="56" y="114" width="648" height="72" fill="#dfa2a0" stroke="#ac6f71" stroke-width="3"/><rect x="56" y="186" width="648" height="177" fill="#f1c3a9" stroke="#c18d75" stroke-width="3"/><rect x="56" y="363" width="648" height="40" fill="#e8d4a0" stroke="#b5a379" stroke-width="3"/>${follicles}<path d="M489 219 C461 197 458 179 473 166 M489 219 C521 197 522 179 507 166 M490 219 C487 191 490 169 501 150" fill="none" stroke="#a95b54" stroke-width="4"/>${line(110,145,35,102)}${label(28,98,"Epidermis","end")}${line(112,245,30,233)}${label(22,238,"Dermis","end")}${line(489,270,587,235)}${label(596,239,"Hair follicle","start")}${line(504,165,603,130)}${label(611,134,"Sweat duct","start")}${label(380,425,"Epidermis · dermis · subcutaneous tissue")}`);
  }
  if (diagram.id === "knee-joint") {
    return shell(diagram, `${title}<path d="M310 92 C309 130 321 162 349 187 C364 201 360 219 343 231 L316 248 L329 273 L381 264 C412 258 437 237 439 210 C442 180 419 156 400 139 C390 127 389 106 392 92Z" fill="#e9dfc5" stroke="#a9987a" stroke-width="5"/><path d="M325 273 L311 311 C300 337 299 366 305 390 L392 390 C400 357 395 324 383 292 L372 264Z" fill="#e9dfc5" stroke="#a9987a" stroke-width="5"/><path d="M337 267 Q358 254 382 267 L391 280 Q359 292 322 282Z M304 303 Q349 288 394 303 L390 315 Q349 307 306 319Z" fill="#75b9b8" stroke="#4f8e91" stroke-width="3"/><path d="M310 183 Q280 204 305 268 M399 178 Q427 207 392 271" fill="none" stroke="#c17d67" stroke-width="8" stroke-linecap="round"/>${line(337,130,214,105)}${label(205,109,"Femur","end")}${line(283,210,177,200)}${label(168,204,"Patella","end")}${line(359,279,493,290)}${label(501,294,"Articular cartilage","start")}${line(349,339,496,355)}${label(504,359,"Tibia","start")}${label(380,418,"Anterior section · ligaments and cartilage simplified")}`);
  }
  if (diagram.id === "seasons") {
    const earth=(x,y,name)=>`<circle cx="${x}" cy="${y}" r="31" fill="url(#earth)" stroke="#315d6e" stroke-width="2"/><path d="M${x-20} ${y-8} Q${x-10} ${y-23} ${x} ${y-11} L${x+12} ${y-15} L${x+19} ${y-2} L${x+8} ${y+6} L${x-3} ${y+3} L${x-12} ${y+16}Z" fill="#72a76f"/><path d="M${x-21} ${y-24} L${x+21} ${y+24}" stroke="#f2e7b6" stroke-width="2"/>${label(x,y+53,name)}`;
    return shell(diagram, `${title}<ellipse cx="380" cy="221" rx="245" ry="139" fill="none" stroke="#8c9a8d" stroke-width="2" stroke-dasharray="5 6"/><circle cx="380" cy="221" r="43" fill="url(#sun)"/>${earth(135,221,"June · N. summer")}${earth(380,82,"March · equinox")}${earth(625,221,"December · N. winter")}${earth(380,360,"September · equinox")}${label(380,416,"Earth's 23.5° axial tilt stays pointed in the same direction")}`);
  }
  if (diagram.id === "solar-eclipse" || diagram.id === "lunar-eclipse") {
    const solar=diagram.id==="solar-eclipse", sunX=solar?125:100, earthX=solar?625:380, moonX=solar?380:645;
    const shadow=solar?`<path d="M398 208 L585 194 V246 L398 232Z" fill="#283640" opacity=".65"/>`:`<path d="M428 198 L621 180 V260 L428 242Z" fill="#283640" opacity=".55"/>`;
    return shell(diagram, `${title}<circle cx="${sunX}" cy="220" r="${solar?52:44}" fill="url(#sun)"/>${shadow}<circle cx="${earthX}" cy="220" r="${solar?40:48}" fill="url(#earth)" stroke="#315d6e" stroke-width="2"/><circle cx="${moonX}" cy="220" r="${solar?18:22}" fill="#bfc2bd" stroke="#737975" stroke-width="2"/>${label(sunX,303,"Sun")}${label(earthX,303,"Earth")}${label(moonX,303,"Moon")}${label(solar?523:242,155,solar?"Moon's umbra":"Earth's umbra")}${svgText(380,370,solar?"Sun → Moon → Earth":"Sun → Earth → Moon","diagram-title")}${label(380,410,"Alignment is schematic · sizes and distances are not to scale")}`);
  }
  if (diagram.id === "prism-spectrum") {
    const colorsSpectrum=["#d9514c","#e78b45","#e3c64b","#64a66e","#5485b5","#645da0","#985b9a"];
    return shell(diagram, `${title}<path d="M55 211 H302" stroke="#fff" stroke-width="16"/><path d="M55 211 H302" stroke="#8c9295" stroke-width="2"/><path d="M302 111 L407 211 L302 311 L197 211Z" fill="#d8eef0" fill-opacity=".48" stroke="#728c91" stroke-width="4"/>${colorsSpectrum.map((color,i)=>`<path d="M407 211 L686 ${95+i*28}" stroke="${color}" stroke-width="5"/>`).join("")}${label(100,184,"White light")}${label(302,350,"Glass prism")}${label(615,320,"Red → violet")}${label(380,399,"Shorter wavelengths refract more than longer wavelengths")}`);
  }
  if (diagram.id === "sound-wave") {
    const particles=Array.from({length:49},(_,i)=>`<circle cx="${70+i*13}" cy="214" r="5" fill="#527e91" opacity="${.55+Math.abs(Math.cos(i*Math.PI/5))*.4}"/>`).join("");
    return shell(diagram, `${title}<path d="M72 214 H688" stroke="#91aaa6" stroke-width="2" marker-end="url(#diagram-arrow)"/>${particles}<path d="M90 123 C145 123 145 305 200 305 S255 123 310 123 S365 305 420 305 S475 123 530 123 S585 305 640 305" fill="none" stroke="#d98a64" stroke-width="4"/><path d="M94 350 H200 M310 350 H420 M530 350 H640" stroke="#667b70" stroke-width="2"/>${label(147,374,"Compression")}${label(365,374,"Rarefaction")}${label(380,410,"Particle vibration is parallel to the direction sound travels")}`);
  }
  if (diagram.id === "magnetic-field") {
    const paths=[-3,-2,-1,0,1,2,3].map(offset=>`<path d="M300 ${219+offset*12} C302 ${99+offset*15} 495 ${99+offset*15} 498 ${219+offset*12} C495 ${339+offset*15} 302 ${339+offset*15} 300 ${219+offset*12}" fill="none" stroke="#628c91" stroke-width="${offset===0?2.8:1.7}" marker-end="url(#diagram-arrow)" opacity=".8"/>`).join("");
    return shell(diagram, `${title}${paths}<rect x="292" y="190" width="214" height="60" rx="5" fill="#c96d63" stroke="#824f4b" stroke-width="3"/><path d="M399 190 V250" stroke="#f7eee2" stroke-width="2"/><rect x="292" y="190" width="107" height="60" rx="5" fill="#6f8eaf" stroke="#506b89" stroke-width="3"/>${svgText(345,226,"N","diagram-atom-label")}${svgText(452,226,"S","diagram-atom-label")}${label(345,278,"North pole")}${label(452,278,"South pole")}${label(380,405,"Outside the magnet, field lines point from north to south")}`);
  }
  if (diagram.id === "water-filtration") {
    return shell(diagram, `${title}<path d="M187 95 H573 L548 154 H516 L494 328 Q489 358 460 358 H300 Q271 358 266 328 L244 154 H212Z" fill="#eaf2ed" fill-opacity=".46" stroke="#637c77" stroke-width="4"/><path d="M250 175 H510 L500 222 H260Z" fill="#c5ae7f" stroke="#907951" stroke-width="2"/><path d="M260 223 H500 L490 271 H270Z" fill="#d5c39b" stroke="#9b8968" stroke-width="2"/><path d="M270 272 H490 L484 318 Q482 337 460 337 H300 Q278 337 276 318Z" fill="#4d4942" stroke="#363c3b" stroke-width="2"/><g fill="#e5eee7" stroke="#66807b" stroke-width="2"><circle cx="305" cy="194" r="7"/><circle cx="340" cy="206" r="5"/><circle cx="391" cy="190" r="6"/><circle cx="451" cy="204" r="8"/></g><path d="M380 94 V154 M380 155 V174 M380 223 V250 M380 271 V296" stroke="#4a8eb0" stroke-width="3" marker-end="url(#cool-arrow)"/><path d="M358 358 V389 Q358 400 369 400 H391 Q402 400 402 389 V358" fill="#84c9d3" stroke="#637c77" stroke-width="3"/>${line(494,193,610,175)}${label(619,179,"Gravel","start")}${line(485,245,603,240)}${label(612,244,"Fine sand","start")}${line(476,302,591,307)}${label(600,311,"Charcoal","start")}${line(380,391,489,382)}${label(498,386,"Filtered water","start")}${label(380,428,"A demonstration filter does not remove dissolved contaminants")}`);
  }
  return "";
}

export function initializeScienceDiagrams() {
  const list = document.querySelector("#diagram-list");
  const search = document.querySelector("#diagram-search");
  const count = document.querySelector("#diagram-count");
  const category = document.querySelector("#diagram-category");
  const title = document.querySelector("#diagram-name");
  const description = document.querySelector("#diagram-description");
  const canvas = document.querySelector("#diagram-canvas");
  const download = document.querySelector("#download-diagram");
  let selected = diagrams[0];

  function draw(diagram) {
    selected = diagram;
    category.textContent = diagram.level.toUpperCase();
    title.textContent = diagram.title;
    description.textContent = diagram.description;
    const renderers = {
      flow: renderFlow,
      cycle: renderCycle,
      water: renderWaterCycle,
      "food-chain": renderFoodChain,
      photosynthesis: renderPhotosynthesis,
      solar: renderSolar,
      cell: renderCell,
      molecule: renderMolecule,
      network: renderNetwork,
      anatomy: renderAnatomy,
      layers: renderLayers,
      circuit: renderCircuit,
      orbit: renderOrbit,
      helix: renderHelix,
      volcano: renderVolcano,
      plates: renderPlates,
      illustration: renderScienceIllustration,
    };
    canvas.innerHTML = renderers[diagram.type](diagram);
    list.querySelectorAll("button").forEach((button) => {
      const active = button.dataset.diagramId === diagram.id;
      button.setAttribute("aria-current", String(active));
    });
  }

  selectDiagram = (query) => {
    const normalized = query.trim().toLocaleLowerCase().replace(/[^a-z0-9]+/g, " ").trim();
    const diagram = diagrams.find((item) =>
      [item.title, item.id.replaceAll("-", " ")]
        .some((name) => name.toLocaleLowerCase().replace(/[^a-z0-9]+/g, " ").trim() === normalized));
    if (!diagram) return false;
    search.value = "";
    renderList();
    draw(diagram);
    list.querySelector(`[data-diagram-id="${diagram.id}"]`)?.scrollIntoView({ block: "nearest" });
    return true;
  };

  function renderList(query = "") {
    const normalized = query.trim().toLocaleLowerCase();
    const filtered = diagrams.filter((diagram) =>
      `${diagram.title} ${diagram.description} ${diagram.level}`.toLocaleLowerCase().includes(normalized));
    list.replaceChildren();
    ["Common", "Intermediate", "Advanced"].forEach((level) => {
      const matches = filtered.filter((diagram) => diagram.level === level);
      if (!matches.length) return;
      const group = document.createElement("section");
      group.className = "diagram-group";
      const heading = document.createElement("h3");
      heading.textContent = level;
      const buttons = document.createElement("div");
      buttons.className = "diagram-options";
      matches.forEach((diagram) => {
        const button = document.createElement("button");
        button.type = "button";
        button.className = "diagram-option";
        button.dataset.diagramId = diagram.id;
        button.setAttribute("aria-current", String(diagram.id === selected.id));
        button.textContent = diagram.title;
        button.addEventListener("click", () => draw(diagram));
        buttons.append(button);
      });
      group.append(heading, buttons);
      list.append(group);
    });
    count.textContent = normalized
      ? `${filtered.length} of ${diagrams.length} diagrams`
      : `${diagrams.length} diagrams · Common to advanced`;
    if (!filtered.some((diagram) => diagram.id === selected.id) && filtered.length) draw(filtered[0]);
    if (!filtered.length) {
      const empty = document.createElement("p");
      empty.className = "diagram-empty";
      empty.textContent = "No diagrams match that search.";
      list.append(empty);
    }
  }

  search.addEventListener("input", () => renderList(search.value));
  download.addEventListener("click", () => {
    const svg = canvas.querySelector("svg");
    const file = new Blob([svg.outerHTML], { type: "image/svg+xml;charset=utf-8" });
    const url = URL.createObjectURL(file);
    const link = document.createElement("a");
    link.href = url;
    link.download = `${selected.id}.svg`;
    link.click();
    window.setTimeout(() => URL.revokeObjectURL(url), 1_000);
  });
  renderList();
  draw(selected);
}

export function selectScienceDiagram(query) {
  return selectDiagram(query);
}
