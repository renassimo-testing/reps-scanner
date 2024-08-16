import GitHubService from '../services/GitHubService.js';

const getReposResolver =
  (githubService: GitHubService) =>
  async (_, { token }: { token: string; }) => {
    const reps = await githubService.getRepos(token);

    return reps;
  };

export default getReposResolver;
