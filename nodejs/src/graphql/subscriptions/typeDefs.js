import { gql } from 'apollo-server-express';

export const typeDefs = gql`
  type Subscription {
    kind: String
    etag: String
    id: String
    snippet: SubscriptionSnippet
  }

  type SubscriptionSnippet {
    publishedAt: String
    title: String
    description: String
    resourceId: ResourceId
    channelId: String
    thumbnails: Thumbnails
  }

  type ResourceId {
    kind: String
    channelId: String
  }

  type Thumbnails {
    default: Thumbnail
    medium: Thumbnail
    high: Thumbnail
  }

  type Thumbnail {
    url: String
  }

  extend type Query {
    subscriptions(id: String!): [Subscription]
  }
`;
