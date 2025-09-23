import createNextIntlPlugin from 'next-intl/plugin';

const withNextIntl = createNextIntlPlugin();

/** @type {import('next').NextConfig} */
const nextConfig = {
  async redirects() {
    return [
      {
        source: '/:lang/orders/edit',
        has: [
          { type: 'query', key: 'orderId' },
          { type: 'query', key: 'customerId' }
        ],
        destination: '/:lang/orders/editv-2?orderId=:orderId&customerId=:customerId',
        permanent: true,
      }
    ];
  }
};

export default withNextIntl(nextConfig);
