@digitalroute/plutt
===================



[![oclif](https://img.shields.io/badge/cli-oclif-brightgreen.svg)](https://oclif.io)
[![Version](https://img.shields.io/npm/v/@digitalroute/plutt.svg)](https://npmjs.org/package/@digitalroute/plutt)
[![Downloads/week](https://img.shields.io/npm/dw/@digitalroute/plutt.svg)](https://npmjs.org/package/@digitalroute/plutt)
[![License](https://img.shields.io/npm/l/@digitalroute/plutt.svg)](https://github.com/digitalroute/plutt/blob/master/package.json)

<!-- toc -->
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
@digitalroute/plutt/0.0.0 darwin-x64 node-v12.14.1
$ plutt --help [COMMAND]
USAGE
  $ plutt COMMAND
...
```
<!-- usagestop -->
# Commands
<!-- commands -->
* [`plutt hello [FILE]`](#plutt-hello-file)
* [`plutt help [COMMAND]`](#plutt-help-command)

## `plutt hello [FILE]`

describe the command here

```
USAGE
  $ plutt hello [FILE]

OPTIONS
  -f, --force
  -h, --help       show CLI help
  -n, --name=name  name to print

EXAMPLE
  $ plutt hello
  hello world from ./src/hello.ts!
```

_See code: [src/commands/hello.ts](https://github.com/digitalroute/plutt/blob/v0.0.0/src/commands/hello.ts)_

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
