import { loadJson } from 'jnj-lib-base';
import path from 'path';
import { fileURLToPath } from 'url';

const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);

const JSON_DB_DIR =
  process.env.JSON_DB_DIR || path.join(__dirname, '../../../../db/json');
const channelsData = loadJson(`${JSON_DB_DIR}/channels.json`);

export const resolvers = {
  Query: {
    channels: () => channelsData,
    channel: (_, { id }) => channelsData.find((channel) => channel.id === id),
  },
};
