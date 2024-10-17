import { loadJson } from 'jnj-lib-base';
import { JSON_DB_DIR } from '../../utils/settings.js';

const subscriptionsData = loadJson(`${JSON_DB_DIR}/subscriptions.json`);

export const resolvers = {
  Query: {
    subscriptions: () => subscriptionsData,
    subscription: (_, { id }) => subscriptionsData.find((sub) => sub.id === id),
  },
};
