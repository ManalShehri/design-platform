import html2canvas from "html2canvas";
import jsPDF from "jspdf";

/**
 * Export a DOM node as a PNG image.
 * - Temporarily removes parent transform (used for preview scaling)
 * - Captures the node at its real size
 */
export async function exportNodeAsPNG(
  node,
  { scale = 2, filename = "poster.png" } = {}
) {
  const parent = node.parentElement;

  // Store and temporarily remove transform (preview scaling)
  const oldTransform = parent.style.transform;
  parent.style.transform = "none";

  const width = node.offsetWidth;
  const height = node.offsetHeight;

  const canvas = await html2canvas(node, {
    scale,
    width,
    height,
    backgroundColor: "#ffffff",
    useCORS: true,
  });

  // Restore original transform
  parent.style.transform = oldTransform;

  const dataUrl = canvas.toDataURL("image/png");

  const link = document.createElement("a");
  link.href = dataUrl;
  link.download = filename;
  link.click();
}

/**
 * Export a DOM node as a PDF file.
 * - Uses the exact canvas dimensions as the PDF page size
 * - Removes preview scaling before capture
 */
export async function exportNodeAsPDF(
  node,
  { scale = 2, filename = "poster.pdf" } = {}
) {
  const parent = node.parentElement;

  // Temporarily remove transform (preview scaling)
  const oldTransform = parent.style.transform;
  parent.style.transform = "none";

  const width = node.offsetWidth;
  const height = node.offsetHeight;

  const canvas = await html2canvas(node, {
    scale,
    width,
    height,
    backgroundColor: "#ffffff",
    useCORS: true,
  });

  // Restore original transform
  parent.style.transform = oldTransform;

  const imgData = canvas.toDataURL("image/png");

  // Use canvas size as PDF page size (no margins)
  const pdfWidth = canvas.width;
  const pdfHeight = canvas.height;

  const pdf = new jsPDF({
    orientation: pdfWidth >= pdfHeight ? "l" : "p",
    unit: "px",
    format: [pdfWidth, pdfHeight],
  });

  pdf.addImage(imgData, "PNG", 0, 0, pdfWidth, pdfHeight);
  pdf.save(filename);
}