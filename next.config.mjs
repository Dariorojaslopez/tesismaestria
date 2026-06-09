/** @type {import('next').NextConfig} */
const nextConfig = {
  output: "standalone",
  async redirects() {
    return [
      {
        source: "/observatorio",
        destination: "/resultados",
        permanent: true,
      },
    ];
  },
};

export default nextConfig;
