import { Helmet } from 'react-helmet-async';

const SEO = ({
    title,
    description,
    canonical,
    ogImage,
    ogType = 'website',
    twitterCard = 'summary_large_image'
}) => {
    const siteTitle = "SmartJobs";
    const fullTitle = title ? `${title} | ${siteTitle}` : `${siteTitle} | Local Opportunities, Smarter Hiring`;
    const defaultDescription = "SmartJobs is the premium marketplace for discovering local work and hiring skilled talent with ease. Modern, fast, and local.";
    const metaDescription = description || defaultDescription;
    const metaImage = ogImage || '/og-image.png';

    return (
        <Helmet>
            {/* Standard metadata tags */}
            <title>{fullTitle}</title>
            <meta name="description" content={metaDescription} />
            {canonical && <link rel="canonical" href={canonical} />}

            {/* Open Graph tags */}
            <meta property="og:title" content={fullTitle} />
            <meta property="og:description" content={metaDescription} />
            <meta property="og:image" content={metaImage} />
            <meta property="og:type" content={ogType} />

            {/* Twitter tags */}
            <meta name="twitter:card" content={twitterCard} />
            <meta name="twitter:title" content={fullTitle} />
            <meta name="twitter:description" content={metaDescription} />
            <meta name="twitter:image" content={metaImage} />
        </Helmet>
    );
};

export default SEO;
