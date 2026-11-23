import fs from 'fs';
import path from 'path';

import { preliminaryData } from './preliminary.js';
import { chapter1Data } from './chapter1.js';
import { chapter2Data } from './chapter2.js';
import { chapter3Data } from './chapter3.js';
import { chapter4Data } from './chapter4.js';
import { chapter5Data } from './chapter5.js';
import { referencesData } from './references.js';
import { appendicesData } from './appendices.js';

import { extraChapter2Sections } from './extra_ch2.js';
import { extraChapter3Sections } from './extra_ch3.js';
import { extraChapter4Sections } from './extra_ch4.js';
import { extraAppendicesData } from './extra_appendices.js';
import { screenshotsSection } from './screenshots_section.js';

// Merge extra sections
chapter2Data.sections.push(...extraChapter2Sections);
chapter3Data.sections.push(...extraChapter3Sections);
chapter4Data.sections.push(...extraChapter4Sections);

// Read actual source code files from root
const rootDir = path.resolve('.');
const indexHtmlContent = fs.readFileSync(path.join(rootDir, 'index.html'), 'utf-8');
const mainJsContent = fs.readFileSync(path.join(rootDir, 'main.js'), 'utf-8');
const styleCssContent = fs.readFileSync(path.join(rootDir, 'style.css'), 'utf-8');
const packageJsonContent = fs.readFileSync(path.join(rootDir, 'package.json'), 'utf-8');

function escapeHtml(str) {
  return str
    .replace(/&/g, '&amp;')
    .replace(/</g, '&lt;')
    .replace(/>/g, '&gt;')
    .replace(/"/g, '&quot;')
    .replace(/'/g, '&#039;');
}

console.log("Assembling comprehensive project report with dedicated Screenshots section...");

let html = `<!DOCTYPE html>
<html lang="en">
<head>
<meta charset="UTF-8">
<title>${escapeHtml(preliminaryData.title)}</title>
<style>
  @page {
    size: A4;
    margin: 25mm 20mm 25mm 25mm; /* 25mm top/bottom/left, 20mm right */
  }

  @media print {
    body {
      font-family: 'Times New Roman', Times, serif;
      font-size: 12pt;
      line-height: 1.5;
      color: #000000;
      background: #ffffff;
    }
    .page-break {
      page-break-before: always;
      break-before: page;
      height: 0;
      margin: 0;
      padding: 0;
    }
    .no-print {
      display: none !important;
    }
  }

  body {
    font-family: 'Times New Roman', Times, serif;
    font-size: 12pt;
    line-height: 1.5;
    color: #111111;
    background: #f4f6f9;
    margin: 0;
    padding: 0;
  }

  .report-container {
    max-width: 860px;
    margin: 20px auto;
    background: #ffffff;
    padding: 50px 60px;
    box-shadow: 0 4px 25px rgba(0,0,0,0.15);
  }

  @media print {
    .report-container {
      max-width: 100%;
      margin: 0;
      padding: 0;
      box-shadow: none;
    }
  }

  .page-break {
    page-break-before: always;
    break-before: page;
    height: 1px;
    border: none;
    margin: 35px 0;
    background: #cbd5e1;
  }

  @media print {
    .page-break {
      background: transparent;
      margin: 0;
    }
  }

  /* Strict Typography conforming to Project Report Guidelines */
  h1.chapter-title {
    font-family: 'Times New Roman', Times, serif;
    font-size: 16pt;
    font-weight: bold;
    text-align: center;
    text-transform: uppercase;
    margin-top: 35px;
    margin-bottom: 25px;
    letter-spacing: 0.04em;
  }

  h2.main-heading {
    font-family: 'Times New Roman', Times, serif;
    font-size: 14pt;
    font-weight: bold;
    text-align: left;
    margin-top: 25px;
    margin-bottom: 12px;
  }

  h3.sub-heading {
    font-family: 'Times New Roman', Times, serif;
    font-size: 12pt;
    font-weight: bold;
    text-align: left;
    margin-top: 18px;
    margin-bottom: 8px;
  }

  p {
    font-family: 'Times New Roman', Times, serif;
    font-size: 12pt;
    line-height: 1.5;
    text-align: justify;
    text-justify: inter-word;
    margin-bottom: 14px;
    text-indent: 0;
  }

  /* Table styling */
  table.report-table {
    width: 100%;
    border-collapse: collapse;
    margin: 20px 0;
    font-size: 10pt;
  }

  table.report-table th, table.report-table td {
    border: 1px solid #333333;
    padding: 7px 9px;
    text-align: left;
    vertical-align: top;
  }

  table.report-table th {
    background-color: #f1f5f9;
    font-weight: bold;
  }

  .caption-table {
    font-family: 'Times New Roman', Times, serif;
    font-size: 10pt;
    font-weight: bold;
    margin-bottom: 6px;
    text-align: left;
  }

  .caption-figure {
    font-family: 'Times New Roman', Times, serif;
    font-size: 10pt;
    font-weight: bold;
    margin-top: 8px;
    margin-bottom: 25px;
    text-align: center;
  }

  /* Screenshot display & placeholder styling */
  .screenshot-container {
    width: 100%;
    margin: 18px 0 25px 0;
    text-align: center;
  }

  .screenshot-box {
    width: 100%;
    max-width: 740px;
    min-height: 280px;
    margin: 0 auto;
    border: 2px dashed #94a3b8;
    border-radius: 8px;
    background: #f8fafc;
    display: flex;
    flex-direction: column;
    align-items: center;
    justify-content: center;
    overflow: hidden;
    box-sizing: border-box;
  }

  .screenshot-box img {
    width: 100%;
    height: auto;
    display: block;
    border-radius: 6px;
  }

  .screenshot-placeholder {
    padding: 35px 20px;
    text-align: center;
    color: #475569;
  }

  .placeholder-icon {
    font-size: 40px;
    margin-bottom: 10px;
  }

  .placeholder-title {
    font-family: 'Times New Roman', serif;
    font-size: 12pt;
    font-weight: bold;
    color: #1e293b;
    margin-bottom: 6px;
  }

  .placeholder-desc {
    font-size: 9.5pt;
    color: #64748b;
  }

  .diagram-box {
    background: #f8fafc;
    border: 1px solid #cbd5e1;
    border-radius: 4px;
    padding: 14px;
    margin: 15px 0;
    font-family: 'Courier New', Courier, monospace;
    font-size: 9pt;
    line-height: 1.35;
    white-space: pre;
    overflow-x: auto;
  }

  code, pre {
    font-family: 'Courier New', Courier, monospace;
    font-size: 9pt;
  }

  pre.code-block {
    background: #f8fafc;
    border: 1px solid #cbd5e1;
    border-radius: 4px;
    padding: 12px;
    overflow-x: auto;
    line-height: 1.35;
  }

  /* Preliminary styles */
  .title-page {
    text-align: center;
    padding-top: 30px;
    min-height: 900px;
  }
  .title-page h1 {
    font-size: 16pt;
    font-weight: bold;
    line-height: 1.6;
    margin-bottom: 50px;
  }
  .title-page p {
    text-align: center;
    margin: 10px 0;
  }

  .cert-page {
    line-height: 2.0; /* Double line spacing */
    font-size: 14pt;
    text-align: justify;
    padding-top: 40px;
  }
  .cert-page h2 {
    text-align: center;
    font-size: 16pt;
    font-weight: bold;
    margin-bottom: 40px;
  }

  .toc-entry {
    display: flex;
    justify-content: space-between;
    margin-bottom: 7px;
    font-size: 11pt;
  }
  .toc-entry.bold {
    font-weight: bold;
    margin-top: 12px;
  }
  .toc-dots {
    flex-grow: 1;
    border-bottom: 1px dotted #666666;
    margin: 0 8px 4px 8px;
  }

  .action-bar {
    position: fixed;
    top: 15px;
    right: 25px;
    background: #1e293b;
    padding: 10px 18px;
    border-radius: 30px;
    box-shadow: 0 4px 20px rgba(0,0,0,0.3);
    z-index: 1000;
  }
  .action-bar button {
    background: #6366f1;
    color: white;
    border: none;
    padding: 8px 18px;
    border-radius: 20px;
    font-weight: bold;
    font-family: sans-serif;
    cursor: pointer;
    font-size: 14px;
  }
  .action-bar button:hover {
    background: #4f46e5;
  }
</style>
</head>
<body>

<div class="action-bar no-print">
  <button onclick="window.print()">🖨️ Print / Save as PDF (Minimum 80+ Pages)</button>
</div>

<div class="report-container">

  <!-- ============================================================== -->
  <!-- 1. TITLE PAGE (Page i)                                         -->
  <!-- ============================================================== -->
  <div class="title-page">
    <br><br>
    <h1>${preliminaryData.title}</h1>
    <br>
    <p><strong>A PROJECT REPORT</strong></p>
    <br>
    <p><em>Submitted in partial fulfillment of the requirements for the award of the degree of</em></p>
    <br>
    <p><strong>${preliminaryData.degree}</strong></p>
    <p>IN</p>
    <p><strong>${preliminaryData.department}</strong></p>
    <br><br><br>
    <p>By</p>
    <p><strong>${preliminaryData.studentName}</strong></p>
    <p><strong>(Register No: ${preliminaryData.registerNo})</strong></p>
    <br><br><br>
    <p>Under the Guidance of</p>
    <p><strong>${preliminaryData.supervisorName}</strong></p>
    <p><strong>SUPERVISOR</strong></p>
    <p>${preliminaryData.supervisorDesignation}</p>
    <br><br><br>
    <p><strong>${preliminaryData.department}</strong></p>
    <p><strong>${preliminaryData.institution}</strong></p>
    <p><strong>${preliminaryData.university}</strong></p>
    <br>
    <p><strong>${preliminaryData.monthYear}</strong></p>
  </div>

  <div class="page-break"></div>

  <!-- ============================================================== -->
  <!-- 2. BONAFIDE CERTIFICATE (Page ii)                             -->
  <!-- ============================================================== -->
  <div class="cert-page">
    <h2>BONAFIDE CERTIFICATE</h2>
    <p style="line-height: 2.0; font-size: 14pt;">
      Certified that this project report titled <strong>"${preliminaryData.title}"</strong> is the bonafide work of <strong>${preliminaryData.studentName} (Register No: ${preliminaryData.registerNo})</strong> who carried out the project work under my supervision. Certified further that to the best of my knowledge the work reported herein does not form part of any other thesis or dissertation on the basis of which a degree or award was conferred on an earlier occasion on this or any other candidate.
    </p>
    <br><br><br>
    <div style="display: flex; justify-content: space-between; font-size: 13pt; line-height: 1.5;">
      <div>
        <p><strong>HEAD OF THE DEPARTMENT</strong><br>
        ${preliminaryData.department}<br>
        ${preliminaryData.institution}<br>
        ${preliminaryData.university}</p>
      </div>
      <div>
        <p><strong>${preliminaryData.supervisorName}</strong><br>
        <strong>SUPERVISOR</strong><br>
        ${preliminaryData.supervisorDesignation}<br>
        ${preliminaryData.supervisorDept}<br>
        ${preliminaryData.institution}<br>
        ${preliminaryData.university}</p>
      </div>
    </div>
  </div>

  <div class="page-break"></div>

  <!-- ============================================================== -->
  <!-- 3. ACKNOWLEDGEMENT (Page iii)                                  -->
  <!-- ============================================================== -->
  <h1 class="chapter-title">ACKNOWLEDGEMENT</h1>
  <p>
    First and foremost, I express my profound gratitude to the Almighty for bestowing upon me the strength, perseverance, and intellectual clarity required to successfully conceive, execute, and complete this engineering research project.
  </p>
  <p>
    I express my deepest sense of gratitude and respectful regards to my esteemed supervisor, <strong>${preliminaryData.supervisorName}</strong>, ${preliminaryData.supervisorDesignation}, ${preliminaryData.department}, for their invaluable guidance, constant technical inspiration, and relentless academic encouragement throughout the trajectory of this research. Their profound insights into modern public-key cryptography, side-channel resilience, and web systems engineering proved instrumental in shaping the architectural rigor of this project.
  </p>
  <p>
    I convey my sincere appreciation to the Head of the Department, faculty members, and technical staff of the <strong>${preliminaryData.department}</strong> for providing state-of-the-art laboratory infrastructure, computational facilities, and an intellectually vibrant environment conducive to high-caliber cybersecurity research.
  </p>
  <p>
    I am equally grateful to my beloved parents, family members, and peers whose steadfast faith, unconditional moral support, and patience sustained me throughout the demanding phases of mathematical modeling, algorithmic implementation, and manuscript preparation.
  </p>
  <br>
  <p style="text-align: right;"><strong>${preliminaryData.studentName}</strong></p>

  <div class="page-break"></div>

  <!-- ============================================================== -->
  <!-- 4. TABLE OF CONTENTS (Pages iv - vi)                           -->
  <!-- ============================================================== -->
  <h1 class="chapter-title">TABLE OF CONTENTS</h1>
  
  <div class="toc-entry bold"><span>BONAFIDE CERTIFICATE</span><span class="toc-dots"></span><span>ii</span></div>
  <div class="toc-entry bold"><span>ACKNOWLEDGEMENT</span><span class="toc-dots"></span><span>iii</span></div>
  <div class="toc-entry bold"><span>ABSTRACT</span><span class="toc-dots"></span><span>vii</span></div>
  <div class="toc-entry bold"><span>GRAPHICAL ABSTRACT</span><span class="toc-dots"></span><span>viii</span></div>
  <div class="toc-entry bold"><span>LIST OF FIGURES</span><span class="toc-dots"></span><span>ix</span></div>
  <div class="toc-entry bold"><span>LIST OF TABLES</span><span class="toc-dots"></span><span>xii</span></div>
  <div class="toc-entry bold"><span>LIST OF SYMBOLS AND ABBREVIATIONS</span><span class="toc-dots"></span><span>xiv</span></div>
  
  <div class="toc-entry bold"><span>1. INTRODUCTION</span><span class="toc-dots"></span><span>1</span></div>
  <div class="toc-entry"><span>&nbsp;&nbsp;&nbsp;&nbsp;1.1 Identification of Client and Need</span><span class="toc-dots"></span><span>1</span></div>
  <div class="toc-entry"><span>&nbsp;&nbsp;&nbsp;&nbsp;1.2 Relevant Contemporary Issues</span><span class="toc-dots"></span><span>3</span></div>
  <div class="toc-entry"><span>&nbsp;&nbsp;&nbsp;&nbsp;1.3 Problem Identification and Threat Modeling</span><span class="toc-dots"></span><span>5</span></div>
  <div class="toc-entry"><span>&nbsp;&nbsp;&nbsp;&nbsp;1.4 Task Identification and Scope of Work</span><span class="toc-dots"></span><span>7</span></div>
  <div class="toc-entry"><span>&nbsp;&nbsp;&nbsp;&nbsp;1.5 Project Timeline and Work Breakdown</span><span class="toc-dots"></span><span>9</span></div>
  <div class="toc-entry"><span>&nbsp;&nbsp;&nbsp;&nbsp;1.6 Organization of the Report</span><span class="toc-dots"></span><span>10</span></div>

  <div class="toc-entry bold"><span>2. LITERATURE SURVEY</span><span class="toc-dots"></span><span>11</span></div>
  <div class="toc-entry"><span>&nbsp;&nbsp;&nbsp;&nbsp;2.1 Timeline of Reported Problem (1976–Present)</span><span class="toc-dots"></span><span>11</span></div>
  <div class="toc-entry"><span>&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;2.1.6 Cryptanalytic Investigation of Low Public Exponents</span><span class="toc-dots"></span><span>15</span></div>
  <div class="toc-entry"><span>&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;2.1.7 Mathematical Foundations of Integer Factorization</span><span class="toc-dots"></span><span>17</span></div>
  <div class="toc-entry"><span>&nbsp;&nbsp;&nbsp;&nbsp;2.2 Bibliometric Analysis of In-Browser Cryptography</span><span class="toc-dots"></span><span>19</span></div>
  <div class="toc-entry"><span>&nbsp;&nbsp;&nbsp;&nbsp;2.3 Proposed Solutions by Different Researchers</span><span class="toc-dots"></span><span>22</span></div>
  <div class="toc-entry"><span>&nbsp;&nbsp;&nbsp;&nbsp;2.4 Summary Linking Literature Review with the Project</span><span class="toc-dots"></span><span>25</span></div>
  <div class="toc-entry"><span>&nbsp;&nbsp;&nbsp;&nbsp;2.5 Formal Problem Definition</span><span class="toc-dots"></span><span>27</span></div>
  <div class="toc-entry"><span>&nbsp;&nbsp;&nbsp;&nbsp;2.6 Research Goals and Engineering Objectives</span><span class="toc-dots"></span><span>28</span></div>

  <div class="toc-entry bold"><span>3. DESIGN FLOW AND PROCESS</span><span class="toc-dots"></span><span>30</span></div>
  <div class="toc-entry"><span>&nbsp;&nbsp;&nbsp;&nbsp;3.1 Concept Generation and Architectural Ideation</span><span class="toc-dots"></span><span>30</span></div>
  <div class="toc-entry"><span>&nbsp;&nbsp;&nbsp;&nbsp;3.2 Evaluation and Selection of Specifications/Features</span><span class="toc-dots"></span><span>32</span></div>
  <div class="toc-entry"><span>&nbsp;&nbsp;&nbsp;&nbsp;3.3 Design Constraints Analysis</span><span class="toc-dots"></span><span>35</span></div>
  <div class="toc-entry"><span>&nbsp;&nbsp;&nbsp;&nbsp;3.4 Analysis and Feature Finalization Subject to Constraints</span><span class="toc-dots"></span><span>42</span></div>
  <div class="toc-entry"><span>&nbsp;&nbsp;&nbsp;&nbsp;3.5 Design Flow and Alternative Design Analysis</span><span class="toc-dots"></span><span>44</span></div>
  <div class="toc-entry"><span>&nbsp;&nbsp;&nbsp;&nbsp;3.6 Implementation Plan and Mathematical Foundations</span><span class="toc-dots"></span><span>47</span></div>
  <div class="toc-entry"><span>&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;3.6.5 Mathematical Proof of RSA Correctness via CRT</span><span class="toc-dots"></span><span>51</span></div>
  <div class="toc-entry"><span>&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;3.6.6 ASN.1 DER Byte-by-Byte Structural Mapping</span><span class="toc-dots"></span><span>53</span></div>
  <div class="toc-entry"><span>&nbsp;&nbsp;&nbsp;&nbsp;3.7 Failure Mode and Effects Analysis (FMEA)</span><span class="toc-dots"></span><span>56</span></div>

  <div class="toc-entry bold"><span>4. RESULTS ANALYSIS AND VALIDATION</span><span class="toc-dots"></span><span>58</span></div>
  <div class="toc-entry"><span>&nbsp;&nbsp;&nbsp;&nbsp;4.1 Modern Engineering Tools in Implementation</span><span class="toc-dots"></span><span>58</span></div>
  <div class="toc-entry"><span>&nbsp;&nbsp;&nbsp;&nbsp;4.2 System Schematics and Interface Architecture</span><span class="toc-dots"></span><span>60</span></div>
  <div class="toc-entry"><span>&nbsp;&nbsp;&nbsp;&nbsp;4.3 Project Management and Communication Protocols</span><span class="toc-dots"></span><span>63</span></div>
  <div class="toc-entry"><span>&nbsp;&nbsp;&nbsp;&nbsp;4.4 Experimental Testing, Benchmarking, and Data Validation</span><span class="toc-dots"></span><span>65</span></div>
  <div class="toc-entry"><span>&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;4.4.8 Microarchitectural Instruction Profiling</span><span class="toc-dots"></span><span>71</span></div>
  <div class="toc-entry"><span>&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;4.4.9 Exhaustive Boundary Condition Assertion Matrix</span><span class="toc-dots"></span><span>73</span></div>
  <div class="toc-entry bold"><span>&nbsp;&nbsp;&nbsp;&nbsp;4.5 Visual Demonstration and Application Execution Screenshots</span><span class="toc-dots"></span><span>75</span></div>

  <div class="toc-entry bold"><span>5. CONCLUSION AND FUTURE WORK</span><span class="toc-dots"></span><span>89</span></div>
  <div class="toc-entry"><span>&nbsp;&nbsp;&nbsp;&nbsp;5.1 Synthesis of Project Achievements</span><span class="toc-dots"></span><span>89</span></div>
  <div class="toc-entry"><span>&nbsp;&nbsp;&nbsp;&nbsp;5.2 Deviation from Expected Results and Mitigations</span><span class="toc-dots"></span><span>91</span></div>
  <div class="toc-entry"><span>&nbsp;&nbsp;&nbsp;&nbsp;5.3 The Way Ahead: Post-Quantum and Hybrid Paradigms</span><span class="toc-dots"></span><span>92</span></div>

  <div class="toc-entry bold"><span>REFERENCES</span><span class="toc-dots"></span><span>95</span></div>
  <div class="toc-entry bold"><span>APPENDIX 1: USER MANUAL</span><span class="toc-dots"></span><span>101</span></div>
  <div class="toc-entry bold"><span>APPENDIX 2: COMPLETE SOURCE CODE REPOSITORY</span><span class="toc-dots"></span><span>109</span></div>
  <div class="toc-entry bold"><span>APPENDIX 3: VERIFICATION TEST LOGS AND ASSERTIONS</span><span class="toc-dots"></span><span>123</span></div>
  <div class="toc-entry bold"><span>APPENDIX 4: MATHEMATICAL WORKED NUMERICAL EXAMPLE</span><span class="toc-dots"></span><span>129</span></div>
  <div class="toc-entry bold"><span>APPENDIX 5: CRYPTOGRAPHIC OID REFERENCE CATALOG</span><span class="toc-dots"></span><span>133</span></div>

  <div class="page-break"></div>

  <!-- ============================================================== -->
  <!-- 5. LIST OF FIGURES & LIST OF TABLES (Pages vii - xiii)         -->
  <!-- ============================================================== -->
  <h1 class="chapter-title">LIST OF FIGURES</h1>
  <div class="toc-entry bold"><span>Figure 1.1: Modern Threat Modeling and Adversary Vector Topography</span><span class="toc-dots"></span><span>6</span></div>
  <div class="toc-entry bold"><span>Figure 1.2: Project Lifecycle Gantt Chart and Milestones</span><span class="toc-dots"></span><span>9</span></div>
  <div class="toc-entry bold"><span>Figure 2.1: Bibliometric Co-Occurrence and Research Clustering Map</span><span class="toc-dots"></span><span>20</span></div>
  <div class="toc-entry bold"><span>Figure 3.1: Architectural Comparison: Compromised Models vs Native Architecture</span><span class="toc-dots"></span><span>46</span></div>
  <div class="toc-entry bold"><span>Figure 3.2: Comprehensive End-to-End Cryptographic Execution Flowchart</span><span class="toc-dots"></span><span>50</span></div>
  <div class="toc-entry bold"><span>Figure 4.1: Four-Tier Modular System Software Architecture</span><span class="toc-dots"></span><span>61</span></div>
  <div class="toc-entry bold"><span>Figure 4.2: Wireframe and Interactive Ergonomics of the User Interface</span><span class="toc-dots"></span><span>62</span></div>
  <div class="toc-entry bold"><span>Figure 4.3: Empirical Key Generation Latency Curves (2048 vs 3072 vs 4096-bit)</span><span class="toc-dots"></span><span>67</span></div>
  <div class="toc-entry bold"><span>Figure 4.4: Encryption Latency and Block Scaling Linearity Analysis</span><span class="toc-dots"></span><span>69</span></div>
  <div class="toc-entry bold"><span>Figure 4.5: Decryption Execution Latency Across Chunk Count Thresholds</span><span class="toc-dots"></span><span>70</span></div>
  <div class="toc-entry bold"><span>Figure 4.6: OpenSSL CLI Cryptographic Interoperability Verification Protocol</span><span class="toc-dots"></span><span>72</span></div>
  <div class="toc-entry bold"><span>Figure 4.7: Initial Application Launch and Key Generation Interface</span><span class="toc-dots"></span><span>76</span></div>
  <div class="toc-entry bold"><span>Figure 4.8: High-Performance Key Generation Execution State with Loading Spinner</span><span class="toc-dots"></span><span>77</span></div>
  <div class="toc-entry bold"><span>Figure 4.9: Generated 4096-bit RSA Key Pair (SPKI Public & PKCS#8 Private PEM)</span><span class="toc-dots"></span><span>78</span></div>
  <div class="toc-entry bold"><span>Figure 4.10: Automated Key Synchronization and Notification Banner</span><span class="toc-dots"></span><span>79</span></div>
  <div class="toc-entry bold"><span>Figure 4.11: Encrypt Message Panel with Active Public Key Status Indicator</span><span class="toc-dots"></span><span>80</span></div>
  <div class="toc-entry bold"><span>Figure 4.12: Plaintext Input and Successful Base64 Ciphertext Output Generation</span><span class="toc-dots"></span><span>81</span></div>
  <div class="toc-entry bold"><span>Figure 4.13: One-Click Ciphertext Transfer Pipeline to Decrypt Panel</span><span class="toc-dots"></span><span>82</span></div>
  <div class="toc-entry bold"><span>Figure 4.14: Decrypt Message Panel with Active Private Key Status</span><span class="toc-dots"></span><span>83</span></div>
  <div class="toc-entry bold"><span>Figure 4.15: Successful Message Decryption and Plaintext Recovery (Exact Match)</span><span class="toc-dots"></span><span>84</span></div>
  <div class="toc-entry bold"><span>Figure 4.16: Collapsible Key Drawer for Viewing, Editing, and Custom Key Pasting</span><span class="toc-dots"></span><span>85</span></div>
  <div class="toc-entry bold"><span>Figure 4.17: Error Boundary Trapping and Tampered Ciphertext Security Alert</span><span class="toc-dots"></span><span>86</span></div>
  <div class="toc-entry bold"><span>Figure 4.18: Developer Console Programmatic Verification of window.encryptMessage</span><span class="toc-dots"></span><span>87</span></div>

  <br><br>
  <h1 class="chapter-title">LIST OF TABLES</h1>
  <div class="toc-entry bold"><span>Table 1.1: Work Breakdown Structure and Execution Timeline</span><span class="toc-dots"></span><span>9</span></div>
  <div class="toc-entry bold"><span>Table 2.1: Chronological Evolution of Public-Key Cryptography</span><span class="toc-dots"></span><span>13</span></div>
  <div class="toc-entry bold"><span>Table 2.2: Bibliometric Distribution of Research Articles by Domain</span><span class="toc-dots"></span><span>19</span></div>
  <div class="toc-entry bold"><span>Table 2.3: Comparative Synthesis of Existing Cryptographic Paradigms</span><span class="toc-dots"></span><span>24</span></div>
  <div class="toc-entry bold"><span>Table 2.4: GNFS Asymptotic Complexity and Factoring Milestones</span><span class="toc-dots"></span><span>18</span></div>
  <div class="toc-entry bold"><span>Table 3.1: Comparative Evaluation of Candidate Asymmetric Cryptographic Algorithms</span><span class="toc-dots"></span><span>33</span></div>
  <div class="toc-entry bold"><span>Table 3.2: Multi-Criteria Decision Matrix for Alternative Designs</span><span class="toc-dots"></span><span>45</span></div>
  <div class="toc-entry bold"><span>Table 3.3: RSA-OAEP Capacity and Block Boundary Mapping (SHA-256)</span><span class="toc-dots"></span><span>48</span></div>
  <div class="toc-entry bold"><span>Table 3.4: Byte-by-Byte Hexadecimal Mapping of an RSA-2048 SPKI Public Key</span><span class="toc-dots"></span><span>54</span></div>
  <div class="toc-entry bold"><span>Table 3.5: Failure Mode and Effects Analysis (FMEA) Matrix</span><span class="toc-dots"></span><span>57</span></div>
  <div class="toc-entry bold"><span>Table 4.1: Project Risk Management Matrix and Mitigation Strategies</span><span class="toc-dots"></span><span>64</span></div>
  <div class="toc-entry bold"><span>Table 4.2: Empirical Key Generation Latency Comparison (Mean of 100 Trials)</span><span class="toc-dots"></span><span>66</span></div>
  <div class="toc-entry bold"><span>Table 4.3: Encryption Execution Latency and Block Chunking Overhead</span><span class="toc-dots"></span><span>68</span></div>
  <div class="toc-entry bold"><span>Table 4.4: Decryption Execution Latency and Plaintext Reassembly</span><span class="toc-dots"></span><span>70</span></div>
  <div class="toc-entry bold"><span>Table 4.5: Cross-Browser and Cross-Platform Verification Matrix</span><span class="toc-dots"></span><span>71</span></div>
  <div class="toc-entry bold"><span>Table 4.7: Microarchitectural and Memory Execution Profiling</span><span class="toc-dots"></span><span>72</span></div>
  <div class="toc-entry bold"><span>Table 4.8: Boundary Condition and Stress Test Assertion Results</span><span class="toc-dots"></span><span>74</span></div>

  <div class="page-break"></div>

  <!-- ============================================================== -->
  <!-- 6. ABSTRACT (Page xi)                                          -->
  <!-- ============================================================== -->
  <h1 class="chapter-title">ABSTRACT</h1>
  <div style="font-size: 14pt; line-height: 2.0; text-align: justify;">
    <p style="font-size: 14pt; line-height: 2.0;">
      ${preliminaryData.abstract.replace(/\n\n/g, '</p><p style="font-size: 14pt; line-height: 2.0;">')}
    </p>
  </div>

  <div class="page-break"></div>

  <!-- ============================================================== -->
  <!-- 7. GRAPHICAL ABSTRACT (Page xii)                               -->
  <!-- ============================================================== -->
  <h1 class="chapter-title">GRAPHICAL ABSTRACT</h1>
  <p style="text-align: center; margin-bottom: 25px;">
    <strong>Figure GA.1: Conceptual Architecture, Security Boundaries, and Data Flow Pipeline of the Client-Side Asymmetric Cryptosystem</strong>
  </p>
  <div class="diagram-box">
+----------------------------------------------------------------------------------------------------+
|                                      CLIENT BROWSER RUNTIME                                        |
|                                                                                                    |
|  +----------------------------------------------------------------------------------------------+  |
|  |                          REACTIVE PRESENTATION & INTERACTION LAYER                           |  |
|  |  [Key Generator Tab]                      [Encrypt Panel]               [Decrypt Panel]      |  |
|  |  - Modulus: 2048/3072/4096-bit            - Live Char/Byte Counter      - Base64 Inbound     |  |
|  |  - Generate Keys Glow Button              - SPKI PEM Drawer             - PKCS#8 PEM Drawer  |  |
|  |  - Public/Private PEM Outputs             - Base64 Ciphertext Output    - Plaintext Output   |  |
|  +----------------------------------------------------------------------------------------------+  |
|                                                │                                                   |
|                                                ▼                                                   |
|  +----------------------------------------------------------------------------------------------+  |
|  |                       ASYMMETRIC CRYPTOGRAPHIC CONTROLLER & CHUNKER                          |  |
|  |                                                                                              |  |
|  |   [Key Management]               [Chunking Encryptor]               [Chunking Decryptor]     |  |
|  |   - SPKI / PKCS#8 Export         - Capacity: k - 66 Bytes           - Alignment: C % k == 0  |  |
|  |   - PEM Wrap / Unwrap            - Slicing: N = ceil(L / Cap)       - Slicing: N = len / k   |  |
|  |   - Active Session Store         - Concatenate Base64 Buffer        - UTF-8 Stream Rebuild   |  |
|  +----------------------------------------------------------------------------------------------+  |
|                                                │                                                   |
|                                                ▼                                                   |
|  +----------------------------------------------------------------------------------------------+  |
|  |                       NATIVE BROWSER CRYPTO SUBSYSTEM (SubtleCrypto)                         |  |
|  |                                                                                              |  |
|  |   Hardware CSPRNG           Constant-Time RSA Core            SHA-256 / MGF1 Engine          |  |
|  |   - OS Entropy Pool         - Modular Exponentiation          - Dual-Feistel Padding         |  |
|  |   - Miller-Rabin Primes     - CRT Acceleration (dP, dQ)       - IND-CCA2 Semantic Security   |  |
|  +----------------------------------------------------------------------------------------------+  |
|                                                                                                    |
+----------------------------------------------------------------------------------------------------+
                                                │
                          [Zero Network Telemetry / Local Sandbox]
                                                │
                                                ▼
+----------------------------------------------------------------------------------------------------+
|                         STANDARDIZED ENTERPRISE INTEROPERABILITY LAYER                             |
|                                                                                                    |
|  RFC 7468 SPKI Public Key (.pem)       RFC 8017 Base64 Ciphertext        RFC 7468 PKCS#8 Private   |
|  Compatible with OpenSSL 3.x           Compatible with GnuPG Suites      Compatible with SSH Tooling|
+----------------------------------------------------------------------------------------------------+
  </div>
  <p class="caption-figure">Figure GA.1: Graphical Abstract Highlighting Native Subsystem Isolation and Multi-Block Chunking</p>

  <div class="page-break"></div>

  <!-- ============================================================== -->
  <!-- 8. LIST OF SYMBOLS AND ABBREVIATIONS (Pages xiii - xiv)        -->
  <!-- ============================================================== -->
  <h1 class="chapter-title">LIST OF SYMBOLS AND ABBREVIATIONS</h1>
  <table class="report-table">
    <thead>
      <tr>
        <th style="width: 20%;">Abbreviation / Symbol</th>
        <th style="width: 80%;">Standard Definition and Contextual Meaning</th>
      </tr>
    </thead>
    <tbody>
      ${preliminaryData.abbreviations.map(a => `
        <tr>
          <td><strong>${escapeHtml(a.term)}</strong></td>
          <td>${escapeHtml(a.definition)}</td>
        </tr>
      `).join('')}
    </tbody>
  </table>

  <div class="page-break"></div>
`;

// Helper to append Chapter
function appendChapter(ch) {
  let chHtml = `
  <!-- ============================================================== -->
  <!-- CHAPTER ${ch.chapterNo}: ${escapeHtml(ch.title)}               -->
  <!-- ============================================================== -->
  <div style="text-align: center; margin-bottom: 20px;">
    <h1 style="font-size: 16pt; font-weight: bold; margin: 0;">CHAPTER ${ch.chapterNo}</h1>
    <h1 class="chapter-title" style="margin-top: 10px;">${escapeHtml(ch.title)}</h1>
  </div>
  `;

  ch.sections.forEach((sec, idx) => {
    if (idx > 0) {
      chHtml += `\n<div class="page-break"></div>\n`;
    }

    chHtml += `
    <h2 class="main-heading">${escapeHtml(sec.num)} ${escapeHtml(sec.title)}</h2>
    `;

    const paragraphs = sec.content.split('\n\n');
    paragraphs.forEach(pText => {
      pText = pText.trim();
      if (!pText) return;

      if (pText.startsWith('[Table')) {
        const lines = pText.split('\n');
        const caption = lines[0].replace(/^\[|\]$/g, '');
        const tableLines = lines.slice(1).filter(l => l.includes('|'));
        if (tableLines.length >= 2) {
          const headers = tableLines[0].split('|').map(h => h.trim()).filter(h => h);
          const rows = tableLines.slice(2).map(r => r.split('|').map(c => c.trim()).filter(c => c));
          
          chHtml += `
          <div class="caption-table">${escapeHtml(caption)}</div>
          <table class="report-table">
            <thead>
              <tr>${headers.map(h => `<th>${escapeHtml(h)}</th>`).join('')}</tr>
            </thead>
            <tbody>
              ${rows.map(row => `<tr>${row.map(cell => `<td>${escapeHtml(cell)}</td>`).join('')}</tr>`).join('')}
            </tbody>
          </table>
          `;
        }
      } else if (pText.startsWith('Figure ')) {
        chHtml += `<p class="caption-figure"><strong>${escapeHtml(pText)}</strong></p>`;
      } else {
        chHtml += `<p>${escapeHtml(pText).replace(/\n/g, '<br>')}</p>`;
      }
    });
  });

  chHtml += `\n<div class="page-break"></div>\n`;
  return chHtml;
}

html += appendChapter(chapter1Data);
html += appendChapter(chapter2Data);
html += appendChapter(chapter3Data);

// Custom build for Chapter 4 with Screenshots
let ch4Html = `
  <div style="text-align: center; margin-bottom: 20px;">
    <h1 style="font-size: 16pt; font-weight: bold; margin: 0;">CHAPTER 4</h1>
    <h1 class="chapter-title" style="margin-top: 10px;">RESULTS ANALYSIS AND VALIDATION</h1>
  </div>
`;

chapter4Data.sections.forEach((sec, idx) => {
  if (idx > 0) {
    ch4Html += `\n<div class="page-break"></div>\n`;
  }

  ch4Html += `<h2 class="main-heading">${escapeHtml(sec.num)} ${escapeHtml(sec.title)}</h2>`;
  const paragraphs = sec.content.split('\n\n');
  paragraphs.forEach(pText => {
    pText = pText.trim();
    if (!pText) return;

    if (pText.startsWith('[Table')) {
      const lines = pText.split('\n');
      const caption = lines[0].replace(/^\[|\]$/g, '');
      const tableLines = lines.slice(1).filter(l => l.includes('|'));
      if (tableLines.length >= 2) {
        const headers = tableLines[0].split('|').map(h => h.trim()).filter(h => h);
        const rows = tableLines.slice(2).map(r => r.split('|').map(c => c.trim()).filter(c => c));
        
        ch4Html += `
        <div class="caption-table">${escapeHtml(caption)}</div>
        <table class="report-table">
          <thead>
            <tr>${headers.map(h => `<th>${escapeHtml(h)}</th>`).join('')}</tr>
          </thead>
          <tbody>
            ${rows.map(row => `<tr>${row.map(cell => `<td>${escapeHtml(cell)}</td>`).join('')}</tr>`).join('')}
          </tbody>
        </table>
        `;
      }
    } else if (pText.startsWith('Figure ')) {
      ch4Html += `<p class="caption-figure"><strong>${escapeHtml(pText)}</strong></p>`;
    } else {
      ch4Html += `<p>${escapeHtml(pText).replace(/\n/g, '<br>')}</p>`;
    }
  });
});

// Append Section 4.5: Visual Demonstration & Screenshots
ch4Html += `
  <div class="page-break"></div>
  <h2 class="main-heading">${escapeHtml(screenshotsSection.num)} ${escapeHtml(screenshotsSection.title)}</h2>
  <p>${escapeHtml(screenshotsSection.content).replace(/\n\n/g, '</p><p>')}</p>
`;

screenshotsSection.screenshots.forEach((shot, sIdx) => {
  if (sIdx > 0) {
    ch4Html += `\n<div class="page-break"></div>\n`;
  }

  ch4Html += `
  <h3 class="sub-heading">4.5.${sIdx + 1} ${escapeHtml(shot.title)}</h3>
  <p>${escapeHtml(shot.description)}</p>
  <div class="screenshot-container">
    <div class="screenshot-box">
      <img src="screenshots/${shot.fileName}" onerror="this.style.display='none'; this.nextElementSibling.style.display='block';" alt="${escapeHtml(shot.title)}">
      <div class="screenshot-placeholder" style="display: none;">
        <div class="placeholder-icon">📷</div>
        <div class="placeholder-title">[ INSERT SCREENSHOT HERE: ${escapeHtml(shot.title)} ]</div>
        <div class="placeholder-desc">File path: <code>screenshots/${shot.fileName}</code> (Drop image here or paste in Word)</div>
      </div>
    </div>
    <p class="caption-figure"><strong>${escapeHtml(shot.caption)}</strong></p>
  </div>
  `;
});

ch4Html += `\n<div class="page-break"></div>\n`;
html += ch4Html;

html += appendChapter(chapter5Data);

// Append References
html += `
<!-- ============================================================== -->
<!-- REFERENCES                                                     -->
<!-- ============================================================== -->
<h1 class="chapter-title">REFERENCES</h1>
<br><br>
<div style="line-height: 1.5; font-size: 11pt; text-align: justify;">
  ${referencesData.map((ref, idx) => `
    <p style="margin-bottom: 12px; text-indent: -30px; padding-left: 30px;">
      [${idx + 1}] ${escapeHtml(ref)}
    </p>
  `).join('')}
</div>

<div class="page-break"></div>
`;

// Append Appendix 1: User Manual
html += `
<!-- ============================================================== -->
<!-- APPENDIX 1: USER MANUAL                                        -->
<!-- ============================================================== -->
<h1 class="chapter-title">${escapeHtml(appendicesData.appendix1.title)}</h1>
<p style="text-align: center; font-size: 13pt; font-weight: bold; margin-bottom: 30px;">
  ${escapeHtml(appendicesData.appendix1.subtitle)}
</p>

${appendicesData.appendix1.sections.map(sec => `
  <h2 class="main-heading">${escapeHtml(sec.heading)}</h2>
  <div class="diagram-box">${escapeHtml(sec.body)}</div>
  <div class="page-break"></div>
`).join('')}
`;

// Append Appendix 2: Production Source Code
html += `
<!-- ============================================================== -->
<!-- APPENDIX 2: COMPLETE PRODUCTION SOURCE CODE LISTING            -->
<!-- ============================================================== -->
<h1 class="chapter-title">${escapeHtml(appendicesData.appendix2.title)}</h1>
<p style="text-align: center; font-size: 13pt; font-weight: bold; margin-bottom: 30px;">
  ${escapeHtml(appendicesData.appendix2.subtitle)}
</p>

<h2 class="main-heading">1. index.html - Primary Application Structure</h2>
<p>The following listing provides the complete production markup defining the glassmorphic dual-panel interface, navigation tabs, and semantic input/output containers:</p>
<pre class="code-block">${escapeHtml(indexHtmlContent)}</pre>

<div class="page-break"></div>

<h2 class="main-heading">2. main.js - Core Cryptographic Engine & Orchestration</h2>
<p>The following listing documents the production JavaScript implementation, including SPKI/PKCS#8 PEM transcoding, multi-block chunking, SubtleCrypto interfacing, and DOM event bindings:</p>
<pre class="code-block">${escapeHtml(mainJsContent)}</pre>

<div class="page-break"></div>

<h2 class="main-heading">3. style.css - Glassmorphic Cyber Design System</h2>
<p>The following listing specifies the responsive CSS custom properties, backdrop filter blur definitions, CSS Grid layouts, and print styles:</p>
<pre class="code-block">${escapeHtml(styleCssContent)}</pre>

<div class="page-break"></div>

<h2 class="main-heading">4. package.json - Application Manifest & Toolchain</h2>
<p>The following manifest details project metadata, scripts, and build dependencies:</p>
<pre class="code-block">${escapeHtml(packageJsonContent)}</pre>

<div class="page-break"></div>
`;

// Append Appendix 3: Verification Test Logs
html += `
<!-- ============================================================== -->
<!-- APPENDIX 3: VERIFICATION TEST LOGS AND CRYPTOGRAPHIC ASSERTIONS-->
<!-- ============================================================== -->
<h1 class="chapter-title">${escapeHtml(appendicesData.appendix3.title)}</h1>
<p style="text-align: center; font-size: 13pt; font-weight: bold; margin-bottom: 30px;">
  ${escapeHtml(appendicesData.appendix3.subtitle)}
</p>

<div class="diagram-box">${escapeHtml(appendicesData.appendix3.content)}</div>

<div class="page-break"></div>
`;

// Append Appendix 4: Worked Numerical Example
html += `
<!-- ============================================================== -->
<!-- APPENDIX 4: MATHEMATICAL WORKED NUMERICAL EXAMPLE OF RSA-OAEP  -->
<!-- ============================================================== -->
<h1 class="chapter-title">${escapeHtml(extraAppendicesData.appendix4.title)}</h1>
<p style="text-align: center; font-size: 13pt; font-weight: bold; margin-bottom: 30px;">
  ${escapeHtml(extraAppendicesData.appendix4.subtitle)}
</p>

<div class="diagram-box">${escapeHtml(extraAppendicesData.appendix4.content)}</div>

<div class="page-break"></div>
`;

// Append Appendix 5: Cryptographic OID Catalog
html += `
<!-- ============================================================== -->
<!-- APPENDIX 5: CRYPTOGRAPHIC OID REFERENCE CATALOG                -->
<!-- ============================================================== -->
<h1 class="chapter-title">${escapeHtml(extraAppendicesData.appendix5.title)}</h1>
<p style="text-align: center; font-size: 13pt; font-weight: bold; margin-bottom: 30px;">
  ${escapeHtml(extraAppendicesData.appendix5.subtitle)}
</p>

<div class="diagram-box">${escapeHtml(extraAppendicesData.appendix5.content)}</div>

</div>
</body>
</html>
`;

// Write HTML file
const htmlPath = path.join(rootDir, 'REPORT.html');
fs.writeFileSync(htmlPath, html, 'utf-8');
console.log(`Generated: ${htmlPath} (Size: ${(html.length / 1024).toFixed(1)} KB)`);

// Generate Word (.doc) version
const docHeader = `
<html xmlns:o='urn:schemas-microsoft-com:office:office'
      xmlns:w='urn:schemas-microsoft-com:office:word'
      xmlns='http://www.w3.org/TR/REC-html40'>
<head>
<!--[if gte mso 9]>
<xml>
 <w:WordDocument>
  <w:View>Print</w:View>
  <w:Zoom>100</w:Zoom>
  <w:DoNotOptimizeForBrowser/>
 </w:WordDocument>
</xml>
<![endif]-->
<style>
  @page {
    size: 21.0cm 29.7cm; /* A4 */
    margin: 2.54cm 2.0cm 2.54cm 2.54cm;
    mso-page-orientation: portrait;
  }
  body {
    font-family: 'Times New Roman', serif;
    font-size: 12.0pt;
    line-height: 150%;
  }
  .screenshot-box {
    border: 2px dashed #94a3b8;
    background: #f8fafc;
    min-height: 280px;
    text-align: center;
    padding: 20px;
  }
</style>
</head>
<body>
`;
const docContent = html.replace('<!DOCTYPE html>\n<html lang="en">\n<head>', docHeader);
const docPath = path.join(rootDir, 'REPORT.doc');
try {
  fs.writeFileSync(docPath, docContent, 'utf-8');
  console.log(`Generated: ${docPath} (Size: ${(docContent.length / 1024).toFixed(1)} KB)`);
} catch (err) {
  if (err.code === 'EBUSY') {
    const altDocPath = path.join(rootDir, 'REPORT_UPDATED.doc');
    fs.writeFileSync(altDocPath, docContent, 'utf-8');
    console.log(`NOTE: REPORT.doc is currently open in Microsoft Word. Saved updated file to: ${altDocPath}`);
  } else {
    throw err;
  }
}

// Generate Markdown (.md) version
let md = `# ${preliminaryData.title}\n\n`;
md += `**Degree:** ${preliminaryData.degree} in ${preliminaryData.department}\n`;
md += `**Institution:** ${preliminaryData.institution}, ${preliminaryData.university}\n`;
md += `**Supervisor:** ${preliminaryData.supervisorName}, SUPERVISOR, ${preliminaryData.supervisorDesignation}\n\n`;
md += `---\n\n## ABSTRACT\n\n${preliminaryData.abstract}\n\n---\n\n`;

function appendChapterMd(ch) {
  let chMd = `## CHAPTER ${ch.chapterNo}: ${ch.title}\n\n`;
  ch.sections.forEach(sec => {
    chMd += `### ${sec.num} ${sec.title}\n\n${sec.content}\n\n`;
  });
  return chMd;
}

md += appendChapterMd(chapter1Data);
md += appendChapterMd(chapter2Data);
md += appendChapterMd(chapter3Data);

// Append Chapter 4 in MD
md += `## CHAPTER 4: RESULTS ANALYSIS AND VALIDATION\n\n`;
chapter4Data.sections.forEach(sec => {
  md += `### ${sec.num} ${sec.title}\n\n${sec.content}\n\n`;
});
md += `### ${screenshotsSection.num} ${screenshotsSection.title}\n\n${screenshotsSection.content}\n\n`;
screenshotsSection.screenshots.forEach(s => {
  md += `#### ${s.caption}\n\n${s.description}\n\n![${s.caption}](screenshots/${s.fileName})\n\n`;
});

md += appendChapterMd(chapter5Data);

md += `## REFERENCES\n\n`;
referencesData.forEach((r, idx) => {
  md += `[${idx + 1}] ${r}\n\n`;
});

md += `## APPENDIX 1: USER MANUAL\n\n`;
appendicesData.appendix1.sections.forEach(s => {
  md += `### ${s.heading}\n\n\`\`\`\n${s.body}\n\`\`\`\n\n`;
});

md += `## APPENDIX 3: VERIFICATION TEST LOGS\n\n\`\`\`\n${appendicesData.appendix3.content}\n\`\`\`\n`;
md += `## APPENDIX 4: MATHEMATICAL WORKED NUMERICAL EXAMPLE\n\n\`\`\`\n${extraAppendicesData.appendix4.content}\n\`\`\`\n`;
md += `## APPENDIX 5: CRYPTOGRAPHIC OID REFERENCE CATALOG\n\n\`\`\`\n${extraAppendicesData.appendix5.content}\n\`\`\`\n`;

const mdPath = path.join(rootDir, 'PROJECT_REPORT.md');
fs.writeFileSync(mdPath, md, 'utf-8');
console.log(`Generated: ${mdPath} (Size: ${(md.length / 1024).toFixed(1)} KB)`);

console.log("\n=======================================================");
console.log("PROJECT REPORT ASSEMBLY COMPLETED SUCCESSFULLY!");
console.log("Screenshots Section 4.5 integrated with 12 screenshot containers.");
console.log("=======================================================\n");
