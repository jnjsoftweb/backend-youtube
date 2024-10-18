import { chromium } from 'playwright';
import { saveFile, loadJson, findFolders } from 'jnj-lib-base';

const DEFAULT_USER_DATA_DIR =
  'C:/Users/Jungsam/AppData/Local/Google/Chrome/User Data';
const DEFAULT_EXE_PATH =
  'C:/Program Files/Google/Chrome/Application/chrome.exe';

/**
 * Finds all Chrome profiles and their associated information
 * @param {string} [basePath]
 * @returns {Array<{profile: string, email?: string, full_name?: string, given_name?: string}>}
 */
const findChromeProfiles = (basePath) => {
  const actualBasePath = basePath || DEFAULT_USER_DATA_DIR;
  const pattern = 'Profile';
  const folders = findFolders(actualBasePath, pattern);
  const profiles = [];

  for (const folder of folders) {
    const json = loadJson(`${folder}/Preferences`);

    if (json.account_info && json.account_info.length > 0) {
      const profilePath = folder.replace(/\\/g, '/');
      const profileName = profilePath.split('/').pop() || '';

      const profile = {
        profile: profileName,
        email: json.account_info[0].email,
        full_name: json.account_info[0].full_name,
        given_name: json.account_info[0].given_name,
      };

      profiles.push(profile);
    }
  }

  return profiles;
};

/**
 * Gets the profile name associated with a specific email
 * @param {string} [email="bigwhitekmc@gmail.com"]
 * @param {string} [basePath]
 * @returns {string}
 */
const getProfileByEmail = (email = 'bigwhitekmc@gmail.com', basePath) => {
  const actualBasePath = basePath || DEFAULT_USER_DATA_DIR;
  const folders = findFolders(actualBasePath, 'Profile');

  for (const folder of folders) {
    const json = loadJson(`${folder}/Preferences`);

    if (json.account_info && json.account_info.length > 0) {
      if (json.account_info[0].email === email) {
        return folder.replace(/\\/g, '/').split('/').pop() || 'Profile 1';
      }
    }
  }

  return 'Profile 1';
};

/**
 * Gets the Chrome paths for user data directory and executable
 * @param {string} [userDataDir]
 * @param {string} [exePath]
 * @returns {{userDataDir: string, exePath: string}}
 */
const getChromePaths = (userDataDir, exePath) => ({
  userDataDir: userDataDir || DEFAULT_USER_DATA_DIR,
  exePath: exePath || DEFAULT_EXE_PATH,
});

const scrapePage = async ({
  url = 'https://www.google.com',
  email = 'bigwhitekmc@gmail.com',
  callBack = async ({ browser, page }) => {
    saveFile('google.html', await page.content());
  },
  waitTime = 30000,
}) => {
  const { userDataDir, exePath } = getChromePaths();
  const profileName = getProfileByEmail();

  // Chrome 브라우저를 실행합니다.
  const browser = await chromium.launchPersistentContext(userDataDir, {
    headless: false,
    executablePath: exePath,
    args: [`--profile-directory=${profileName}`],
  });

  const page = await browser.newPage();

  try {
    await page.goto(url);
    const result = await callBack({ browser, page });
    await new Promise((resolve) => setTimeout(resolve, waitTime)); // waitTime초간 작업 완료 후 대기
    return result;
  } catch (error) {
    console.error('에러 발생:', error);
  } finally {
    await browser.close();
  }
};

const getYouTubePlaylists = async ({ browser, page }) => {
  try {
    await page.goto('https://www.youtube.com/feed/playlists', {
      waitUntil: 'networkidle',
      timeout: 60000,
    });

    // 재생목록 컨테이너가 로드될 때까지 대기
    await page.waitForSelector('ytd-two-column-browse-results-renderer', {
      timeout: 10000,
    });

    // 재생목록 데이터 추출
    const playlists = await page.evaluate(() => {
      const playlistElements = document.querySelectorAll(
        'ytd-rich-item-renderer'
      );
      return Array.from(playlistElements).map((element) => {
        const titleElement = element.querySelector(
          '.yt-lockup-metadata-view-model-wiz__title'
        );
        const thumbnailElement = element.querySelector(
          '.yt-thumbnail-view-model__image img'
        );
        const countElement = element.querySelector('.badge-shape-wiz__text');
        const metadataElements = element.querySelectorAll(
          '.yt-content-metadata-view-model-wiz__metadata-row'
        );

        return {
          title: titleElement ? titleElement.textContent.trim() : '',
          thumbnailUrl: thumbnailElement ? thumbnailElement.src : '',
          videoCount: countElement ? countElement.textContent.trim() : '',
          playlistUrl: titleElement ? titleElement.href : '',
          visibility: metadataElements[0]
            ? metadataElements[0].textContent.split('•')[0].trim()
            : '',
          lastUpdated: metadataElements[1]
            ? metadataElements[1].textContent.trim()
            : '',
        };
      });
    });

    // console.log('playlists:', playlists);
    return playlists;
  } catch (error) {
    console.error('에러 발생:', error);
    return [];
  } finally {
    await browser.close();
  }
};

// 페이지 자동 스크롤 함수
async function autoScroll(page) {
  await page.evaluate(async () => {
    await new Promise((resolve) => {
      let totalHeight = 0;
      const distance = 100;
      const timer = setInterval(() => {
        const scrollHeight = document.documentElement.scrollHeight;
        window.scrollBy(0, distance);
        totalHeight += distance;

        if (totalHeight >= scrollHeight) {
          clearInterval(timer);
          resolve();
        }
      }, 100);
    });
  });
}

const getWatchLaterVideos = async ({ browser, page }) => {
  try {
    await page.goto('https://www.youtube.com/playlist?list=WL', {
      waitUntil: 'networkidle',
      timeout: 60000,
    });

    await page.waitForSelector('#contents.ytd-playlist-video-list-renderer', {
      timeout: 10000,
    });

    await autoScroll(page);

    const videos = await page.evaluate(() => {
      const videoElements = document.querySelectorAll(
        'ytd-playlist-video-renderer'
      );
      return Array.from(videoElements).map((element) => {
        const titleElement = element.querySelector('#video-title');
        const thumbnailElement = element.querySelector('#img');
        const channelElement = element.querySelector('#text.ytd-channel-name');
        const viewsElement = element.querySelector(
          '#metadata-line span:first-child'
        );
        const addedTimeElement = element.querySelector(
          '#metadata-line span:last-child'
        );

        return {
          title: titleElement ? titleElement.textContent.trim() : '',
          thumbnailUrl: thumbnailElement ? thumbnailElement.src : '',
          channelName: channelElement ? channelElement.textContent.trim() : '',
          views: viewsElement ? viewsElement.textContent.trim() : '',
          addedTime: addedTimeElement
            ? addedTimeElement.textContent.trim()
            : '',
          videoUrl: titleElement ? titleElement.href : '',
        };
      });
    });

    return videos;
  } catch (error) {
    console.error('에러 발생:', error);
    return [];
  }
};

const getWatchHistory = async ({ browser, page }) => {
  try {
    await page.goto('https://www.youtube.com/feed/history', {
      waitUntil: 'networkidle',
      timeout: 60000,
    });

    await page.waitForSelector('ytd-browse[page-subtype="history"]', {
      timeout: 10000,
    });

    await autoScroll(page);

    const historyVideos = await page.evaluate(() => {
      const videoElements = document.querySelectorAll('ytd-video-renderer');
      return Array.from(videoElements).map((element) => {
        const titleElement = element.querySelector('#video-title');
        const thumbnailElement = element.querySelector('#img');
        const channelElement = element.querySelector('#text.ytd-channel-name');
        const metadataElement = element.querySelector('#metadata-line');

        return {
          title: titleElement ? titleElement.textContent.trim() : '',
          thumbnailUrl: thumbnailElement ? thumbnailElement.src : '',
          channelName: channelElement ? channelElement.textContent.trim() : '',
          metadata: metadataElement ? metadataElement.textContent.trim() : '',
          videoUrl: titleElement ? titleElement.href : '',
        };
      });
    });

    return historyVideos;
  } catch (error) {
    console.error('에러 발생:', error);
    return [];
  }
};

export {
  findChromeProfiles,
  getProfileByEmail,
  getChromePaths,
  findFolders,
  loadJson,
  getYouTubePlaylists,
  getWatchLaterVideos,
  getWatchHistory,
};

// * 재생목록 추출
// const palylists = await scrapePage({
//   url: 'https://www.youtube.com/feed/subscriptions',
//   callBack: getYouTubePlaylists,
//   waitTime: 5000,
// });

// console.log('palylists:', palylists);

// // * 나중에 볼 동영상 추출
// const palylists = await scrapePage({
//   url: 'https://www.youtube.com/playlist?list=WL',
//   callBack: getWatchLaterVideos,
//   waitTime: 5000,
// });

// console.log('palylists:', palylists);

// * History 추출
const palylists = await scrapePage({
  url: 'https://www.youtube.com/feed/history',
  callBack: getWatchHistory,
  waitTime: 5000,
});

console.log('palylists:', palylists);
