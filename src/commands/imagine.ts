import { EmbedBuilder } from 'discord.js';
import { rest, response } from '../utils';
import { ICommand } from '../interfaces';
import crypto from 'crypto';

export const Command: ICommand = {
    name: 'imagine',
    description: 'Generates an image from a prompt.',
    options: [
        {
            type: 3,
            name: 'prompt',
            description: 'The prompt for the image.',
            required: true
        }
    ],
    run: async (client, interaction) => {
        await interaction.deferReply();
        const embed = new EmbedBuilder();

        if (client.jobs.has(interaction.user.id)) {
            embed.setColor('Red').setDescription(':x: **|** You already have a job running.');
            return interaction.followUp({ embeds: [ embed ] });
        };

        const md5 = (data: string) => crypto.createHash('md5').update(data).digest('hex');
        const prompt = interaction.options.getString('prompt');

        const req = await rest('post', undefined, {
            version: process.env.STABILITY_AI_STABLE_DIFFUSION__VERSION,
            input: {
                prompt
            }
        });

        if (!req?.urls?.get) {
            embed.setColor('Red').setDescription(':x: **|** Something went wrong.');
            return interaction.followUp({ embeds: [ embed ] });
        };

        client.jobs.set(interaction.user.id, {
            id: md5(req.id),
            job_id: req.id,
            name: 'Imagine',
            user: interaction.user.id,
            interaction,
            status: req.status,
            started_at: new Date(req.created_at).getTime(),
            urls: req.urls
        });

        interaction.followUp(response({
            name: 'Imagine',
            id: md5(req.id),
            avatar: interaction.user.displayAvatarURL(),
            image: undefined,
            started_at: new Date(req.created_at).getTime(),
            status: req.status
        }));
    }
};