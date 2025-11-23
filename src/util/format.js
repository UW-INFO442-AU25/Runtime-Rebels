export function formatEventDate(iso) {
    const d = new Date(iso);
    return d.toLocaleString([], {
      weekday: "short",
      month: "short",
      day: "numeric",
    });
  }
  
  export function formatEventTime(iso) {
    const d = new Date(iso);
    return d.toLocaleString([], {
      hour: "numeric",
      minute: "2-digit",
    });
  }
  
  export function formatDateTimeLine(iso) {
    return `${formatEventDate(iso)} • ${formatEventTime(iso)}`;
  }  