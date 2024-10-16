// [API Reference](https://developers.google.com/youtube/v3/docs?hl=ko)
import axios from 'axios';
import dotenv from 'dotenv';
import path from 'path';
import { fileURLToPath } from 'url';

// .env 파일 로드
const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);
dotenv.config({ path: path.resolve(__dirname, '../../../.env') });

// const 설정
const API_KEY = process.env.GOOGLE_API_KEY;
const API_URL = process.env.GOOGLE_API_URL;

console.log(API_KEY, API_URL);

// * REST API용 함수
// YouTube API 응답을 가져오는 함수
const getResponse = async (slug, params) => {
  try {
    const response = await axios.get(`${API_URL}/${slug}`, {
      params: {
        ...params,
        key: API_KEY,
      },
    });
    return response.data;
  } catch (error) {
    console.error(`YouTube API 오류 (${slug}):`, error);
    throw new Error(
      `YouTube API 요청 중 오류가 발생했습니다: ${error.message}`
    );
  }
};

// 모든 응답을 가져오는 함수
const getAllResponses = async (slug, params) => {
  let results = [];
  let nextPageToken = null;

  do {
    const data = await getResponse(slug, {
      ...params,
      pageToken: nextPageToken,
      maxResults: 50, // YouTube API의 최대 허용 값
    });

    results = results.concat(data.items);
    nextPageToken = data.nextPageToken;
  } while (nextPageToken);

  return results;
};

// YouTube API 응답을 가져오는 함수
const getChannelIdByCustomUrl = async (customUrl) => {
  try {
    if (!customUrl) {
      return '';
    }
    const searchResponse = await getResponse('search', {
      part: 'id',
      type: 'channel',
      q: customUrl,
      maxResults: 1,
    });

    if (searchResponse.items && searchResponse.items.length > 0) {
      return searchResponse.items[0].id.channelId;
    } else {
      return '';
    }
  } catch (error) {
    return '';
  }
};

export { getAllResponses, getResponse, getChannelIdByCustomUrl };


// const response = await axios.get(`https://youtube.googleapis.com/youtube/v3/playlists?part=snippet&channelId=UCJIlfUISLIj9DODAQJWGHfA&maxResults=25&key=${API_KEY}`);
// console.log(response.data);