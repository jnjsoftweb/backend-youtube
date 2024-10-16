import { gql } from 'apollo-server-express';

export const typeDefs = gql`
  type Playlist {
    kind: String
    etag: String
    id: String
    snippet: PlaylistSnippet
    status: PlaylistStatus
    contentDetails: PlaylistContentDetails
    player: PlaylistPlayer
  }

  type PlaylistSnippet {
    publishedAt: String
    channelId: String
    title: String
    description: String
    thumbnails: Thumbnails
    channelTitle: String
    localized: PlaylistLocalized
  }

  type PlaylistLocalized {
    title: String
    description: String
  }

  type PlaylistStatus {
    privacyStatus: String
  }

  type PlaylistContentDetails {
    itemCount: Int
  }

  type PlaylistPlayer {
    embedHtml: String
  }

  type Thumbnails {
    default: Thumbnail
    medium: Thumbnail
    high: Thumbnail
    standard: Thumbnail
    maxres: Thumbnail
  }

  type Thumbnail {
    url: String
    width: Int
    height: Int
  }

  extend type Query {
    playlists: [Playlist]
    playlist(id: String!): Playlist
  }
`;
