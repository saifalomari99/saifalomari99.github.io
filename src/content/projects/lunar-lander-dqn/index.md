---
title: "Deep Q-Network Agent for Lunar Lander"
tagline: "Training a DQN agent to land a simulated spacecraft, from crash-prone early episodes to a policy averaging above 200 reward over 100 evaluation episodes."
summary: "A reinforcement-learning project in the Gymnasium LunarLander-v3 environment using a Deep Q-Network from Stable-Baselines3. After a first configuration failed to learn due to exploration scheduling, a second run with a larger replay buffer, longer exploration, and a two-layer 256-unit network reached a mean evaluation reward of 206.46 over 100 deterministic episodes."
category: ml-ai
tags: [coursework]
tech: ["Python", "Gymnasium", "Stable-Baselines3", "PyTorch", "DQN", "Reinforcement Learning"]
type: coursework
tier: standard
order: 160
dates:
  start: "2026-02"
  end: "2026-03"
affiliation: "Artificial Intelligence, UC Santa Barbara (Winter 2026)"
role: "Experiment design, training, and evaluation"
repo: "https://github.com/saifalomari99/Artificial_Intelligence_SaifAlomari_Winter2026/tree/main/Reinforcement_Learning_Luner_Lander"
hero:
  src: ./images/hero.png
  alt: "The Lunar Lander simulation with the purple lander resting upright on the landing pad between two yellow flags."
  caption: "A successful landing by the trained policy."
gallery:
  - src: ./images/01-early-training.png
    alt: "The Lunar Lander simulation with the lander hovering above the pad, main engine firing."
    caption: "Early in training the agent hovers and drifts before it learns to commit to a landing."
metrics:
  - value: "206.46"
    label: "Mean reward over 100 evaluation episodes"
  - value: "528k"
    label: "Training timesteps"
  - value: "2,000"
    label: "Training episodes"
credits:
  - name: "Gymnasium LunarLander-v3 and Stable-Baselines3"
    note: "Environment and DQN implementation (experience replay, target network)."
---

## Overview

LunarLander is a standard reinforcement-learning benchmark: the agent controls a lander's main and side engines and is rewarded for touching down gently on the pad and penalised for crashing or burning fuel. A score above 200 is generally considered solved. This project trains a Deep Q-Network agent and documents what it took to get there.

## Approach

- **Baseline.** A random policy scores around -131 per episode.
- **Run 1 (failed).** Learning rate 5e-4, a 200k replay buffer, a [256, 256] network, and exploration decaying over 20% of training. After 600 episodes the evaluation mean was -169: the agent had stopped exploring before it had seen enough successful landings.
- **Run 2.** Learning rate 1e-3, a 300k replay buffer, 5,000 warm-up steps, batch size 128, discount 0.99, target-network update every 500 steps, training every 4 steps, exploration decaying over 30% of the budget to a floor of 0.05, and the same [256, 256] network. A callback capped training at 2,000 episodes, which stopped at 528,134 timesteps.
- **Evaluation.** 100 deterministic episodes with fixed seeds, plus reward and episode-length curves, 50-episode moving averages, and histograms.

## Results

The final policy scored a mean reward of 206.46 with a mean episode length of 183 steps over the 100 evaluation episodes. Training recordings at episodes 150, 750, 1200, and 1775 in the repository show the progression from chaotic flight to controlled landings; around the first thousand episodes the running reward crosses from negative to positive.

## Engineering decisions and challenges

- **Exploration schedule was the bottleneck.** The difference between a failed and a solved run was almost entirely how long epsilon stayed high. Sparse landing rewards require many exploratory episodes before the replay buffer contains useful transitions.
- **Larger buffer and warm-up.** Starting learning only after 5,000 random steps and keeping 300k transitions gave the network a more diverse sample of states early in training.
- **Deterministic evaluation.** Evaluating with greedy actions and fixed seeds separates the policy's quality from exploration noise.

## My contribution

Individual coursework. I designed the experiments, trained and evaluated the agent, and wrote the analysis. The environment and DQN implementation are credited below.
