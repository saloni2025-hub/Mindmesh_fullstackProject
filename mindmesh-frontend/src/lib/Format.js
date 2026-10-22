export const formatMessageTime = (iso) => {
  const d = new Date(iso);
  const now = new Date();
  if (d.toDateString() === now.toDateString()) {
    return d.toLocaleTimeString([], { hour: 'numeric', minute: '2-digit' });
  }
  if ((now - d) / 86400000 < 7) return d.toLocaleDateString([], { weekday: 'short' });
  return d.toLocaleDateString([], { day: 'numeric', month: 'short' });
};

export const formatSessionDate = (iso) =>
  new Date(iso).toLocaleString([], {
    weekday: 'short', day: 'numeric', month: 'short', hour: 'numeric', minute: '2-digit',
  });

export const timeUntil = (iso) => {
  const mins = Math.round((new Date(iso) - Date.now()) / 60000);
  if (mins <= 0) return 'now';
  if (mins < 60) return `in ${mins}m`;
  const h = Math.floor(mins / 60);
  if (h < 24) return `in ${h}h ${mins % 60}m`;
  return `in ${Math.floor(h / 24)}d`;
};

// Free video calls, no API key needed
export const callLink = (sessionId) => `https://meet.jit.si/mindmesh-${sessionId}`;