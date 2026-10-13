---
title: "OpenVoxel2Mesh: MRI Segmentation to 3D Mesh"
tagline: "A template-free pipeline and desktop GUI that turns MRI segmentation masks into smooth, watertight surface meshes using signed distance fields."
summary: "OpenVoxel2Mesh converts 3D MRI label volumes (.nii, .nii.gz, .mgz) into surface meshes without anatomical templates. The pipeline cleans each label mask, builds a signed distance field, extracts an isosurface with marching cubes, then applies Taubin smoothing and uniform remeshing. A PyQt6 application runs every label in parallel and assembles the results into a 3D view of the brain."
category: software
tags: [coursework]
tech: ["Python", "NumPy", "SciPy", "scikit-image", "trimesh", "PyVista", "pyacvd", "nibabel", "PyQt6"]
type: team-coursework
tier: featured
order: 110
dates:
  start: "2026-04"
  end: "2026-06"
affiliation: "UCSB ECE 278A, Digital Image Processing"
team: "Team of 4"
role: "Repository owner; pipeline and GUI developed with the team"
repo: "https://github.com/saifalomari99/OpenVoxel2Mesh"
hero:
  src: ./images/hero.png
  alt: "3D rendering of a reconstructed human brain viewed from the side, with cortical regions in shades of blue, teal, and green, the cerebellum in yellow, and a small red brainstem."
  caption: "All-labels reconstruction from an OASIS DKT31 label volume, with each cortical parcel meshed independently and placed at its anatomical position."
gallery:
  - src: ./images/01-gui.png
    alt: "The OpenVoxel2Mesh desktop application with a parameter panel on the left, a 3D viewport showing a multicoloured brain in the center, a log panel below it, and a list of anatomical labels with checkboxes on the right."
    caption: "The PyQt6 GUI after an all-labels run: 96 of 99 labels meshed, each toggleable from the label panel."
  - src: ./images/02-pipeline.png
    alt: "Block diagram of the pipeline from a segmentation mask through label extraction and mask cleaning to signed-distance-field surface extraction, optional Taubin smoothing, uniform remeshing, and a surface mesh output."
    caption: "Pipeline overview. The SDF path is the default; a binary marching-cubes baseline is kept for comparison."
metrics:
  - value: "96 / 99"
    label: "Labels meshed in a full-brain parallel run"
  - value: "3,400+"
    label: "Lines of Python across 34 modules"
  - value: "3"
    label: "Input formats (.nii, .nii.gz, .mgz)"
credits:
  - name: "OASIS-TRT-20 DKT31 label volumes"
    note: "De-identified, publicly released manual cortical labels (Mindboggle-101) used as sample data."
  - name: "scikit-image, SciPy, trimesh, PyVista, pyacvd, nibabel, PyQt6"
    note: "Open-source libraries for marching cubes, distance transforms, mesh processing, remeshing, I/O, and the GUI."
---

## Overview

OpenVoxel2Mesh reconstructs 3D surface meshes from MRI segmentation masks. Given a label volume in which each voxel carries an integer anatomical label, it produces one watertight triangle mesh per label (or per selected label) and can assemble all of them into a single anatomical view. It was developed as a team project for a graduate digital image processing course and is written in Python with a command-line interface and a desktop GUI.

## Problem

Marching cubes on a binary mask produces a staircase surface that follows voxel edges. Smoothing that surface afterwards shrinks thin structures and can break watertightness. Template-based methods avoid this by deforming an atlas mesh, but they require a template for each anatomy and bias the result toward it. The goal was a template-free pipeline that still produces smooth, watertight, metrically sensible meshes directly from the mask.

## Architecture

The pipeline is a sequence of small modules under `src/`:

1. **Load** (`io_utils.py`): `nibabel` reads `.nii`, `.nii.gz`, and `.mgz` volumes; voxel spacing comes from the header.
2. **Label selection and cleaning** (`mask_cleaning.py`): the chosen label becomes a boolean mask, the largest connected component is kept, and internal holes are filled.
3. **Surface extraction** (`sdf.py`, `mesh_generation.py`): the default path computes a signed distance field as the difference of two Euclidean distance transforms in physical units, optionally Gaussian-smooths it, optionally upsamples it 2x, and runs marching cubes at the zero level set. A binary baseline runs marching cubes on the mask at 0.5 for comparison. Every path fixes normals and orients the mesh so volume is positive.
4. **Taubin smoothing** (`mesh_smoothing.py`): low-shrinkage smoothing with configurable lambda, mu, and iteration count.
5. **Uniform remeshing** (`mesh_remeshing.py`): `pyacvd` clustering on a PyVista surface produces evenly sized triangles at a target vertex count.
6. **Metrics and export** (`mesh_metrics.py`): vertex and face counts, surface area, volume, and watertightness are reported, and the mesh is written as `.ply` with automatic dataset-aware naming.

The **GUI** (`src/frontend/`) is a PyQt6 application with a parameter panel, an embedded 3D viewport, a live log, and a label panel. Long-running work happens in `QThread` workers; the all-labels mode fans out across a `ProcessPoolExecutor` sized to the CPU count and streams progress back to the log. Finished meshes are colored by label and placed at their raw anatomical coordinates in a `pyvistaqt` interactor.

## Features

- SDF-based extraction with optional Gaussian smoothing and 2x upsampling, plus a binary marching-cubes baseline
- Optional Taubin smoothing and uniform remeshing
- Per-mesh metrics including watertightness
- Parallel all-labels processing with an assembled anatomical view
- FreeSurfer and DKT31 lookup tables so labels appear by anatomical name
- Automatic output naming that encodes the dataset, subject, label, and method
- A `shrinkage_table.py` analysis script that sweeps smoothing settings and reports area and volume change against the binary baseline

## Engineering decisions and challenges

- **Signed distance fields instead of post-hoc smoothing.** Smoothing the scalar field before extraction yields a smooth surface that still passes through the true boundary, so volume is preserved far better than smoothing the mesh afterwards.
- **Physical spacing throughout.** Distance transforms, upsampling, and metrics use the voxel size from the header, so area and volume are reported in real units and anisotropic volumes are handled correctly.
- **Process-level parallelism for the full brain.** Meshing roughly 100 labels is embarrassingly parallel but each job is CPU-bound Python; a process pool with the module path injected into each worker gave near-linear speedup.
- **Keeping the viewer responsive.** Rendering a hundred meshes in Qt required decimating for display only and moving file I/O off the UI thread.

## Results

On the bundled OASIS DKT31 sample, a full all-labels run meshed 96 of 99 labels (the remaining three are tiny or degenerate regions that produce no closed surface) and loaded them into the viewer. Area and volume comparisons against the binary baseline are produced by the shrinkage analysis script.

## My contribution

This was a four-person team project; the repository is hosted on my GitHub account and I maintained it. The pipeline, GUI, and analysis tooling were developed together with my teammates. The datasets and libraries the project builds on are listed below.
