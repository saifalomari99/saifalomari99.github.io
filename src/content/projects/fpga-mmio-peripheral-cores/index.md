---
title: "Custom MMIO Peripheral Cores for a MicroBlaze SoC"
tagline: "Two memory-mapped SystemVerilog cores, a four-channel programmable LED blinker and a debounced quadrature rotary-encoder decoder, with matching C++ drivers."
summary: "Two peripheral cores designed from the bus interface up for an FPro-based MicroBlaze SoC on the Nexys A7: a blinking-LED core with four interval registers driving four square-wave generators, and a Pmod rotary-encoder core with hardware debouncing and quadrature decoding. Each core includes a register map, SystemVerilog implementation, and a C++ driver class."
category: fpga-rtl
tags: [hw-sw-integration, coursework]
tech: ["SystemVerilog", "C++", "MicroBlaze MCS", "MMIO Bus", "Xilinx Vivado", "Nexys A7-100T", "Pmod ENC", "PWM"]
type: coursework
tier: standard
order: 80
dates:
  start: "2024-04"
  end: "2024-05"
affiliation: "Undergraduate FPGA coursework, Cal Poly Pomona"
role: "Core design, register maps, drivers, and test applications"
repo: "https://github.com/saifalomari99/FPGA_Projects_SaifAlomari/tree/main/SystemVerilog_FPGA_Projects"
hero:
  src: ./images/hero.jpg
  alt: "Hand-drawn block diagram of the blinking LED core: an address decoder feeds four interval registers, each driving a square-wave generator connected to one of four LEDs."
  caption: "Blinking-LED core. Four interval registers, written over the MMIO bus, set the period of four independent square-wave generators."
gallery:
  - src: ./images/01-pmod-enc-core.jpg
    alt: "Hand-drawn block diagram of the Pmod encoder core showing debounce blocks on the A, B, and button inputs feeding a quadrature decoder and a read register."
    caption: "Pmod encoder core. Debounced A/B inputs feed a quadrature decoder; direction pulses and the button state are exposed through a read register."
  - src: ./images/02-wiring-diagram.jpg
    alt: "Wiring diagram showing the Pmod rotary encoder connected to a Pmod header on the FPGA board."
    caption: "Encoder wiring to the Pmod header."
metrics:
  - value: "2"
    label: "Custom MMIO cores"
  - value: "4"
    label: "Independent LED channels"
  - value: "1 ms"
    label: "Timing tick for interval registers"
credits:
  - name: "FPro SoC framework by Pong P. Chu"
    note: "MMIO bus definition, MicroBlaze MCS wrapper, and base driver classes the cores plug into."
---

## Overview

The FPro framework exposes a simple memory-mapped bus: each peripheral slot gets a chip-select, a register address, write data, and read data. Writing a new core means implementing that interface in SystemVerilog, defining a register map, and writing a driver class so application code can use it. These two cores were built that way and then used in later projects, including the final SoC game.

## Blinking-LED core

**Register map.** Four write-only interval registers, one per LED. The application writes a period in milliseconds; a 1 ms tick counter inside the core converts it to a square wave.

**Implementation (`blinking_led_core.sv`).** An address decoder routes bus writes to the four registers. Each register feeds its own square-wave generator, so the four LEDs blink independently at different rates with no processor involvement after setup. A `BlinkingCore` C++ class wraps the register writes.

## Pmod rotary-encoder core

**Register map.** A read register packs the debounced button state and the decoded rotation events.

**Implementation (`pmod_enc_core.sv`, `encoder.sv`).** The A and B quadrature signals and the push button pass through debounce logic, then a state machine decodes the Gray-code transitions into clockwise and counter-clockwise pulses. The test application (`rgb_controlled_pmod`) uses the pulses to raise or lower the brightness of an RGB LED through the PWM core and shows the level on the seven-segment display. A standalone `HDL_pmod_test` design exercises the encoder without the processor.

## Engineering decisions and challenges

- **Doing timing in hardware.** Converting a millisecond interval to a waveform inside the core frees the processor entirely; the application only writes four registers.
- **Debouncing before decoding.** Mechanical encoders bounce on every detent. Filtering A and B before the quadrature state machine eliminated spurious double-steps that appeared when decoding raw inputs.
- **Bus-first design.** Both cores were written against the FPro bus contract first, with the data path added afterwards, so they could be dropped into any slot of an existing SoC without changes elsewhere.

## My contribution

Individual coursework. I designed and implemented both cores, their register maps, the C++ drivers, and the test applications. The bus definition and processor wrapper come from the FPro framework credited below.
