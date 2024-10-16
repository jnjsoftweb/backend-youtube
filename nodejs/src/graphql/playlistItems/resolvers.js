import { loadJson } from 'jnj-lib-base';
import path from 'path';
import { fileURLToPath } from 'url';

const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);

const JSON_DB_DIR =
  process.env.JSON_DB_DIR || path.join(__dirname, '../../../../db/json');
const playlistItemsData = loadJson(`${JSON_DB_DIR}/playlistItems.json`);

export const resolvers = {
  Query: {
    playlistItems: (_, { playlistId }) =>
      playlistItemsData.filter(
        (item) => item.snippet.playlistId === playlistId
      ),
    playlistItem: (_, { id }) =>
      playlistItemsData.find((item) => item.id === id),
  },
};
