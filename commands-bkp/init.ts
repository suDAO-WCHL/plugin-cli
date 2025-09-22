import { Command } from 'commander';
import inquirer from 'inquirer';
import chalk from 'chalk';
import { PluginManager } from '@sudao-wchl/plugin-core';
import type { InitOptions } from '@sudao-wchl/plugin-core';

export const initPluginCommand = new Command('init')
    .description('Initialize plugin in current directory')
    .option('-f, --force', 'Overwrite existing files')
    .option('-t, --template <template>', 'Template to use (component|service|utility)', 'component')
    .option('--interactive', 'Run in interactive mode')
    .action(async (options?: any) => {
        try {
            const pluginManager = new PluginManager();
            let initOptions: InitOptions;

            if (options?.interactive) {
                // Interactive mode
                const answers = await inquirer.prompt([
                    {
                        type: 'list',
                        name: 'template',
                        message: 'Plugin type:',
                        choices: [
                            { name: 'Component - React component plugin', value: 'component' },
                            { name: 'Service - API/service plugin', value: 'service' },
                            { name: 'Utility - Helper functions plugin', value: 'utility' }
                        ],
                        default: options?.template || 'component'
                    },
                    {
                        type: 'confirm',
                        name: 'force',
                        message: 'Overwrite existing files?',
                        default: options?.force || false,
                        when: () => {
                            // Only ask if package.json exists
                            return require('fs').existsSync('./package.json');
                        }
                    }
                ]);

                initOptions = {
                    template: answers.template,
                    force: answers.force
                };
            } else {
                // Non-interactive mode
                initOptions = {
                    template: options?.template || 'component',
                    force: options?.force || false
                };
            }

            console.log(chalk.blue('Initializing plugin...'));
            await pluginManager.initPlugin(initOptions);

            console.log(chalk.green('✓ Plugin initialized successfully!'));
            console.log(chalk.gray('Next steps:'));
            console.log(chalk.gray('  npm install'));
            console.log(chalk.gray('  npm run build'));
        } catch (error) {
            console.error(chalk.red('Error:'), error instanceof Error ? error.message : 'Unknown error');
            process.exit(1);
        }
    });

