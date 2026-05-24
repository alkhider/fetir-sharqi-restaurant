/// <reference types="vite/client" />

declare module 'html2canvas' {
  function html2canvas(element: HTMLElement, options?: any): Promise<HTMLCanvasElement>;
  export default html2canvas;
}

declare module 'jspdf' {
  class jsPDF {
    constructor(options?: any);
    addImage(data: string, format: string, x: number, y: number, w: number, h: number): void;
    addPage(): void;
    save(filename: string): void;
    setFontSize(size: number): void;
    text(text: string, x: number, y: number, options?: any): void;
    internal: {
      pageSize: {
        getWidth(): number;
        getHeight(): number;
      };
    };
  }
  export { jsPDF };
}

declare module 'qrcode' {
  function toDataURL(text: string, options?: any): Promise<string>;
  export { toDataURL };
}
