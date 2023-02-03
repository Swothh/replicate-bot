import { EmbedBuilder, ActionRowBuilder, ButtonBuilder, ButtonStyle } from 'discord.js';

interface IOptions {
    name: string;
    id: string;
    avatar: string;
    image?: string;
    status: string;
    started_at: number;
    finished_at?: number;
};

export const response = (options: IOptions) => ({
    embeds: [
        new EmbedBuilder()
            .setColor(options.finished_at ? 'Green' : 'Grey')
            .setAuthor({ name: `ID: ${options.id}`, iconURL: options.avatar })
            .setTitle(options.name + ' job ' + (options.finished_at ? 'finished' : 'started') + '.')
            .setImage(options.image ? String(options.image) : null)
            .addFields({
                name: '• Status',
                value: options.status.charAt(0).toUpperCase() + options.status.slice(1),
                inline: true
            }, ...(!options.finished_at ? [
                {
                    name: '• Started At',
                    value: `<t:${Math.floor(new Date(options.started_at).getTime() / 1000)}${options.finished_at ? '' : ':R'}>`,
                    inline: true
                }
            ] : [
                {
                    name: '• Processed In',
                    value: `${((options.finished_at - options.started_at) / 1000).toFixed(1)} seconds`,
                    inline: true
                }
            ]))
    ],
    components: options.finished_at ? [] : [
        new ActionRowBuilder<ButtonBuilder>()
            .addComponents(
                new ButtonBuilder()
                    .setCustomId('cancel_job')
                    .setLabel('Cancel Job')
                    .setStyle(ButtonStyle.Secondary)
                    .setEmoji('❌')
            )
    ]
});