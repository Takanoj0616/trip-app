import MainContent from './MainContent';

interface SpotPageProps {
  params: { id: string };
  searchParams: Promise<{ [key: string]: string | string[] | undefined }>;
}

export default async function SpotPage({ params, searchParams }: SpotPageProps) {
  const resolvedSearchParams = await searchParams;
  const language = resolvedSearchParams.lang as string;
  const currency = resolvedSearchParams.currency as string;
  const unit = resolvedSearchParams.unit as string;

  return (
    <MainContent 
      spotId={params.id}
      language={language}
      currency={currency}
      unit={unit}
    />
  );
}