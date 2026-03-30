#!/usr/bin/env bun
/**
 * PDF Generator for FRIDAY
 * Usage: bun run tools/generate-pdf.ts <input.html> <output.pdf>
 *
 * Converts any HTML file to a styled PDF using Chrome headless.
 * Works with the Monarch-branded SOPs and service menus.
 */

import puppeteer from "puppeteer-core";
import { resolve } from "path";

const args = process.argv.slice(2);
if (args.length < 2) {
  console.log("Usage: bun run tools/generate-pdf.ts <input.html> <output.pdf>");
  console.log("Example: bun run tools/generate-pdf.ts documents/sop-seat-shampooing.html documents/sop-seat-shampooing.pdf");
  process.exit(1);
}

const inputPath = resolve(args[0]);
const outputPath = resolve(args[1]);

const chromePath = "C:/Program Files/Google/Chrome/Application/chrome.exe";

async function generatePDF() {
  console.log(`[pdf] Opening Chrome headless...`);
  const browser = await puppeteer.launch({
    executablePath: chromePath,
    headless: true,
    args: ["--no-sandbox", "--disable-setuid-sandbox"],
  });

  const page = await browser.newPage();

  console.log(`[pdf] Loading ${inputPath}...`);
  await page.goto(`file:///${inputPath.replace(/\\/g, "/")}`, {
    waitUntil: "networkidle0",
    timeout: 30000,
  });

  console.log(`[pdf] Generating PDF...`);
  await page.pdf({
    path: outputPath,
    format: "A4",
    printBackground: true,
    margin: { top: "10mm", bottom: "10mm", left: "10mm", right: "10mm" },
  });

  await browser.close();
  console.log(`[pdf] Done! Saved to ${outputPath}`);
}

generatePDF().catch((err) => {
  console.error(`[pdf] Error:`, err.message);
  process.exit(1);
});
