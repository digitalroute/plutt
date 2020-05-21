# <img src="images/logo.png" title="Plutt" alt="Plutt logo" width="530">

[![Version](https://img.shields.io/npm/v/@digitalroute/plutt.svg)](https://npmjs.org/package/@digitalroute/plutt)
[![Downloads/week](https://img.shields.io/npm/dw/@digitalroute/plutt.svg)](https://npmjs.org/package/@digitalroute/plutt)
[![License](https://img.shields.io/npm/l/@digitalroute/plutt.svg)](https://github.com/digitalroute/plutt/blob/master/package.json)

Plutt is a build tool that enables developers to generate micro frontends from framework native components and to serve them version safely. The micro frontends are automatically safe to use in production if they work during development.

## Features

- **Access transparency:** Consuming applications use the micro frontends as regular components, without having to know that it is a micro frontend.
- **Automatic Version Safety:** At run-time Plutt will always upgrade to the latest version of a micro frontend, as long as it is non-breaking. This is done by supporting lock-step deployments.
- **Framework Agnostic:** Plutt applications can be consumed by any framework. Currently Plutt supports React and Vue, but it is easy to extend Plutt to support more frameworks.
- **Type Safety:** Micro frontends can be consumed with type safety. Any props that are used incorrectly can be found at compile-time.

## Table of Contents

<!-- toc -->
* [<img src="images/logo.png" title="Plutt" alt="Plutt logo" width="530">](#img-srcimageslogopng-titleplutt-altplutt-logo-width530)
<!-- tocstop -->

## Usage

<!-- usage -->
```sh-session
$ npm install -g @digitalroute/plutt
$ plutt COMMAND
running command...
$ plutt (-v|--version|version)
@digitalroute/plutt/0.0.0-semantically-released darwin-x64 node-v13.10.1
$ plutt --help [COMMAND]
USAGE
  $ plutt COMMAND
...
```
<!-- usagestop -->

## Commands

<!-- commands -->
* [`plutt build`](#plutt-build)
* [`plutt help [COMMAND]`](#plutt-help-command)
* [`plutt serve [DIRECTORY]`](#plutt-serve-directory)

## `plutt build`

Build a plutt app.

```
USAGE
  $ plutt build

OPTIONS
  -s, --sourceDirectory=sourceDirectory  [default: src] Source directory for the plutt app.
  -v, --verbose                          Prints extra information. Useful for debuging.

DESCRIPTION
  Build a plutt app.

  Make sure that there exists a src/ directory with an index.js.
```

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

## `plutt serve [DIRECTORY]`

Serve a plutt app.

```
USAGE
  $ plutt serve [DIRECTORY]

ARGUMENTS
  DIRECTORY  [default: .] Directory to serve plutt apps from

OPTIONS
  -p, --port=port  [default: 5000] Port used to serve plutt app
```
<!-- commandsstop -->

## How does it work?
