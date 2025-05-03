import {execSync} from "child_process";

execSync('npm run build', {stdio: 'inherit'})
execSync('npm run botcore:copy', {stdio: 'inherit'})