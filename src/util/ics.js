export function buildIcs({ title, description, location, startsAt, endsAt }) {
    const uid = crypto.randomUUID();
    const dt = (s) =>
      new Date(s).toISOString().replace(/[-:]/g, '').split('.')[0] + 'Z';
  
    const lines = [
      'BEGIN:VCALENDAR',
      'VERSION:2.0',
      'PRODID:AzureHaven',
      'BEGIN:VEVENT',
      `UID:${uid}`,
      `DTSTAMP:${dt(new Date().toISOString())}`,
      `DTSTART:${dt(startsAt)}`,
      `DTEND:${dt(endsAt)}`,
      `SUMMARY:${escapeIcs(title)}`,
      location ? `LOCATION:${escapeIcs(location)}` : '',
      description ? `DESCRIPTION:${escapeIcs(description)}` : '',
      'END:VEVENT',
      'END:VCALENDAR'
    ].filter(Boolean);
  
    return new Blob([lines.join('\r\n')], { type: 'text/calendar' });
  }
  
  function escapeIcs(s) {
    return s.replace(/([,;])/g, '\\$1').replace(/\n/g, '\\n');
  }
  
  export function downloadIcsFile(blob, name) {
    const url = URL.createObjectURL(blob);
    const a = document.createElement('a');
    a.href = url;
    a.download = `${name}.ics`;
    a.click();
    URL.revokeObjectURL(url);
  }
  