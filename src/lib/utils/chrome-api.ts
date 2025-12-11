export async function getHistory(filter: string = "") {
  return new Promise<chrome.history.HistoryItem[]>((resolve, reject) => {
    if (!chrome?.history) {
      reject(new Error("Chrome history API not available"));
      return;
    }
    chrome.history.search(
      { text: filter, maxResults: 9999999, startTime: 0 },
      (results: chrome.history.HistoryItem[]) => {
        resolve(results);
      }
    );
  });
}

export type HistoryByDay = {
  [day: string]: chrome.history.HistoryItem[];
};

export async function getHistoryByDay(
  filter: string = "",
  emptyDays: boolean = false
): Promise<HistoryByDay> {
  const history = await getHistory(filter);
  const grouped: HistoryByDay = {};

  history.forEach((item) => {
    if (!item.lastVisitTime) return;

    const date = new Date(item.lastVisitTime);
    // Use local timezone instead of UTC
    const year = date.getFullYear();
    const month = String(date.getMonth() + 1).padStart(2, "0");
    const day = String(date.getDate()).padStart(2, "0");
    const dayKey = `${year}-${month}-${day}`; // YYYY-MM-DD in local time

    if (!grouped[dayKey]) {
      grouped[dayKey] = [];
    }

    grouped[dayKey].push(item);
  });

  if (emptyDays && Object.keys(grouped).length > 0) {
    const dates = Object.keys(grouped).sort();
    const firstDate = new Date(dates[0]);
    const startDate = new Date(firstDate);
    // Making sure every set starts on Monday
    startDate.setDate(startDate.getDate() - (startDate.getDay() - 1));
    const endDate = new Date(dates[dates.length - 1]);

    const currentDate = new Date(startDate);
    while (currentDate <= endDate) {
      const year = currentDate.getFullYear();
      const month = String(currentDate.getMonth() + 1).padStart(2, "0");
      const day = String(currentDate.getDate()).padStart(2, "0");
      const dayKey = `${year}-${month}-${day}`;

      if (!grouped[dayKey]) {
        grouped[dayKey] = [];
      }
      currentDate.setDate(currentDate.getDate() + 1);
    }
  }

  return grouped;
}

export async function deleteHistoryUrl(url: string): Promise<void> {
  return new Promise((resolve, reject) => {
    if (!chrome?.history) {
      reject(new Error("Chrome history API not available"));
      return;
    }

    chrome.history.deleteUrl({ url }, () => {
      if (chrome.runtime.lastError) {
        reject(new Error(chrome.runtime.lastError.message));
      } else {
        resolve();
      }
    });
  });
}

export function getFaviconURL(u: string) {
  const url = new URL(chrome.runtime.getURL("/_favicon/"));
  url.searchParams.set("pageUrl", u);
  url.searchParams.set("size", "16");
  return url.toString();
}
