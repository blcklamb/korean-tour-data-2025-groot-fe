const HOURS_IN_MS = 60 * 60 * 1000;
const DAYS_IN_MS = 24 * HOURS_IN_MS;

export const formatRelativeDate = (input: Date | string | number) => {
  const target = input instanceof Date ? input : new Date(input);
  if (Number.isNaN(target.getTime())) {
    return "-";
  }

  const now = new Date();
  const diff = now.getTime() - target.getTime();

  if (diff < 0) {
    return target.toISOString().slice(0, 10);
  }

  if (diff < HOURS_IN_MS) {
    return "1시간 전";
  }

  if (diff < 24 * HOURS_IN_MS) {
    const hours = Math.max(1, Math.floor(diff / HOURS_IN_MS));
    return `${hours}시간 전`;
  }

  if (diff < 5 * DAYS_IN_MS) {
    const days = Math.max(1, Math.floor(diff / DAYS_IN_MS));
    return `${days}일 전`;
  }

  return target.toISOString().slice(0, 10);
};
