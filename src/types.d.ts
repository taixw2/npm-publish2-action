declare module 'read-package-json' {
  type Log = (...args: any[]) => void;
  type Cb1 = (err: Error, data?: { [key: string]: any }) => void;
  type Cb2 = (err: null, data: { [key: string]: any }) => void;

  export default function readJSON(file: string, log_?: Log, strict_?: any, cb_?: Cb1 | Cb2): void;
}
