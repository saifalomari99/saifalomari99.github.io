---
title: "PIC18F4620 Embedded Firmware Series"
tagline: "Eleven bare-metal PIC18 projects in C and assembly, ending in a real-time clock, alarm, and thermostat with a TFT UI, I2C sensors, and PWM fan control."
summary: "A progression of eleven microcontroller projects on the PIC18F4620: GPIO and ADC fundamentals, assembly programming, sensor interfacing, a voltmeter and ohmmeter, a traffic-light controller, IR remote decoding with external interrupts, a software I2C bus, fan speed measurement, and a final system that combines a DS3231 real-time clock, a DS1621 temperature sensor, a PWM-driven fan with tachometer feedback, a buzzer alarm, and a multi-screen TFT user interface."
category: embedded-firmware
tags: [coursework]
tech: ["C (XC8)", "PIC18 Assembly", "MPLAB X", "PICkit 4", "I2C", "SPI", "PWM", "UART", "ADC", "DS3231 RTC", "DS1621", "ST7735 TFT"]
type: coursework
tier: standard
order: 70
dates:
  start: "2023-01"
  end: "2023-05"
affiliation: "Microcontrollers laboratory, Cal Poly Pomona (Spring 2023)"
role: "All application firmware across the eleven projects"
repo: "https://github.com/saifalomari99/Microcontroller_Projects_SaifAlomari"
collection: true
hero:
  src: ./images/hero.jpg
  alt: "Breadboard with a PIC18 development board, an IR remote, RGB LEDs, and a small TFT screen showing temperature, time, date, alarm, heater, and fan RPM readouts."
  caption: "Final project: real-time clock, alarm, and thermostat with the TFT main screen showing temperature, time, date, alarm state, heater state, and fan RPM."
gallery:
  - src: ./images/01-schematic.png
    alt: "Schematic of the final project showing the PIC18 development board connected to a DS3231 RTC, DS1621 temperature sensor, IR receiver, a fan driven by a 2N7000 MOSFET, a buzzer, RGB LEDs, and a TFT header."
    caption: "Final-project schematic: I2C bus to the RTC and temperature sensor, MOSFET-switched fan with tachometer, buzzer, RGB status LEDs, and SPI TFT."
  - src: ./images/02-traffic-lights.jpg
    alt: "Breadboard traffic-light controller with LEDs arranged over a paper intersection drawing and a small TFT showing status text."
    caption: "Project 7: two-direction traffic-light controller with pedestrian buttons, day/night sensing, and a TFT status display."
  - src: ./images/03-collage.jpg
    alt: "Collage of seven breadboard photographs from the microcontroller project series."
    caption: "Hardware from across the series."
metrics:
  - value: "11"
    label: "Firmware projects"
  - value: "8 MHz"
    label: "Internal oscillator"
  - value: "I2C, SPI, PWM, UART, ADC"
    label: "Peripherals used"
credits:
  - name: "ST7735 TFT and software I2C drivers"
    note: "Course-provided driver files used by the later projects."
  - name: "Instructor development board"
    note: "Custom PIC18F4620 board supplied for the laboratory."
---

## Overview

This series was built on a PIC18F4620 running from its 8 MHz internal oscillator, programmed with MPLAB X and a PICkit 4 on an instructor-supplied development board. The projects move from register-level I/O to a complete multi-peripheral system, and the later ones share a small set of reusable modules for I2C, interrupts, and display handling.

## Projects

| # | Project | What it does |
|---|---------|--------------|
| 1 | ADC initialization and LED flashing | ADC-controlled flash rate; floating-point printing over UART; five-channel voltage readout |
| 2 | I/O port configuration and RGB LED control | Port mirroring and array-driven RGB sequences |
| 3 | Assembly: LED control | LED patterns using indirect addressing and nested delay loops |
| 4 | Assembly: task selection | Port-selected complement, add, XOR, OR, and BCD operations with a zero flag |
| 5 | Temperature and light sensors | LM84 temperature to a seven-segment display; light-dependent RGB output |
| 6 | Digital voltmeter and ohmmeter | ADC voltmeter plus a reference-resistor ohmmeter with a low-resistance buzzer |
| 7 | Traffic-light control system | Two-direction sequencing, pedestrian buttons, day/night mode, TFT status |
| 8 | IR remote control | NEC-style decoding using Timer1 and external-interrupt edges; TFT shows the key |
| 9 | I2C bus implementation | Software I2C master with an interrupt service routine |
| 10 | Fan speed measurement | DS1621 temperature and DS3231 time over I2C, PWM fan drive, tachometer RPM |
| 11 | Real-time clock, alarm, and heater system | Final integrated system (below) |

## Final project architecture

The final firmware is split into modules: a main screen, three setup screens (time, alarm, fan temperature threshold), an I2C layer, an interrupt handler, fan support, and shared utilities.

- **Time and alarm.** The DS3231 provides time and date over I2C; a matching alarm drives the buzzer until dismissed.
- **Thermostat.** The DS1621 temperature reading is compared with a user-set threshold to switch the heater output and the fan, which is driven by PWM through a 2N7000 MOSFET.
- **Fan feedback.** The tachometer pulse is counted on an interrupt to compute RPM, shown on the display.
- **Input.** An IR remote, decoded on an external interrupt with a 1 microsecond Timer1 tick, navigates between screens and edits values.
- **Display.** The ST7735 TFT over SPI renders a main screen with temperature in both units, time, date, alarm, heater, and RPM, and dedicated editing screens with a cursor.

## Engineering decisions and challenges

- **Interrupt-driven input.** Both the IR receiver and the fan tachometer are timing-sensitive; handling them in interrupts keeps the main loop free for display updates and I2C polling.
- **Software I2C.** Implementing the bus in software made its timing visible on a logic analyzer and allowed the same routines to serve both the RTC and the temperature sensor.
- **Screen state machine.** The UI is a small state machine over screens, which kept the final project manageable as features were added across the semester.

## My contribution

Individual coursework. I wrote the application firmware for all eleven projects and built every circuit. The TFT and I2C driver files were provided by the course and are credited below.
