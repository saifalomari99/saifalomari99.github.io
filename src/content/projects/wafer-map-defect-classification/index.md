---
title: "Wafer-Map Failure Pattern Classification"
tagline: "Classifying wafer-map failure signatures from ten geometric features of the salient defect region with a decision tree and an RBF support-vector classifier."
summary: "A machine-learning project on the WM-811K wafer-map dataset. Each wafer map is reduced to its largest connected region of failing dies, from which ten geometric descriptors are computed: area and perimeter ratios, radial extent, ellipse axis ratios, solidity, eccentricity, yield loss, and edge yield loss. A depth-limited decision tree and an RBF SVC are trained to separate five failure types, reaching 86.55% and 82.91% validation accuracy."
category: ml-ai
tags: [coursework]
tech: ["Python", "scikit-learn", "scikit-image", "NumPy", "pandas", "matplotlib", "OpenAI API"]
type: coursework
tier: standard
order: 150
dates:
  start: "2025-10"
  end: "2025-12"
affiliation: "Machine Learning Design and Test Automation, UC Santa Barbara (Fall 2025)"
role: "Feature engineering, model training, and evaluation"
repo: "https://github.com/saifalomari99/MachineLearning_Design_and_TestAutomation_SaifAlomari"
hero:
  src: ./images/hero.png
  alt: "Five wafer maps side by side labelled Center, Edge-Loc, Scratch, Donut, and Near-full, with failing dies shown in red on a light blue wafer."
  caption: "One example of each failure class in the training set."
gallery:
  - src: ./images/01-salient-region.png
    alt: "Three rows, each showing a wafer map on the left and its extracted salient failure region on the right."
    caption: "Salient-region extraction: the largest 8-connected component of failing dies, from which all ten features are computed."
metrics:
  - value: "86.55%"
    label: "Decision-tree validation accuracy"
  - value: "82.91%"
    label: "SVC validation accuracy"
  - value: "10"
    label: "Geometric features per wafer"
credits:
  - name: "WM-811K wafer map dataset"
    note: "Public dataset of labelled wafer maps; a 2,746-sample subset was used."
---

## Overview

Wafer maps record which dies on a semiconductor wafer passed or failed final test. The spatial pattern of failures often points to a specific process problem: a ring near the edge, a central cluster, a scratch, a donut. This project builds a classical machine-learning classifier that recognises five such patterns (Center, Donut, Edge-Loc, Near-full, Scratch) from hand-designed geometric features rather than from raw pixels.

## Approach

1. **Salient region.** Failing dies are labelled with scikit-image connected-component analysis and the largest 8-connected region is kept, which removes random isolated failures.
2. **Features.** Ten descriptors are computed per wafer: area ratio and perimeter ratio of the region, maximum and minimum distance from the wafer center, major- and minor-axis ratios from an ellipse fit, solidity, eccentricity, overall yield loss, and edge yield loss over the outer two die rings found by iterative erosion.
3. **Models.** A stratified 80/20 split holds out validation data. A decision tree limited to depth 3 and an RBF-kernel support-vector classifier are trained on the same features and compared on overall and per-class accuracy with confusion matrices.

## Results

| Model | Training accuracy | Validation accuracy |
|-------|------------------:|--------------------:|
| Decision tree (depth 3) | 88.21% | 86.55% |
| SVC (RBF) | 82.70% | 82.91% |

Center patterns are recognised almost perfectly by both models; Donut and Scratch are the hardest classes. The Near-full class makes up only about half a percent of the data, so its per-class numbers rest on very few samples.

## Engineering decisions and challenges

- **Features over pixels.** With under three thousand samples and strong class imbalance, interpretable geometric features generalise better than a pixel-level model and make the confusion between classes explainable.
- **Depth-limited tree.** Restricting the tree to three levels kept training and validation accuracy within two points of each other, a sign it was not overfitting the small dataset.
- **LLM-assisted workflow.** The course required generating analysis code through API calls to a language model with the prompts preserved in the notebook; the feature definitions, model choices, and evaluation were designed and verified by hand.

## My contribution

Individual coursework. I designed the feature set, implemented the extraction and training notebook, and evaluated both models. The dataset is credited below.
