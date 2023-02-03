# Vidya

Vidya is an unopinionated framework for creating video games with JavaScript.

What this looks like in practice is a CLI for bootstrapping a project with the requisite technologies and a set of commands to scaffold "game objects". The term game object is used loosely here and can be thought of as all the files needed to implement a new object in a game.

## Installation

```
npm install -g vidya
```

## Bootstrap

```
vidya bootstrap <name>
```

## Create

```
vidya create <type> <name>
```

##  Rename

```
vidya rename <type> <old> <new>
```

## Sync

```
vidya sync
```

## Note

This framework was created to solidify the patterns that I've found myself reimplementing ad nauseam throughout the years as a squarely amateur game developer. The primary reason for Vidya's existence is to increase my own productivity.

I'll do my best to keep these docs up to date and maybe add a tutorial or two, but I wouldn't necessarily recommend anyone use Vidya over something like Unity unless you deeply love JavaScript and are willing to put in the time to understand how this framework and the other frameworks it utilizes work together.
