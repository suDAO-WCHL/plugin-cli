#!/usr/bin/env node

/**
 * CLI entry point for suDAO plugin management
 */

import { Command, Option } from 'commander';
import { backendCommand } from './commands/registry.js';
import { initCommand } from './commands/bootstrap.js';
import { project } from './utils/config.js';
import { errorable } from './utils/errorable.js';
import { publishCommand } from './commands/package.js';

const program = new Command()
    .name('sudao')
    .description('CLI tool for managing suDAO plugins')
    .version('0.0.1')
    .configureHelp({ showGlobalOptions: true })
    .addOption(new Option('-n, --network <network>', 'Network to use').default('local'))
    .addOption(new Option('--ic', 'Alias for --network ic').implies({ network: 'ic' }))
    .addOption(new Option('--local', 'Alias for --network local').implies({ network: 'local' }))
    .addOption(new Option('--dir <cwd>', 'Working directory for suDAO dfx project').default('.sudao'))
    .addOption(new Option('--config <config>', 'Path to suDAO config file').default('sudao.json'))
    .hook('preAction', errorable(async (command, actionCmd) => {
        const opts = command.optsWithGlobals();
        project.load(actionCmd.name() === 'init', {
            network: opts.network,
            sudaoDirPath: opts.dir,
            configPath: opts.config,
        });
    }));

const addCommand = (cmd: Command) => {
    program.addCommand(cmd.configureHelp({ showGlobalOptions: true }));
};

addCommand(backendCommand);
addCommand(initCommand);
addCommand(publishCommand);

// Parse command line arguments
program.parse(process.argv);
