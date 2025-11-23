// cron/reportScheduler.ts
import cron from "node-cron";
import { generateReport } from "../utilities/reportGenerator";
import { ReportType } from "../utilities/enums/reportType";

// 🗓 Daily at 9 PM
cron.schedule("0 21 * * *", async () => {
  console.log("⏰ Generating daily reports...");
  await generateReport(ReportType.DAILY);
});

// 🗓 Weekly (Sunday 9 PM)
cron.schedule("0 21 * * 0", async () => {
  console.log("📅 Generating weekly reports...");
  await generateReport(ReportType.WEEKLY);
});

// 🗓 Monthly (last day of the month 9 PM)
cron.schedule("0 21 L * *", async () => {
  console.log("🗓 Generating monthly reports...");
  await generateReport(ReportType.MONTHLY);
});
