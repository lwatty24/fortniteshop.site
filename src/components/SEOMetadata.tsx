import Head from 'next/head';

interface SEOMetadataProps {
  title?: string;
  description?: string;
  image?: string;
  url?: string;
}

export function SEOMetadata({ 
  title = 'Fortnite Shop Tracker • Daily Item Shop Updates',
  description = 'Track Fortnite item shop rotations, prices, and history. Get notifications for your wishlist items and never miss your favorite cosmetics.',
  image = '/logo.jpg',
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
      <meta property="og:site_name" content="Fortnite Shop Tracker" />

      {/* Twitter */}
      <meta name="twitter:card" content="summary_large_image" />
      <meta name="twitter:site" content="@FNShopTracker" />
      <meta name="twitter:creator" content="@FNShopTracker" />
      <meta name="twitter:title" content={title} />
      <meta name="twitter:description" content={description} />
      <meta name="twitter:image" content={image} />
      <meta name="twitter:image:alt" content="Fortnite Shop Tracker Preview" />

      {/* Discord */}
      <meta name="theme-color" content="#4F46E5" />
      <meta property="og:image:width" content="1200" />
      <meta property="og:image:height" content="630" />
      <meta property="og:locale" content="en_US" />

      {/* Additional SEO tags */}
      <meta name="robots" content="index, follow" />
      <meta name="author" content="Fortnite Shop Tracker" />
      <meta name="keywords" content="fortnite, item shop, cosmetics, skins, vbucks, tracker, battle royale, epic games" />
      <link rel="canonical" href={url} />

      {/* PWA tags */}
      <meta name="apple-mobile-web-app-capable" content="yes" />
      <meta name="apple-mobile-web-app-status-bar-style" content="black" />
      <meta name="apple-mobile-web-app-title" content="FN Shop" />
      <meta name="mobile-web-app-capable" content="yes" />
      <meta name="application-name" content="Fortnite Shop Tracker" />
      <meta name="msapplication-TileColor" content="#4F46E5" />
    </Head>
  );
} 