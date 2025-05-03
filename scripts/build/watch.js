import fs from "fs";
import {Logger} from "@tenorium/utilslib";
import {spawnSync} from "child_process";

let lastTime = Date.now()
let timer = null

function canBuild()
{
    const now = Date.now()
    const diff = now - lastTime
    lastTime = now

    return diff > 3000
}

const fsWatcher = fs.watch("./src", {
    recursive: true
}, (eventType) => {
    if (eventType === 'change') {
        if (!timer) {
            timer = setTimeout(() => {
                if (canBuild()) {
                    Logger.info('File changed, rebuilding...')
                    spawnSync('npm', ['run', 'deploy'], {
                        stdio: 'inherit'
                    })
                }

                clearInterval(timer)
                timer = null
            }, 1000)
        }
    }
})

fsWatcher.on('error', (err) => {
    if (err.code === 'ENOENT') {
        return
    }

    console.error(err)
})

Logger.info('Watching for file changes...')