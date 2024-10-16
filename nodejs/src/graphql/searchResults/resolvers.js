import { loadJson } from 'jnj-lib-base';
import { JSON_DB_DIR } from '../../utils/settings.js';

const searchResultsData = loadJson(`${JSON_DB_DIR}/searchResults.json`);

export const resolvers = {
  Query: {
    searchResults: () => searchResultsData,
    searchResult: (_, { id }) =>
      searchResultsData.find(
        (result) => result.id.videoId === id || result.id.channelId === id
      ),
  },
};
