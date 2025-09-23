'use client';

import Script from 'next/script';

const baseUrl = process.env.NEXT_PUBLIC_BASE_URL || 'https://trip-iwlemq2cb-takanoj0616s-projects.vercel.app';

interface TouristAttractionData {
  name: string;
  description: string;
  image: string;
  address?: string;
  lat?: number;
  lng?: number;
  rating?: number;
  reviewCount?: number;
  category?: string;
  priceRange?: string;
  openingHours?: string;
}

interface EventData {
  name: string;
  description: string;
  startDate: string;
  endDate?: string;
  location: string;
  organizer: string;
  image?: string;
  ticketUrl?: string;
}

interface TravelPlanData {
  name: string;
  description: string;
  destinations: string[];
  duration: string;
  price?: string;
}

interface StructuredDataProps {
  type: 'tourist-attraction' | 'event' | 'travel-plan' | 'local-business';
  data: TouristAttractionData | EventData | TravelPlanData | any;
}

export default function StructuredData({ type, data }: StructuredDataProps) {
  const generateSchema = () => {
    switch (type) {
      case 'tourist-attraction':
        const attraction = data as TouristAttractionData;
        return {
          "@context": "https://schema.org",
          "@type": "TouristAttraction",
          "name": attraction.name,
          "description": attraction.description,
          "image": attraction.image ? `${baseUrl}${attraction.image}` : undefined,
          "url": `${baseUrl}/spots/${encodeURIComponent(attraction.name)}`,
          "address": attraction.address ? {
            "@type": "PostalAddress",
            "addressLocality": "東京",
            "addressCountry": "JP",
            "streetAddress": attraction.address
          } : undefined,
          "geo": attraction.lat && attraction.lng ? {
            "@type": "GeoCoordinates",
            "latitude": attraction.lat,
            "longitude": attraction.lng
          } : undefined,
          "aggregateRating": attraction.rating ? {
            "@type": "AggregateRating",
            "ratingValue": attraction.rating,
            "reviewCount": attraction.reviewCount || 10,
            "bestRating": 5,
            "worstRating": 1
          } : undefined,
          "openingHours": attraction.openingHours || "Mo-Su 09:00-18:00",
          "priceRange": attraction.priceRange || "¥",
          "category": attraction.category || "観光スポット",
          "hasMap": `https://maps.google.com/?q=${encodeURIComponent(attraction.name + ' 東京')}`,
          "touristType": ["文化観光", "自然観光", "歴史観光"],
          "availableLanguage": ["ja", "en", "fr", "ko"],
          "accessibilityFeature": ["車椅子対応", "多言語サポート"]
        };

      case 'event':
        const event = data as EventData;
        return {
          "@context": "https://schema.org",
          "@type": "Event",
          "name": event.name,
          "description": event.description,
          "startDate": event.startDate,
          "endDate": event.endDate || event.startDate,
          "location": {
            "@type": "Place",
            "name": event.location,
            "address": {
              "@type": "PostalAddress",
              "addressLocality": "東京",
              "addressCountry": "JP"
            }
          },
          "organizer": {
            "@type": "Organization",
            "name": event.organizer
          },
          "image": event.image ? `${baseUrl}${event.image}` : undefined,
          "offers": event.ticketUrl ? {
            "@type": "Offer",
            "url": event.ticketUrl,
            "availability": "https://schema.org/InStock",
            "validFrom": new Date().toISOString()
          } : undefined,
          "eventStatus": "https://schema.org/EventScheduled",
          "eventAttendanceMode": "https://schema.org/OfflineEventAttendanceMode",
          "audience": {
            "@type": "Audience",
            "audienceType": "観光客"
          }
        };

      case 'travel-plan':
        const plan = data as TravelPlanData;
        return {
          "@context": "https://schema.org",
          "@type": "TravelPlan",
          "name": plan.name,
          "description": plan.description,
          "itinerary": plan.destinations.map((dest, index) => ({
            "@type": "TravelItinerary",
            "name": `Day ${index + 1}: ${dest}`,
            "description": `${dest}での観光`
          })),
          "totalTime": plan.duration,
          "estimatedCost": plan.price ? {
            "@type": "MonetaryAmount",
            "currency": "JPY",
            "value": plan.price
          } : undefined,
          "provider": {
            "@type": "Organization",
            "name": "TravelGuideJapan",
            "url": baseUrl
          },
          "audience": {
            "@type": "Audience",
            "audienceType": "観光客"
          },
          "potentialAction": {
            "@type": "PlanAction",
            "target": `${baseUrl}/plan`
          }
        };

      case 'local-business':
        return {
          "@context": "https://schema.org",
          "@type": "LocalBusiness",
          "name": data.name,
          "description": data.description,
          "image": data.image ? `${baseUrl}${data.image}` : undefined,
          "address": {
            "@type": "PostalAddress",
            "streetAddress": data.address,
            "addressLocality": "東京",
            "addressCountry": "JP"
          },
          "geo": data.lat && data.lng ? {
            "@type": "GeoCoordinates",
            "latitude": data.lat,
            "longitude": data.lng
          } : undefined,
          "telephone": data.phone,
          "openingHours": data.openingHours,
          "priceRange": data.priceRange,
          "servedCuisine": data.cuisine,
          "acceptsReservations": true,
          "hasMenu": data.menuUrl,
          "aggregateRating": data.rating ? {
            "@type": "AggregateRating",
            "ratingValue": data.rating,
            "reviewCount": data.reviewCount || 10
          } : undefined
        };

      default:
        return null;
    }
  };

  const schema = generateSchema();

  if (!schema) return null;

  return (
    <Script
      id={`structured-data-${type}`}
      type="application/ld+json"
      dangerouslySetInnerHTML={{
        __html: JSON.stringify(schema),
      }}
    />
  );
}