import QueueSerice from '../../services/QueueSerice';
import GitHubService from '../../services/GitHubService';
import getRepoResolver from '../repo';

describe('getRepoResolver', () => {
  test('returns resolver which calls getRepo with proper arguments and returns repos', async () => {
    // Arange
    const mockedToken = 'mocked-token';
    const mockedName = 'mocked-name';
    const mockedOwner = 'mocked-owner';
    const mockedRepos = 'mocked-repos';
    const mockedGetRepo = jest.fn(() => mockedRepos);
    const mockedGithubService = {
      getRepo: mockedGetRepo,
    } as unknown as GitHubService;
    const mockedAddAndResolve = jest.fn((func) => func());
    const mockedQueueSerice = {
      addAndResolve: mockedAddAndResolve,
    } as unknown as QueueSerice;
    const resolver = getRepoResolver(mockedGithubService, mockedQueueSerice);
    // Act
    const result = await resolver(undefined, {
      token: mockedToken,
      name: mockedName,
      owner: mockedOwner,
    });
    // Assert
    expect(result).toEqual(mockedRepos);
    expect(mockedGetRepo).toHaveBeenCalledWith(
      mockedToken,
      mockedName,
      mockedOwner
    );
    expect(mockedAddAndResolve).toHaveBeenCalledWith(expect.any(Function));
  });
});
