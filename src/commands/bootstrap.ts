import { createCommand } from "../utils/command.js";

export const initCommand = createCommand('init')
    .description('Initialize suDAO project')
    .action(async () => {
        console.log('Successfully initialized suDAO project!');
    });