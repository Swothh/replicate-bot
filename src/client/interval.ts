import { response, rest } from '../utils';
import Bot from './index';

export default function Interval(client: Bot) {
    client.jobs.forEach(async job => {
        const req = await rest('get', job.urls.get);
        if (!req) return client.jobs.delete(job.user);

        job.interaction.editReply(response({
            name: job.name,
            id: job.id,
            avatar: job.interaction.user.displayAvatarURL(),
            image: req?.output ?? req.input?.image,
            started_at: new Date(req.created_at).getTime(),
            status: req.status,
            finished_at: req.completed_at ? new Date(req.completed_at).getTime() : undefined
        }));

        if (![ 'starting', 'processing' ].includes(req?.status)) {
            client.jobs.delete(job.user);
        };
    });
};