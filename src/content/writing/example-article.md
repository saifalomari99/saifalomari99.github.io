---
# Example article. It is a draft, so it is not built or listed.
# To publish your first article: copy this file, rename it to the URL slug,
# fill in the fields, and set draft: false (or delete the line).
title: "Closing 5,800 CDC Violations: A Field Guide"
description: "What a clock-domain-crossing cleanup on a production FPGA design actually involves, from triage to sign-off."
pubDate: 2026-10-12
tags: ["FPGA", "CDC", "Verification"]
draft: true
---

## Why this matters

Write the article body in Markdown. Headings, lists, tables, code blocks, and images all render with the site's typography.

```verilog
// Two-flop synchronizer for a single-bit control signal
always_ff @(posedge clk_dst) begin
  sync_ff <= {sync_ff[0], async_in};
end
```

Images can be placed next to this file and referenced with a relative path.
