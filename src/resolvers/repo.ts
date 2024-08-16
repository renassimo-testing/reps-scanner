import QueueService from '../services/QueueSerice.js';
import GitHubService from '../services/GitHubService.js';
import { Repository } from '../types/githubTypes';

const getRepoResolver =
  (githubService: GitHubService, queueSerice: QueueService) =>
  async (
    _,
    { token, name }: { token: string; name: string; }
  ): Promise<Repository> => {
    return await queueSerice.addAndResolve<Repository>(
      async () => await githubService.getRepo(token, name)
    );
  };

export default getRepoResolver;
