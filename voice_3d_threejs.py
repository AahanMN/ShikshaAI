"""
Shiksha AI - Voice-powered 3D teaching studio
==============================================
Run this file to launch the local web app. Use a Chromium-based browser
for browser speech recognition. Three.js and speech recognition require
an internet connection.
"""

import argparse
import functools
import http.server
import json
import math
import os
import re
import socketserver
import sys
import threading
import time
import urllib.error
import urllib.request
import webbrowser
from pathlib import Path


# ---------------------------------------------------------------------------
# Vocabulary
# ---------------------------------------------------------------------------
NUMBER_WORDS = {
    "zero": 0, "one": 1, "two": 2, "three": 3, "four": 4, "five": 5,
    "six": 6, "seven": 7, "eight": 8, "nine": 9, "ten": 10,
    "eleven": 11, "twelve": 12, "thirteen": 13, "fourteen": 14,
    "fifteen": 15, "sixteen": 16, "seventeen": 17, "eighteen": 18,
    "nineteen": 19, "twenty": 20, "thirty": 30, "forty": 40,
    "fifty": 50, "sixty": 60, "seventy": 70, "eighty": 80, "ninety": 90,
    "hundred": 100, "thousand": 1000,
}

# Words the number parser should step over rather than stop at, so phrases
# like "one hundred and fifty" parse correctly.
NUMBER_FILLERS = {"and", "-"}

# Spoken words (including 2D names) mapped to the 3D shape they produce.
SHAPE_KEYWORDS = {
    "cube": "cube", "square": "cube",
    "cuboid": "cuboid", "box": "cuboid", "rectangle": "cuboid",
    "sphere": "sphere", "ball": "sphere", "circle": "sphere",
    "pyramid": "pyramid", "triangle": "pyramid",
    "tetrahedron": "tetrahedron",
    "pentagon": "pentagonal_prism", "pentagonal": "pentagonal_prism",
    "hexagon": "hexagonal_prism", "hexagonal": "hexagonal_prism",
    "octagon": "octagonal_prism", "octagonal": "octagonal_prism",
    "cone": "cone",
    "cylinder": "cylinder",
    "torus": "torus", "donut": "torus", "doughnut": "torus",
}

VALID_SHAPES = sorted(set(SHAPE_KEYWORDS.values()))


# ---------------------------------------------------------------------------
# Parsing
# ---------------------------------------------------------------------------
def extract_shape(text):
    """Find a shape keyword. Longest keywords are checked first so that
    'pentagonal' wins over a substring match."""
    for word in sorted(SHAPE_KEYWORDS, key=len, reverse=True):
        if re.search(rf"\b{re.escape(word)}\b", text):
            return SHAPE_KEYWORDS[word]
    return None


def extract_length(text):
    """Return the size as a float, or None. Handles digits ('100') and
    spelled-out numbers ('one hundred and fifty')."""
    digit_match = re.search(r"\d+(?:\.\d+)?", text)
    if digit_match:
        return float(digit_match.group())

    total = 0          # completed hundreds/thousands groups
    current = 0        # group being accumulated
    found = False

    for word in re.findall(r"[a-z]+", text):
        if word in NUMBER_WORDS:
            found = True
            val = NUMBER_WORDS[word]
            if val == 100:
                current = (current or 1) * 100
            elif val == 1000:
                total += (current or 1) * 1000
                current = 0
            else:
                current += val
        elif found and word not in NUMBER_FILLERS:
            break

    return float(total + current) if found else None


def parse_command(text):
    return extract_shape(text), extract_length(text)


def normalize_shape_request(payload):
    command = payload.get("command")
    if isinstance(command, str) and command.strip():
        shape, size = parse_command(command.lower())
        if shape is None:
            raw_shape = command.strip().lower()
            shape = SHAPE_KEYWORDS.get(raw_shape, raw_shape)
        if size is None:
            size = payload.get("size")
    else:
        raw_shape = str(payload.get("shape", "")).strip().lower()
        shape = SHAPE_KEYWORDS.get(raw_shape, raw_shape)
        size = payload.get("size")

    if shape not in VALID_SHAPES:
        raise ValueError("I couldn't find a supported shape in that request.")
    try:
        size = float(size)
    except (TypeError, ValueError):
        raise ValueError("Please include a size, like 'cube size 5'.") from None
    if not math.isfinite(size) or size <= 0:
        raise ValueError("Size must be a positive number.")
    return shape, size


def answer_with_ai(question, history=(), language="en"):
    api_key = os.environ.get("GEMINI_API_KEY", "").strip()
    if not api_key:
        raise RuntimeError(
            "AI is not connected yet. Set the GEMINI_API_KEY environment "
            "variable on this computer, then restart Shiksha AI."
        )

    model = os.environ.get("SHIKSHA_AI_MODEL", "gemini-3.8-flash").strip() or "gemini-3.8-flash"
    messages = [
        {
            "role": "system",
            "content": (
                "You are Shiksha AI, a friendly, accurate teaching assistant. "
                "Answer questions across school subjects and everyday topics. "
                "Explain clearly at a level suited to the learner, use examples "
                "when helpful, and ask a brief clarifying question only when "
                "needed. If uncertain, say so rather than inventing facts. "
                "For unsafe or age-inappropriate requests, respond safely. "
                + (
                    "Reply in natural Hindi using Devanagari script."
                    if language == "hi"
                    else "Reply in English."
                )
            ),
        },
        *history,
        {"role": "user", "content": question},
    ]
    request_body = json.dumps({
        "model": model,
        "messages": messages,
        "temperature": 0.5,
        "max_tokens": 700,
    }).encode("utf-8")
    request = urllib.request.Request(
        "https://generativelanguage.googleapis.com/v1beta/openai/chat/completions",
        data=request_body,
        headers={
            "Authorization": f"Bearer {api_key}",
            "Content-Type": "application/json",
        },
        method="POST",
    )

    try:
        for attempt in range(3):
            try:
                response = urllib.request.urlopen(request, timeout=45)
                break
            except urllib.error.HTTPError as error:
                if error.code not in (500, 502, 503, 504) or attempt == 2:
                    raise
                retry_after = error.headers.get("Retry-After") if error.headers else None
                try:
                    delay = min(max(float(retry_after), 0), 4) if retry_after else attempt + 1
                except ValueError:
                    delay = attempt + 1
                error.close()
                time.sleep(delay)
        with response:
            result = json.loads(response.read(1_000_001))
    except urllib.error.HTTPError as error:
        provider_error = {}
        try:
            error_payload = json.loads(error.read(1_000_001).decode("utf-8"))
            provider_error = error_payload.get("error", {})
            if not isinstance(provider_error, dict):
                provider_error = {}
            provider_code = provider_error.get("status") or provider_error.get("type") or provider_error.get("code")
        except (json.JSONDecodeError, UnicodeDecodeError, AttributeError):
            provider_error = {}
            provider_code = None
        if error.code == 401:
            raise RuntimeError(
                "The Gemini API key was rejected. Check GEMINI_API_KEY and restart the app."
            ) from None
        if error.code == 403:
            raise RuntimeError(
                "Google denied access to the Gemini API. Check that the key is valid, the Gemini API is enabled for its project, and the key's restrictions allow this API."
            ) from None
        if error.code == 429:
            error_message = provider_error.get("message", "").lower()
            if provider_code in ("insufficient_quota", "billing_hard_limit_reached") or "quota" in error_message or "billing" in error_message:
                raise RuntimeError(
                    "The Gemini API quota for this project or model has been reached. Check the free-tier limits and usage in Google AI Studio, then wait for the quota to reset or select an available model."
                ) from None
            if provider_code == "rate_limit_exceeded":
                raise RuntimeError(
                    "The Gemini request rate limit was reached. Wait a minute and try again. If it continues, check the model's rate limits in Google AI Studio."
                ) from None
            raise RuntimeError(
                "Gemini temporarily limited this request (HTTP 429). Check the model's quota and rate limits in Google AI Studio, then try again."
            ) from None
        if error.code == 503:
            provider_message = provider_error.get("message", "").strip()
            detail = f" Google says: {provider_message[:300]}" if provider_message else ""
            raise RuntimeError(
                "Gemini is temporarily unavailable after a few retries (HTTP 503). "
                "This is usually a temporary model-capacity issue. Wait briefly and try again, "
                "or choose another model with SHIKSHA_AI_MODEL."
                f"{detail}"
            ) from None
        if error.code in (500, 502, 504):
            raise RuntimeError(
                f"Gemini's service did not recover after a few retries (HTTP {error.code}). "
                "Wait briefly and try again."
            ) from None
        raise RuntimeError(
            f"The AI service returned an error (HTTP {error.code}). Please try again."
        ) from None
    except (urllib.error.URLError, TimeoutError):
        raise RuntimeError(
            "Could not reach the AI service. Check your internet connection and try again."
        ) from None
    except (json.JSONDecodeError, UnicodeDecodeError):
        raise RuntimeError("The AI service returned an unreadable response.") from None

    try:
        answer = result["choices"][0]["message"]["content"].strip()
    except (KeyError, IndexError, TypeError, AttributeError):
        raise RuntimeError("The AI service did not return an answer. Please try again.") from None
    if not answer:
        raise RuntimeError("The AI service returned an empty answer. Please try again.")
    return answer


def serve_app(port=8000):
    if getattr(sys, "frozen", False):
        web_root = Path(sys._MEIPASS)
    else:
        web_root = Path(__file__).resolve().parent

    class AppHandler(http.server.SimpleHTTPRequestHandler):
        def __init__(self, *args, **kwargs):
            super().__init__(*args, directory=str(web_root), **kwargs)

        def send_json(self, status, payload):
            body = json.dumps(payload).encode("utf-8")
            self.send_response(status)
            self.send_header("Content-Type", "application/json; charset=utf-8")
            self.send_header("Content-Length", str(len(body)))
            self.send_header("Cache-Control", "no-store")
            self.end_headers()
            self.wfile.write(body)

        def do_POST(self):
            if self.path not in ("/api/shape", "/api/ask"):
                self.send_json(404, {"error": "Not found."})
                return
            try:
                content_length = int(self.headers.get("Content-Length", "0"))
                if content_length <= 0 or content_length > 1_000_000:
                    raise ValueError("Request body is empty or too large.")
                payload = json.loads(self.rfile.read(content_length))
                if not isinstance(payload, dict):
                    raise ValueError("Request must be a JSON object.")
            except (json.JSONDecodeError, UnicodeDecodeError):
                self.send_json(400, {"error": "Request body must be valid JSON."})
                return
            except ValueError as error:
                self.send_json(400, {"error": str(error)})
                return

            if self.path == "/api/ask":
                question = payload.get("question")
                if not isinstance(question, str) or not question.strip():
                    self.send_json(400, {"error": "Please enter a question."})
                    return
                if len(question) > 8_000:
                    self.send_json(400, {"error": "That question is too long. Please shorten it."})
                    return
                history = payload.get("history", [])
                if not isinstance(history, list) or len(history) > 12:
                    self.send_json(400, {"error": "Conversation history is invalid. Please start a new question."})
                    return
                clean_history = []
                for message in history:
                    if (
                        not isinstance(message, dict)
                        or message.get("role") not in ("user", "assistant")
                        or not isinstance(message.get("content"), str)
                        or len(message["content"]) > 8_000
                    ):
                        self.send_json(400, {"error": "Conversation history is invalid. Please start a new question."})
                        return
                    clean_history.append({
                        "role": message["role"],
                        "content": message["content"],
                    })
                language = payload.get("language", "en")
                if language not in ("en", "hi"):
                    self.send_json(400, {"error": "Please choose English or Hindi."})
                    return
                try:
                    answer = answer_with_ai(question.strip(), clean_history[-10:], language)
                except RuntimeError as error:
                    self.send_json(503, {"error": str(error)})
                    return
                self.send_json(200, {"answer": answer})
                return

            try:
                shape, size = normalize_shape_request(payload)
            except ValueError as error:
                self.send_json(400, {"error": str(error)})
                return
            self.send_json(200, {
                "shape": shape,
                "title": shape.replace("_", " ").title(),
                "size": size,
            })

    server = None
    for candidate_port in range(port, port + 10):
        try:
            server = http.server.ThreadingHTTPServer(
                ("127.0.0.1", candidate_port), AppHandler
            )
            break
        except OSError:
            continue
    if server is None:
        raise OSError(f"No free port found between {port} and {port + 9}.")

    url = f"http://127.0.0.1:{server.server_address[1]}/"
    print(f"Shiksha AI is running at {url}")
    print("Press Ctrl+C to stop the server.")
    webbrowser.open(url)
    try:
        server.serve_forever()
    except KeyboardInterrupt:
        print("\nShiksha AI stopped.")
    finally:
        server.server_close()


# ---------------------------------------------------------------------------
# HTML / Three.js page
# ---------------------------------------------------------------------------
HTML_TEMPLATE = """<!DOCTYPE html>
<html lang="en">
<head>
<meta charset="UTF-8">
<meta name="viewport" content="width=device-width, initial-scale=1">
<title>Voice 3D Shape: __SHAPE_TITLE__</title>
<style>
  html, body { margin: 0; height: 100%; background: #101418; overflow: hidden; }
  .overlay { position: absolute; z-index: 10; color: #eaeaea;
             font-family: system-ui, -apple-system, sans-serif; }
  #label { top: 16px; left: 16px; font-size: 18px; }
  #hint  { bottom: 16px; left: 16px; font-size: 13px; color: #9aa4ad; }
  #error { top: 50%; left: 0; width: 100%; text-align: center;
           font-size: 15px; color: #ff8080; display: none; padding: 0 24px;
           box-sizing: border-box; }
</style>
</head>
<body>
<div id="label" class="overlay">__SHAPE_TITLE__ &nbsp;(size = __SIZE__)</div>
<div id="hint" class="overlay">Drag to rotate &middot; Scroll to zoom &middot; Right-drag to pan</div>
<div id="error" class="overlay">
  Could not load Three.js from the CDN.<br>
  Check your internet connection, or re-run the script with <b>--serve</b>.
</div>

<script type="importmap">
{
  "imports": {
    "three": "https://unpkg.com/three@0.160.0/build/three.module.js",
    "three/addons/": "https://unpkg.com/three@0.160.0/examples/jsm/"
  }
}
</script>

<script type="module">
const errorBox = document.getElementById("error");

try {

const THREE = await import("three");
const { OrbitControls } = await import("three/addons/controls/OrbitControls.js");

const SHAPE = __SHAPE_JSON__;
const SIZE  = __SIZE_JSON__;

// ---- scene ----------------------------------------------------------
const scene = new THREE.Scene();
scene.background = new THREE.Color(0x101418);

// Far plane and camera distance both scale with SIZE, so the shape stays
// visible whether the user asks for size 2 or size 2000.
const camera = new THREE.PerspectiveCamera(
  50, window.innerWidth / window.innerHeight, SIZE * 0.01, SIZE * 100
);
camera.position.set(SIZE * 1.8, SIZE * 1.5, SIZE * 1.8);

const renderer = new THREE.WebGLRenderer({ antialias: true });
renderer.setPixelRatio(window.devicePixelRatio);
renderer.setSize(window.innerWidth, window.innerHeight);
document.body.appendChild(renderer.domElement);

const controls = new OrbitControls(camera, renderer.domElement);
controls.target.set(0, SIZE * 0.5, 0);
controls.enableDamping = true;
controls.update();

// ---- lighting -------------------------------------------------------
scene.add(new THREE.AmbientLight(0xffffff, 0.55));
const key = new THREE.DirectionalLight(0xffffff, 0.9);
key.position.set(SIZE, SIZE * 2, SIZE);
scene.add(key);
const fill = new THREE.DirectionalLight(0x88aaff, 0.35);
fill.position.set(-SIZE, SIZE * 0.5, -SIZE);
scene.add(fill);

// ---- ground grid for spatial reference -------------------------------
scene.add(new THREE.GridHelper(SIZE * 6, 24, 0x3a4a5a, 0x243240));

// ---- geometry --------------------------------------------------------
function buildGeometry(shape, size) {
  switch (shape) {
    case "cube":             return new THREE.BoxGeometry(size, size, size);
    case "cuboid":           return new THREE.BoxGeometry(size, size * 0.6, size * 0.6);
    case "sphere":           return new THREE.SphereGeometry(size, 48, 32);
    case "cone":             return new THREE.ConeGeometry(size / 2, size, 48);
    case "cylinder":         return new THREE.CylinderGeometry(size / 2, size / 2, size, 48);
    case "pyramid":          return new THREE.ConeGeometry(size * 0.7, size, 4);
    case "tetrahedron":      return new THREE.TetrahedronGeometry(size * 0.8);
    case "pentagonal_prism": return new THREE.CylinderGeometry(size / 2, size / 2, size, 5);
    case "hexagonal_prism":  return new THREE.CylinderGeometry(size / 2, size / 2, size, 6);
    case "octagonal_prism":  return new THREE.CylinderGeometry(size / 2, size / 2, size, 8);
    case "torus":            return new THREE.TorusGeometry(size / 2, size / 6, 24, 60);
    default:                 return new THREE.BoxGeometry(size, size, size);
  }
}

// Curved shapes look better smooth-shaded; flat-faced solids look better
// with flat shading and a visible wireframe.
const CURVED = ["sphere", "cone", "cylinder", "torus"];
const isCurved = CURVED.includes(SHAPE);

const geometry = buildGeometry(SHAPE, SIZE);
const material = new THREE.MeshStandardMaterial({
  color: 0x4a90e2,
  metalness: 0.15,
  roughness: 0.5,
  flatShading: !isCurved,
});

const mesh = new THREE.Mesh(geometry, material);
scene.add(mesh);

// Sit the shape on the grid rather than half-sunk into it.
geometry.computeBoundingBox();
mesh.position.y = -geometry.boundingBox.min.y;

// Edge lines make faceted solids readable; skip on curved shapes where a
// full wireframe would just be visual noise.
if (!isCurved) {
  const edges = new THREE.LineSegments(
    new THREE.EdgesGeometry(geometry),
    new THREE.LineBasicMaterial({ color: 0xdfe9f5 })
  );
  edges.position.copy(mesh.position);
  scene.add(edges);
  mesh.userData.edges = edges;
}

// ---- resize ----------------------------------------------------------
window.addEventListener("resize", () => {
  camera.aspect = window.innerWidth / window.innerHeight;
  camera.updateProjectionMatrix();
  renderer.setSize(window.innerWidth, window.innerHeight);
});

// ---- render loop -----------------------------------------------------
function animate() {
  requestAnimationFrame(animate);
  mesh.rotation.y += 0.004;
  if (mesh.userData.edges) mesh.userData.edges.rotation.y = mesh.rotation.y;
  controls.update();
  renderer.render(scene, camera);
}
animate();

} catch (err) {
  console.error(err);
  errorBox.style.display = "block";
}
</script>
</body>
</html>
"""


def generate_html(shape, size, out_path="voice_shape_3d.html"):
    """Write the Three.js page and return its resolved Path."""
    html = (
        HTML_TEMPLATE
        .replace("__SHAPE_TITLE__", shape.replace("_", " ").title())
        .replace("__SIZE__", f"{size:g}")
        .replace("__SHAPE_JSON__", json.dumps(shape))
        .replace("__SIZE_JSON__", json.dumps(size))
    )
    path = Path(out_path).resolve()
    path.write_text(html, encoding="utf-8")
    return path


# ---------------------------------------------------------------------------
# Serving
# ---------------------------------------------------------------------------
def serve_and_open(html_path, port=8000):
    """Serve the file's directory over HTTP and open it in the browser.
    Avoids browsers that restrict ES modules on the file:// protocol."""
    handler = functools.partial(
        http.server.SimpleHTTPRequestHandler,
        directory=str(html_path.parent),
    )
    socketserver.TCPServer.allow_reuse_address = True

    for attempt_port in range(port, port + 10):
        try:
            httpd = socketserver.TCPServer(("127.0.0.1", attempt_port), handler)
            break
        except OSError:
            continue
    else:
        print("Could not find a free port. Opening via file:// instead.")
        webbrowser.open(html_path.as_uri())
        return

    url = f"http://127.0.0.1:{attempt_port}/{html_path.name}"
    threading.Thread(target=httpd.serve_forever, daemon=True).start()
    print(f"Serving at {url}")
    print("Press Ctrl+C to stop the server.")
    webbrowser.open(url)

    try:
        threading.Event().wait()
    except KeyboardInterrupt:
        print("\nServer stopped.")
        httpd.shutdown()


# ---------------------------------------------------------------------------
# Input completion helpers
# ---------------------------------------------------------------------------
def prompt_for_shape():
    while True:
        typed = input(f"Shape name ({', '.join(VALID_SHAPES)}): ").strip().lower()
        shape = SHAPE_KEYWORDS.get(typed, typed)
        if shape in VALID_SHAPES:
            return shape
        print(f"'{typed}' is not a supported shape. Try again.")


def prompt_for_size():
    while True:
        raw = input("Size (a positive number): ").strip()
        try:
            size = float(raw)
        except ValueError:
            print("That isn't a number. Try again.")
            continue
        if size <= 0:
            print("Size must be greater than zero. Try again.")
            continue
        return size


# ---------------------------------------------------------------------------
# Main
# ---------------------------------------------------------------------------
def main():
    parser = argparse.ArgumentParser(
        description="Launch the Shiksha AI voice-powered 3D studio."
    )
    parser.add_argument("--port", type=int, default=8000,
                        help="starting port for the local server (default 8000)")
    args = parser.parse_args()
    serve_app(args.port)


if __name__ == "__main__":
    main()
