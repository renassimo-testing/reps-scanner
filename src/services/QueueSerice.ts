import PQueue from 'p-queue';

export default class QueueService {
  queue: PQueue;

  constructor(concurrency: number) {
    this.queue = new PQueue({ concurrency });
  }

  async addAndResolve<Result>(
    resolver: () => Promise<Result>
  ): Promise<Result> {
    return await this.queue.add(async () => await resolver()) as Awaited<Result>
  }
}
