import { google } from 'googleapis';
import dotenv from 'dotenv'
dotenv.config()
const youtube = google.youtube({version: 'v3', auth: process.env.YOUTUBE_API_KEY})

export const youtubeApi = {
  getVideoInfo: async (videoId: string) => {
    const response = await youtube.videos.list({
        part: ['snippet', 'contentDetails', 'statistics'],
        id: [videoId],
        //key: process.env.YOUTUBE_API_KEY
    })
    return response
  },
  getVideoCaptions: async (videoId: string) => { //Does not retrieve the captions, only the list of captions that exist for a video
    const response = await youtube.captions.list({
      part: ['snippet'],
      videoId: videoId,
        //key: process.env.YOUTUBE_API_KEY
    })
    return response
  }
}