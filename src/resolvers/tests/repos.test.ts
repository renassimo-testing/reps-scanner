import GitHubService from '../../services/GitHubService';
import getReposResolver from '../repos';

describe('getReposResolver', () => {
  test('returns resolver which calls getRepos with proper arguments and returns repos', async () => {
    // Arange
    const mockedToken = 'mocked-token';
    const mockedOrgLogin = 'mocked-org-login';
    const mockedRepos = 'mocked-repos';
    const mockedGetRepos = jest.fn(() => mockedRepos);
    const mockedGithubService = {
      getRepos: mockedGetRepos,
    } as unknown as GitHubService;
    const resolver = getReposResolver(mockedGithubService);
    // Act
    const result = await resolver(undefined, {
      token: mockedToken,
      orgLogin: mockedOrgLogin,
    });
    // Assert
    expect(result).toEqual(mockedRepos);
    expect(mockedGetRepos).toHaveBeenCalledWith(mockedToken, mockedOrgLogin);
  });
});
