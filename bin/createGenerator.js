#!/usr/bin/env node

const { execSync } = require("child_process");
const path = require("path");
const fs = require("fs");

function init() {
  // check command length
  if (process.argv.length < 3) {
    console.log("You have to provide a name to your app.");
    console.log("For example :");
    console.log("  npx create-reactjs-generator my-app");
    process.exit(1);
  }

  const projectName = process.argv[2];
  const currentPath = process.cwd();
  const projectPath = path.join(currentPath, projectName);

  // create project folder
  try {
    fs.mkdirSync(projectPath);
  } catch (err) {
    if (err.code === "EEXIST") {
      console.log(projectName);
      console.log(
        `The file ${projectName} already exist in the current directory`
      );
    } else {
      console.log(error);
    }
    process.exit(1);
  }

  // copy template to project folder
  console.log("Copy files...");
  execSync(`sudo cp -r ./template/* ${projectPath}`);
  process.chdir(projectPath);

  // install dependencies
  console.log("Installing dependencies...");
  execSync("npm install");

  // The installation is done
  console.log("The installation is done");
  console.log("this is ready to use!");
}

export default { init };