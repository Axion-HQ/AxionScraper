import chalk, { Chalk } from "chalk";

const chalkConfig = new Chalk({
    level: 3,
});

export {
    chalkConfig,
    chalkConfig as default
}