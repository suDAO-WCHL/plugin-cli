import { exec, spawn, spawnSync } from "child_process";

import { project } from "./config.js";

interface GlobalArgs {
    network?: string;
    cwd?: string;
}

const globalArgs: (keyof GlobalArgs)[] = ['cwd'];

type Args = GlobalArgs & Record<string, string | undefined>;

function buildArgs(opts: Args) {
    return Object.entries(opts)
        .filter(([key, value]) => value !== undefined && value !== '' && !globalArgs.includes(key as keyof GlobalArgs))
        .flatMap(([key, value]) => [`--${key}`, value!]);
}

const decoder = new TextDecoder();

export class DFXError extends Error {
    dfxMessage: string;
    constructor(userMessage: string, dfxMessage: string, cause?: any) {
        super(userMessage, { cause });
        this.dfxMessage = dfxMessage;
    }

    getDfxMessage() {
        return this.dfxMessage;
    }
}

export const spawnDFX = (cmd: string[], opts: Args = {}, input?: any): Promise<string> => {
    if (!opts.cwd) {
        opts.cwd = project.getSudaoDFXCwd();
    }
    if (!opts.network) {
        opts.network = project.getNetwork();
    }
    return new Promise((resolve, reject) => {
        const child = spawn('dfx', [...cmd, ...buildArgs(opts)], { cwd: opts.cwd });

        child.on('error', (error) => {
            reject(new DFXError('Failed to spawn dfx', error.message, error));
        });

        child.stdin.end(input);

        const outputChunks: string[] = [];
        const errorChunks: string[] = [];

        child.stdout.on('data', (data) => {
            outputChunks.push(decoder.decode(data));
        });

        child.stderr.on('data', (data) => {
            const err = decoder.decode(data);
            errorChunks.push(err);
            console.error(err);
        });

        child.on('close', (code) => {
            if (code !== 0) {
                return reject(new DFXError(`Error while running dfx (code: ${code})`, errorChunks.join('')));
            }
            const res = outputChunks.join('');
            resolve(res);
        });
    });
}

export function getCanisterId(canister: string, cwd: string = '.') {
    return spawnDFX(['canister', 'id', canister], { cwd });
}

// if canister is empty string, it will generate binding for all canisters
export function generateBinding(canister: string = '', cwd: string = '.') {
    return spawnDFX(['generate', canister], { cwd });
}

interface DeployOptions {
    'specified-id'?: string;
    mode?: 'install' | 'reinstall' | 'upgrade' | 'auto';
    'argument-type'?: 'raw' | 'idl';
    'argument-file'?: string | '-';
    argument?: string;
    [key: string]: string | undefined;
}

export function deploy(canister: string, cwd: string = '.', opts: DeployOptions = {}) {
    return spawnDFX(['deploy', canister, '-y'], {
        cwd,
        ...opts,
    });
}

export function canisterStatus(canister: string, cwd: string = '.') {
    return spawnDFX(['canister', 'status', canister], {
        cwd,
    });
}

export function topupCanister(canister: string, amountInT: number, cwd: string = '.') {
    return spawnDFX(['ledger', 'fabricate-cycles'], {
        cwd,
        t: amountInT.toString(),
        canister,
    });
}
