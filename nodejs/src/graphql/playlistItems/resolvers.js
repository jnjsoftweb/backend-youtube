import { getAllResponses } from '../../utils/youtubeREST.js';

export const resolvers = {
  Query: {
    playlistItems: async (_, { playlistId }) => {
      const playlistItems = await getAllResponses('playlistItems', {
        part: 'snippet,contentDetails',
        playlistId,
      });
      return playlistItems;
    },
    playlistItem: async (_, { id }) => {
      const playlistItems = await getAllResponses('playlistItems', {
        part: 'snippet,contentDetails',
        id,
      });
      return playlistItems[0];
    },
  },
};
