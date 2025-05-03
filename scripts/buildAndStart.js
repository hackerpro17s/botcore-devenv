import {execSync} from "child_process";

execSync('npm run build', {stdio: 'inherit'})
execSync('npm run copy', {stdio: 'inherit'})
execSync('npm start', {stdio: 'inherit'})