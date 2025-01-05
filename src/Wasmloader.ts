export async function loadWasm(url: string): Promise<WebAssembly.Instance> {
    try {
      const response = await fetch(url);
      const contentType = response.headers.get('Content-Type');
      
      if (contentType !== 'application/wasm') {
        const buffer = await response.arrayBuffer();
        const wasmModule = await WebAssembly.compile(buffer);
        return await WebAssembly.instantiate(wasmModule, {});
      }
      
      return (await WebAssembly.instantiateStreaming(response)).instance;
    } catch (error) {
      console.error('Failed to load WASM:', error);
      throw error;
    }
  }