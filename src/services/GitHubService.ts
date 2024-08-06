import { Octokit } from '@octokit/rest';
import { Organization, Repository, Webhook, TreeItem } from '../types/githubTypes';

export default class GitHubService {
  private octokit: Octokit;

  constructor() {
    this.octokit = new Octokit();
  }

  async getRepo(
    token: string,
    name: string,
    owner: string
  ): Promise<Repository> {
    const [repository, webhooks, [filesCount, ymlContent]] = await Promise.all([
      this.getRepository(token, name, owner),
      this.getWebhooks(token, name, owner),
      this.getYmlAndFilesCount(token, name, owner),
    ]);

    return { ...repository, webhooks, filesCount, ymlContent };
  }

  async getRepos(token: string, login: string): Promise<Repository[]> {
    const { organization }: { organization: Organization } =
      await this.octokit.graphql(
        this.getReposQuery(login),
        this.getAuthOptions(token)
      );
    return organization.repositories.nodes;
  }

  private async getRepository(
    token: string,
    name: string,
    owner: string
  ): Promise<Repository> {
    const { repository }: { repository: Repository } =
      await this.octokit.graphql(
        this.getRepoQuery(name, owner),
        this.getAuthOptions(token)
      );
    return repository;
  }

  private async getWebhooks(
    token: string,
    name: string,
    owner: string
  ): Promise<Webhook[]> {
    const { data: webhooks } = await this.octokit.rest.repos.listWebhooks({
      owner,
      repo: name,
      ...this.getAuthOptions(token),
    });

    return webhooks;
  }

  private async getTree(
    token: string,
    name: string,
    owner: string
  ): Promise<TreeItem[]> {
    const {
      data: { tree },
    } = await this.octokit.rest.git.getTree({
      owner,
      repo: name,
      tree_sha: 'master',
      recursive: 'true',
      ...this.getAuthOptions(token),
    });

    return tree;
  }

  private async getYmlContent(
    tree: TreeItem[],
    owner: string,
    repo: string,
    token: string
  ): Promise<string | null> {
    const yml = tree.find(
      (item) =>
        item.type === 'blob' &&
        item.path.match(/\.[0-9a-z]+$/i)?.[0] === '.yml' &&
        item.size
    );
    if (!yml) return null;

    const {
      data: { content: ymlContent },
    } = await this.octokit.rest.git.getBlob({
      owner,
      repo,
      file_sha: yml.sha,
      ...this.getAuthOptions(token),
    });
    return ymlContent;
  }

  private async getYmlAndFilesCount(
    token: string,
    name: string,
    owner: string
  ): Promise<[number, string | null]> {
    const tree = await this.getTree(token, name, owner);
    if (tree.length === 0) return [0, null];

    const filesCount = tree.filter((item) => item.type === 'blob').length;
    const ymlContent = await this.getYmlContent(tree, owner, name, token);

    return [filesCount, ymlContent];
  }

  private getAuthOptions(token: string): {
    headers: { authorization: string };
  } {
    return {
      headers: { authorization: `bearer ${token}` },
    };
  }

  private getRepoQuery(name: string, owner: string): string {
    return `
        {
          repository(name: "${name}", owner: "${owner}") {
            ${this.baseRepoQuery}
          }
        }
      `;
  }

  private getReposQuery(login: string): string {
    return `
        {
          organization(login: "${login}") {
            id
            repositories(first: 10) {
              nodes {
                ${this.baseRepoQuery}
              }
            }
          }
        }
      `;
  }

  private get baseRepoQuery(): string {
    return `
      id
      name
      size: diskUsage
      owner {
        id
        login
      }
      visibility
    `;
  }
}
