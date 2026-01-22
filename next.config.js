/** @type {import('next').NextConfig} */
const nextConfig = {
  reactStrictMode: true,
  
  // Exclude ONNX Runtime from SWC compilation
  experimental: {
    swcPlugins: [],
    esmExternals: 'loose',
  },
  
  webpack: (config, { isServer }) => {
    // Ignore ONNX Runtime node bindings
    config.resolve.alias = {
      ...config.resolve.alias,
      'onnxruntime-node': false,
    };
    
    // Fix for @imgly/background-removal
    config.module.rules.push({
      test: /\.mjs$/,
      include: /node_modules/,
      type: 'javascript/auto',
    });

    return config;
  },
  
  // Transpile specific packages
  transpilePackages: ['@imgly/background-removal'],
}

module.exports = nextConfig