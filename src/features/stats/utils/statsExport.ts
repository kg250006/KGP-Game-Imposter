/**
 * @fileoverview Utilities for exporting stats as images
 * @module stats/utils
 */

import html2canvas from 'html2canvas';

/**
 * Generates PNG image from a DOM element
 * @param element - HTML element to capture
 * @returns Data URL of the captured image
 */
export async function generateScoreboardImage(
  element: HTMLElement
): Promise<string> {
  try {
    const canvas = await html2canvas(element, {
      backgroundColor: '#1a1a2e',
      scale: 2, // Higher resolution
      logging: false,
    });

    return canvas.toDataURL('image/png');
  } catch (error) {
    throw new Error('Failed to generate scoreboard image');
  }
}

/**
 * Downloads an image from a data URL
 * @param dataUrl - Image data URL
 * @param filename - Desired filename
 */
export function downloadImage(dataUrl: string, filename: string): void {
  const link = document.createElement('a');
  link.download = filename;
  link.href = dataUrl;
  link.click();
}

/**
 * Generates and downloads scoreboard image
 * @param element - HTML element to capture
 * @param filename - Desired filename (defaults to timestamped name)
 */
export async function exportScoreboard(
  element: HTMLElement,
  filename?: string
): Promise<void> {
  const dataUrl = await generateScoreboardImage(element);
  const defaultFilename = `imposter-game-${Date.now()}.png`;
  downloadImage(dataUrl, filename || defaultFilename);
}
