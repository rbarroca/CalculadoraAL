import { Helmet } from 'react-helmet-async';

interface PageMetaProps {
  title: string;
  description: string;
  canonical: string;
  ogImage?: string;
}

export default function PageMeta({ title, description, canonical, ogImage }: PageMetaProps) {
  const image = ogImage ?? 'https://calculadoraal.pt/calculadora_al.png';
  return (
    <Helmet>
      <title>{title}</title>
      <meta name="description" content={description} />
      <link rel="canonical" href={canonical} />
      <meta property="og:title" content={title} />
      <meta property="og:description" content={description} />
      <meta property="og:url" content={canonical} />
      <meta property="og:image" content={image} />
      <meta name="twitter:title" content={title} />
      <meta name="twitter:description" content={description} />
      <meta name="twitter:image" content={image} />
    </Helmet>
  );
}
