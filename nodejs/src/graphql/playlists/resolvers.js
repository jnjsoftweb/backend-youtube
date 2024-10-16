import { loadJson } from 'jnj-lib-base';
import { JSON_DB_DIR } from '../../utils/settings.js';

const playlistsData = loadJson(`${JSON_DB_DIR}/playlists.json`);

export const resolvers = {
  Query: {
    playlists: () => playlistsData,
    playlist: (_, { id }) =>
      playlistsData.find((playlist) => playlist.id === id),
  },
};
