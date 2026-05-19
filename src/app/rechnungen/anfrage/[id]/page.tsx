import RequestReviewClient from './RequestReviewClient';

export const dynamic = 'force-dynamic';

export default async function RequestReviewPage({
  params,
}: {
  params: Promise<{ id: string }>;
}) {
  const { id } = await params;
  return <RequestReviewClient id={id} />;
}
