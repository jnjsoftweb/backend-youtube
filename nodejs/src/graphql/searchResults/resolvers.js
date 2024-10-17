import { getAllResponses } from '../../utils/youtubeREST.js';

export const resolvers = {
  Query: {
    searchResults: async (_, { q, type }) => {
      const searchResults = await getAllResponses('search', {
        part: 'snippet',
        q,
        type,
      });
      return searchResults;
    },
  },
};
