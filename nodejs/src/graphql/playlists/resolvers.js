import { getAllResponses } from '../../utils/youtubeREST.js';

export const resolvers = {
  Query: {
    playlists: async (_, { channelId }) => {
      const playlists = await getAllResponses('playlists', {
        part: 'snippet,contentDetails',
        channelId,
      });
      return playlists;
    },
    playlist: async (_, { id }) => {
      const playlists = await getAllResponses('playlists', {
        part: 'snippet,contentDetails',
        id,
      });
      return playlists[0];
    },
  },
};
