import type { _SERVICE as HelloBackend } from "../declarations/hello_backend/hello_backend.did.ts";
import { idlFactory } from "../declarations/hello_backend/hello_backend.did.js";
import { project, registryDFXName } from "./config.js";
import { createCLIActor } from "./cli-agent.js";
import { canisterStatus, deploy, DFXError, getCanisterId, topupCanister } from "./dfx.js";
import { errorable } from "./errorable.js";


export async function getRegistryCanisterId(): Promise<string> {
    const path = 'https://raw.githubusercontent.com/suDAO-WCHL/plugin-registry/refs/heads/main/canister_ids.json'
    const response = await fetch(path);
    if (!response.ok) {
        throw new Error('Failed to fetch registry canister id from github repo', {
            cause: response,
        });
    }
    const data = (await response.json()) as { [registryDFXName]: { ic: string } };
    if (!data[registryDFXName] || !data[registryDFXName]['ic']) {
        throw new Error(`Registry DFX ${registryDFXName} not found in github repo's canister_ids.json`);
    }
    return data[registryDFXName]['ic'];
}

export async function autoCreateRegistry() {
    const cwd = project.getSudaoDFXCwd();
    const network = project.getNetwork();
    if (network !== 'local') {
        throw new Error(`Cannot create plugin registry canister in network '${network}'`);
    }
    const canisterId = project.getRegistryCanisterId();
    await deploy(registryDFXName, cwd, {
        "specified-id": project.getRegistryCanisterId(),
    })
    console.log('Registry canister id:', canisterId);
    return canisterId;
}

export async function resetRegistry() {
    const cwd = project.getSudaoDFXCwd();
    const network = project.getNetwork();
    if (network !== 'local') {
        throw new Error(`Cannot reset plugin registry canister in network '${network}'`);
    }
    const canisterId = project.getRegistryCanisterId();
    await deploy(registryDFXName, cwd, {
        mode: 'reinstall',
        "specified-id": canisterId,
    });
}

export function getActor() {
    return createCLIActor<HelloBackend>(idlFactory, registryDFXName, {
        cwd: project.getSudaoDFXCwd(),
        network: project.getNetwork(),
    });
}

export function withRegistryActor(fn: (agent: HelloBackend) => Promise<void>) {
    const actor = getActor();
    return errorable(() => fn(actor));
}

export async function getStatus() {
    return canisterStatus(registryDFXName, project.getSudaoDFXCwd());
}

export async function topupRegistry(amountInT: number = 10) {
    return topupCanister(registryDFXName, amountInT, project.getSudaoDFXCwd());
}

export async function updateRegistry() {
    // TODO: check if a new version is available
    await getRegistryCanisterId();
}