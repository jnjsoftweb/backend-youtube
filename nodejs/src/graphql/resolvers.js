import { resolvers as subscriptionResolvers } from './subscriptions/resolvers.js';
import { resolvers as searchResultResolvers } from './searchResults/resolvers.js';
import { resolvers as playlistResolvers } from './playlists/resolvers.js';
import { resolvers as channelResolvers } from './channels/resolvers.js';

export const resolvers = [
  subscriptionResolvers,
  searchResultResolvers,
  playlistResolvers,
  channelResolvers,
];
