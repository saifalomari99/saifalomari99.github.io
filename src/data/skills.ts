/**
 * Technical skills, grouped as on the resume. Each item points to an SVG in
 * src/assets/skills/ (file name without extension).
 *
 * Icon sources:
 *  - `brand: true` entries are official brand marks (Simple Icons, CC0, or
 *    Wikimedia Commons public-domain files for Lattice and MATLAB), rendered
 *    in their brand colors.
 *  - all others are line icons (Lucide, ISC, plus a few drawn in the same
 *    style) rendered in the site's accent color.
 *
 * To add a skill: drop an SVG into src/assets/skills/ and add an entry here.
 */
export interface SkillItem {
  name: string;
  /** File name (no extension) in src/assets/skills/; SVG or PNG. */
  icon: string;
  brand?: boolean;
  /** Wide wordmark logos get a wider box. */
  wide?: boolean;
}

export interface SkillGroup {
  name: string;
  items: SkillItem[];
}

export const skills: SkillGroup[] = [
  {
    name: 'RTL / FPGA Design',
    items: [
      { name: 'Verilog', icon: 'hdl-v' },
      { name: 'SystemVerilog', icon: 'hdl-sv' },
      { name: 'RTL Design', icon: 'flipflop' },
      { name: 'Clock-Domain Crossing', icon: 'cdc' },
      { name: 'FPGA Timing Analysis', icon: 'timer' },
      { name: 'Synthesis', icon: 'and-gate' },
    ],
  },
  {
    name: 'Firmware / Embedded',
    items: [
      { name: 'Embedded Firmware', icon: 'binary-chip' },
      { name: 'Firmware Debugging', icon: 'bug' },
      { name: 'Microcontrollers', icon: 'cpu' },
      { name: 'JTAG', icon: 'plug' },
      { name: 'RISC Architectures', icon: 'riscv', brand: true },
    ],
  },
  {
    name: 'Interfaces / Memory',
    items: [
      { name: 'MIPI CSI-2', icon: 'camera' },
      { name: 'I2C', icon: 'i2c' },
      { name: 'DRAM', icon: 'memory' },
      { name: 'ADC', icon: 'adc' },
      { name: 'JTAG', icon: 'plug' },
    ],
  },
  {
    name: 'Programming / Scripting',
    items: [
      { name: 'C', icon: 'c', brand: true },
      { name: 'C++', icon: 'cplusplus', brand: true },
      { name: 'C#', icon: 'dotnet', brand: true },
      { name: 'Python', icon: 'python', brand: true },
      { name: 'MATLAB', icon: 'matlab', brand: true },
      { name: 'Shell Scripting', icon: 'gnubash', brand: true },
    ],
  },
  {
    name: 'Development Tools',
    items: [
      { name: 'QuestaSim', icon: 'siemens', brand: true },
      { name: 'Lattice Radiant', icon: 'lattice-semiconductor', brand: true, wide: true },
      { name: 'Xilinx Vivado', icon: 'amd', brand: true },
      { name: 'Xilinx Vitis', icon: 'amd', brand: true },
      { name: 'LTspice', icon: 'resistor' },
      { name: 'OrCAD PSpice', icon: 'schematic' },
      { name: 'Aldec ALINT-PRO', icon: 'search-check' },
    ],
  },
  {
    name: 'Lab / Hardware',
    items: [
      { name: 'Soldering', icon: 'soldering-iron' },
      { name: 'Logic Analyzers', icon: 'logic-analyzer' },
      { name: 'Oscilloscopes', icon: 'oscilloscope' },
      { name: 'Power Supplies', icon: 'zap' },
      { name: 'Function Generators', icon: 'sine' },
      { name: 'Multimeters', icon: 'multimeter' },
    ],
  },
];
