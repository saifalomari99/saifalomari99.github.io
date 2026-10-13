---
title: "RTLStation: RTL Development IDE"
tagline: "A project-aware Windows IDE for Verilog, SystemVerilog, and VHDL with static analysis, hierarchy elaboration, and design visualization."
summary: "RTLStation is a desktop IDE for RTL development that I built from concept to release through Habaka Semiconductor Solutions. It indexes a whole HDL project, runs 386 standards-mapped diagnostics, checks FPGA constraints against the elaborated design, and generates FSM diagrams and documentation, all fully offline."
category: software
tags: [fpga-rtl]
tech: ["Verilog", "SystemVerilog", "VHDL", "XDC / SDC", "IEEE 1364-2005", "IEEE 1800-2023", "Windows"]
type: professional
tier: featured
order: 20
dates:
  start: "2026-06"
  end: "present"
affiliation: "Habaka Semiconductor Solutions"
role: "Architecture, feature development, testing, debugging, and distribution"
sourceStatus: closed
links:
  - label: "RTLStation product page"
    url: "https://habakasemiconductor.com/#rtlstation"
  - label: "Habaka Semiconductor Solutions"
    url: "https://habakasemiconductor.com"
thumbnail:
  src: ./images/logo.png
  alt: "RTLStation logo"
  fit: contain
hero:
  src: ./images/hero.png
  alt: "RTLStation IDE showing a SystemVerilog FIFO project with the project hierarchy on the left, the editor in the center, and a Problems panel listing one error and six warnings on the right."
  caption: "RTLStation editing a SystemVerilog FIFO. The Problems panel maps each finding to an IEEE 1800 rule and suggests a fix."
metrics:
  - value: "386"
    label: "Static-analysis diagnostics mapped to IEEE 1364 / 1800"
  - value: "3"
    label: "HDLs: Verilog, SystemVerilog, VHDL"
  - value: "Offline"
    label: "No telemetry, no account, no network access"
---

## Overview

RTLStation is a Windows desktop IDE for RTL development. It gives hardware engineers one organized workspace for writing, checking, understanding, documenting, and navigating Verilog and SystemVerilog designs together with their FPGA constraint files. VHDL files get syntax highlighting and structural checking.

The application is distributed by [Habaka Semiconductor Solutions](https://habakasemiconductor.com), an engineering-software company focused on FPGA, RTL, and semiconductor development workflows. I developed RTLStation from concept to release, leading the software architecture, feature development, testing, debugging, and distribution.

RTLStation runs fully offline, with no telemetry, no account, and no network access. It does not synthesize, simulate, run timing analysis, or drive vendor tools; it is the workspace where RTL is written, checked, understood, and documented before it enters the FPGA flow.

## Problem

Most RTL is still written in general-purpose editors that treat a module as a text file rather than as a node in a design hierarchy. Engineers find width mismatches, inferred latches, incomplete case statements, and constraint typos late, after synthesis has already run. Project-wide questions such as "where is this signal driven?" or "which ports does this module actually expose after parameter overrides?" require reading across many files by hand.

RTLStation's goal is to move that understanding earlier, into the editor, with analysis that is aware of the whole project rather than a single file.

## Architecture

RTLStation is organized around a project index and an elaboration engine:

- **Project understanding.** The IDE indexes modules and packages across the project, elaborates the hierarchy with parameter overrides and generate expansion, and resolves references across files. Findings are identical whether a single file or the whole project is checked.
- **Static-analysis engine.** 386 diagnostics are mapped to IEEE 1364-2005 (Verilog) and IEEE 1800-2023 (SystemVerilog): unused and undriven signals, inferred latches, incomplete case statements, width mismatches, multiply-driven nets, and more. The engine is qualified against real open-source RTL.
- **Constraint cross-checking.** XDC and SDC files are highlighted, outlined, and syntax-checked, then cross-checked against the elaborated top module for unknown ports, missing or duplicate `PACKAGE_PIN` assignments, out-of-range bit selects, and timing commands that name unknown ports.
- **Design visualization.** State machines are detected from the RTL, including the state register, transitions with their conditions, and the reset state, then drawn in an FSM panel and exported as SVG or PNG.

## Features

- **HDL editor** with syntax highlighting for Verilog, SystemVerilog, VHDL, and XDC/SDC, code folding, bracket matching, and autocomplete that knows the ports and parameters of the module being instantiated. Go to Declaration, Show References, and multi-tab editing with session restore.
- **Static analysis** on demand: check a file (F7) or the whole project (Shift+F7), with suggested fixes for common findings.
- **Design Inspector** with Overview, Connectivity, References, and Trace views for any symbol, showing where signals originate, where they are used, and how parts of the design connect.
- **Documentation generation**: one click produces HTML or Markdown documentation for the active file, including ports with resolved widths, parameters, signals, instances, functions and tasks, and state machines with an inline diagram.
- **Hex editor** for `.bin`, `.bit`, and `.elf` images with virtualized memory (a 500 MB file opens with flat memory), search, overwrite editing with undo, CRC-32 and SHA-256, and interpretation of any selection as 8- to 64-bit values in both byte orders.

## Engineering decisions

- **Offline by design.** Hardware teams often work on networks where source code cannot leave the machine. RTLStation makes no network calls, which also keeps the analysis deterministic and fast.
- **Standards-mapped diagnostics.** Every finding references a clause of the relevant IEEE standard, so a warning is an explanation rather than an opinion.
- **Project-level elaboration before analysis.** Checking a module in isolation produces false positives for parameterized designs. Elaborating the hierarchy first lets the same engine give consistent results at file and project scope.

## Results

RTLStation is available for Windows from the Habaka Semiconductor Solutions website. The static-analysis engine has been qualified against real open-source RTL projects.

## My contribution

I built RTLStation from concept to release: the overall software architecture, the HDL parsing and elaboration pipeline, the diagnostics engine, the editor and inspector UI, testing, debugging, and the installer and distribution. RTLStation is closed source; the product page and download are linked above.
