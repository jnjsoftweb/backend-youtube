import { gql } from 'apollo-server-express';
import { typeDefs as subscriptionTypeDefs } from './subscriptions/typeDefs.js';
import { typeDefs as searchResultTypeDefs } from './searchResults/typeDefs.js';
import { typeDefs as playlistTypeDefs } from './playlists/typeDefs.js';
import { typeDefs as channelTypeDefs } from './channels/typeDefs.js';

const rootTypeDefs = gql`
  type Query {
    _empty: String
    channels: [Channel]
  }
`;

export const typeDefs = [
  rootTypeDefs,
  subscriptionTypeDefs,
  searchResultTypeDefs,
  playlistTypeDefs,
  channelTypeDefs,
];
