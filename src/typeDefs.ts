const typeDefs = `#graphql

  type Owner {
    id: ID!
    login: String
  }

  type Webhook {
    id: Int
    name: String
    active: Boolean
  }

  type Repo {
    id: ID!
    name: String
    size: Int
    owner: Owner
    visibility: String
    filesCount: Int
    ymlContent: String
    webhooks: [Webhook]
  }

  type Query {
    repos(token: String!, orgLogin: String!): [Repo]
    repo(token: String!, name: String!, owner: String!): Repo
  }
`;

export default typeDefs;