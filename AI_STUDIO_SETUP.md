# AI Teaching Studio setup

The lesson generator uses OpenAI's Chat Completions API. The Python server
sends requests to `https://api.openai.com/v1/chat/completions`; the browser
only sends a lesson prompt to the same-origin `/api/lesson` endpoint and never
receives the provider API key.
OpenAI API usage may incur charges on your account; this integration does not
create an account or purchase a service.

## Run locally

1. Create an OpenAI API key in your OpenAI account.
2. Copy `.env.example` to `.env` in the project directory.
3. Replace `OPENAI_API_KEY` with your key. Keep `.env` private; it is excluded
   from Git and requests for `.env` files are denied by the local server.
4. Optionally change `OPENAI_MODEL`; the default is `gpt-4o-mini`.
5. Start the updated app with `python voice_3d_threejs.py`.

The existing `ShikshaAI.exe` was not rebuilt as part of this change, so it
does not include the new endpoint or interface. Rebuild the executable from
the updated Python source before using the AI studio in a packaged app; place
`.env` next to that rebuilt executable.

The server reads environment variables first and fills in only variables not
already set. You can configure them directly instead of using `.env`. For
example, in PowerShell:

```powershell
$env:OPENAI_API_KEY = "your-key"
python voice_3d_threejs.py
```

## Hosted website

The repository does not include a hosting-platform configuration. The host
must run the Python server and serve the frontend and `/api/lesson` from the
same origin; a static-only hosting plan cannot run this integration by itself.
Configure these server environment variables in the hosting provider's secret
or environment-variable settings:

- `OPENAI_API_KEY`: your OpenAI API key (required; never put it in frontend
  files or public build variables).
- `OPENAI_MODEL`: optional; defaults to `gpt-4o-mini`.
- `HOST`: set to `0.0.0.0` so the hosted server accepts platform traffic.
- `PORT`: set this to the port assigned by the hosting platform.

Start the server with `python voice_3d_threejs.py`. If the host cannot run this
Python server, deploy the Python API separately and proxy `/api/lesson` and
`/api/shape` to it from the website's origin. Do not send the OpenAI API key to
that proxy or to browser code. Because the project has no user accounts,
configure rate limiting for `/api/lesson` at the hosting platform or reverse
proxy before making the endpoint public.

The API returns a validated lesson plan only. Its text is rendered as text,
not HTML, and generated content cannot trigger application actions. If the
provider is not configured or returns an error, the interface reports that
failure instead of inventing a lesson.
