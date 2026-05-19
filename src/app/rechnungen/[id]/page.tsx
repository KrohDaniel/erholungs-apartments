import EditorClient from './EditorClient';

export const dynamic = 'force-dynamic';

export default async function InvoiceEditorPage({
  params,
}: {
  params: Promise<{ id: string }>;
}) {
  const { id } = await params;
  return <EditorClient id={id} />;
}
