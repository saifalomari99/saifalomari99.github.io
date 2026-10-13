---
title: "Spiking Neural Network with On-Chip STDP in Verilog"
tagline: "A hardware spiking neural network: 25 spike-train inputs, two integrate-and-fire neurons with lateral inhibition, and 2-bit weights trained on-chip by STDP."
summary: "A neuromorphic RTL design and testbench for a graduate course on neurally inspired computing. Each pixel of a 5x5 binary pattern becomes a 20-step spike train feeding two integrate-and-fire neurons. During training, an STDP rule updates 2-bit weights in hardware based on the relative timing of pre- and post-synaptic spikes; during testing the weights are frozen and the neurons separate the two classes of input pattern."
category: fpga-rtl
tags: [ml-ai, coursework]
tech: ["Verilog", "Icarus Verilog", "Integrate-and-Fire Neurons", "STDP", "Neuromorphic Hardware"]
type: coursework
tier: standard
order: 90
dates:
  start: "2026-02"
  end: "2026-03"
affiliation: "Neurally Inspired Computing Systems, UC Santa Barbara (Winter 2026)"
role: "RTL implementation and testbench"
repo: "https://github.com/saifalomari99/Neurally_Inspired_Computing_Systems_Winter2026"
thumbnail:
  src: ./images/02-waveform.png
  alt: "Icarus Verilog simulation waveform of the spiking neural network showing membrane potentials, spikes, and weight maps."
  fit: cover
hero:
  src: ./images/hero.png
  alt: "Two 5x5 heat maps of synaptic weights after training; neuron 1 shows a ring pattern resembling a zero and neuron 2 shows a vertical bar resembling a one."
  caption: "Weight maps after training. Neuron 1 has converged toward the ring-shaped pattern and neuron 2 toward the vertical-bar pattern."
gallery:
  - src: ./images/01-initial-weights.png
    alt: "Two 5x5 heat maps of the initial synaptic weights before training."
    caption: "Initial weights before STDP training."
  - src: ./images/02-waveform.png
    alt: "Simulation waveform showing clock, reset, input spikes, step counter, membrane potentials, output spikes, spike counters, and weight maps."
    caption: "Icarus Verilog simulation: membrane potentials integrate input spikes, fire at threshold, and lateral inhibition suppresses the losing neuron."
metrics:
  - value: "25 → 2"
    label: "Input spike trains to output neurons"
  - value: "2-bit"
    label: "Synaptic weight resolution"
  - value: "20"
    label: "Time steps per input presentation"
credits:
  - name: "Course assignment specification"
    note: "Network topology, neuron parameters, STDP rule, dataset, and initial weights were specified by the course; the RTL and testbench are my implementation."
---

## Overview

Spiking neural networks compute with the timing of discrete events rather than continuous activations, which maps naturally onto digital hardware: a neuron is an accumulator and a comparator, a synapse is a small weight, and learning is a local update rule that only needs to know when the two neurons on either side of the synapse fired. This project implements such a network in synthesizable Verilog and trains it in simulation.

## Architecture

- **Inputs.** A 5x5 binary image is encoded as 25 spike trains, one per pixel, each 20 time steps long.
- **Neurons (`if_output_neuron.v`).** Each of the two output neurons sums the weighted pre-synaptic spikes with packed 2-bit weights, adds the result to a membrane potential clamped at a resting value of 6, and fires when the potential reaches the threshold of 65. The potential resets on the next clock edge or when inhibited.
- **Lateral inhibition (`snn_hw4_top.v`).** When neuron 1 fires it suppresses neuron 2 in the same step, forcing the two neurons to specialize on different patterns.
- **STDP learning.** A two-cycle spike history per input supports a timing window of plus or minus two steps. A pre-before-post event within one step strengthens the synapse by 2 (by 1 at two steps); post-before-pre weakens it by the same amounts. Updates saturate within the 2-bit range and are gated by a training-enable input so weights freeze during testing.
- **Testbench (`tb_snn_hw4_top.v`).** Drives the training and testing sequences, prints the weight maps and per-step potentials and spikes, and writes a VCD waveform for inspection.

## Results

After training, neuron 1's weight map resembles the ring-shaped pattern and neuron 2's resembles the vertical-bar pattern, and the frozen network fires the matching neuron for the test presentations of each class. The results are qualitative; the assignment used two pattern classes rather than a labelled dataset with accuracy metrics.

## Engineering decisions and challenges

- **Packed weight storage.** Keeping 25 two-bit weights per neuron in a single packed vector keeps the weighted sum a simple combinational reduction and makes the weight map easy to print from the testbench.
- **Saturating updates.** With only four weight levels, every update must clamp; a small helper function applies the signed delta without wrap-around.
- **Timing window as shift history.** Recording two cycles of spike history per input is enough to implement the plus or minus two-step STDP window without storing timestamps.

## My contribution

Individual coursework. I wrote the neuron module, the top-level network with lateral inhibition and STDP, and the testbench. The network parameters and learning rule were specified by the course.
