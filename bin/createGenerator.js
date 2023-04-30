#!/usr/bin/env node

const { execSync } = require('child_process');
const path = require('path');
const fs = require('fs');

function init() {
  const startTime = new Date().getTime();
  let useYarn = false;

  // Package manager
  if (process.argv[0] === 'yarn') {
    console.log('Using yarn');
    useYarn = true;
  } else if (process.argv[0] === 'npx') {
    console.log('Using npx');
    useYarn = false;
  } else {
    console.log('Unknown command');
    process.exit(1);
  }

  // Check command length
  if (
    (useYarn && process.argv.length < 4) ||
    (!useYarn && process.argv.length < 3)
  ) {
    console.log('You have to provide a name to your app.');
    console.log('For example :');
    if (useYarn) {
      console.log('  yarn create create-reactjs-generator my-app');
    } else {
      console.log('  npx create-reactjs-generator my-app');
    }
    process.exit(1);
  }

  const projectName = useYarn ? process.argv[3] : process.argv[2];
  const currentPath = process.cwd();
  const projectPath = path.join(currentPath, projectName);
  const baseGitRepo = 'https://github.com/seungdeok/react-templates.git';

  // Create project folder
  try {
    fs.mkdirSync(projectPath);
  } catch (err) {
    if (err.code === 'EEXIST') {
      console.log(projectName);
      console.log(
        `The file ${projectName} already exist in the current directory`,
      );
    } else {
      console.log(error);
    }
    process.exit(1);
  }

  // Copy template to project folder
  try {
    console.log('Copy files...');
    execSync(`git clone --depth=1 ${baseGitRepo} ${projectPath}`);
    process.chdir(projectPath);
  } catch (error) {
    console.error(`Error: Failed to Copy files: ${error.message}`);
    process.exit(1);
  }

  // Remove useless files
  const gitFolder = path.join(projectPath, '.git');
  if (fs.existsSync(gitFolder)) {
    fs.rmdirSync(gitFolder, { recursive: true });
  }

  const binFolder = path.join(projectPath, 'bin');
  if (fs.existsSync(binFolder)) {
    fs.rmdirSync(binFolder, { recursive: true });
  }

  const licenseFile = path.join(projectPath, 'LICENSE');
  if (fs.existsSync(licenseFile)) {
    fs.rmSync(licenseFile, { recursive: true });
  }

  // Update the package.json file with the project name
  try {
    console.log('Update project name');
    const packageFile = path.join(projectPath, 'package.json');
    const packageJson = JSON.parse(fs.readFileSync(packageFile));
    packageJson.name = projectName;

    fs.writeFileSync(packageFile, JSON.stringify(packageJson, null, 2));
  } catch (error) {
    console.error(`Error: Failed to update project name: ${error.message}`);
    process.exit(1);
  }

  // Install dependencies
  console.log('Installing dependencies');
  if (useYarn) {
    execSync('yarn install');
  } else {
    execSync('npm install');
  }

  // The installation is done
  const endTime = new Date().getTime();
  console.log(`The installation is done: ${(endTime - startTime) / 1000}s`);
  console.log('This is ready to use! 🚀');
}

module.exports = { init };
