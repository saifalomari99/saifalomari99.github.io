---
title: "LLM-Guided Design Space Exploration for HLS Accelerators"
tagline: "A multiagent, LLM-ranked design space exploration framework for Vitis HLS that cut clock cycles 54% on average across nine HLS benchmarks."
summary: "A research framework that optimizes High-Level Synthesis pragmas (parallelism, pipelining, tiling, array partitioning) for FPGA accelerators. Instead of changing one pragma per step, it generates up to 48 complete pragma configurations, scores them with an LLM-based design ranker conditioned on the synthesis history, screens the pick with a hardware risk pre-checker, and synthesizes one design per step with Vitis HLS. On nine HLSyn benchmarks it reduced clock cycles by 54.0% versus a gradient-search baseline and 46.9% versus a pure LLM agent baseline, winning on all nine."
category: fpga-rtl
tags: [ml-ai, software]
tech: ["Vitis HLS", "FPGA", "High-Level Synthesis", "Python", "LLM Agents", "Gemini API", "Alveo U200", "HLSyn"]
type: research
tier: featured
order: 130
dates:
  start: "2026-04"
  end: "2026-06"
affiliation: "UC Santa Barbara (Spring 2026)"
team: "Team of 2"
role: "Co-author; framework design, implementation, and evaluation with one collaborator"
sourceStatus: closed
hero:
  src: ./images/hero.png
  alt: "Two-stage framework diagram: a bootstrap phase evaluates default, flatten, single-max-parallelism, and LLM-recommended seed designs, then a main loop runs phase determination, agent generation, heuristic sampling, LLM ranking, hardware pre-checking, and one Vitis HLS synthesis per step."
  caption: "Overview of the two-stage framework: a bootstrap phase seeds the observation history, then each main-loop step ranks up to 48 candidates and synthesizes one."
thumbnail:
  src: ./images/02-pipeline-comparison.png
  alt: "Diagram comparing how AutoDSE, LLM-DSE, and the proposed method extend the base Vitis HLS flow."
  fit: cover
gallery:
  - src: ./images/01-method-comparison.png
    alt: "Conceptual comparison on a two-dimensional performance landscape: a single-pragma gradient search gets stuck at a local optimum, an LLM agent pipeline wanders without ranking, and the proposed method jumps directly to the high-performance region by scoring 48 candidates per step."
    caption: "Why full-configuration ranking helps: single-pragma steps (red) stall in a local optimum, unranked agents (orange) wander, and ranked multi-pragma jumps (green) reach the high-performance region."
  - src: ./images/02-pipeline-comparison.png
    alt: "Four rows comparing the base HLS flow, AutoDSE with a gradient search loop, LLM-DSE with an agent pipeline, and the proposed flow that inserts four agents, an LLM ranker, and a hardware checker before Vitis HLS."
    caption: "How each method extends the base C/C++ to Vitis HLS flow. The proposed method inserts a candidate pool, an LLM ranker, and a hardware pre-checker before synthesis."
  - src: ./images/03-main-loop.png
    alt: "Main-loop architecture: observation history feeds a phase controller, a 48-candidate pool built from four agents and heuristic sampling, an LLM ranker, a hardware pre-checker, Vitis HLS synthesis, and a record-and-update step that feeds back into the history."
    caption: "The main-loop search engine, from phase control through candidate generation, ranking, pre-checking, synthesis, and feedback."
metrics:
  - value: "-54.0%"
    label: "Average clock cycles vs. single-pragma gradient baseline"
  - value: "-46.9%"
    label: "Average clock cycles vs. pure LLM-agent baseline"
  - value: "9 / 9"
    label: "Benchmarks won (HLSyn, Vitis HLS 2024.2)"
credits:
  - name: "HLSyn benchmark suite"
    note: "Nine kernels (gemm-p, atax-medium, jacobi-2d, fdtd-2d, syr2k, covariance, trmm-opt, 3mm, gemver-medium) used for evaluation."
  - name: "AutoDSE and LLM-DSE"
    note: "Prior methods re-implemented on the same Vitis HLS 2024.2 infrastructure as baselines."
  - name: "LLAMBO"
    note: "The discriminative LLM surrogate model that inspired the design ranker."
---

## Overview

High-Level Synthesis lets an FPGA accelerator be written in C or C++, but its performance depends on pragmas that control loop parallelism (PARA), pipelining (PIPE), tiling (TILE), and array partitioning (PART). The space of pragma combinations is far too large to search by hand or exhaustively, and each evaluation costs a full synthesis run. Design space exploration (DSE) automates that search.

This project is a DSE framework for the Vitis HLS toolchain, written up as a research paper with one collaborator at UC Santa Barbara. Its central idea is that complete pragma configurations should be ranked, not proposed one pragma at a time. The code is not public.

## Problem

Existing tools move one pragma per step. Gradient-style heuristics such as AutoDSE climb toward a local optimum and cannot make large jumps. LLM-agent approaches such as LLM-DSE explore more broadly, but still change a single directive per step and have no data-driven way to score a pool of candidates against the synthesis results already observed. Both waste expensive synthesis runs on designs that overflow the FPGA's resources or time out, and neither can make a coordinated move such as enabling loop flattening while raising parallelism and adjusting tiling at the same time.

## Architecture

The framework runs in two stages.

**Bootstrap.** Several seed designs are synthesized in parallel to give the ranker an informative prior: an all-conservative default, a flatten-only probe, one design per PARA pragma at its maximum value, and up to three designs recommended by the LLM after reading the kernel's C code.

**Main loop.** Each of the N steps performs the same sequence:

1. **Phase determination.** A rule-based controller reads the observation history and picks one of four phases (explore, balanced, resource fix, escape) from the recent overflow count, a stagnation counter, and the budget consumed.
2. **Multiagent candidate generation** (every third step). Four role-specialized agents each propose up to two complete configurations: an aggressive parallelizer, a pipeline strategist, a resource guardian, and an escape explorer. The phase decides which agents are active.
3. **Heuristic sampling** fills the pool to 48 designs with kernel-aware candidates: boundary sweeps of each PARA pragma, partition injection, single-pragma exploits of the best design, one-to-two-pragma mutations, and random designs with extreme-configuration injection. A session-wide seen set prevents re-evaluating any design.
4. **LLM design ranker.** A discriminative surrogate adapted from LLAMBO samples two performance predictions per candidate in log-cycle space and selects the candidate with the highest expected improvement over the current best. Invalid and timed-out designs stay in the history with a penalty value so the ranker learns to avoid them.
5. **Hardware pre-checker.** Before synthesis, a composite risk score built from the log2 of each PARA, TILE, and PART value (parallelism pressure plus tiling load minus partition relief, plus penalties for flatten usage) screens the ranker's pick. If it fails, the next passing candidate is used. Two hard-reject rules catch unproven outer-loop flattening under high compute pressure and candidates dominated by a prior timeout.
6. **Synthesis and feedback.** One Vitis HLS run records cycles and LUT, FF, BRAM, DSP, and URAM utilization; any resource above 80% marks the design invalid. Every third step, one additional agent proposal is force-evaluated to give the ranker unbiased feedback on agent quality.

When the search stagnates for five steps, an escape mode suspends the ranker and the agents for three steps and injects exploratory candidates with a relaxed pre-checker threshold.

## Results

Experiments targeted a Xilinx Alveo U200 with Vitis HLS 2024.2, a 50-step budget, and a five-minute synthesis timeout. On nine HLSyn kernels the framework reduced best clock cycles by 54.0% on average versus the AutoDSE-style gradient baseline and 46.9% versus the LLM-DSE baseline (best of three seeds at evaluation index 50), winning on all nine benchmarks; a single seed also wins all nine. The largest gains came on kernels whose best configurations need coordinated pipeline, tiling, and parallelism choices, such as covariance (-74.3%) and 3mm (-73.3%). Runs took roughly one to four hours per benchmark with an estimated LLM cost of about two dollars each.

An ablation with the agents disabled degraded results on six of nine benchmarks, most sharply on covariance, where agent proposals found a flatten-based configuration that heuristic sampling never reached. One benchmark, 3mm, did better without agents because aggressive agent proposals triggered synthesis timeouts; the paper identifies timeout-aware filtering and seed-to-seed variance as the main open problems.

## Engineering decisions and challenges

- **Rank full configurations, generate diversely.** Decoupling candidate generation (agents and heuristics) from selection (the ranker) is what allows multi-pragma jumps while staying sample-efficient.
- **Filter before paying for synthesis.** The pre-checker has no access to real resource counts, which only exist after synthesis, so it estimates pressure from pragma values alone. That is enough to keep most overflows and timeouts from consuming the budget.
- **Keep failures in the history.** Penalized rather than discarded, invalid designs steer the ranker away from bad regions without hiding information.
- **Make the backend swappable.** Synthesis runs behind a shell-script interface with a strict JSON contract, so other HLS toolchains can be plugged in.

## My contribution

I co-authored the paper and worked with my collaborator on the framework's design, implementation on the Vitis HLS toolchain, baseline re-implementations, and the benchmark evaluation. The paper is a draft; the implementation is closed source.
