import type { ActorMethod, ActorSubclass } from "@icp-sdk/core/agent";
import { IDL } from "@icp-sdk/core/candid";
import { spawn } from "child_process";
import { spawnDFX } from "./dfx.js";

export interface CanisterActorCLIInitArgs {
    cwd?: string;
    network?: string;
}

class CanisterActorCLI {
    [x: string]: Omit<ActorMethod, 'withOptions'>;
    constructor(idlFactory: IDL.InterfaceFactory, canisterName: string, initArgs: CanisterActorCLIInitArgs) {
        const service = idlFactory({ IDL });
        const { cwd = '.', network = 'local' } = initArgs;
        for (const [methodName, func] of service._fields) {
            this[methodName] = _createActorMethod(canisterName, methodName, func, {
                cwd,
                network,
            });
        }
    }
}

function _createActorMethod(
    canisterName: string,
    methodName: string,
    func: IDL.FuncClass,
    initArgs: Required<CanisterActorCLIInitArgs>,
): Omit<ActorMethod, 'withOptions'> {
    return async (...args: unknown[]) => {
        const idlArg = IDL.encode(func.argTypes, args);
        const result = await spawnDFX(['canister', 'call', canisterName, methodName], {
            cwd: initArgs.cwd,
            network: initArgs.network,
            'argument-file': '-',
            'type': 'raw',
            'output': 'raw',
        }, Buffer.from(idlArg).toString('hex'));
        return IDL.decode(func.retTypes, Uint8Array.from(Buffer.from(result, 'hex')));
    };
};

export function createCLIActor<T>(
    idlFactory: IDL.InterfaceFactory,
    canisterName: string,
    initArgs: CanisterActorCLIInitArgs,
): ActorSubclass<T> {
    return new CanisterActorCLI(idlFactory, canisterName, initArgs) as ActorSubclass<T>;
};
