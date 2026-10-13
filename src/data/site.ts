import type { SiteConfig } from './types';

/**
 * Global site configuration. Edit this file to change the name, title,
 * social links, and the section navigation.
 */
export const site: SiteConfig = {
  name: 'Saif Alomari',
  role: 'Embedded Firmware & FPGA Engineer',
  description:
    'Project portfolio of Saif Alomari, Embedded Firmware and FPGA Engineer: RTL and FPGA designs, embedded firmware, hardware/software integration, and engineering tools such as the RTLStation IDE.',
  url: 'https://saifalomari99.github.io',
  location: 'Goleta, CA',
  github: 'https://github.com/saifalomari99',
  githubHandle: 'saifalomari99',
  linkedin: 'https://www.linkedin.com/in/saif-alomari-profile/',
  nav: [
    { label: 'Projects', href: '/#projects' },
    { label: 'Skills', href: '/#skills' },
    { label: 'Contact', href: '/#contact' },
  ],
};

/** Short copy used on the page. */
export const summary = {
  /** One line under the name in the hero. */
  intro:
    "I'm a Firmware and FPGA Engineer who designs and validates FPGA systems, from RTL in Verilog and SystemVerilog through simulation, hardware integration, and system-level testing. My work centers on FPGA resource and memory optimization, RTL verification, and hardware/firmware debugging.",
};
