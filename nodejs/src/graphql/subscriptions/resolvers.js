import fs from 'fs/promises';
import path from 'path';
import dotenv from 'dotenv';
import { loadJson } from 'jnj-lib-base';
import { fileURLToPath } from 'url';

// .env 파일 로드
const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);
dotenv.config({ path: path.resolve(__dirname, '../../../../../.env') });

// * const 설정
const APP_ROOT = process.env.APP_ROOT;
const DB_FOLDER = process.env.DB_FOLDER;
const JSON_DB_DIR = `${APP_ROOT}/${DB_FOLDER}/json`;

const subscriptionsData = loadJson(`${JSON_DB_DIR}/subscriptions.json`);

export const resolvers = {
  Query: {
    subscriptions: () => subscriptionsData,
    subscription: (_, { id }) => subscriptionsData.find(sub => sub.id === id),
  },
};
