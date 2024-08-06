import GitHubService from '../services/GitHubService.js';

const getRepoResolver =
  (githubService: GitHubService) =>
  async (_, { token, name, owner }: { token: string; name: string; owner: string }) => {
    const repo = await githubService.getRepo(token, name, owner);

    return repo;
  };

export default getRepoResolver;
