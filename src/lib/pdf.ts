/**
 * Wraps one JPEG in a single-page PDF. All the type is already in the picture,
 * which is what lets Tamil keep its correct letter shapes on any phone.
 */
export function jpegToPdf(jpeg: Uint8Array, widthPx: number, heightPx: number, pageWidthPt: number) {
  const pageHeightPt = Math.round((pageWidthPt * heightPx) / widthPx);
  const encoder = new TextEncoder();
  const chunks: Uint8Array[] = [];
  const offsets: number[] = [];
  let size = 0;
  const push = (chunk: string | Uint8Array) => {
    const bytes = typeof chunk === "string" ? encoder.encode(chunk) : chunk;
    chunks.push(bytes);
    size += bytes.length;
  };
  const object = (body: string) => {
    offsets.push(size);
    push(`${offsets.length} 0 obj\n${body}\nendobj\n`);
  };

  push("%PDF-1.4\n");
  object("<< /Type /Catalog /Pages 2 0 R >>");
  object("<< /Type /Pages /Kids [3 0 R] /Count 1 >>");
  object(
    `<< /Type /Page /Parent 2 0 R /MediaBox [0 0 ${pageWidthPt} ${pageHeightPt}] ` +
      "/Resources << /XObject << /Art 4 0 R >> >> /Contents 5 0 R >>",
  );
  offsets.push(size);
  push(
    `4 0 obj\n<< /Type /XObject /Subtype /Image /Width ${widthPx} /Height ${heightPx} ` +
      `/ColorSpace /DeviceRGB /BitsPerComponent 8 /Filter /DCTDecode /Length ${jpeg.length} >>\nstream\n`,
  );
  push(jpeg);
  push("\nendstream\nendobj\n");
  const draw = `q ${pageWidthPt} 0 0 ${pageHeightPt} 0 0 cm /Art Do Q`;
  object(`<< /Length ${draw.length} >>\nstream\n${draw}\nendstream`);

  const xref = size;
  const rows = offsets.map((o) => `${String(o).padStart(10, "0")} 00000 n \n`).join("");
  push(`xref\n0 ${offsets.length + 1}\n0000000000 65535 f \n${rows}`);
  push(`trailer\n<< /Size ${offsets.length + 1} /Root 1 0 R >>\nstartxref\n${xref}\n%%EOF\n`);
  return new Blob(chunks as BlobPart[], { type: "application/pdf" });
}

export function downloadBlob(blob: Blob, filename: string) {
  const url = URL.createObjectURL(blob);
  const link = document.createElement("a");
  link.href = url;
  link.download = filename;
  document.body.append(link);
  link.click();
  link.remove();
  window.setTimeout(() => URL.revokeObjectURL(url), 10000);
}
