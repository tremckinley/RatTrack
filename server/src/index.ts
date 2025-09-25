import dotenv from 'dotenv'
dotenv.config()

// Debug: Check if environment variable is loaded
console.log('YOUTUBE_API_KEY loaded:', process.env.YOUTUBE_API_KEY ? 'Yes' : 'No')

import express from 'express'
import path from 'path'
import { fileURLToPath } from 'url'
import { youtubeApi } from './services/youtube-api.js'
import cors from 'cors'

const __filename = fileURLToPath(import.meta.url)
const __dirname = path.dirname(__filename)

const app = express()
const port = process.env.PORT || 3000

// Function to set CSP headers
const setCSPHeaders = (res: express.Response, path?: string) => {
  const cspHeader = "default-src 'self' 'unsafe-inline' 'unsafe-eval' data: blob:; connect-src 'self' http://localhost:* ws://localhost:* https:; script-src 'self' 'unsafe-inline' 'unsafe-eval'; style-src 'self' 'unsafe-inline'"
  
  res.setHeader('X-Content-Security-Policy', cspHeader)
  res.setHeader('Content-Security-Policy', cspHeader)
  
  if (path) {
    console.log(`Setting CSP header for ${path}:`, cspHeader)
  }
}

app.use(cors())

// Add CSP headers to all routes
app.use((req, res, next) => {
  setCSPHeaders(res, req.path)
  next()
})

app.get('/', (req, res) => {
  res.send('Hello World')
  console.log('Hello World')
})

app.get('/health', (_req, res) => {
  console.log('Health endpoint - CSP header:', res.getHeader('Content-Security-Policy'))
  res.json({ status: 'ok' })
})
app.get('/yt-video-info/:videoId', async (req, res) => {
  const videoId = req.params.videoId
  
  console.log(`YouTube route called with videoId: ${videoId}`)
    
  try {
    const videoInfo = await youtubeApi.getVideoInfo(videoId)
    console.log('YouTube API response received')
    res.json(videoInfo);
  } catch (error) {
    console.error('YouTube API error:', error)
    res.status(500).json({ error: 'Failed to fetch video info' })
  }
})

app.get('/yt-video-captions/:videoId', async (req, res) => {
  const videoId = req.params.videoId
  const captions = await youtubeApi.getVideoCaptions(videoId)
  res.json(captions)
})

// Static serve client build if present
//app.use(express.static(path.join(__dirname, '../../client/dist')))

/*app.get('*', (_req, res) => {
  res.sendFile(path.join(__dirname, '../../client/dist/index.html'))
})*/

app.listen(port, () => {
  // eslint-disable-next-line no-console
  console.log(`Server listening on http://localhost:${port}`)
})

console.log("hello")