import { ICommand } from '@/interfaces';

export const Command: ICommand = {
    name: 'help',
    description: 'Shows a list of all commands.',
    run: async (client, interaction) => {
        interaction.reply('hello world!');
    }
};