---
title: "Polyphonic FM Synthesizer on a MicroBlaze SoC"
tagline: "A four-voice FM synthesizer in bare-metal C on a MicroBlaze soft core, with 50 kHz PWM audio, cubic-interpolated wavetables, and a TFT parameter UI."
summary: "Final project of a graduate embedded-systems course: a real-time, four-voice FM synthesizer running on a MicroBlaze processor in a Nexys A7 FPGA. Fourteen breadboard keys feed an interrupt-driven scanner, audio is rendered at 50 kHz through a timer-generated PWM output, and a 2.8-inch SPI TFT shows a parameter editor built on the QP-nano hierarchical state-machine framework."
category: embedded-firmware
tags: [hw-sw-integration, coursework]
tech: ["C", "MicroBlaze", "Xilinx Vivado", "Xilinx Vitis", "QP-nano", "AXI", "PWM Audio", "SPI TFT", "Nexys A7-100T"]
type: team-coursework
tier: featured
order: 30
dates:
  start: "2025-11"
  end: "2025-12"
affiliation: "Embedded Computing Systems, UC Santa Barbara (Fall 2025)"
team: "Team of 2"
role: "Rotary-encoder state machine, joint development of the audio engine, input scanning, and UI firmware"
repo: "https://github.com/saifalomari99/UCSB_Embedded_Computing_Systems_Fall2025/tree/main/Project_05"
hero:
  src: ./images/hero.jpg
  alt: "A Nexys A7 FPGA board, a breadboard with fourteen push-button keys, and a small TFT display showing a Main Screen with operator, oscillator, and envelope parameters, next to a desktop speaker."
  caption: "The complete synthesizer: breadboard keyboard, Nexys A7 running MicroBlaze, SPI TFT parameter screen, and PWM audio into a powered speaker."
gallery:
  - src: ./images/01-main-screen.jpg
    alt: "Close-up of the TFT Main Screen listing operator depth, wave, and ratio, oscillator wave, and envelope attack, decay, release, and sustain values."
    caption: "Main screen. Current operator, oscillator, and envelope settings."
  - src: ./images/02-edit-screen.jpg
    alt: "Close-up of the TFT Edit Params screen with a yellow border and a cursor on the Ratio parameter."
    caption: "Edit screen. The rotary encoder moves a blinking cursor and adjusts the selected parameter."
metrics:
  - value: "50 kHz"
    label: "Audio sample rate (PWM)"
  - value: "4"
    label: "Simultaneous voices"
  - value: "4"
    label: "Waveforms (sine, triangle, saw, square)"
credits:
  - name: "QP-nano"
    url: "https://www.state-machine.com/"
    note: "Quantum Leaps hierarchical state-machine framework (GPL) used for the UI active object."
  - name: "LCD driver"
    note: "Course-provided ILI9341 SPI TFT driver derived from the UTFT library."
  - name: "Course lab templates and Xilinx platform code"
    note: "Board-support skeleton, linker script, and platform initialization."
---

## Overview

This synthesizer was the final project of a graduate embedded-systems course taught around a MicroBlaze soft core on the Digilent Nexys A7. Fourteen push buttons on a breadboard act as a one-octave piano keyboard plus octave-up and octave-down keys. The processor renders two-operator FM audio for up to four simultaneous notes, writes samples to a PWM output through an AXI timer, and shows a parameter editor on a 2.8-inch SPI TFT. The board's rotary encoder and buttons navigate the UI.

## Problem

Audio synthesis on a soft-core processor without a floating-point unit or DSP blocks is a budget problem: every sample must be produced inside a 20 microsecond window at 50 kHz while the same processor scans keys, debounces them, services the display, and runs the UI state machine. The design had to be fully fixed-point and interrupt-driven.

## Architecture

- **Audio engine (`audio.c`, `oscillator.c`, `operator.c`).** Each voice is a two-operator FM pair: the modulator's sample, scaled by a Q8.8 depth, is added to the carrier's phase increment. A global low-frequency oscillator applies tremolo with a Q1.15 depth. Active voices are mixed with a reciprocal-multiply divide (including an exact divide-by-three), and an exponential decay runs when the synth is idle to suppress pops. The final sample is mapped to a PWM duty cycle.
- **Wavetables (`wavetables.c`, `interpolate.c`).** A 256-entry Q15 sine table is read through a 32-bit phase accumulator using an 8-bit index and 8-bit fraction, with Catmull-Rom-style cubic interpolation. Triangle, sawtooth, and square waves are computed directly from phase.
- **Timing (`timer_helpers.h`).** A 100 MHz AXI timer produces the 50 kHz sample interrupt (2,000 ticks) and the PWM period.
- **Input (`gpio.c`, `bsp.c`).** A GPIO interrupt scans the fourteen keys with per-key debounce of roughly 1 ms, allocates voices on key-down, and applies the octave offset. A seven-state quadrature decoder turns the rotary encoder into `ENCODER_UP` / `ENCODER_DOWN` events.
- **UI (`lab2a.c`, `lcd.c`).** A QP-nano hierarchical state machine moves between Welcome, Main, and Edit states. The Edit screen uses a blinking cursor driven by the framework's time tick to select operator depth, wave, and ratio, the oscillator waveform, and envelope attack, decay, sustain, and release values.

## Features

- Four-voice polyphony with per-voice two-operator FM
- Four waveforms for both carrier and modulator
- Octave shifting from -2 to +3 with notes clamped to C1-B6
- Global LFO tremolo
- Live parameter editing on the TFT with encoder navigation
- Envelope attack, decay, sustain, and release parameters exposed in the UI (stored and displayed; the audio path applies operator and oscillator settings)

## Engineering decisions and challenges

- **Fixed-point everywhere.** Phase accumulators, FM depth, LFO depth, and mixing all use integer arithmetic with explicit Q formats so the sample ISR stays short and predictable on a MicroBlaze without hardware floating point.
- **Cubic interpolation over a small table.** A 256-entry table keeps memory small; cubic interpolation removes the harmonic distortion a linear lookup would add at low frequencies.
- **Pop suppression.** Voices do not stop abruptly; an exponential decay on idle avoids audible clicks on the PWM output.
- **Separating audio from UI.** Audio runs in the timer ISR, UI runs in the QP-nano event loop, so screen redraws never disturb sample timing.

## My contribution

This was a two-person project. The repository explicitly marks the rotary-encoder state machine as my work, and the TFT background-tiling and overlay drawing routines as my teammate's. The audio engine, key scanning, voice allocation, and UI state machine were developed jointly. Third-party components are listed below.
