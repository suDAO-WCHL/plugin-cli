import { Command } from 'commander';
import inquirer from 'inquirer';
import chalk from 'chalk';
import { PluginManager } from '@sudao-wchl/plugin-core';
import type { CreatePluginOptions } from '@sudao-wchl/plugin-core';

export const createPluginCommand = new Command('create')
    .description('Create a new plugin from template')
    .argument('[name]', 'Plugin name')
    .option('-d, --description <description>', 'Plugin description')
    .option('-a, --author <author>', 'Plugin author')
    .option('-t, --type <type>', 'Plugin type (component|service|utility)', 'component')
    .option('--template <template>', 'Template to use (defaults to type)')
    .option('--dir <directory>', 'Target directory')
    .option('--interactive', 'Run in interactive mode')
    .action(async (name?: string, options?: any) => {
        try {
            const pluginManager = new PluginManager();
            let createOptions: CreatePluginOptions;

            if (options?.interactive || !name) {
                // Interactive mode
                const answers = await inquirer.prompt([
                    {
                        type: 'input',
                        name: 'name',
                        message: 'Plugin name:',
                        default: name,
                        validate: (input: string) => {
                            if (!input) return 'Plugin name is required';
                            if (!/^[a-z]([a-z0-9-]*[a-z0-9])?$/.test(input)) {
                                return 'Plugin name must be lowercase and can only contain letters, numbers, and hyphens';
                            }
                            return true;
                        }
                    },
                    {
                        type: 'input',
                        name: 'description',
                        message: 'Plugin description:',
                        default: options?.description
                    },
                    {
                        type: 'input',
                        name: 'author',
                        message: 'Author:',
                        default: options?.author || 'suDAO Developer'
                    },
                    {
                        type: 'list',
                        name: 'type',
                        message: 'Plugin type:',
                        choices: [
                            { name: 'Component - React component plugin', value: 'component' },
                            { name: 'Service - API/service plugin', value: 'service' },
                            { name: 'Utility - Helper functions plugin', value: 'utility' }
                        ],
                        default: options?.type || 'component'
                    },
                    {
                        type: 'input',
                        name: 'directory',
                        message: 'Target directory:',
                        default: options?.dir || ((answers: any) => `plugin-${answers.name}`)
                    }
                ]);

                createOptions = {
                    name: answers.name,
                    description: answers.description,
                    author: answers.author,
                    type: answers.type,
                    template: options?.template || answers.type,
                    directory: answers.directory
                };
            } else {
                // Non-interactive mode
                createOptions = {
                    name,
                    description: options?.description,
                    author: options?.author,
                    type: options?.type || 'component',
                    template: options?.template || options?.type || 'component',
                    directory: options?.dir
                };
            }

            console.log(chalk.blue('Creating plugin...'));
            await pluginManager.createPlugin(createOptions);

            console.log(chalk.green('✓ Plugin created successfully!'));
            console.log(chalk.gray('Next steps:'));
            console.log(chalk.gray(`  cd ${createOptions.directory || `plugin-${createOptions.name}`}`));
            console.log(chalk.gray('  npm install'));
            console.log(chalk.gray('  npm run build'));
        } catch (error) {
            console.error(chalk.red('Error:'), error instanceof Error ? error.message : 'Unknown error');
            process.exit(1);
        }
    });

