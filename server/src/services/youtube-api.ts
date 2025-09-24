import { google } from 'googleapis';
const youtube = google.youtube({version: 'v3', auth: process.env.YOUTUBE_API_KEY})

export const youtubeApi = {
  getVideoInfo: async (videoId: string) => {
    const response = await youtube.videos.list({
        part: ['snippet', 'contentDetails', 'statistics'],
        id: [videoId],
        key: process.env.YOUTUBE_API_KEY
    })
    return response
  },
  getVideoCaptions: async (videoId: string) => {
    const response = await youtube.captions.list({
        videoId: videoId,
        part: ['snippet'],
        key: process.env.YOUTUBE_API_KEY
    })
    return response
  }
}