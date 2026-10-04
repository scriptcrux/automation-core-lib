import { BaseAxiosClient, HttpClientEnvConfig, ILogger } from '@script-crux/adapter-axios';

export interface JSONPlaceholderPost {
    userId: number;
    id: number;
    title: string;
    body: string;
}

export class ReqResClient extends BaseAxiosClient {
    constructor(config: HttpClientEnvConfig, logger: ILogger) {
        super(config, logger);
    }

    // Hits: GET /posts/:id
    public async getUser(id: number): Promise<JSONPlaceholderPost> {
        return this.get<JSONPlaceholderPost>(`/posts/${id}`);
    }

    // Hits: POST /posts
    public async createNewUser(name: string, job: string): Promise<{ id: number; title: string }> {
        return this.post<{ id: number; title: string }>('/posts', { title: name, body: job, userId: 1 });
    }
}
