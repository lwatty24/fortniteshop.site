import Head from 'next/head';

interface SEOMetadataProps {
  title?: string;
  description?: string;
  image?: string;
  url?: string;
}

export function SEOMetadata({ 
  title = 'Fortnite Item Shop Tracker',
  description = 'Track Fortnite item shop rotations, prices, and history. Get notifications for your wishlist items.',
  image = '/og-image.jpg',
  url = 'https://fortniteshop.site'
}: SEOMetadataProps) {
  return (
    <Head>
      <title>{title}</title>
      <meta name="description" content={description} />
      
      {/* Open Graph / Facebook */}
      <meta property="og:type" content="website" />
      <meta property="og:url" content={url} />
      <meta property="og:title" content={title} />
      <meta property="og:description" content={description} />
      <meta property="og:image" content={image} />

      {/* Twitter */}
      <meta property="twitter:card" content="summary_large_image" />
      <meta property="twitter:url" content={url} />
      <meta property="twitter:title" content={title} />
      <meta property="twitter:description" content={description} />
      <meta property="twitter:image" content={image} />

      {/* Additional SEO tags */}
      <meta name="robots" content="index, follow" />
      <meta name="author" content="ShopBrowse" />
      <meta name="keywords" content="fortnite, item shop, cosmetics, skins, vbucks, tracker" />
      <link rel="canonical" href={url} />

      {/* PWA tags */}
      <meta name="theme-color" content="#000000" />
      <meta name="apple-mobile-web-app-capable" content="yes" />
      <meta name="apple-mobile-web-app-status-bar-style" content="black" />
    </Head>
  );
} 