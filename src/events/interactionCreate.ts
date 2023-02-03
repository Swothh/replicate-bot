import { Events, Interaction, EmbedBuilder } from 'discord.js';
import { isAsyncFunction } from 'util/types';
import { IEvent } from '@/interfaces';

export const Event: IEvent = {
    name: Events.InteractionCreate,
    type: 'on',
    run: async (client, interaction: Interaction) => {
        if (interaction.isButton() && interaction.customId === 'cancel_job') {
            const job = client.jobs.get(interaction.user.id);
            if (!job) return;
            job.interaction.deleteReply();
            return client.jobs.delete(interaction.user.id);
        };

        if (!interaction.isCommand() || !interaction.isChatInputCommand()) return;
        const command = client.commands.get(interaction.commandName);
        if (!command) return;

        const errorHandler = (err: Error) => {
            console.error(err);

            interaction.reply({
                embeds: [
                    new EmbedBuilder()
                        .setColor('Red')
                        .setDescription(':x: **|** An error occurred while executing this command.')
                ]
            });
        };

        if (isAsyncFunction(command.run)) {
            command.run(client, interaction).catch(errorHandler);
        } else {
            try {
                command.run(client, interaction);
            } catch(err) {
                errorHandler(err);
            };
        };
    }
};