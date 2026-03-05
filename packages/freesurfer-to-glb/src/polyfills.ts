import { Blob } from 'node:buffer';

/**
 * Apply browser-API polyfills needed by three.js in Node.js.
 * Must be called before importing three.js modules.
 */
export function applyPolyfills() {
  const g = globalThis as any;

  g.Blob = Blob;
  g.self = globalThis;
  g.window = globalThis;
  g.document = {
    createElementNS: () => ({ style: {} }),
    createElement: () => ({ getContext: () => null }),
  };
  g.navigator = { userAgent: '' };

  if (!g.atob) {
    g.atob = (s: string) => Buffer.from(s, 'base64').toString('binary');
  }
  if (!g.btoa) {
    g.btoa = (s: string) => Buffer.from(s, 'binary').toString('base64');
  }

  if (!g.FileReader) {
    g.FileReader = class FileReader {
      result: any = null;
      onload: ((e: any) => void) | null = null;
      onerror: ((e: any) => void) | null = null;

      readAsArrayBuffer(blob: Blob) {
        blob.arrayBuffer().then((buf) => {
          this.result = buf;
          if (this.onload) this.onload({ target: this });
        }).catch((err) => {
          if (this.onerror) this.onerror(err);
        });
      }
      readAsDataURL(blob: Blob) {
        blob.arrayBuffer().then((buf) => {
          const b64 = Buffer.from(buf).toString('base64');
          const type = (blob as any).type || 'application/octet-stream';
          this.result = `data:${type};base64,${b64}`;
          if (this.onload) this.onload({ target: this });
        }).catch((err) => {
          if (this.onerror) this.onerror(err);
        });
      }
    };
  }
}
