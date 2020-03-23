import chalk from "chalk";
import fs from "fs";
import path from "path";
import {promisify} from "util";
import {copyTemplateFiles} from "./utils/files";
import execa from "execa";
import Listr from "listr";

const access = promisify(fs.access);

export async function create(options) {
    const tasks = new Listr([
        {
            title: "Initialize Spring",
            task: () => initSpring(options)
        },
        // {
        //     title: "Initialize Git",
        //     task: () => initGit(options),
        //     enabled: options.git
        // }
    ]);

    await tasks.run();
    console.log("%s Spring project created successfully!", chalk.green.bold("DONE"));

    return true;
}

export async function crud(options) {
    const folderNames = process.cwd().split("/");
    const folderName = folderNames[folderNames.length -1];

    options = {
        ...options,
        targetDirectory: options.targetDirectory || `${process.cwd()}/src/main/java/com/example/${folderName}/`
    };

    const currentFileUrl = import.meta.url;
    const templateDir = path.resolve(
        new URL(currentFileUrl).pathname,
        "../../templates",
        `${options.cli.toLowerCase()}/crud`
    );
    options.templateDirectory = templateDir;

    try {
        await access(templateDir, fs.constants.R_OK);
    } catch (err) {
        console.error("%s Invalid template name", chalk.red.bold("ERROR"));
        process.exit(1);
    }


    const tasks = new Listr([
        // {
        //     title: "Ckeck folders structure",
        //     task: () => createFoldersCrud(options)
        // },
        {
            title: "Create files",
            task: () => copyTemplateFiles(options)
        }
    ]);

    await tasks.run();
    console.log("%s Spring Crud created successfully!", chalk.green.bold("DONE"));

    return true;
}

async function initSpring(options) {
    // spring init --name=api --dependencies=web,sqlserver,data-jpa api
    console.log(options)
    const result = await execa("spring", [
        "init",
        `--name=${options.name}`,
        "--dependencies=web,sqlserver,data-jpa",
        options.name
    ], {
        cwd: options.targetDirectory
    });

    if (result.failed) {
        return Promise.reject(new Error("Failed to initialize Spring"));
    }

    return;
}

async function initGit(options) {
    // git init
    const result = await execa("git", ["init"], {
        cwd: `${options.targetDirectory}/${options.name}`
    });

    if (result.failed) {
        return Promise.reject(new Error("Failed to initialize Git"));
    }

    return;
}

async function createFoldersCrud(options) {
    // mkdir -p src/main/java/com/example/api/{controller,domain,repository,service}
    const result = await execa("mkdir", [
        "-p",
        `src/main/java/com/example/${options.name}/{controller,domain,repository,service}`
    ], {
        cwd: `${options.targetDirectory}`
    });

    if (result.failed) {
        return Promise.reject(new Error("Failed to initialize Git"));
    }

    return;
}