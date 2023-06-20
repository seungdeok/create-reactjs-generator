#!/usr/bin/env node

const { program } = require('commander');
const { execSync } = require('child_process');
const path = require('path');
const fs = require('fs');
const packageJsonFile = require('../package.json');

function copyRepo(projectName) {
  const startTime = new Date().getTime();
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
  execSync('npm install');

  // The installation is done
  const endTime = new Date().getTime();
  console.log(`The installation is done: ${(endTime - startTime) / 1000}s`);
  console.log('This is ready to use! 🚀');
}

function init() {
  program
    .version(packageJsonFile.version, '-v, --version')
    .name(packageJsonFile.name);

  program
    .usage('<projectname>  --template [template]')
    .description('Create Template')
    .option('-t, --template [template]', '템플릿명을 입력하세요', 'react')
    .arguments('<projectname>')
    .action((projectName) => {
      const { template } = program.opts();
      const args = process.argv.slice(2);

      if (args.length > 1) {
        console.log('Unknown command');
        program.help();
        return;
      }

      console.log('Project Name:', projectName);
      console.log('Template:', template);
      copyRepo(projectName);
    });

  program.parse(process.argv);
}

module.exports = { init };
