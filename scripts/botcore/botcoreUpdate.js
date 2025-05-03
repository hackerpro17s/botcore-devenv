import {execSync} from "child_process";
import path from "path";
import {Logger} from "@tenorium/utilslib";

const CHECKOUT_COMMIT = '8ac09968686767360e08a16648e8c650eb8019a2'

const BOTCORE_PATH = path.join(process.cwd(), 'BotCore')

execSync(`git clean -f`, {
    cwd: BOTCORE_PATH
})

Logger.info(`Fetching remote of BotCore repository`)

execSync(`git fetch`, {
    cwd: BOTCORE_PATH
})

Logger.info(`Checking out commit ${CHECKOUT_COMMIT} of BotCore repository`)

execSync(`git checkout -f ${CHECKOUT_COMMIT}` , {
    cwd: BOTCORE_PATH
})

Logger.info('Installing node.js dependencies')

execSync('npm i', {
    cwd: BOTCORE_PATH
})

Logger.info('Starting build of BotCore')

try {
    execSync(`npm run build`, {
        cwd: BOTCORE_PATH
    })
} catch (e) {
    console.log(e.stdout.toString())
}
