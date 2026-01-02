export type OpenPeriod = {
  open: Date;
  close: Date;
};

export function normalizeDay(periods: OpenPeriod[]): OpenPeriod[] {
  periods = periods.slice();
  periods.sort((a, b) => a.open.getTime() - b.open.getTime());
  for (let i = 0; i < periods.length - 1; ) {
    if (periods[i]!.close < periods[i + 1]!.open) {
      i += 1;
      continue;
    }
    if (periods[i]!.close < periods[i + 1]!.close) {
      periods[i]!.close = periods[i + 1]!.close;
    }

    periods.splice(i + 1, 1);
  }
  return periods;
}
