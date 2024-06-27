/** @type {import('next').NextConfig} */
const nextConfig = {
  images: {
    remotePatterns: [
      {
        protocol: "https",
        hostname: "mars.jpl.nasa.gov",
        port: "",
        pathname: "/msl-raw-images/**",
      },
      {
        protocol: "http",
        hostname: "mars.jpl.nasa.gov",
        port: "",
        pathname: "/msl-raw-images/**",
      },
      {
        protocol: "https",
        hostname: "mars.nasa.gov",
        port: "",
        pathname: "/msl-raw-images/**",
      },
      {
        protocol: "http",
        hostname: "mars.nasa.gov",
        port: "",
        pathname: "/msl-raw-images/**",
      },
      {
        protocol: "https",
        hostname: "mars.nasa.gov",
        port: "",
        pathname: "/mars2020-raw-images/**",
      },
      {
        protocol: "http",
        hostname: "mars.nasa.gov",
        port: "",
        pathname: "/mars2020-raw-images/**",
      },
    ],
  },
};

module.exports = nextConfig;
