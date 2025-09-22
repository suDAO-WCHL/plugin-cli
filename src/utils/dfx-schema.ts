/**
 * Configurations for a single canister.
 */
export type CanisterConfiguration =
  | RustSpecificProperties
  | AssetSpecificProperties
  | CustomSpecificProperties
  | MotokoSpecificProperties
  | PullSpecificProperties
/**
 * Path of this canister's candid interface declaration.
 */
export type CandidFile = string
/**
 * Name of the Rust crate that compiles to this canister's Wasm. If left unspecified, defaults to the crate with the same name as the package.
 */
export type CrateName = string | null
/**
 * Name of the Rust package that compiles this canister's Wasm.
 */
export type PackageName = string
/**
 * If set to true, does not run `cargo audit` before building.
 */
export type CargoAuditCheck = boolean
/**
 * Commands that are executed in order to produce this canister's assets. Expected to produce assets in one of the paths specified by the 'source' field. Optional if there is no build necessary or the assets can be built using the default `npm run build` command.
 */
export type BuildCommands = SerdeVecFor_String
export type SerdeVecFor_String = string | string[]
/**
 * Folders from which assets are uploaded.
 */
export type AssetSourceFolder = string[]
/**
 * The workspace in package.json that this canister is in, if it is not in the root workspace.
 */
export type NPMWorkspace = string | null
/**
 * Commands that are executed in order to produce this canister's Wasm module. Expected to produce the Wasm in the path specified by the 'wasm' field. No build commands are allowed if the `wasm` field is a URL. These commands are executed in the root of the project.
 */
export type BuildCommands1 = SerdeVecFor_String
/**
 * Path to this canister's candid interface declaration.  A URL to a candid file is also acceptable.
 */
export type CandidFile1 = string
/**
 * Path to Wasm to be installed. URLs to a Wasm module are also acceptable. A canister that has a URL to a Wasm module can not also have `build` steps.
 */
export type WasmPath = string
/**
 * Principal of the canister on the ic network.
 */
export type CanisterID = string
/**
 * The initialization argument for the bitcoin canister.
 */
export type InitializationArgument = string
export type EnableBitcoinAdapter = boolean
/**
 * The logging level of the adapter.
 */
export type LoggingLevel = LoggingLevel1 & LoggingLevel2
export type LoggingLevel1 = BitcoinAdapterLogLevel
/**
 * Represents the log level of the bitcoin adapter.
 */
export type BitcoinAdapterLogLevel =
  | "critical"
  | "error"
  | "warning"
  | "info"
  | "debug"
  | "trace"
export type LoggingLevel2 = string
/**
 * Addresses of nodes to connect to (in case discovery from seeds is not possible/sufficient).
 */
export type AvailableNodes = string[] | null
export type EnableHTTPAdapter = boolean
/**
 * The logging level of the adapter.
 */
export type LoggingLevel3 = LoggingLevel4 & LoggingLevel5
export type LoggingLevel4 = HttpAdapterLogLevel
/**
 * Represents the log level of the HTTP adapter.
 */
export type HttpAdapterLogLevel =
  | "critical"
  | "error"
  | "warning"
  | "info"
  | "debug"
  | "trace"
export type LoggingLevel5 = string
export type ReplicaLogLevel =
  | "critical"
  | "error"
  | "warning"
  | "info"
  | "debug"
  | "trace"
/**
 * Determines the subnet type the replica will run as. Affects things like cycles accounting, message size limits, cycle limits. Defaults to 'application'.
 */
export type SubnetType = ReplicaSubnetType | null
export type ReplicaSubnetType = "system" | "application" | "verifiedapplication"
/**
 * Pins the dfx version for this project.
 */
export type DfxVersion = string | null
export type ConfigNetwork =
  | CustomNetworkConfiguration
  | LocalReplicaConfiguration1
/**
 * Type 'ephemeral' is used for networks that are regularly reset. Type 'persistent' is used for networks that last for a long time and where it is preferred that canister IDs get stored in source control.
 */
export type NetworkType = "ephemeral" | "persistent"
export type Profile = "Debug" | "Release"

export interface DfxJson {
  /**
   * Mapping between canisters and their settings.
   */
  canisters?: {
    [k: string]: CanisterConfiguration
  } | null
  /**
   * Defaults for dfx start.
   */
  defaults?: ConfigDefaults | null
  dfx?: DfxVersion
  /**
   * Mapping between network names and their configurations. Networks 'ic' and 'local' are implicitly defined.
   */
  networks?: {
    [k: string]: ConfigNetwork
  } | null
  /**
   * If set, environment variables will be output to this file (without overwriting any user-defined variables, if the file already exists).
   */
  output_env_file?: string | null
  profile?: Profile | null
  /**
   * Used to keep track of dfx.json versions.
   */
  version?: number | null
  [k: string]: unknown
}
export interface RustSpecificProperties {
  candid: CandidFile
  crate?: CrateName
  package: PackageName
  skip_cargo_audit?: CargoAuditCheck
  type: "rust"
  [k: string]: unknown
}
export interface AssetSpecificProperties {
  build?: BuildCommands
  source: AssetSourceFolder
  type: "assets"
  workspace?: NPMWorkspace
  [k: string]: unknown
}
export interface CustomSpecificProperties {
  build?: BuildCommands1
  candid: CandidFile1
  type: "custom"
  wasm: WasmPath
  [k: string]: unknown
}
export interface MotokoSpecificProperties {
  type: "motoko"
  [k: string]: unknown
}
export interface PullSpecificProperties {
  id: CanisterID
  type: "pull"
  [k: string]: unknown
}
/**
 * Defaults to use on dfx start.
 */
export interface ConfigDefaults {
  bitcoin?: BitcoinAdapterConfiguration | null
  bootstrap?: BootstrapServerConfiguration | null
  build?: BuildProcessConfiguration | null
  canister_http?: HTTPAdapterConfiguration | null
  proxy?: ConfigDefaultsProxy | null
  replica?: LocalReplicaConfiguration | null
  [k: string]: unknown
}
export interface BitcoinAdapterConfiguration {
  canister_init_arg?: InitializationArgument
  enabled?: EnableBitcoinAdapter
  log_level?: LoggingLevel
  nodes?: AvailableNodes
  [k: string]: unknown
}
/**
 * The bootstrap command has been removed.  All of these fields are ignored.
 */
export interface BootstrapServerConfiguration {
  /**
   * Specifies the IP address that the bootstrap server listens on. Defaults to 127.0.0.1.
   */
  ip?: string
  /**
   * Specifies the port number that the bootstrap server listens on. Defaults to 8081.
   */
  port?: number
  /**
   * Specifies the maximum number of seconds that the bootstrap server will wait for upstream requests to complete. Defaults to 30.
   */
  timeout?: number
  [k: string]: unknown
}
export interface BuildProcessConfiguration {
  /**
   * Arguments for packtool.
   */
  args?: string | null
  /**
   * Main command to run the packtool. This command is executed in the root of the project.
   */
  packtool?: string | null
  [k: string]: unknown
}
export interface HTTPAdapterConfiguration {
  enabled?: EnableHTTPAdapter
  log_level?: LoggingLevel3
  [k: string]: unknown
}
/**
 * Configuration for the HTTP gateway.
 */
export interface ConfigDefaultsProxy {
  /**
   * A list of domains that can be served. These are used for canister resolution [default: localhost]
   */
  domain?: SerdeVecFor_String | null
  [k: string]: unknown
}
export interface LocalReplicaConfiguration {
  /**
   * Run replica with the provided log level. Default is 'error'. Debug prints still get displayed
   */
  log_level?: ReplicaLogLevel | null
  /**
   * Port the replica listens on.
   */
  port?: number | null
  subnet_type?: SubnetType
  [k: string]: unknown
}
export interface CustomNetworkConfiguration {
  playground?: PlaygroundConfig | null
  /**
   * The URL(s) this network can be reached at.
   */
  providers: string[]
  /**
   * Persistence type of this network.
   */
  type?: NetworkType & string
  [k: string]: unknown
}
/**
 * Playground config to borrow canister from instead of creating new canisters.
 */
export interface PlaygroundConfig {
  /**
   * Canister ID of the playground canister
   */
  playground_canister: string
  /**
   * How many seconds a canister can be borrowed for
   */
  timeout_seconds?: number
  [k: string]: unknown
}
export interface LocalReplicaConfiguration1 {
  /**
   * Bind address for the webserver. For the shared local network, the default is 127.0.0.1:4943. For project-specific local networks, the default is 127.0.0.1:8000.
   */
  bind?: string | null
  bitcoin?: BitcoinAdapterConfiguration | null
  bootstrap?: BootstrapServerConfiguration | null
  canister_http?: HTTPAdapterConfiguration | null
  playground?: PlaygroundConfig | null
  proxy?: ConfigDefaultsProxy | null
  replica?: LocalReplicaConfiguration | null
  /**
   * Persistence type of this network.
   */
  type?: NetworkType & string
  [k: string]: unknown
}
