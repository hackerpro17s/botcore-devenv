import { execSync, spawnSync } from 'child_process'
import { Logger } from '@tenorium/utilslib'
import fs from "fs";
import path from "path";

const BUILD_PATH = path.join(process.cwd(), 'build/tsc')

execSync('npm run build:clean',  { stdio: 'inherit' })

Logger.info('Compiling TypeScript...')

const result = spawnSync('npx', 'tsc --build --verbose'.split(' '), { stdio: 'inherit' })

if (result.status !== 0) {
    Logger.error('Compilation failed!')
    process.exit(result.status)
}

Logger.info('Checking import of AbstractModule class...')

const modules = fs.readdirSync(BUILD_PATH, {
    withFileTypes: true
})
modules.forEach(module => {
    if (!module.isDirectory()) {
        return
    }

    const modulePath = path.join(BUILD_PATH, module.name, `${module.name}.js`)

    let moduleContent = fs.readFileSync(modulePath, 'utf8')

    if (!moduleContent.includes('import AbstractModule from "@core/moduleSystem/abstractModule.js";')) {
        Logger.error(`Module ${module.name} doesn't import AbstractModule class or import can't be found! Try using this example: import AbstractModule from "@core/moduleSystem/abstractModule.js";`)
        process.exit(1)
    }

    moduleContent = moduleContent.replace('import AbstractModule from "@core/moduleSystem/abstractModule.js";', 'import { AbstractModule } from "../../build/dist/botcore.mjs";')

    fs.writeFileSync(modulePath, moduleContent)
    Logger.info(`Module ${module.name} is patched!`)
})

Logger.info('Build completed!')
