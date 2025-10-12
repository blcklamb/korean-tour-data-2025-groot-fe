import MissionHistoryDetailView from "./_components/mission-history-detail-view";

type MissionHistoryDetailPageProps = {
  params: Promise<{ historyId: string }>;
};

export default async function MissionHistoryDetailPage({
  params,
}: MissionHistoryDetailPageProps) {
  const { historyId } = await params;
  return <MissionHistoryDetailView historyIdParam={historyId} />;
}
