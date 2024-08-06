// Resolvers define how to fetch the types defined in your schema.
import GitHubService from '../services/GitHubService.js';
import QueueSerice from '../services/QueueSerice.js';
import getRepoResolver from './repo.js';
import getReposResolver from './repos.js';

const getResolvers = () => {
  const githubService = new GitHubService();
  const queueSerice = new QueueSerice(2);

  return {
    Query: {
      repos: getReposResolver(githubService),
      repo: getRepoResolver(githubService, queueSerice),
    },
  };
};

export default getResolvers();
