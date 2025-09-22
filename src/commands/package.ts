import { createCommand } from "../utils/command.js";
import { getActor, withRegistryActor } from "../utils/registry.js";

export const publishCommand = createCommand('publish')
    .description('Publish suDAO plugin to registry')
    .action(withRegistryActor(async (actor) => {
        console.log(await actor.greet('hi!'));
    }));

