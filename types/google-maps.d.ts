// Minimal google maps shim for type-check during development (install @types/google.maps for fuller types)
declare const google: any;
declare namespace google {
  const maps: any;
}
export {};
