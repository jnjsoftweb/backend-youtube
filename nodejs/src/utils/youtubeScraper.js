// import { chromium } from 'playwright';
// import * as fs from 'fs';
// import path from 'path';

// async function scrapeGoogle() {
//     const userDataDir = "/Users/youchan/Library/Application Support/Google/Chrome";
//     const profileName = "Profile 39";

//     // Chrome 브라우저를 실행합니다.
//     const browser = await chromium.launchPersistentContext(userDataDir, {
//         headless: false,
//         executablePath: '/Applications/Google Chrome.app/Contents/MacOS/Google Chrome',
//         args: [
//             `--profile-directory=${profileName}`,
//         ]
//     });

//     const page = await browser.newPage();

//     try {
//         await page.goto('https://www.google.com');
//         const html = await page.content();

//         fs.writeFileSync('google.html', html);
//         console.log('HTML 소스가 google.html 파일에 저장되었습니다.');
//         await new Promise(resolve => setTimeout(resolve, 60000)); // 60초간 작업 완료 후 대기
//     } catch (error) {
//         console.error('에러 발생:', error);
//     } finally {
//         await browser.close();
//     }
// }

// scrapeGoogle();
