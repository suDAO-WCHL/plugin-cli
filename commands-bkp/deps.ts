import { Command } from 'commander';
import inquirer from 'inquirer';
import chalk from 'chalk';
import { PluginManager } from '@sudao-wchl/plugin-core';
import type { DepsOptions } from '@sudao-wchl/plugin-core';

export const depsCommand = new Command('deps')
    .description('Manage plugin dependencies')
    .option('-i, --install', 'Install dependencies')
    .option('-u, --update', 'Update dependencies')
    .option('-c, --clean', 'Clean and reinstall dependencies')
    .option('--interactive', 'Run in interactive mode')
    .action(async (options?: any) => {
        try {
            const pluginManager = new PluginManager();
            let depsOptions: DepsOptions;

            if (options?.interactive) {
                // Interactive mode
                const answers = await inquirer.prompt([
                    {
                        type: 'checkbox',
                        name: 'actions',
                        message: 'Select actions to perform:',
                        choices: [
                            { name: 'Clean node_modules and package-lock.json', value: 'clean' },
                            { name: 'Install dependencies', value: 'install' },
                            { name: 'Update dependencies', value: 'update' }
                        ],
                        validate: (input: string[]) => {
                            if (input.length === 0) {
                                return 'Please select at least one action';
                            }
                            return true;
                        }
                    }
                ]);

                depsOptions = {
                    clean: answers.actions.includes('clean'),
                    install: answers.actions.includes('install'),
                    update: answers.actions.includes('update')
                };
            } else {
                // Non-interactive mode
                // If no options provided, default to install
                const hasOptions = options?.install || options?.update || options?.clean;

                depsOptions = {
                    install: options?.install || !hasOptions,
                    update: options?.update || false,
                    clean: options?.clean || false
                };
            }

            // Warn about clean operation
            if (depsOptions.clean) {
                const { confirm } = await inquirer.prompt([
                    {
                        type: 'confirm',
                        name: 'confirm',
                        message: 'This will delete node_modules and package-lock.json. Continue?',
                        default: false
                    }
                ]);

                if (!confirm) {
                    console.log(chalk.yellow('Operation cancelled.'));
                    return;
                }
            }

            console.log(chalk.blue('Managing dependencies...'));
            await pluginManager.manageDeps(depsOptions);

            console.log(chalk.green('✓ Dependencies managed successfully!'));
        } catch (error) {
            console.error(chalk.red('Error:'), error instanceof Error ? error.message : 'Unknown error');
            process.exit(1);
        }
    });

