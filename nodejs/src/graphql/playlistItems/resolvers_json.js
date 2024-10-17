import { loadJson } from 'jnj-lib-base';
import { JSON_DB_DIR } from '../../utils/settings.js';

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
