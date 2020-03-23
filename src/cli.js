import arg from "arg";
import inquirer from "inquirer";
import {crud, create} from "./spring";

function parseArgumentsIntoOptions(rawArgs) {
    const args = arg({
        "--name": String,
        "--dependencies": String,
        "--git": Boolean,
        "-n": "--name",
        "-d": "--dependencies",
        "-g": "--git"
    }, {
        argv: rawArgs.slice(2)
    });

    return {
        cli: args._[0] || null,
        option: args._[1] || null,
        name: args["--name"] || null,
        dependencies: args["--dependencies"] || null,
        git: args["--git"] || false
    }
}

async function promptForMissingOptions(options) {

    const questions = [];

    const defaultCli = "React";
    if (!options.cli) {
        questions.push({
            type: "list",
            name: "cli",
            message: "Please choose which CLI to use",
            choices: ["react", "spring"],
            default: defaultCli
        });
    }

    const defaultOption = "create";
    if (!options.option) {
        questions.push({
            type: "list",
            name: "option",
            message: "Please choose which option to do",
            choices: ["create", "crud"],
            default: defaultCli
        });
    }

    if (!options.name) {
        questions.push({
            type: "input",
            name: "name",
            message: "Enter the name",
            validate: function (name) {
                if (name) {
                    return true;
                }
                return "Name is required";
            }
        });
    }

    const answers = await inquirer.prompt(questions);

    return {
        ...options,
        cli: options.cli || answers.cli,
        option: options.option || answers.option,
        name: options.name || answers.name
    };
}

export async function cli(args) {
    let options = parseArgumentsIntoOptions(args);
    options = await promptForMissingOptions(options);
    const {cli, option} = options;

    if (["spring", "s"].includes(cli) && ["create", "c"].includes(option)) {
        await create(options);
    }

    if (["spring", "s"].includes(cli) && ["crud", "cr"].includes(option)) {
        await crud(options);
    }
}