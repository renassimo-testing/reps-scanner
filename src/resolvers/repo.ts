import QueueService from '../services/QueueSerice.js';
import GitHubService from '../services/GitHubService.js';
import { Repository } from '../types/githubTypes';

const getRepoResolver =
  (githubService: GitHubService, queueSerice: QueueService) =>
  async (
    _,
    { token, name, owner }: { token: string; name: string; owner: string }
  ): Promise<Repository> => {
    return await queueSerice.addAndResolve<Repository>(
      async () => await githubService.getRepo(token, name, owner)
    );
  };

export default getRepoResolver;
