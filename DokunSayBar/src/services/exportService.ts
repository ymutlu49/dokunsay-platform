import { toPng } from "html-to-image";
import type { CanvasItem, DrawLine } from "../types";

export function saveAsJson(items: CanvasItem[], lines: DrawLine[]): void {
  const blob = new Blob(
    [JSON.stringify({ items, lines }, null, 2)],
    { type: "application/json" }
  );
  const url = URL.createObjectURL(blob);
  const anchor = document.createElement("a");
  anchor.href = url;
  anchor.download = "dokun-say.json";
  anchor.click();
  setTimeout(() => URL.revokeObjectURL(url), 1000);
}

export function loadFromJson(
  onLoad: (data: { items?: CanvasItem[]; lines?: DrawLine[] }) => void
): void {
  const input = document.createElement("input");
  input.type = "file";
  input.accept = ".json";
  input.onchange = (e) => {
    const file = (e.target as HTMLInputElement).files?.[0];
    if (!file) return;
    const reader = new FileReader();
    reader.onload = (ev) => {
      try {
        const data = JSON.parse(ev.target?.result as string);
        onLoad(data);
      } catch {
        // Invalid JSON
      }
    };
    reader.readAsText(file);
  };
  input.click();
}

export async function exportAsPng(
  element: HTMLElement,
  bgColor: string
): Promise<void> {
  try {
    const dataUrl = await toPng(element, { backgroundColor: bgColor });
    const anchor = document.createElement("a");
    anchor.href = dataUrl;
    anchor.download = "dokun-say.png";
    anchor.click();
  } catch {
    // Export failed
  }
}

export async function printCanvas(
  element: HTMLElement,
  bgColor: string
): Promise<void> {
  try {
    const dataUrl = await toPng(element, { backgroundColor: bgColor });
    const win = window.open("", "_blank");
    if (!win) return;
    win.document.write(
      `<html><head><title>DokunSay</title>` +
      `<style>@page{margin:1cm}body{margin:0;display:flex;` +
      `justify-content:center;align-items:center;min-height:100vh}` +
      `img{max-width:100%;height:auto}</style></head><body>` +
      `<img src="${dataUrl}"/></body></html>`
    );
    win.document.close();
    setTimeout(() => win.print(), 500);
  } catch {
    // Print failed
  }
}
