/**
 * @type { import("next").NextConfig}
 */
const config = {
  swcMinify: true,
  experimental: {
    cpus: 4,
  },
};
module.exports = config;
