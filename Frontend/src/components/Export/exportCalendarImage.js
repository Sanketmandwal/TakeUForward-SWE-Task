import {
  addDays,
  eachWeekOfInterval,
  endOfMonth,
  isSameMonth,
  isToday,
  startOfMonth,
} from "date-fns";

const MODULE_EXPORT_THEME = {
  dsa: { primary: "#0ea5e9", glow: "#0ea5e933", emoji: "🔥", label: "DSA" },
  lld: { primary: "#8b5cf6", glow: "#8b5cf633", emoji: "⚡", label: "LLD" },
  sql: { primary: "#10b981", glow: "#10b98133", emoji: "💎", label: "SQL" },
};

const DAY_LABELS = ["MON", "TUE", "WED", "THU", "FRI", "SAT", "SUN"];

const toKey = (date) =>
  `${date.getFullYear()}-${String(date.getMonth() + 1).padStart(2, "0")}-${String(date.getDate()).padStart(2, "0")}`;

function roundedRect(ctx, x, y, width, height, radius) {
  ctx.beginPath();
  ctx.moveTo(x + radius, y);
  ctx.lineTo(x + width - radius, y);
  ctx.arcTo(x + width, y, x + width, y + radius, radius);
  ctx.lineTo(x + width, y + height - radius);
  ctx.arcTo(x + width, y + height, x + width - radius, y + height, radius);
  ctx.lineTo(x + radius, y + height);
  ctx.arcTo(x, y + height, x, y + height - radius, radius);
  ctx.lineTo(x, y + radius);
  ctx.arcTo(x, y, x + radius, y, radius);
  ctx.closePath();
}

export async function renderCalendarImage({
  viewDate,
  activeModule,
  activeDays,
  rangeStart,
  rangeEnd,
  currentStreak,
}) {
  const canvas = document.createElement("canvas");
  const ctx = canvas.getContext("2d");
  const width = 1080;
  const height = 1080;
  const theme = MODULE_EXPORT_THEME[activeModule] ?? MODULE_EXPORT_THEME.dsa;
  const padding = 64;

  canvas.width = width;
  canvas.height = height;

  drawBackground(ctx, width, height);
  drawTopAccent(ctx, width, theme.primary);
  drawHeader(ctx, padding, theme, currentStreak);
  drawMonthTitle(ctx, padding, viewDate, theme.primary);
  drawCalendarGrid(ctx, {
    width,
    height,
    padding,
    viewDate,
    activeModule,
    activeDays,
    rangeStart,
    rangeEnd,
    theme,
  });
  drawFooter(ctx, width, height, padding, theme);

  return canvas;
}

export function downloadCalendarImage(canvas, filename) {
  const anchor = document.createElement("a");
  anchor.href = canvas.toDataURL("image/png", 1.0);
  anchor.download = filename;
  anchor.click();
}

export async function copyCalendarImage(canvas) {
  return new Promise((resolve, reject) => {
    canvas.toBlob(async (blob) => {
      try {
        await navigator.clipboard.write([
          new ClipboardItem({ "image/png": blob }),
        ]);
        resolve();
      } catch (error) {
        reject(error);
      }
    }, "image/png", 1.0);
  });
}

function drawBackground(ctx, width, height) {
  const bg = ctx.createLinearGradient(0, 0, 0, height);
  bg.addColorStop(0, "#0d1117");
  bg.addColorStop(0.5, "#111520");
  bg.addColorStop(1, "#080a0e");
  ctx.fillStyle = bg;
  ctx.fillRect(0, 0, width, height);

  const vignette = ctx.createRadialGradient(width / 2, height / 2, height * 0.3, width / 2, height / 2, height * 0.85);
  vignette.addColorStop(0, "rgba(0,0,0,0)");
  vignette.addColorStop(1, "rgba(0,0,0,0.45)");
  ctx.fillStyle = vignette;
  ctx.fillRect(0, 0, width, height);
}

function drawTopAccent(ctx, width, primary) {
  const barGrad = ctx.createLinearGradient(0, 0, width, 0);
  barGrad.addColorStop(0, "transparent");
  barGrad.addColorStop(0.3, `${primary}cc`);
  barGrad.addColorStop(0.7, `${primary}cc`);
  barGrad.addColorStop(1, "transparent");
  ctx.fillStyle = barGrad;
  ctx.fillRect(0, 0, width, 5);
}

function drawHeader(ctx, padding, theme, currentStreak) {
  ctx.font = "700 13px 'Inter',system-ui,sans-serif";
  const badgeText = `● ${theme.label} MODULE`;
  const badgeWidth = ctx.measureText(badgeText).width + 36;

  roundedRect(ctx, padding, 42, badgeWidth, 34, 17);
  ctx.fillStyle = theme.glow;
  ctx.fill();
  roundedRect(ctx, padding, 42, badgeWidth, 34, 17);
  ctx.strokeStyle = `${theme.primary}55`;
  ctx.lineWidth = 1.2;
  ctx.stroke();

  ctx.fillStyle = theme.primary;
  ctx.fillText(badgeText, padding + 18, 64);

  ctx.font = "800 88px 'Inter',system-ui,sans-serif";
  ctx.fillStyle = "#ffffff";
  const numberLabel = `${currentStreak}`;
  ctx.fillText(numberLabel, padding + 68, 178);

  const numberWidth = ctx.measureText(numberLabel).width;
  ctx.font = "300 26px 'Inter',system-ui,sans-serif";
  ctx.fillStyle = "rgba(255,255,255,0.48)";
  ctx.fillText("day streak", padding + 68 + numberWidth + 14, 178);

  ctx.font = "52px serif";
  ctx.fillText(theme.emoji, padding, 178);

  ctx.strokeStyle = "rgba(255,255,255,0.07)";
  ctx.lineWidth = 1;
  ctx.beginPath();
  ctx.moveTo(padding, 208);
  ctx.lineTo(1080 - padding, 208);
  ctx.stroke();
}

function drawMonthTitle(ctx, padding, viewDate, primary) {
  const month = viewDate.toLocaleString("default", { month: "long" }).toUpperCase();
  const year = String(viewDate.getFullYear());

  ctx.font = "800 70px 'Inter',system-ui,sans-serif";
  ctx.fillStyle = "#ffffff";
  ctx.fillText(month, padding, 290);

  const monthWidth = ctx.measureText(month).width;
  ctx.font = "300 52px 'Inter',system-ui,sans-serif";
  ctx.fillStyle = `${primary}cc`;
  ctx.fillText(`  ${year}`, padding + monthWidth, 290);
}

function drawCalendarGrid(ctx, {
  width,
  height,
  padding,
  viewDate,
  activeModule,
  activeDays,
  rangeStart,
  rangeEnd,
  theme,
}) {
  const columnWidth = (width - padding * 2) / 7;
  const gridHeaderY = 348;

  ctx.font = "600 13px 'Inter',system-ui,sans-serif";
  DAY_LABELS.forEach((label, index) => {
    const centerX = padding + index * columnWidth + columnWidth / 2;
    ctx.fillStyle = index >= 5 ? `${theme.primary}bb` : "rgba(255,255,255,0.30)";
    ctx.textAlign = "center";
    ctx.fillText(label, centerX, gridHeaderY);
  });

  const gridStart = gridHeaderY + 24;
  const footerHeight = 110;
  const gridHeight = height - gridStart - footerHeight;
  const monthStart = startOfMonth(viewDate);
  const monthEnd = endOfMonth(viewDate);
  const weeks = eachWeekOfInterval({ start: monthStart, end: monthEnd }, { weekStartsOn: 1 });
  const rowHeight = gridHeight / weeks.length;

  const rawModuleDays = activeDays[activeModule];
  const moduleDays = rawModuleDays instanceof Set
    ? rawModuleDays
    : Array.isArray(rawModuleDays)
      ? new Set(rawModuleDays)
      : new Set();

  const lowerBound = rangeStart && rangeEnd
    ? (rangeStart <= rangeEnd ? rangeStart : rangeEnd)
    : rangeStart;
  const upperBound = rangeStart && rangeEnd
    ? (rangeStart <= rangeEnd ? rangeEnd : rangeStart)
    : null;

  weeks.forEach((weekStart, weekIndex) => {
    const rowY = gridStart + weekIndex * rowHeight;
    const midY = rowY + rowHeight / 2;

    if (lowerBound && upperBound) {
      let bandStartX = -1;
      let bandEndX = -1;

      for (let dayIndex = 0; dayIndex < 7; dayIndex += 1) {
        const date = addDays(weekStart, dayIndex);
        if (!isSameMonth(date, viewDate)) continue;

        if (date >= lowerBound && date <= upperBound) {
          const centerX = padding + dayIndex * columnWidth + columnWidth / 2;
          if (bandStartX < 0) bandStartX = centerX;
          bandEndX = centerX;
        }
      }

      if (bandStartX >= 0) {
        ctx.fillStyle = `${theme.primary}28`;
        roundedRect(
          ctx,
          bandStartX - columnWidth * 0.42,
          midY - rowHeight * 0.34,
          (bandEndX - bandStartX) + columnWidth * 0.84,
          rowHeight * 0.68,
          40,
        );
        ctx.fill();
      }
    }

    for (let dayIndex = 0; dayIndex < 7; dayIndex += 1) {
      const date = addDays(weekStart, dayIndex);
      const inMonth = isSameMonth(date, viewDate);
      const centerX = padding + dayIndex * columnWidth + columnWidth / 2;
      const radius = Math.min(columnWidth, rowHeight) * 0.34;
      const dateKey = toKey(date);
      const streakDay = inMonth && moduleDays.has(dateKey);
      const today = isToday(date);
      const rangeStartDay = lowerBound && inMonth && dateKey === toKey(lowerBound);
      const rangeEndDay = upperBound && inMonth && dateKey === toKey(upperBound);

      if (!inMonth) {
        ctx.font = "400 22px 'Inter',system-ui,sans-serif";
        ctx.fillStyle = "rgba(255,255,255,0.10)";
        ctx.textAlign = "center";
        ctx.fillText(date.getDate(), centerX, midY + 8);
        continue;
      }

      if (streakDay && !rangeStartDay && !rangeEndDay) {
        const glow = ctx.createRadialGradient(centerX, midY, 0, centerX, midY, radius * 1.2);
        glow.addColorStop(0, `${theme.primary}44`);
        glow.addColorStop(1, `${theme.primary}00`);
        ctx.beginPath();
        ctx.arc(centerX, midY, radius * 1.2, 0, Math.PI * 2);
        ctx.fillStyle = glow;
        ctx.fill();

        ctx.beginPath();
        ctx.arc(centerX, midY, radius, 0, Math.PI * 2);
        ctx.strokeStyle = `${theme.primary}66`;
        ctx.lineWidth = 1.5;
        ctx.stroke();
      }

      if (rangeStartDay || rangeEndDay) {
        ctx.beginPath();
        ctx.arc(centerX, midY, radius, 0, Math.PI * 2);
        ctx.fillStyle = theme.primary;
        ctx.fill();
      }

      if (today) {
        ctx.beginPath();
        ctx.arc(centerX, midY, radius + 5, 0, Math.PI * 2);
        ctx.strokeStyle = "rgba(255,255,255,0.85)";
        ctx.lineWidth = 2.5;
        ctx.stroke();
      }

      const bright = rangeStartDay || rangeEndDay;
      ctx.font = `${streakDay || bright ? "700" : "400"} 26px 'Inter',system-ui,sans-serif`;
      ctx.fillStyle = bright || streakDay || today ? "#ffffff" : "rgba(255,255,255,0.72)";
      ctx.textAlign = "center";
      ctx.fillText(date.getDate(), centerX, midY + 9);

      if (streakDay && !bright) {
        ctx.font = "11px serif";
        ctx.fillText(theme.emoji, centerX + radius * 0.55, midY - radius * 0.55);
      }
    }
  });
}

function drawFooter(ctx, width, height, padding, theme) {
  const footerHeight = 110;
  const footerY = height - footerHeight + 20;

  ctx.strokeStyle = "rgba(255,255,255,0.07)";
  ctx.lineWidth = 1;
  ctx.beginPath();
  ctx.moveTo(padding, footerY);
  ctx.lineTo(width - padding, footerY);
  ctx.stroke();

  ctx.font = "500 17px 'Inter',system-ui,sans-serif";
  ctx.fillStyle = "rgba(255,255,255,0.35)";
  ctx.textAlign = "left";
  ctx.fillText("Generated with TUF Calendar  ·  takeuforward.org", padding, footerY + 36);

  ctx.font = "600 17px 'Inter',system-ui,sans-serif";
  ctx.fillStyle = `${theme.primary}cc`;
  ctx.textAlign = "right";
  ctx.fillText(`#${theme.label}Streak  #TakeUforward`, width - padding, footerY + 36);
}
