import { loadJson } from 'jnj-lib-base';
import { JSON_DB_DIR } from '../../utils/settings.js';

const channelsData = loadJson(`${JSON_DB_DIR}/channels.json`);

export const resolvers = {
  Query: {
    channels: () => channelsData,
    channel: (_, { id }) => channelsData.find((channel) => channel.id === id),
  },
};
