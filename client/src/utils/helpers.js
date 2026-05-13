export const getImageUrl = (path) => {
  if (!path) return '';
  if (path.startsWith('http')) return path;
  return path;
};

export const shareToWhatsApp = (text, url) => {
  const encoded = encodeURIComponent(`${text} ${url || ''}`);
  window.open(`https://wa.me/?text=${encoded}`, '_blank');
};

export const shareViaEmail = (subject, body) => {
  window.open(`mailto:?subject=${encodeURIComponent(subject)}&body=${encodeURIComponent(body)}`);
};

export const nativeShare = async (title, text, url) => {
  if (navigator.share) {
    try {
      await navigator.share({ title, text, url });
      return true;
    } catch {
      return false;
    }
  }
  return false;
};

export const downloadCanvasImage = (canvas, filename = 'greeting-card.png') => {
  const link = document.createElement('a');
  link.download = filename;
  link.href = canvas.toDataURL('image/png', 1.0);
  link.click();
};

export const categories = [
  { label: 'All', value: '', icon: '✨' },
  { label: 'Birthday', value: 'Birthday', icon: '🎂' },
  { label: 'Anniversary', value: 'Anniversary', icon: '💍' },
  { label: 'Festivals', value: 'Festivals', icon: '🪔' },
  { label: 'Shayari', value: 'Shayari', icon: '📝' },
  { label: 'Joke', value: 'Joke', icon: '😂' },
  { label: 'Updesh', value: 'Updesh', icon: '🙏' },
  { label: 'Love', value: 'Love', icon: '❤️' },
  { label: 'Trending', value: 'Trending', icon: '🔥' },
];
