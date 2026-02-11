/// <reference types="vite/client" />

interface ImportMetaEnv {
  readonly VITE_RIO_CHAT_PROXY_URL?: string;
  readonly VITE_APP_RIO_CHAT_PROXY_URL?: string;
}

interface ImportMeta {
  readonly env: ImportMetaEnv;
}

declare module 'react-dom/client' {
  type Root = {
    render: (children: React.ReactNode) => void;
    unmount: () => void;
  };

  const ReactDOMClient: {
    createRoot: (container: Element | DocumentFragment) => Root;
  };

  export default ReactDOMClient;
  export function createRoot(container: Element | DocumentFragment): Root;
}
