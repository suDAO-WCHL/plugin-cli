import { Command } from 'commander';
import inquirer from 'inquirer';
import chalk from 'chalk';
import { PluginManager } from '@sudao-wchl/plugin-core';
import type { PublishOptions } from '@sudao-wchl/plugin-core';

export const publishPluginCommand = new Command('publish')
    .description('Publish plugin to registry')
    .option('-r, --registry <registry>', 'NPM registry URL')
    .option('-a, --access <access>', 'Access level (public|restricted)', 'public')
    .option('-t, --tag <tag>', 'Publish tag', 'latest')
    .option('--dry-run', 'Dry run without actually publishing')
    .option('--interactive', 'Run in interactive mode')
    .action(async (options?: any) => {
        try {
            const pluginManager = new PluginManager();
            let publishOptions: PublishOptions;

            if (options?.interactive) {
                // Interactive mode
                const answers = await inquirer.prompt([
                    {
                        type: 'input',
                        name: 'registry',
                        message: 'NPM registry URL (leave empty for default):',
                        default: options?.registry
                    },
                    {
                        type: 'list',
                        name: 'access',
                        message: 'Access level:',
                        choices: [
                            { name: 'Public - Anyone can install', value: 'public' },
                            { name: 'Restricted - Only authorized users', value: 'restricted' }
                        ],
                        default: options?.access || 'public'
                    },
                    {
                        type: 'input',
                        name: 'tag',
                        message: 'Publish tag:',
                        default: options?.tag || 'latest'
                    },
                    {
                        type: 'confirm',
                        name: 'dryRun',
                        message: 'Perform dry run only?',
                        default: options?.dryRun || false
                    }
                ]);

                publishOptions = {
                    registry: answers.registry || undefined,
                    access: answers.access,
                    tag: answers.tag,
                    dryRun: answers.dryRun
                };
            } else {
                // Non-interactive mode
                publishOptions = {
                    registry: options?.registry,
                    access: options?.access || 'public',
                    tag: options?.tag || 'latest',
                    dryRun: options?.dryRun || false
                };
            }

            // Confirm publication unless it's a dry run
            if (!publishOptions.dryRun) {
                const { confirm } = await inquirer.prompt([
                    {
                        type: 'confirm',
                        name: 'confirm',
                        message: `Are you sure you want to publish${publishOptions.registry ? ` to ${publishOptions.registry}` : ''}?`,
                        default: false
                    }
                ]);

                if (!confirm) {
                    console.log(chalk.yellow('Publication cancelled.'));
                    return;
                }
            }

            console.log(chalk.blue(publishOptions.dryRun ? 'Running dry run...' : 'Publishing plugin...'));
            await pluginManager.publishPlugin(publishOptions);

            console.log(chalk.green(`✓ Plugin ${publishOptions.dryRun ? 'dry run completed' : 'published successfully'}!`));
        } catch (error) {
            console.error(chalk.red('Error:'), error instanceof Error ? error.message : 'Unknown error');
            process.exit(1);
        }
    });

