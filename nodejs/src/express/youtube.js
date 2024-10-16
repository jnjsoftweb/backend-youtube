// [API Reference](https://developers.google.com/youtube/v3/docs?hl=ko)

import express from 'express';
import cors from 'cors';
import path from 'path';
import dotenv from 'dotenv';
import {
  getAllResponses,
  getChannelIdByCustomUrl,
} from '../utils/youtubeREST.js';
import { subscriptions, myPlaylistItems } from '../utils/youtubeGoogle.js';
import {
  downloadSubtitles,
  downloadYoutube,
  BASE_DOWN_FOLDER,
} from '../utils/youtubeDown.js';
import { fileURLToPath } from 'url';

// .env 파일 로드
const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);
dotenv.config({ path: path.resolve(__dirname, '../../../.env') });

// * const 설정
const PORT = process.env.NEXT_PUBLIC_EXPRESS_PORT || 3006;
// console.log('PORT: ', PORT);

// app 설정
const app = express();
app.use(cors());
app.use(express.json());

// * YOUTUBEAPI(REST) 사용 ./utils/youtubeREST

// Channels: list, Info
// http://localhost:3006/channels?part=snippet,statistics,contentDetails,id,localizations,status,topicDetails,brandingSettings,contentOwnerDetails&id=UCUpJs89fSBXNolQGOYKn0YQ,UC06m1684XKULVP00TwURFdg
app.get('/channels', async (req, res) => {
  res.json(await getAllResponses('channels', req.query));
});

// Playlists: list
// http://localhost:3006/playlists?part=contentDetails,id,localizations,player,snippet,status&channelId=UCJIlfUISLIj9DODAQJWGHfA
app.get('/playlists', async (req, res) => {
  res.json(await getAllResponses('playlists', req.query));
});

// PlaylistItems: list
// http://localhost:3006/playlistItems?part=id,snippet,contentDetails,status&playlistId=PLwt0kothbrpdAlGrzPwjSxbkxZXqrfL5k
app.get('/playlistItems', async (req, res) => {
  res.json(await getAllResponses('playlistItems', req.query));
});

// Playlists: list
// http://localhost:3006/search?part=snippet&type=video,channel,playlist&q=파이코인
app.get('/search', async (req, res) => {
  res.json(await getAllResponses('search', req.query));
});

// Videos: list
// https://youtube.googleapis.com/youtube/v3/videos?part=contentDetails,id,liveStreamingDetails,localizations,player, recordingDetails,snippet,statistics,status,topicDetails&id=qQPxP9TZEO8,D4nZW4wk3gQ&key=AIzaSyBHsLKBGbPRGi11o2m7i7e_TZU3efYsWag
app.get('/videos', async (req, res) => {
  res.json(await getAllResponses('videos', req.query));
});

// Channel Info by Custom URL
// http://localhost:3006/channelByCustomUrl?customUrl=nomadcoders
app.get('/channelByCustomUrl', async (req, res) => {
  const channelId = await getChannelIdByCustomUrl(req.query.customUrl);
  res.json(
    await getAllResponses('channels', {
      part: 'snippet,statistics,contentDetails',
      id: channelId,
    })
  );
});

// * GOOGLE CLOUD(JNJ-LIB-GOOGLE) 사용 jnj-lib-google
// 구독 목록 가져오기
// http://localhost:3006/mySubscriptions?userId=mooninlearn
app.get('/subscriptions', async (req, res) => {
  res.json(await subscriptions(req.query.userId));
});

// 좋아요 표시한 동영상 목록
// http://localhost:3006/subscriptions?userId=mooninlearn
app.get('/likePlaylistItems', async (req, res) => {
  res.json(await myPlaylistItems(req.query.userId, 'LL'));
});

// * Youtube Download(JNJ-LIB-GOOGLE) 사용 jnj-lib-google
// http://localhost:3006/downloadYoutube?videoId=RfUlsRjxMM0&resolution=720
app.get('/downloadYoutube', async (req, res) => {
  let { videoId, resolution, outputDir } = req.query;
  outputDir = outputDir ?? BASE_DOWN_FOLDER;
  downloadYoutube(videoId, resolution, outputDir);
  res.json({ file: `${outputDir}/${videoId}.mp4` });
});

// http://localhost:3006/downloadSubtitles?videoId=RfUlsRjxMM0&languages=en,ko&formatType=vtt
app.get('/downloadSubtitles', async (req, res) => {
  downloadSubtitles(
    req.query.videoId,
    req.query.languages,
    req.query.formatType
  );
  res.json({ message: 'Download started' });
});

// 서버 실행
app.listen(PORT, () => {
  console.log(`서버가 http://localhost:${PORT}에서 실행 중입니다.`);
});
