import { EmbedBuilder } from 'discord.js';
import { rest, response } from '../utils';
import { ICommand } from '../interfaces';
import crypto from 'crypto';

export const Command: ICommand = {
    name: 'restoration',
    description: 'Robust face restoration algorithm for old photos / AI-generated faces.',
    options: [
        {
            type: 1,
            name: 'url',
            description: 'Restore a image from a URL.',
            options: [
                {
                    type: 3,
                    name: 'url',
                    description: 'The URL of the image.',
                    required: true
                }
            ]
        },
        {
            type: 1,
            name: 'attachment',
            description: 'Restore a image from an attachment.',
            options: [
                {
                    type: 11,
                    name: 'attachment',
                    description: 'The attachment of the image.',
                    required: true
                }
            ]
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
        const att = interaction.options.getAttachment('attachment');
        const url = att?.url ?? interaction.options.getString('url');

        if (att && att.contentType.split('/')[0] !== 'image' || ![ 'png', 'jpeg', 'jpg' ].includes(url.split('.').reverse()[0])) {
            embed.setColor('Red').setDescription(':x: **|** Invalid attachment type.');
            return interaction.followUp({ embeds: [ embed ] });
        };

        const req = await rest('post', undefined, {
            version: process.env.SCZHOU_CODEFORMER__VERSION,
            input: {
                image: url
            }
        });

        if (!req?.urls?.get) {
            embed.setColor('Red').setDescription(':x: **|** Something went wrong. (rate-limit)');
            return interaction.followUp({ embeds: [ embed ] });
        };

        client.jobs.set(interaction.user.id, {
            id: md5(req.id),
            job_id: req.id,
            name: 'Restoration',
            user: interaction.user.id,
            interaction,
            status: req.status,
            started_at: new Date(req.created_at).getTime(),
            urls: req.urls
        });

        interaction.followUp(response({
            name: 'Restoration',
            id: md5(req.id),
            avatar: interaction.user.displayAvatarURL(),
            image: url,
            started_at: new Date(req.created_at).getTime(),
            status: req.status
        }));
    }
};