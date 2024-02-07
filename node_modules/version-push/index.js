import { promisify } from 'util';
import cp, { execSync } from "child_process";

const exec = promisify(cp.exec);
// const currentPath = process.cwd();
import optionsSeletor from './option-selector.js';

let currentBranch = '';
let error = true;
let remoteRepoAvailable = true;
let oldVersion = false;

/**
 * <-- MAIN FUNCTION -->
 * 1. checks if remote repository is available
 * 2. adds the current branch so that it can be pushed to the branch
 * 3. check if working directory is clear
 * 4. checks if package.json is initialized
 * 5. THEN ONLY IT RUNS THE VERSION SELECTOR 
 */
(async function () {
    let remoteRepo = await exec('git remote -v')
    remoteRepoAvailable = remoteRepo.stdout ? true : false;

    currentBranch = (await exec('git branch --show-current')).stdout
    let data = await exec('(git status --porcelain)')
    error = data.stdout ? true : false

    // if working directory is not clean. then it askd you to add and commit
    if (error) {
        console.error('\n\n\x1b[31mworking directory is not clean please run.\x1b[0m \n\x1b[32mgit add .\x1b[0m \n\x1b[32mgit commit -m <msg>\x1b[0m');
        return;
    }
    oldVersion = (await exec('npm pkg get version')).stdout.slice(1, -2)

    // if package.json is not available then it asks u initialize it first
    if (!oldVersion) {
        console.error('\n\n\x1b[31package.json is not initiated. Please run the below command\x1b[0m \n\n \x1b[32m npm init -y\x1b[0m');
        return;
    }

    optionsSeletor.init()
})();


process.on('exit', async () => {

    let type = optionsSeletor.answer;
    // takes oldversion then changes it to new version
    let currentOldVersion = oldVersion;
    let newVersion = oldVersion && oldVersion.split('.').map((element, index) => {
        if (type === 'major') {
            return index === 0 ? Number(element) + 1 : 0
        }

        else if (type === 'minor' && index > 0) {
            return index === 1 ? Number(element) + 1 : 0;
        }

        else if (type === 'patch' && index > 1) {
            return Number(element) + 1;
        }

        else return element
    }).join('.');

    if (type && currentBranch) {
        execSync(`npm version ${type}`);

        console.log('\n\n' + oldVersion + ' --> ' + newVersion);

        if (!remoteRepoAvailable) {
            console.error('\n\n\x1b[31mRemote Branch not available. \nWill not be able to push the code. \nCheck the availability of branch. \n\n\x1b[33mUse the below command to check if remote branch is added or not\x1b[0m \n\x1b[32m> git remote -v\x1b[0m');
            // return;
        } else {
            let codePushData = execSync(`git push origin ${currentBranch}`);
            console.log(codePushData)
        }
    }
    else if (!type) {
        console.error('\n\n\x1b[31mNo semantic version selector available.\x1b[0m \n\x1b[34mPlease select: <major> <minor> <patch>\x1b[0m')
    }
    else if (!currentBranch) {
        console.log('current branch not available. Please add a commit first.');
    }
    else {
        console.log('please contact the developer. \nError !!')
    }
})
