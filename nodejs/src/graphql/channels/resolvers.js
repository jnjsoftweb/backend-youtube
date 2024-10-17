import { getAllResponses } from '../../utils/youtubeREST.js';

export const resolvers = {
  Query: {
    channels: () => [],
    channel: async (_, { id }) => {
      const channels = await getAllResponses('channels', {
        part: 'snippet,statistics,contentDetails',
        id, // "UCUpJs89fSBXNolQGOYKn0YQ"
      });
      return channels[0];
    },
  },
};

//
// http://localhost:3006/channels?part=snippet,statistics,contentDetails&id=UCUpJs89fSBXNolQGOYKn0YQ
