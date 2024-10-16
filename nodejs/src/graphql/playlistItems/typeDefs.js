import { gql } from 'apollo-server-express';

export const typeDefs = gql`
  type PlaylistItem {
    kind: String
    etag: String
    id: String
    snippet: PlaylistItemSnippet
    contentDetails: PlaylistItemContentDetails
    status: PlaylistItemStatus
  }

  type PlaylistItemSnippet {
    publishedAt: String
    channelId: String
    title: String
    description: String
    thumbnails: Thumbnails
    channelTitle: String
    playlistId: String
    position: Int
    resourceId: ResourceId
    videoOwnerChannelTitle: String
    videoOwnerChannelId: String
  }

  type PlaylistItemContentDetails {
    videoId: String
    videoPublishedAt: String
  }

  type PlaylistItemStatus {
    privacyStatus: String
  }

  type ResourceId {
    kind: String
    videoId: String
  }

  extend type Query {
    playlistItems(playlistId: String!): [PlaylistItem]
    playlistItem(id: String!): PlaylistItem
  }
`;
