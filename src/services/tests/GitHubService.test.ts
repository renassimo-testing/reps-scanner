import GitHubService from '../GitHubService';

const mockedNodes = 'mocked-nodes';
const mockedRepoId = 'mocked-repo-id';
const mockedRepository = { id: mockedRepoId };
const mockedViewer = {
  repositories: { nodes: 'mocked-nodes' },
  repository: mockedRepository,
};
const mockedGraphql = jest.fn(() => ({
  viewer: mockedViewer,
}));
const mockedWebhooks = 'mocked-webhooks';
const mockedListWebhooks = jest.fn(() => ({
  data: mockedWebhooks,
}));
const mockedYml = {
  path: 'mocked-tree-path-3.yml',
  mode: 'mocked-tree-mode-3',
  type: 'blob',
  sha: 'mocked-tree-sha-3',
  size: 3,
  url: 'mocked-tree-url-3',
};
const mockedTree = [
  {
    path: 'mocked-tree-path-0',
    mode: 'mocked-tree-mode-0',
    type: 'mocked-tree-type-0',
    sha: 'mocked-tree-sha-0',
    size: 0,
    url: 'mocked-tree-url-0',
  },
  {
    path: 'mocked-tree-path-1',
    mode: 'mocked-tree-mode-1',
    type: 'mocked-tree-type-1',
    sha: 'mocked-tree-sha-1',
    size: 1,
    url: 'mocked-tree-url-1',
  },
  {
    path: 'mocked-tree-path-2.yml',
    mode: 'mocked-tree-mode-2',
    type: 'blob',
    sha: 'mocked-tree-sha-2',
    size: 0,
    url: 'mocked-tree-url-2',
  },
  mockedYml,
];
const mockedGetTree = jest.fn(() => ({
  data: { tree: mockedTree },
}));
const mockedYmlContent = 'mocked-yml-content';
const mockedGetBlob = jest.fn(() => ({
  data: { content: mockedYmlContent },
}));
jest.mock(
  '@octokit/rest',
  jest.fn(() => ({
    Octokit: jest.fn(() => ({
      graphql: mockedGraphql,
      rest: {
        repos: {
          listWebhooks: mockedListWebhooks,
        },
        git: {
          getTree: mockedGetTree,
          getBlob: mockedGetBlob,
        },
      },
    })),
  }))
);

describe('GitHubService', () => {
  const mockedToken = 'mocked-token';
  const expectedAuthOptions = {
    headers: { authorization: `bearer ${mockedToken}` },
  };
  mockedViewer.repositories.nodes = mockedNodes;

  const githubService = new GitHubService();

  afterEach(() => {
    jest.clearAllMocks();
  });

  describe('when getRepos called', () => {
    test('returns repos', async () => {
      // Arange
      // Act
      const result = await githubService.getRepos(mockedToken);
      // Assert
      expect(result).toEqual(mockedNodes);
      expect(mockedGraphql).toHaveBeenCalledWith(
        `
        {
          viewer {
            id
            repositories(first: 10) {
              nodes {
                id
                name
                size: diskUsage
                owner {
                  id
                  login
                }
                visibility
              }
            }
          }
        }
      `,
        expectedAuthOptions
      );
    });
  });

  describe('when getRepo called', () => {
    test('returns repo', async () => {
      // Arange
      const mockedName = 'mocked-name';
      const expectedResult = {
        id: mockedRepoId,
        webhooks: mockedWebhooks,
        filesCount: 2,
        ymlContent: mockedYmlContent,
      };
      // Act
      const result = await githubService.getRepo(mockedToken, mockedName);
      // Assert
      expect(result).toEqual(expectedResult);
      expect(mockedGraphql).toHaveBeenCalledWith(
        `
        {
          viewer {
            id
            login
            repository(name: "${mockedName}") {
              id
              name
              size: diskUsage
              owner {
                id
                login
              }
              visibility
            }
          }
        }
      `,
        expectedAuthOptions
      );
    });
  });
});
