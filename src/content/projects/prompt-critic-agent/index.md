---
title: "LLM Prompt Critic Agent"
tagline: "A language-model critic that iteratively rewrites a code-generation prompt for clarity, library choice, data handling, and evaluation."
summary: "A compact notebook that defines a ten-point critic system prompt and applies it in two rounds to a user's request for machine-learning code, producing progressively more specific prompts that name libraries, data loading, evaluation, and missing-value handling."
category: ml-ai
tags: [coursework]
tech: ["Python", "OpenAI API", "Prompt Engineering"]
type: coursework
tier: minor
order: 140
dates:
  start: "2026-02"
affiliation: "Artificial Intelligence, UC Santa Barbara (Winter 2026)"
repo: "https://github.com/saifalomari99/Artificial_Intelligence_SaifAlomari_Winter2026/tree/main/Critic_Prompt_Making"
hero:
  src: ./images/hero.png
  alt: "Diagram of the prompt critic loop: a draft prompt goes to an LLM critic that scores it against a ten-point rubric and returns a revised prompt, repeated for two rounds."
  caption: "The critic loop: each round feeds the revised prompt back to the critic."
---

## Overview

Language models write better code from better prompts, and writing a good prompt is itself a skill a model can help with. This notebook defines a "critic" with a ten-point rubric (clarity, explicit libraries, data loading, evaluation, comments, missing-data handling, and so on) and asks it to rewrite a user's prompt. The rewritten prompt is fed back for a second revision, and the original and both revisions are printed for comparison.

## Example

The sample input asks for a vanilla recurrent neural network over larval trajectory data stored in CSV files sampled every 1/30 second. After two critic passes, the prompt specifies the framework, how to parse and window the sequences, which metrics to report, and how to handle gaps in the data.

## My contribution

Individual coursework. I wrote the critic prompt and the iteration loop. No API keys are stored in the repository.
