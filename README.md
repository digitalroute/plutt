# @digitalroute/plutt

[![oclif](https://img.shields.io/badge/cli-oclif-brightgreen.svg)](https://oclif.io)
[![Version](https://img.shields.io/npm/v/@digitalroute/plutt.svg)](https://npmjs.org/package/@digitalroute/plutt)
[![Downloads/week](https://img.shields.io/npm/dw/@digitalroute/plutt.svg)](https://npmjs.org/package/@digitalroute/plutt)
[![License](https://img.shields.io/npm/l/@digitalroute/plutt.svg)](https://github.com/digitalroute/plutt/blob/master/package.json)

<!-- toc -->
* [@digitalroute/plutt](#digitalrouteplutt)
* [Usage](#usage)
* [Commands](#commands)
<!-- tocstop -->

# Usage

<!-- usage -->
```sh-session
$ npm install -g @digitalroute/plutt
$ plutt COMMAND
running command...
$ plutt (-v|--version|version)
@digitalroute/plutt/1.0.0-beta.1 linux-x64 node-v12.14.1
$ plutt --help [COMMAND]
USAGE
  $ plutt COMMAND
...
```
<!-- usagestop -->

# Commands

<!-- commands -->
* [`plutt build`](#plutt-build)
* [`plutt help [COMMAND]`](#plutt-help-command)

## `plutt build`

Build a plutt project

```
USAGE
  $ plutt build

DESCRIPTION
  Build a plutt project

  Make sure that there exists a src/ directory with an index.js
```

_See code: [src/commands/build.ts](https://github.com/digitalroute/plutt/blob/v1.0.0-beta.1/src/commands/build.ts)_

## `plutt help [COMMAND]`

display help for plutt

```
USAGE
  $ plutt help [COMMAND]

ARGUMENTS
  COMMAND  command to show help for

OPTIONS
  --all  see all commands in CLI
```

_See code: [@oclif/plugin-help](https://github.com/oclif/plugin-help/blob/v2.2.3/src/commands/help.ts)_
<!-- commandsstop -->
