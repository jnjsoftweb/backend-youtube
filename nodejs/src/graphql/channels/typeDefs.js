import { gql } from 'apollo-server-express';

export const typeDefs = gql`
  type Channel {
    kind: String
    etag: String
    id: String
    snippet: ChannelSnippet
    contentDetails: ChannelContentDetails
    statistics: ChannelStatistics
    topicDetails: ChannelTopicDetails
    status: ChannelStatus
    brandingSettings: ChannelBrandingSettings
    # contentOwnerDetails: ContentOwnerDetails
  }

  type ChannelSnippet {
    title: String
    description: String
    customUrl: String
    publishedAt: String
    thumbnails: Thumbnails
    localized: Localized
    country: String
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

  type Localized {
    title: String
    description: String
  }

  type ChannelContentDetails {
    relatedPlaylists: RelatedPlaylists
  }

  type RelatedPlaylists {
    likes: String
    uploads: String
  }

  type ChannelStatistics {
    viewCount: String
    subscriberCount: String
    hiddenSubscriberCount: Boolean
    videoCount: String
  }

  type ChannelTopicDetails {
    topicIds: [String]
    topicCategories: [String]
  }

  type ChannelStatus {
    privacyStatus: String
    isLinked: Boolean
    longUploadsStatus: String
  }

  type ChannelBrandingSettings {
    channel: BrandingChannel
    image: BrandingImage
  }

  type BrandingChannel {
    title: String
    description: String
    keywords: String
    unsubscribedTrailer: String
    country: String
  }

  type BrandingImage {
    bannerExternalUrl: String
  }

  #   type ContentOwnerDetails {
  #     # ContentOwnerDetails에 필요한 필드가 있다면 여기에 추가하세요
  #   }

  extend type Query {
    channels: [Channel]
    channel(id: ID!): Channel
  }
`;
