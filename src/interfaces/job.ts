import { ChatInputCommandInteraction } from 'discord.js';

export interface IJob {
    id: string;
    job_id: string;
    name: string;
    user: string;
    interaction: ChatInputCommandInteraction;
    status: string;
    started_at: number;
    urls: {
        get: string;
        cancel: string;
    }
};