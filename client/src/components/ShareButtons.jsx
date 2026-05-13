import { HiDownload, HiShare, HiMail } from 'react-icons/hi';
import { FaWhatsapp } from 'react-icons/fa';
import { downloadCanvasImage, shareToWhatsApp, shareViaEmail } from '../utils/helpers';
import toast from 'react-hot-toast';

export default function ShareButtons({ canvasRef, templateTitle }) {
  const handleDownload = () => {
    if (!canvasRef?.current) return;
    downloadCanvasImage(canvasRef.current, `${templateTitle || 'greeting'}.png`);
    toast.success('Downloaded!');
  };

  const handleShare = async () => {
    if (!canvasRef?.current || !navigator.share) { handleDownload(); return; }
    try {
      canvasRef.current.toBlob(async (blob) => {
        const file = new File([blob], 'greeting.png', { type: 'image/png' });
        await navigator.share({ title: templateTitle, files: [file] });
      });
    } catch { toast.error('Sharing cancelled'); }
  };

  return (
    <div style={{ display: 'flex', flexWrap: 'wrap', gap: 8 }}>
      <button onClick={handleDownload} className="btn btn-primary" style={{ fontSize: 13 }}>
        <HiDownload /> Download
      </button>
      <button onClick={handleShare} className="btn btn-outline" style={{ fontSize: 13 }}>
        <HiShare /> Share
      </button>
      <button onClick={() => shareToWhatsApp(`Check out this card: ${templateTitle}`)}
        className="btn btn-outline" style={{ padding: '10px 12px', color: '#22c55e' }}>
        <FaWhatsapp size={16} />
      </button>
      <button onClick={() => shareViaEmail(`${templateTitle} - Greeting Card`, 'I made this card for you!')}
        className="btn btn-outline" style={{ padding: '10px 12px', color: '#60a5fa' }}>
        <HiMail size={16} />
      </button>
    </div>
  );
}
