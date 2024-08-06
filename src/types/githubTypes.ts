interface Owner {
  id: string;
  login: string;
}

export interface Webhook {
  id: number;
  name: string;
  active: boolean;
}

export interface Repository {
  id: string;
  name: string;
  size: number;
  owner: Owner;
  visibility: string;
  filesCount: number;
  ymlContent: string;
  webhooks: Webhook[];
}

export interface Organization {
  id: string;
  repositories: {
    nodes: Repository[];
  };
}

export interface TreeItem {
  path?: string;
  mode?: string;
  type?: string;
  sha?: string;
  size?: number;
  url?: string;
}
