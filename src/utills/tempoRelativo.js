export const relativeTime = (date) => {
    const now = Date.now();
    const diff = now - new Date(date);
    const seconds = Math.floor(diff / 1000);
    
    if(seconds < 60) return 'right now';
    if(seconds < 3600) return `${Math.floor(seconds / 60)} minutes ago`;
    if(seconds < 86400) return `${Math.floor(seconds / 3600)} hours ago`;
    if(seconds < 172800) return 'yesterday';
    return `${Math.floor(seconds / 86400)} days ago`;
}