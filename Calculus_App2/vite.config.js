import { defineConfig, loadEnv } from 'vite'
import react from '@vitejs/plugin-react'
import { Buffer } from 'node:buffer'
import process from 'node:process'

function speechApi(apiKey) {
  const voicePresets = {
    'natural-m': { voice: 'onyx', instructions: 'Use a natural masculine-presenting English voice without an emphasized regional accent.' },
    'natural-f': { voice: 'coral', instructions: 'Use a natural feminine-presenting English voice without an emphasized regional accent.' },
  }
  return {
    name: 'local-speech-api',
    configureServer(server) {
      server.middlewares.use('/api/speech', (request, response) => {
        if (request.method !== 'POST') { response.statusCode = 405; response.end('Method not allowed'); return }
        let body = ''
        request.on('data', (chunk) => { body += chunk; if (body.length > 12000) request.destroy() })
        request.on('end', async () => {
          try {
            const { text, voicePreset = 'natural-m' } = JSON.parse(body)
            if (!apiKey) { response.statusCode = 503; response.end('OPENAI_API_KEY is not configured'); return }
            if (typeof text !== 'string' || !text.trim() || text.length > 4000) { response.statusCode = 400; response.end('Narration must contain 1–4000 characters'); return }
            const preset = voicePresets[voicePreset] || voicePresets['natural-m']
            const speech = await fetch('https://api.openai.com/v1/audio/speech', { method: 'POST', headers: { Authorization: `Bearer ${apiKey}`, 'Content-Type': 'application/json' }, body: JSON.stringify({ model: 'gpt-4o-mini-tts', voice: preset.voice, input: text, instructions: `${preset.instructions} Speak as a precise university calculus professor. Use a measured pace, brief pauses between ideas, and clear emphasis on coordinate names and signs.`, response_format: 'mp3' }) })
            if (!speech.ok) { response.statusCode = speech.status; response.end(await speech.text()); return }
            response.statusCode = 200; response.setHeader('Content-Type', 'audio/mpeg'); response.setHeader('Cache-Control', 'private, max-age=3600'); response.end(Buffer.from(await speech.arrayBuffer()))
          } catch (error) { response.statusCode = 500; response.end(error instanceof Error ? error.message : 'Speech generation failed') }
        })
      })
    },
  }
}

// The API key is read only by the Vite server and is never embedded in client code.
export default defineConfig(({ mode }) => {
  const env = loadEnv(mode, process.cwd(), '')
  return {
    plugins: [react(), speechApi(env.OPENAI_API_KEY)],
    server: {
      watch: {
        // Local browser test profiles contain locked database files on Windows.
        // They are not application source and must not be watched by Vite.
        ignored: ['**/.tmp/**'],
      },
    },
  }
})
