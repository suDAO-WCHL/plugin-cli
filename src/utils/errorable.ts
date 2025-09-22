import { join } from "path";
import fs from "fs";
import { project } from "./config.js";
import { format } from "util";

export function errorable<T>(fn: (...args: any[]) => Promise<T>): (...args: any[]) => Promise<T> {
    return async (...args: any[]) => {
        try {
            return await fn(...args);
        } catch (error) {
            console.error(error instanceof Error ? error.message : 'unknown error');
            const cwd = project.getSudaoDFXCwd();
            fs.mkdirSync(cwd, { recursive: true });
            fs.writeFileSync(join(cwd, 'error.log'), format(error));
            process.exit(1);
        }
    };
}