// Resolvers define how to fetch the types defined in your schema.
import GitHubService from '../services/GitHubService.js';
import getRepoResolver from './repo.js';
import getReposResolver from './repos.js';

const getResolvers = () => {
  const githubService = new GitHubService();

  return {
    Query: {
      repos: getReposResolver(githubService),
      repo: getRepoResolver(githubService),
    },
  };
};

export default getResolvers();
