interface BucketDetailPageProps {
  params: Promise<{ id: string }>;
}

export default async function BucketDetailPage({
  params,
}: BucketDetailPageProps) {
  const { id } = await params;

  return (
    <div>
      <h2 className="text-2xl font-bold">Bucket Details</h2>
      <p className="text-muted-foreground mt-2">Bucket ID: {id}</p>
    </div>
  );
}
