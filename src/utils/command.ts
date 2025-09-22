import { Command } from "commander";

export const createCommand = (name?: string) => {
    return new Command(name).configureHelp({ showGlobalOptions: true })
}
