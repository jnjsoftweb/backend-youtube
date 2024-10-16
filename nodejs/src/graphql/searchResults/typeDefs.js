import { gql } from 'apollo-server-express';

export const typeDefs = gql`
  type SearchResult {
    kind: String
    etag: String
    id: SearchResultId
    snippet: SearchResultSnippet
  }

  type SearchResultId {
    kind: String
    videoId: String
    channelId: String
  }

  type SearchResultSnippet {
    publishedAt: String
    channelId: String
    title: String
    description: String
    thumbnails: Thumbnails
    channelTitle: String
    liveBroadcastContent: String
    publishTime: String
  }

  type Thumbnails {
    default: Thumbnail
    medium: Thumbnail
    high: Thumbnail
  }

  type Thumbnail {
    url: String
    width: Int
    height: Int
  }

  extend type Query {
    searchResults: [SearchResult]
    searchResult(id: String!): SearchResult
  }
`;
