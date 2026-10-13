---
title: "Image Segmentation: Thresholding and Region-Based Methods"
tagline: "A team-taught lecture notebook on image segmentation, from global thresholding through watershed, with reviews of two recent papers."
summary: "A fifty-minute lecture delivered with three classmates for UCSB's Digital Image Processing course, built as a runnable Jupyter notebook. I presented the introduction to segmentation, basic global thresholding with synthetic and real examples in OpenCV and scikit-image, and a review of a 2026 paper on denoising binary built-up maps with multi-temporal thresholding. Teammates covered Otsu and adaptive methods, region splitting and merging, watershed, and a cryo-electron tomography paper."
category: software
tags: [ml-ai, coursework]
tech: ["Python", "OpenCV", "scikit-image", "NumPy", "Matplotlib", "Jupyter"]
type: team-coursework
tier: standard
order: 120
dates:
  start: "2026-05"
affiliation: "UCSB ECE 278A, Digital Image Processing"
team: "Team of 4"
role: "Introduction, basic thresholding, and paper review sections"
links:
  - label: "Notebook in the course repository"
    url: "https://github.com/geometric-intelligence/ece278a/tree/main/topics/segmentation_thresholding_region-based"
thumbnail:
  src: ./images/04-histogram-thresholds.png
  alt: "Three intensity histograms with thresholds marked and the resulting binary images below."
  fit: cover
hero:
  src: ./images/hero.png
  alt: "Two thermal camera images of a person, each next to its black-and-white result after thresholding at T=175, where the warm body separates cleanly from the cooler background."
  caption: "Global thresholding on thermal images at T=175: the warm subject separates cleanly from the cooler scene."
gallery:
  - src: ./images/04-histogram-thresholds.png
    alt: "Three intensity histograms of the same photograph with a dashed red line at thresholds 13, 82, and 186, and below each the resulting black-and-white image."
    caption: "Reading a threshold off the histogram: the same image binarized at three thresholds, each placed in a different valley or peak of its intensity distribution."
  - src: ./images/03-bright-object.png
    alt: "A noisy dark image with a bright circle, and its clean binary threshold result."
    caption: "When thresholding works: a bright object on a dark background separates cleanly at a single threshold despite noise."
  - src: ./images/01-nested-regions.png
    alt: "A synthetic image of nested circles touching a rectangle, and the thresholded result that merges regions of similar intensity."
    caption: "When it does not: touching and nested regions with overlapping intensities cannot be separated by intensity alone, which motivates region-based methods."
  - src: ./images/02-threshold-sweep.png
    alt: "A grid of ten binarized versions of the scikit-image coins photograph at thresholds from 0.0 to 0.9."
    caption: "Threshold sweep on the coins image: too low and the background bleeds in, too high and the coins break apart."
---

## Overview

Each team in the course prepared a lecture with theory, runnable code, and a recent paper. Our topic was segmentation: how to go from pixels to regions, first by thresholding intensity and then by growing, splitting, merging, and flooding regions.

The notebook is organized in seven parts: an introduction, basic thresholding, global variants (Otsu and multi-Otsu), local adaptive thresholding (local mean, Niblack, Sauvola), a 2026 paper on multi-temporal thresholding, region-based segmentation (splitting, merging, watershed, marker-controlled watershed, and a 2024 cryo-electron tomography paper), and citations.

## My sections

**Introduction.** Why segmentation matters, the applications that depend on it, and the two fundamental approaches the rest of the lecture builds on.

**Basic thresholding.** The rule is simple: compare each pixel to a value and assign it to foreground or background. The section makes the behavior concrete with synthetic images generated in NumPy and OpenCV (a bright disc on a noisy background that separates cleanly; nested circles touching a rectangle that cannot be separated by intensity), real photographs, a threshold sweep across the scikit-image coins image, and histogram views that show why a threshold in a valley between modes works and one placed on a peak does not.

**Paper review: multi-temporal thresholding.** A 2026 paper that denoises binary built-up (urban footprint) maps by combining several images of the same area taken on different dates into a frequency map, then thresholding that map with adaptive, Otsu, and voting rules. I walked through the workflow, the nine study sites, and how the multi-image result compares with single-image segmentation and an existing global dataset.

## Teammates' sections

Otsu's method and its limitations, multi-level thresholding, local adaptive thresholding, region splitting with quadtrees, region merging with superpixels, the watershed transform and its over-segmentation problem, marker-controlled watershed, and a 2024 paper that uses marker-controlled watershed to erase gold fiducial markers from cryo-electron tomography tilt series.

## My contribution

I wrote, coded, and presented the introduction, the basic thresholding section (shared with one teammate), and the paper review. The figures shown here are the synthetic and sample-image plots generated in the notebook; photographs and paper figures used in the lecture are not reproduced on this site.
