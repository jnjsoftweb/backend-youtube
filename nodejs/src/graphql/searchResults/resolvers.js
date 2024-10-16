import { loadJson } from 'jnj-lib-base';
import path from 'path';
import { fileURLToPath } from 'url';

const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);

const JSON_DB_DIR = process.env.JSON_DB_DIR || path.join(__dirname, '../../../../db/json');
const searchResultsData = loadJson(`${JSON_DB_DIR}/searchResults.json`);

export const resolvers = {
  Query: {
    searchResults: () => searchResultsData,
    searchResult: (_, { id }) => searchResultsData.find(result => 
      (result.id.videoId === id || result.id.channelId === id)
    ),
  },
};
