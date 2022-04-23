#! /usr/bin/env node --experimental-specifier-resolution=node

import { Command } from "commander";
import startServer from "./main.js";

const program = new Command();

program
  .command("start")
  .description("Start a openci server")
  .action(() => {
    startServer();
  })

program.version("0.1.0");
program.parse();
