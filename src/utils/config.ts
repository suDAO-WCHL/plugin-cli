import fs from 'fs';
import { dirname, join } from 'path';
import { DfxJson } from './dfx-schema.js';

const defaultRegistryCanisterId = 'pspuk-dyaaa-aaaao-qkg3q-cai';
export const registryDFXName = 'plugin-registry-backend'

// we'll lock plugin-registry-backend version

export const defaultDFXSudaoCwd = '.sudao';
const defaultDFXFile = 'dfx.json';
const defaultDFXSudaoConfig: DfxJson = {
    canisters: {
        [registryDFXName]: {
            type: 'custom',
            candid: '.sudao/candid/plugin-registry-backend.did', // TODO: add path to candid
            wasm: '.sudao/wasm/plugin-registry-backend.wasm', // TODO: add path to wasm
            remote: {
                id: {
                    ic: defaultRegistryCanisterId,
                },
            },
        }
    },
    version: 1,
    output_env_file: '.env'
}

interface PluginConfig {
    version: number;
    title: string;
    description: string;
    author: string;
    dependencies: string[];
    canisters: Record<string, {
        src?: string;
    }>;
}

export interface PluginJson {
    plugins: Record<string, PluginConfig>;
}
const defaultPluginConfigPath = 'sudao.json';
const defaultPluginConfig: PluginJson = {
    plugins: {
        'plugin-example': {
            version: 1,
            title: "Plugin Template",
            description: "A plugin example",
            author: "suDAO Developers",
            dependencies: [
                "plugin-example:wowie@1"
            ],
            canisters: {
                wowie: {
                    src: "https://esm.run/plugin-template@1.0.0"
                },
                ledger: {}
            }
        }
    }
}

function readJSONConfig<T>(path: string, data?: T): T {
    if (!fs.existsSync(path)) {
        if (!data) {
            throw new Error(`Missing ${path}, please initialize this project first with \`dfx new\` and/or \`sudao init\`.`);
        }
        fs.mkdirSync(dirname(path), { recursive: true });
        fs.writeFileSync(path, JSON.stringify(data, null, 2));
        return data;
    } else {
        return JSON.parse(fs.readFileSync(path, 'utf8')) as T;
    }
}

function writeJSONConfig<T>(path: string, data: T) {
    fs.mkdirSync(dirname(path), { recursive: true });
    fs.writeFileSync(path, JSON.stringify(data, null, 2));
}

export class Project {
    private network: string;
    private pluginDFXConfig?: DfxJson;
    private pluginDFXConfigPath: string;
    private pluginConfig?: PluginJson;
    private pluginConfigPath: string;
    private sudaoDFXConfig?: DfxJson;
    private sudaoDFXCwd: string;
    constructor() {
        this.network = 'local';
        this.pluginConfigPath = defaultPluginConfigPath;
        this.pluginDFXConfigPath = defaultDFXFile;
        this.sudaoDFXCwd = defaultDFXSudaoCwd;
    }
    public load(autoInit: boolean = false, initArgs?: { configPath?: string, sudaoDirPath?: string, network?: string }) {
        this.pluginConfigPath = initArgs?.configPath ?? this.pluginConfigPath;
        this.sudaoDFXCwd = initArgs?.sudaoDirPath ?? this.sudaoDFXCwd;
        this.network = initArgs?.network ?? this.network;
        if (!autoInit) {
            this.pluginDFXConfig = readJSONConfig(defaultDFXFile);
            this.pluginConfig = readJSONConfig(this.pluginConfigPath);
            this.sudaoDFXConfig = readJSONConfig(join(this.sudaoDFXCwd, defaultDFXFile), defaultDFXSudaoConfig);
        } else {
            this.init();
        }
    }
    public getNetwork() {
        return this.network;
    }
    public getSudaoDFXCwd() {
        return this.sudaoDFXCwd;
    }
    public getSudaoDFXConfig() {
        return this.sudaoDFXConfig;
    }
    public getPluginConfig() {
        return this.pluginConfig;
    }
    public getPluginDFXConfig() {
        return this.pluginDFXConfig;
    }
    public sync() {
        // TODO: synchronize configs
    }
    public getRegistryCanisterId() {
        const remote = this.sudaoDFXConfig?.canisters?.[registryDFXName]?.remote as { id?: { ic?: string } } | undefined;
        const canId = remote?.id?.ic
        if (canId === undefined) {
            throw new Error(`Missing canister ${registryDFXName} entry or remote id. Please run \`sudao registry update\` to fix.`)
        }
        return canId;
    }
    public init() {
        this.pluginDFXConfig = readJSONConfig(defaultDFXFile);
        if (fs.existsSync(this.pluginConfigPath)) {
            throw new Error(`${this.pluginConfigPath} already exists. Is this an already initialized suDAO project?`);
        } else {
            this.pluginConfig = defaultPluginConfig;
        }
        this.sudaoDFXConfig = readJSONConfig(join(this.sudaoDFXCwd, defaultDFXFile), defaultDFXSudaoConfig);
        this.save(['pluginConfig']);
    }
    public save(fileTypes: ('sudaoDFX' | 'pluginDFX' | 'pluginConfig')[]) {
        if (fileTypes.includes('sudaoDFX')) {
            writeJSONConfig(join(this.sudaoDFXCwd, defaultDFXFile), this.sudaoDFXConfig);
        }
        if (fileTypes.includes('pluginDFX')) {
            writeJSONConfig(defaultDFXFile, this.pluginDFXConfig);
        }
        if (fileTypes.includes('pluginConfig')) {
            writeJSONConfig(this.pluginConfigPath, this.pluginConfig);
        }
    }
}

export const project = new Project();
