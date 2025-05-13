declare module 'remark-mermaid' {
    const mermaid: {
        (): void;
        initialize: (config: { startOnLoad: boolean; theme: string; securityLevel: string }) => void;
    };
    export default mermaid;
} 