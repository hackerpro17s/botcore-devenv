import fs, {cpSync, existsSync, readdirSync} from 'fs'
import path from "path";
import {Logger} from "@tenorium/utilslib";

const BUILD_PATH = path.join(process.cwd(), 'build/tsc')
const MODULES_PATH = path.join(process.cwd(), 'BotCore/modules')

if (!existsSync(BUILD_PATH)) {
    Logger.warning('Build directory doesn\'t exist!')
    process.exit(1)
}

const moduleFolders = readdirSync(BUILD_PATH)

if (!moduleFolders.length) {
    Logger.warning('Build directory is empty!')
    process.exit(1)
}

Logger.info('Removing all modules from BotCore installation')

readdirSync(
    MODULES_PATH,
    {
        withFileTypes: true
    }
).forEach(dirContent => {
    if (!dirContent.isDirectory()) {
        return
    }

    Logger.info(`Removing module ${dirContent.name}`)
    fs.rmSync(dirContent.parentPath, {
        recursive: true
    })
})

Logger.info('Copying module files to BotCore installation')

cpSync(BUILD_PATH, MODULES_PATH, {
    recursive: true
})

Logger.info('Copying module files to BotCore installation was finished!')
