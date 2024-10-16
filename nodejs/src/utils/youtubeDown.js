import fs from 'fs';
import cp from 'child_process';
import path from 'path';

import ytdl from '@distube/ytdl-core';
import youtubeSubtitlesScraper from 'youtube-captions-scraper';

import { BASE_DOWN_FOLDER } from './settings.js';

const srtFromSubtitles = (Subtitles) => {
  return Subtitles.map((Subtitle, index) => {
    const start = parseFloat(Subtitle.start);
    const end = start + parseFloat(Subtitle.dur);
    const startTime = new Date(start * 1000).toISOString().substr(11, 12);
    const endTime = new Date(end * 1000).toISOString().substr(11, 12);

    return `${index + 1}\n${startTime.replace('.', ',')} --> ${endTime.replace(
      '.',
      ','
    )}\n${Subtitle.text}\n`;
  }).join('\n');
};

const txtFromSubtitles = (Subtitles) => {
  return Subtitles.map((Subtitle) => `${Subtitle.text}`).join('\n');
};

const _getSubtitles = async (videoId, subtitleLanguages) => {
  const languages = subtitleLanguages.split(',').map((lang) => lang.trim());
  console.log('languages: ', languages);
  let subtitles = [];
  for (const language of languages) {
    console.log('language: ', language);
    try {
      const captions = await youtubeSubtitlesScraper.getSubtitles({
        videoID: videoId,
        lang: language,
      });
      console.log(`성공적으로 가져온 자막 언어: ${language || '자동 감지'}`);
      subtitles.push({ language, captions });
    } catch (error) {
      console.log(
        `${
          language || '자동 감지'
        } 자막을 가져오는 데 실패했습니다. 다음 언어 시도 중...`
      );
    }
  }

  return subtitles;
};

const _downloadSubtitles = (captions, formatType = 'vtt') => {
  const formatTime = (seconds) => {
    const date = new Date(seconds * 1000);
    const hours = date.getUTCHours().toString().padStart(2, '0');
    const minutes = date.getUTCMinutes().toString().padStart(2, '0');
    const secs = date.getUTCSeconds().toString().padStart(2, '0');
    const ms = date.getUTCMilliseconds().toString().padStart(3, '0');
    return `${hours}:${minutes}:${secs},${ms}`;
  };

  switch (formatType.toLowerCase()) {
    case 'vtt':
      return `WEBVTT\n\n${captions
        .map(
          (caption) =>
            `${formatTime(caption.start)} --> ${formatTime(
              parseFloat(caption.start) + parseFloat(caption.dur)
            )}\n${caption.text}`
        )
        .join('\n\n')}`;
    case 'srt':
      return captions
        .map(
          (caption, index) =>
            `${index + 1}\n${formatTime(caption.start)} --> ${formatTime(
              parseFloat(caption.start) + parseFloat(caption.dur)
            )}\n${caption.text}`
        )
        .join('\n\n');
    case 'txt':
      return captions.map((caption) => caption.text).join('\n');
    default:
      return captions.map((caption) => caption.text).join('\n');
  }
};

const downloadSubtitles = async (
  videoId,
  subtitleLanguages,
  formatType = 'vtt'
) => {
  let subtitles = await _getSubtitles(videoId, subtitleLanguages);
  for (const subtitle of subtitles) {
    subtitle.captions = _downloadSubtitles(subtitle.captions, formatType);
  }

  // TODO: 파일 저장 추가
  return subtitles;
};

const downloadFile = async (url, options, filePath, fileType) => {
  return new Promise((resolve, reject) => {
    console.log(`Starting ${fileType} download...`);
    const stream = ytdl(url, options);
    let downloadedBytes = 0;
    let totalBytes = 0;

    stream.on('info', (info, format) => {
      totalBytes = format.contentLength;
      console.log(
        `Selected ${fileType} format: ${
          format.qualityLabel || format.audioQuality
        } (${format.container})`
      );
    });

    stream.on('data', (chunk) => {
      downloadedBytes += chunk.length;
      if (totalBytes) {
        const percent = ((downloadedBytes / totalBytes) * 100).toFixed(2);
        process.stdout.write(`\r${fileType} download progress: ${percent}%`);
      }
    });

    stream
      .pipe(fs.createWriteStream(filePath))
      .on('finish', () => {
        console.log(`\n${fileType} download complete:`, filePath);
        resolve();
      })
      .on('error', (err) => {
        console.error(`Error downloading ${fileType}:`, err);
        reject(err);
      });

    stream.on('error', (err) => {
      console.error(`Error in ${fileType} stream:`, err);
      reject(err);
    });
  });
};

const downloadYoutube = async (
  videoId,
  resolution = '700',
  outputDir = BASE_DOWN_FOLDER
) => {
  const url = `https://www.youtube.com/watch?v=${videoId}`;
  console.log('Downloading from:', url);

  const videoPath = path.join(outputDir, `${videoId}_video.mp4`);
  const audioPath = path.join(outputDir, `${videoId}_audio.m4a`);
  const outputPath = path.join(outputDir, `${videoId}.mp4`);

  const options = {
    requestOptions: {
      headers: {
        'User-Agent':
          'Mozilla/5.0 (Windows NT 10.0; Win64; x64) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/91.0.4472.124 Safari/537.36',
        Cookie: 'YOUR_YOUTUBE_COOKIE_HERE',
      },
    },
  };

  try {
    const info = await ytdl.getInfo(url);

    console.log('Available video formats:');
    const videoFormats = info.formats.filter(
      (format) => format.hasVideo && format.container === 'mp4'
    );
    videoFormats.forEach((format, index) => {
      console.log(`${index}: ${format.qualityLabel} (${format.container})`);
    });

    console.log('\nAvailable audio formats:');
    const audioFormats = info.formats.filter(
      (format) => format.hasAudio && !format.hasVideo
    );
    audioFormats.forEach((format, index) => {
      console.log(`${index}: ${format.audioBitrate}kbps (${format.container})`);
    });

    const selectedVideoFormat =
      videoFormats.find((format) =>
        format.qualityLabel.includes(`${resolution}`)
      ) || ytdl.chooseFormat(videoFormats, { quality: 'highest' });
    const selectedAudioFormat = ytdl.chooseFormat(audioFormats, {
      quality: 'highestaudio',
    });

    if (!selectedVideoFormat) {
      throw new Error('No suitable video format found');
    }

    console.log(
      `\nSelected video format: ${selectedVideoFormat.qualityLabel} (${selectedVideoFormat.container})`
    );
    console.log(
      `Selected audio format: ${selectedAudioFormat.audioBitrate}kbps (${selectedAudioFormat.container})`
    );

    await downloadFile(
      url,
      { ...options, format: selectedVideoFormat },
      videoPath,
      'Video'
    );

    // Check if the selected video format has audio
    if (selectedVideoFormat.hasAudio) {
      console.log('Video contains audio. Saving video as:', outputPath);
      fs.renameSync(videoPath, outputPath); // Rename video file to final output path
      console.log('Video saved successfully without merging audio.');
    } else {
      await downloadFile(
        url,
        { ...options, format: selectedAudioFormat },
        audioPath,
        'Audio'
      );

      console.log('Both video and audio downloaded successfully.');

      await new Promise((resolve, reject) => {
        console.log('Merging video and audio...');
        const ffmpeg = cp.spawn('ffmpeg', [
          '-i',
          videoPath,
          '-i',
          audioPath,
          '-c:v',
          'copy',
          '-c:a',
          'aac',
          '-strict',
          'experimental',
          outputPath,
        ]);

        ffmpeg.stdout.on('data', (data) => {
          console.log(`ffmpeg stdout: ${data}`);
        });

        ffmpeg.stderr.on('data', (data) => {
          console.error(`ffmpeg stderr: ${data}`);
        });

        ffmpeg.on('close', (code) => {
          if (code === 0) {
            console.log('Merge completed:', outputPath);
            fs.unlinkSync(videoPath);
            fs.unlinkSync(audioPath);
            resolve();
          } else {
            console.error('ffmpeg process failed with code:', code);
            reject(new Error(`ffmpeg process failed with code: ${code}`));
          }
        });
      });
    }

    console.log('Download and subtitle process completed successfully.');
  } catch (error) {
    console.error('An error occurred:', error.message);
    throw error;
  }
};

export { downloadSubtitles, downloadYoutube, BASE_DOWN_FOLDER };
