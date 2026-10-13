import type { EducationEntry } from './types';

/** Academic history, newest first. Source: resume (Oct 2026). */
export const education: EducationEntry[] = [
  {
    school: 'University of California, Santa Barbara',
    degree: 'Master of Science',
    field: 'Electrical and Computer Engineering (Computer Engineering Emphasis)',
    emphasis: 'Major emphasis: VLSI and Design Automation. Minor emphasis: Computer Architecture.',
    start: '2025-09',
    end: '2026-12',
    expected: true,
    location: 'Santa Barbara, CA',
    coursework: [
      'Embedded Systems',
      'High-Speed IC Design',
      'Machine Learning',
      'Artificial Intelligence',
      'Neural-Inspired Computing Systems',
      'Digital Image Processing',
      'Digital Communication Fundamentals',
      'Principles of Optimization',
      'VLSI Project Design',
    ],
    url: 'https://www.ucsb.edu/',
  },
  {
    school: 'California State Polytechnic University, Pomona',
    degree: 'Bachelor of Science',
    field: 'Computer Engineering',
    start: '2021-08',
    end: '2024-05',
    location: 'Pomona, CA',
    honors: ["Dean's List (Fall 2021, Spring 2022, Spring 2023)", "President's List (Spring 2022)"],
    coursework: [
      'Circuit Analysis I, II, and III',
      'OS for Embedded Applications',
      'Software Engineering',
      'Data Structures and Algorithms',
      'Statistics for ECE',
      'Microcontrollers',
      'Microelectronics',
      'Digital Logic Design',
      'Computer Architecture',
      'Control Systems',
    ],
    url: 'https://www.cpp.edu/',
  },
];
