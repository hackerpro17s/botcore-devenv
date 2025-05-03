import path from "path";
import {execSync, spawn, spawnSync} from "child_process";
import {} from "@tenorium/utilslib"
import {runCommand} from "@tenorium/utilslib"

const BOTCORE_PATH = path.join(process.cwd(), 'BotCore')

spawnSync('npm', ['start'], {
    cwd: BOTCORE_PATH,
    stdio: 'inherit'
});