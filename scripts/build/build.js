import { execSync, spawnSync } from 'child_process'
import { Logger } from '@tenorium/utilslib'
import fs from "fs";
import path from "path";
import * as recast from "recast";

const BUILD_PATH = path.join(process.cwd(), 'build/tsc')
const astTypes = recast.types.namedTypes
/** @type {recast.types.builders} */
const astBuilders = recast.types.builders

const ABSTRACT_MODULE_SPECIFIER_NAME = 'AbstractModule';
const ABSTRACT_MODULE_IMPORT_SOURCE = '@core/moduleSystem/abstractModule.js'
const ABSTRACT_MODULE_SPECIFIER_TYPE = 'ImportDefaultSpecifier'

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

    const moduleContent = fs.readFileSync(modulePath, 'utf8')

    /** @type {astTypes.File} */
    const ast = recast.parse(moduleContent)

    let abstractModuleImported = false

    ast.program.body.forEach((importDeclaration, index) => {
        if (importDeclaration.type !== 'ImportDeclaration') {
            return
        }

        const specifierName = importDeclaration.specifiers[0].local.name
        const specifierType = importDeclaration.specifiers[0].type
        const importSource = importDeclaration.source.value

        if (
            specifierName === ABSTRACT_MODULE_SPECIFIER_NAME &&
            importSource === ABSTRACT_MODULE_IMPORT_SOURCE &&
            specifierType === ABSTRACT_MODULE_SPECIFIER_TYPE
        ) {
            abstractModuleImported = true

            ast.program.body[index] = astBuilders.importDeclaration(
                [
                    astBuilders.importSpecifier(
                        astBuilders.identifier(ABSTRACT_MODULE_SPECIFIER_NAME)
                    )
                ],
                astBuilders.stringLiteral('../../build/dist/botcore.mjs')
            )

            fs.writeFileSync(modulePath, recast.print(ast).code)

            Logger.info(`Module ${module.name} is patched!`)
        }
    })

    if (!abstractModuleImported) {
        Logger.error(`Module ${module.name} doesn't import AbstractModule class or import can't be found! Try using this example: import AbstractModule from "@core/moduleSystem/abstractModule.js";`)
        process.exit(1)
    }
})

Logger.info('Build completed!')
