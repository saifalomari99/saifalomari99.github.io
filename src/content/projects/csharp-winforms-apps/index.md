---
title: "C# WinForms Applications"
tagline: "Three small Windows Forms programs: a parametric circle-rosette drawer, a regular-expression form validator, and a GDI+ yin-yang renderer."
summary: "Early C# desktop programming exercises using Windows Forms and GDI+: a drawing application that places N circles around a center using trigonometry, a form that validates name, address, and phone fields with regular expressions before confirming the data in a second window, and a yin-yang symbol drawn from layered arcs and ellipses."
category: software
tags: [coursework]
tech: ["C#", "Windows Forms", "GDI+", ".NET", "Regular Expressions"]
type: coursework
tier: minor
order: 170
dates:
  start: "2024"
repo: "https://github.com/saifalomari99/Programming_Projects_Saif_Alomari"
hero:
  src: ./images/hero.png
  alt: "A Windows Forms window titled Saif's Beautiful Circles showing nine overlapping blue circles arranged in a rosette, with controls for count and color."
  caption: "Draw Multiple Circles: nine circles placed around a center point."
gallery:
  - src: ./images/01-regex-validator.png
    alt: "A Windows Forms data-entry form with name, address, and phone fields, and an error dialog reading Invalid Last Name."
    caption: "Validate Regular Expressions: each field is checked against a pattern and errors are reported before confirmation."
---

## Overview

These are introductory desktop-programming exercises in C#.

- **Draw Multiple Circles.** The user picks a count and a color; the program places that many circles of fixed radius evenly around a center point using sine and cosine, producing a rosette pattern, and draws them with GDI+.
- **Validate Regular Expressions.** A form collects last name, first name, address, city, state, ZIP code, and phone number, validates each with a `Regex` pattern, shows a message box for the first invalid field, and on success opens a confirmation window listing the entered data.
- **Yin Yang Logo.** A `Paint` handler draws the symbol from filled pies and ellipses.

## My contribution

Individual coursework; all code is my own.
