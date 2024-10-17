import { mySubscriptions } from '../../utils/youtubeGoogle.js';

export const resolvers = {
  Query: {
    subscriptions: (_, { id }) => mySubscriptions(id),
  },
};
