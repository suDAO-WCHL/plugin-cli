import { errorable } from "../utils/errorable.js";
import { autoCreateRegistry, getStatus, resetRegistry, topupRegistry, updateRegistry } from "../utils/registry.js";
import { createCommand } from "../utils/command.js";

export const backendCommand = createCommand('registry')
    .description('Manage plugin registry')
    .addCommand(createCommand('start')
        .description('Start plugin registry, auto create registry if not exists. Only works in local network.')
        .action(errorable(async () => {
            await autoCreateRegistry();
        })))
    .addCommand(createCommand('topup')
        .description('Topup plugin registry. Only works in local network.')
        .argument('<amountInT>', 'Amount in Trillion cycles to topup')
        .action(errorable(async (amountInT: string) => {
            await topupRegistry(Number(amountInT));
        })))
    .addCommand(createCommand('status')
        .description('Check plugin registry status')
        .action(errorable(async () => {
            console.log('Checking plugin registry backend status');
            console.log(await getStatus());
        })))
    .addCommand(createCommand('reset')
        .description('Reset plugin registry. Only works in local network.')
        .action(errorable(async () => {
            await resetRegistry();
        })))
    .addCommand(createCommand('update')
        .description('Update plugin registry binary if a new version is available and restart. Only works in local network.')
        .action(errorable(async () => {
            await updateRegistry();
        })));
