import { redirect } from 'next/navigation';
import MainContent from './MainContent';
import SuspenseWrapper from '@/components/SuspenseWrapper';

interface SpotPageProps {
  params: Promise<{ id: string }>;
  searchParams: Promise<{ [key: string]: string | string[] | undefined }>;
}

export default async function SpotPage({ params, searchParams }: SpotPageProps) {
  const { id } = await params;
  const resolvedSearchParams = await searchParams;
  const language = resolvedSearchParams.lang as string;
  const currency = resolvedSearchParams.currency as string;
  const unit = resolvedSearchParams.unit as string;

  // 言語が指定されている場合は適切なパスにリダイレクト
  if (language && language !== 'ja') {
    redirect(`/${language}/spots/${id}`);
  }

  return (
    <SuspenseWrapper>
      <MainContent
        spotId={id}
        locale={language || 'ja'}
        language={language}
        currency={currency}
        unit={unit}
      />
    </SuspenseWrapper>
  );
}
