import axios from 'axios';
import { API_KEY, API_URL } from './settings.js';
const CHANNEL_ID = 'UCUpJs89fSBXNolQGOYKn0YQ';
// const API_KEY = 'YOUR_API_KEY';
// const CHANNEL_ID = 'CHANNEL_ID';

async function getChannelShorts() {
  try {
    // 1. 채널의 업로드된 동영상 플레이리스트 ID 얻기
    const channelResponse = await axios.get(
      `https://www.googleapis.com/youtube/v3/channels`,
      {
        params: {
          part: 'contentDetails',
          id: CHANNEL_ID,
          key: API_KEY,
        },
      }
    );
    const uploadsPlaylistId =
      channelResponse.data.items[0].contentDetails.relatedPlaylists.uploads;

    // 2. 플레이리스트의 동영상 가져오기
    const playlistResponse = await axios.get(
      `https://www.googleapis.com/youtube/v3/playlistItems`,
      {
        params: {
          part: 'snippet,contentDetails',
          playlistId: uploadsPlaylistId,
          maxResults: 50,
          key: API_KEY,
        },
      }
    );

    console.log('playlistResponse: ', playlistResponse.data.items);

    // // 3. Shorts 필터링
    // const shorts = playlistResponse.data.items.filter((item) => {
    //   const duration = item.contentDetails.duration;
    //   // YouTube Shorts는 일반적으로 60초 이하입니다
    //   return (
    //     duration.includes('PT60S') ||
    //     (duration.includes('PT') && !duration.includes('M'))
    //   );
    // });

    // console.log('Shorts:', shorts);
    // return shorts;
  } catch (error) {
    console.error('에러 발생:', error);
    return [];
  }
}

getChannelShorts();
