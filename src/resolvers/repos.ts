import GitHubService from '../services/GitHubService.js';

const getReposResolver =
  (githubService: GitHubService) =>
  async (_, { token, orgLogin }: { token: string; orgLogin: string }) => {
    const reps = await githubService.getRepos(token, orgLogin);

    return reps;
  };

export default getReposResolver;
