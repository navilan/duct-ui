# Duct

![NPM Version](https://img.shields.io/npm/v/%40duct-ui%2Fcore)

A dom-first, compact user interface library aspiring to have a feature rich set of standard components bundled.

> **⚠️ Under Construction**: This library is currently in early development and may exhibit unexpected behavior. APIs are subject to change and components may not be fully stable. Use with caution in production environments.

## Abstract

Duct: A new UI framework library that wraps over jsx templates and simplifies building
UI components.

## Guiding Aphorisms

1. Don't hide the DOM
2. Little magic, lots of logic
3. Easy Packaging, Simple Reuse

## Goals

* Minimum friction in creating component libraries, distributing and using them
* Ease of use in creating component libraries as part of a pnpm or yarn workspace and using them across applications in the workspace
* Ease of embedding components in other components.
* Clear separation of view code and logic code (as an antithesis to React)
* Simplicity and no leaky abstractions
* Templates are precompiled for speed

## Overall Project structure

* @duct-ui/core: The shared "Duct" runtime
* @duct-ui/components: Core component library bundled with duct
* @duct-ui/demo: Demo project to test / showcase core components
