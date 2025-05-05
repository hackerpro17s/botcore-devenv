import {execSync} from "child_process";
import path from "path";
import {Logger} from "@tenorium/utilslib";

const CHECKOUT_COMMIT = 'c277fb7b3a2bc430bbfb29118dd2a33644a69035'

const BOTCORE_PATH = path.join(process.cwd(), 'BotCore')

execSync(`git submodule update --init`)

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
