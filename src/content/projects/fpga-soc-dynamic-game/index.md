---
title: "FPGA SoC Dynamic Game with Custom Sprite Core"
tagline: "A one- and two-player VGA game on a MicroBlaze soft-core SoC, with a custom sprite hardware core added to an eight-stage video pipeline."
summary: "Final project of a SystemVerilog FPGA course: a VGA game running on a MicroBlaze MCS system-on-chip on the Nexys A7. I extended the SoC video pipeline with a new sprite core, integrated keyboard, potentiometer, and audio peripherals over a memory-mapped bus, and wrote roughly 1,400 lines of C++ game firmware with collision detection, scoring, lives, and win/lose screens."
category: fpga-rtl
tags: [hw-sw-integration, coursework]
tech: ["SystemVerilog", "C++", "MicroBlaze MCS", "Xilinx Vivado", "Xilinx Vitis", "Nexys A7-100T", "VGA", "PS/2", "XADC", "MMIO"]
type: coursework
tier: featured
order: 50
dates:
  start: "2024-05"
affiliation: "Undergraduate FPGA coursework, Cal Poly Pomona"
role: "Custom sprite core, peripheral integration, and all game firmware"
repo: "https://github.com/saifalomari99/FPGA_Projects_SaifAlomari/tree/main/SystemVerilog_FPGA_Projects/14-%20SoC_Final_Project_Dynamic_Game"
hero:
  src: ./images/hero.jpg
  alt: "A monitor shows a blue VGA game screen reading ONE PLAYER GAME, SCORE REACHED 100, YOU WON, with a Nexys A7 FPGA board, a breadboard potentiometer, and a keyboard on the desk below."
  caption: "The finished system: Nexys A7 driving the VGA display, a PS/2 keyboard for player input, and a breadboard potentiometer read through the XADC."
gallery:
  - src: ./images/01-system-diagram.jpg
    alt: "Hand-annotated block diagram of the SoC showing the MicroBlaze processor, the MMIO subsystem with numbered peripheral slots, and a chain of video cores labelled V1 through V7."
    caption: "System block diagram. Red annotations mark the MMIO slots (4-13) and the video cores (V1-V7) used by the game, including the new ghost-sprite core."
  - src: ./images/02-rocket-sprite.png
    alt: "Pixel-art rocket sprite bitmap used by the game."
    caption: "Sprite bitmap converted into the ROM used by the sprite core."
metrics:
  - value: "640x480"
    label: "VGA output resolution"
  - value: "8"
    label: "Daisy-chained video cores in the pipeline"
  - value: "1,400+"
    label: "Lines of C++ game firmware"
credits:
  - name: "FPro SoC framework by Pong P. Chu"
    note: "MicroBlaze MCS wrapper, MMIO bus, standard peripheral cores, frame buffer, OSD and base sprite cores (from the textbook FPGA Prototyping by SystemVerilog Examples)."
  - name: "Xilinx IP"
    note: "MicroBlaze MCS, Clocking Wizard, and XADC primitives."
---

## Overview

This was the capstone project of a SystemVerilog FPGA course built around Pong Chu's FPro system-on-chip framework. The platform is a MicroBlaze MCS soft processor on a Digilent Nexys A7-100T (Artix-7), with peripherals attached through a memory-mapped I/O (MMIO) bus and a video subsystem made of daisy-chained hardware cores that each modify the pixel stream on its way to the VGA output.

On top of that framework I built a playable game: a start menu, a one-player mode in which the player dodges a barrel whose throws are driven by a potentiometer, and a two-player mode, with lives, scoring, and win/lose screens drawn by the on-screen-display core.

## Problem

A real-time game stresses both halves of an SoC. The video path must generate a stable 640x480 signal and composite several moving objects every frame without the processor touching individual pixels. The firmware must poll multiple input devices, update game state, detect collisions, and drive the display registers inside the frame budget. Doing this well means deciding which work belongs in hardware and which in software.

## Architecture

**Hardware.** The video pipeline chains eight cores: a bar-pattern generator, an RGB-to-gray core, a ghost sprite core, a second ghost sprite core that I added for this project (`vga_sprite_ghost2_core`), an on-screen-display text core, a mouse-pointer sprite, and a frame buffer, each with its own MMIO register block. The MMIO subsystem exposes the rotary encoder, XADC, PWM, buttons, seven-segment display, SPI, I2C, PS/2, and audio (DDFS and ADSR) cores to the processor. The complete hardware handoff for the game build is the `mcs_top_complete_saif_v4.xsa` platform file in the repository.

**Firmware.** The C++ application is split across a menu and video test harness (`main_video_test.cpp`), the one-player game (`one_player_game.cpp`), and the two-player game (`two_player_game.cpp`). Each mode runs a main loop that reads the PS/2 keyboard and XADC, updates sprite positions through the core driver classes, checks bounding-box collisions, and writes score and status text to the OSD core.

## Features

- Start menu with mode selection and in-game instructions rendered through the OSD core
- One-player mode: keyboard-controlled player, barrel throws modulated by the XADC potentiometer reading
- Two-player mode with independent keyboard controls
- Lives, score counter, and a win condition at 100 points with a dedicated win screen
- Hardware sprites so the processor only updates positions, never pixels

## Engineering decisions and challenges

- **Adding a second sprite core instead of time-multiplexing one.** Two independent moving objects were needed in the two-player mode. Duplicating the sprite core and giving it its own MMIO slot kept the firmware simple and the frame timing deterministic.
- **Keeping compositing in hardware.** Each video core blends its output into the stream in a fixed pipeline order, so the processor never writes to the frame buffer during gameplay. This is what makes a bare-metal MicroBlaze at modest clock rates sufficient for smooth motion.
- **Input handling.** PS/2 scan codes are decoded in hardware and consumed as make/break events in firmware, with edge detection to avoid repeated actions while a key is held.

## My contribution

This was individual coursework. I designed the second sprite core, integrated the peripheral and video cores into the final SoC build, generated the hardware platform, and wrote all of the game firmware. The underlying FPro framework (processor wrapper, MMIO bus, base peripheral and video cores, drivers) is Pong Chu's textbook code and is credited below.
