---
title: "OV7670 Camera-to-VGA FPGA Pipeline with YOLOv4 Analysis"
tagline: "An FPGA pipeline that configures an OV7670 camera, buffers RGB444 frames in block RAM, and drives VGA, with captured frames analyzed offline by YOLOv4."
summary: "A three-person senior project: the FPGA half initializes an OV7670 CMOS camera, captures 640x480 12-bit frames into a dual-port BRAM frame buffer, and displays them on a VGA monitor at a 25 MHz pixel clock. Frames are then transferred to a PC where a pretrained YOLOv4 model (TensorFlow) labels objects. I owned the repository, the YOLOv4 environment and tutorial scripts, and contributed to the FPGA integration and the report."
category: hw-sw-integration
tags: [fpga-rtl, coursework]
tech: ["Verilog", "Xilinx Vivado", "Nexys A7-100T", "OV7670", "SCCB / I2C", "BRAM", "VGA", "Python", "TensorFlow", "YOLOv4"]
type: team-coursework
tier: standard
order: 60
dates:
  start: "2024-02"
  end: "2024-05"
affiliation: "Senior project, Cal Poly Pomona (Spring 2024)"
team: "Team of 3"
role: "Repository, YOLOv4 environment and scripts, FPGA integration and report"
repo: "https://github.com/saifalomari99/CPP-ECE-Yolov4-Object-Detection-Using-FPGA"
hero:
  src: ./images/hero.jpg
  alt: "Lab bench with a laptop running YOLOv4, a VGA monitor showing the camera feed, and a Nexys A7 FPGA board with an OV7670 camera module on a breadboard, each labelled."
  caption: "Experimental setup: OV7670 on the Nexys A7, live VGA output, and the PC running the YOLOv4 detector."
gallery:
  - src: ./images/01-full-system.png
    alt: "Flow diagram: OV7670 camera, Nexys A7 FPGA, VGA display, capture frames, YOLOv4 detection, results."
    caption: "End-to-end flow. Acquisition and display run on the FPGA; detection runs offline on a PC."
  - src: ./images/02-hdl-diagram.jpg
    alt: "Hand-drawn HDL block diagram with the camera top module at 100 MHz, a BRAM frame buffer, and the VGA top module at 25 MHz."
    caption: "HDL architecture. Camera capture, dual-port BRAM, and VGA timing live in separate clock domains with synchronized resets."
  - src: ./images/03-frame-before.jpg
    alt: "A captured frame of a lab scene with a person whose face is covered by a red box."
    caption: "Frame captured from the FPGA's VGA output (face redacted)."
  - src: ./images/04-frame-after.jpg
    alt: "The same frame with YOLOv4 bounding boxes labelling a person and a chair."
    caption: "The same frame after YOLOv4 inference on the PC."
metrics:
  - value: "640x480"
    label: "Capture and display resolution"
  - value: "12-bit"
    label: "RGB444 pixel format"
  - value: "25 MHz"
    label: "VGA pixel clock"
credits:
  - name: "YOLOv4 (Darknet) and pretrained weights"
    url: "https://github.com/AlexeyAB/darknet"
    note: "Detector architecture and COCO-trained weights; not trained or modified by the team."
  - name: "yolov4-custom-functions (theAIGuysCode)"
    url: "https://github.com/theAIGuysCode/yolov4-custom-functions"
    note: "TensorFlow conversion and detection scripts followed as a tutorial."
  - name: "Xilinx Clocking Wizard"
    note: "Generates the 25 MHz pixel clock and camera clock."
---

## Overview

This senior project combined a camera-to-display pipeline on an FPGA with object detection on a PC. The OV7670 is a low-cost CMOS camera that outputs parallel pixel data and is configured over SCCB, an I2C-like protocol. The Nexys A7 initializes the camera, captures each frame into on-chip memory, and continuously scans that memory out as a 640x480 VGA signal. Frames are captured from the VGA output and run through a pretrained YOLOv4 model to identify objects such as people and chairs.

Detection is not performed on the FPGA, and frames were transferred to the PC manually; closing that gap with a USB or Ethernet link was identified as future work.

## Architecture

The Verilog design (`HDL Source Files/src/`) is organized by function:

- **Camera initialization.** `cam_rom` holds the register table that puts the OV7670 into RGB444 mode; `cam_config` sequences the writes and `sccb_master` implements the SCCB bus at 400 kHz.
- **Capture.** `cam_capture` assembles each pixel from two bytes into 12-bit RGB444 and skips the first two frames after configuration while the sensor settles.
- **Frame buffer.** `mem_bram` is a dual-port block RAM, 12 bits wide and 640x480 deep, written on the camera's pixel clock and read on the VGA clock.
- **Display.** `vga_driver` and `vga_top` generate 640x480 timing at 25 MHz and read the frame buffer in raster order.
- **Top level.** `top.v` instantiates the Clocking Wizard and a three-domain reset synchronizer (100 MHz system clock, camera pixel clock, 25 MHz VGA clock) and connects the Pmod pins to the camera.

On the PC, Anaconda environment and tutorial scripts set up TensorFlow and convert the Darknet weights, after which a detection script annotates captured images.

## Engineering decisions and challenges

- **Dual-port BRAM as the clock-domain boundary.** The camera and the display run on unrelated clocks. Using true dual-port memory with one port per domain avoids any handshaking in the pixel path.
- **Per-domain reset synchronization.** Each clock domain gets its own synchronized reset so the capture state machine and the VGA counters start cleanly after the PLL locks.
- **Pull-ups and power.** The SCCB lines require external pull-up resistors; the bring-up included confirming the bus idle levels before the register table would take.
- **Honest scope.** The team evaluated the detector qualitatively on captured frames; no frame rate, latency, or accuracy figures were measured for this system.

## My contribution

I owned the repository and wrote the YOLOv4 environment-setup and tutorial scripts, contributed to integrating and bringing up the FPGA capture-and-display pipeline on the Nexys A7, and co-authored the project report. Third-party components are listed below.
