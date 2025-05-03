import path from "path";
import {spawnSync} from "child_process";

const BOTCORE_PATH = path.join(process.cwd(), 'BotCore')

spawnSync('npm', ['start'], {
    cwd: BOTCORE_PATH,
    stdio: 'inherit'
});