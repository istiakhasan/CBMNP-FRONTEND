import dayjs from "dayjs";
import utc from "dayjs/plugin/utc";
import timezone from "dayjs/plugin/timezone";

dayjs.extend(utc);
dayjs.extend(timezone);

const BD_TIMEZONE = "Asia/Dhaka";

// Timestamps from the API (punch logs, lastSyncAt, etc.) are absolute instants.
// Always render them in Bangladesh time explicitly instead of the viewer's browser
// timezone — the office runs on BDT regardless of where someone opens the dashboard from.
export const formatBD = (value: string | Date | null | undefined, fmt = "YYYY-MM-DD HH:mm:ss") => {
  if (!value) return "-";
  return dayjs(value).tz(BD_TIMEZONE).format(fmt);
};
