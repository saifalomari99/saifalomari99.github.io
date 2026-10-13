---
title: "Embedded Computing Systems Lab Series on MicroBlaze"
tagline: "Four bare-metal C labs on a MicroBlaze soft core: timing analysis under interrupt load, a stopwatch, an encoder LED cursor, and a TFT state-machine UI."
summary: "The graduate embedded-systems lab sequence that led up to the FM synthesizer. Each project runs on a MicroBlaze processor built in Vivado on the Nexys A7 and exercises a different part of embedded design: measuring execution-time distributions with AXI timers while a periodic interrupt creates bus contention, a millisecond-tick stopwatch on a custom seven-segment AXI IP, GPIO-interrupt quadrature decoding with timer-based debounce, and an ILI9341 TFT interface structured as a QP-nano hierarchical state machine."
category: embedded-firmware
tags: [hw-sw-integration, coursework]
tech: ["C", "MicroBlaze", "AXI", "Xilinx Vivado", "Xilinx Vitis", "QP-nano", "Nexys A7-100T", "SPI TFT"]
type: team-coursework
tier: standard
order: 100
dates:
  start: "2025-10"
  end: "2025-12"
affiliation: "Embedded Computing Systems, UC Santa Barbara (Fall 2025)"
team: "Team of 2"
repo: "https://github.com/saifalomari99/UCSB_Embedded_Computing_Systems_Fall2025"
collection: true
hero:
  src: ./images/hero.jpg
  alt: "A small TFT display on a breadboard showing a tiled pattern of blue triangles, next to a Nexys A7 board with its seven-segment display lit."
  caption: "Project 4: tiled triangle background on the SPI TFT, redrawn only under overlays to keep the UI responsive."
gallery:
  - src: ./images/01-block-design.png
    alt: "Vivado block design with a MicroBlaze processor, DDR2 memory controller, two AXI timers, an interrupt controller, GPIO blocks, and an RGB LED controller."
    caption: "Project 1 hardware: MicroBlaze with DDR2, two AXI timers, interrupt controller, and GPIO."
  - src: ./images/02-encoder-demo.jpg
    alt: "A hand turning a Pmod rotary encoder connected to a Nexys A7 board with a single LED lit in a row of sixteen."
    caption: "Project 3: the rotary encoder moves a single lit LED across the sixteen-LED bar."
  - src: ./images/03-stopwatch.jpg
    alt: "A Nexys A7 seven-segment display showing a stopwatch reading next to a tablet stopwatch for comparison."
    caption: "Project 2: stopwatch on the seven-segment display checked against a reference timer."
metrics:
  - value: "5"
    label: "Lab projects (the fifth is the FM synthesizer)"
  - value: "1,000"
    label: "Timed trials per operation in the timing study"
  - value: "1 ms"
    label: "Stopwatch timer tick"
credits:
  - name: "QP-nano"
    url: "https://www.state-machine.com/"
    note: "Hierarchical state-machine framework used in Project 4 and 5."
  - name: "Course-provided seven-segment IP driver and LCD driver"
    note: "Seven-segment helper and ILI9341 driver derived from the UTFT library."
  - name: "Xilinx platform code and lab templates"
    note: "Platform initialization, linker script, and lab skeletons."
---

## Overview

This repository holds the lab sequence from a graduate embedded-systems course. All projects share a Vivado block design with a MicroBlaze processor and AXI peripherals on the Nexys A7, and all firmware is bare-metal C built in Vitis with the Xilinx GPIO, timer, interrupt-controller, and SPI drivers. The fifth and final project, a polyphonic FM synthesizer, has [its own page](/projects/fm-synthesizer-microblaze/).

## Projects

### Project 1: Timing and performance analysis

A measurement harness reads an AXI timer before and after an operation, repeated through macros for 5x and 40x unrolling over 1,000 trials, and bins the results into an on-board histogram. Measured operations include DDR reads, floating-point addition, GPIO writes to the LEDs, and `printf` over USB-UART. A second timer generates a periodic interrupt whose handler creates bus contention, so the histograms show how caches and interrupt interference spread execution times. Raw per-trial logs are kept as CSV files in the repository.

### Project 2: Stopwatch

An AXI timer interrupt with a 1 ms auto-reload drives a stopwatch shown on all eight seven-segment digits through a custom AXI IP. Buttons are polled with edge detection: start, stop, count direction, and reset, with the count clamped at zero when counting down.

### Project 3: Rotary-encoder LED cursor

A GPIO interrupt decodes the Pmod rotary encoder with a four-state quadrature machine and moves a single lit LED across the sixteen-LED bar. The encoder's push button is debounced with a 20 ms window measured on a free-running timer and toggles the display, with status on the RGB LED and seven-segment display.

### Project 4: TFT volume interface

An ILI9341 240x320 SPI TFT shows a tiled triangle background with a volume bar and message-box overlays. The UI is a QP-nano hierarchical state machine with idle and active states and a two-second inactivity timeout. To keep redraws fast, only the 40x40 tiles under an overlay are repainted when it disappears. The drawing routines live alongside the Project 5 sources in the repository.

## Engineering decisions and challenges

- **Measuring instead of assuming.** The timing study made cache and interrupt effects visible as multimodal histograms rather than single averages, which informed how the later projects placed work in interrupts versus the main loop.
- **Interrupt-driven time base.** Both the stopwatch and the debounce logic derive from hardware timers, so timing does not depend on loop length.
- **Partial redraws on a slow bus.** The SPI TFT is the bottleneck of Project 4; tile-level invalidation turned full-screen repaints into a handful of small writes.

## My contribution

This was a two-person lab series. I worked on the timing-analysis firmware and the encoder decoding, and the projects were otherwise developed jointly with my lab partner, who wrote the TFT background and overlay drawing routines. Third-party components are listed below.
