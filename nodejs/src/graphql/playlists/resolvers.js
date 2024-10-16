import { loadJson } from 'jnj-lib-base';
import path from 'path';
import { fileURLToPath } from 'url';

const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);

const JSON_DB_DIR = process.env.JSON_DB_DIR || path.join(__dirname, '../../../../db/json');
const playlistsData = loadJson(`${JSON_DB_DIR}/playlists.json`);

export const resolvers = {
  Query: {
    playlists: () => playlistsData,
    playlist: (_, { id }) => playlistsData.find(playlist => playlist.id === id),
  },
};
