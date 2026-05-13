import { useState, useRef, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import { HiLockClosed } from 'react-icons/hi';
import { useAuth } from '../context/AuthContext';

export default function TemplateCard({ template, onPremiumClick }) {
  const { user } = useAuth();
  const navigate = useNavigate();
  const canvasRef = useRef(null);
  const [loaded, setLoaded] = useState(false);

  useEffect(() => {
    if (!canvasRef.current) return;
    const canvas = canvasRef.current;
    const ctx = canvas.getContext('2d');
    const config = template.overlayConfig || {};
    const profileCfg = config.profileImage || { x: 0.5, y: 0.75, size: 0.15 };
    const textCfg = config.text || { x: 0.5, y: 0.92, color: '#ffffff', fontSize: 0.04 };

    const bg = new Image();
    bg.crossOrigin = 'anonymous';
    bg.onload = () => {
      canvas.width = bg.width;
      canvas.height = bg.height;
      ctx.drawImage(bg, 0, 0);

      // Gradient at bottom for text readability
      const gradH = canvas.height * 0.35;
      const grad = ctx.createLinearGradient(0, canvas.height - gradH, 0, canvas.height);
      grad.addColorStop(0, 'rgba(0,0,0,0)');
      grad.addColorStop(1, 'rgba(0,0,0,0.5)');
      ctx.fillStyle = grad;
      ctx.fillRect(0, canvas.height - gradH, canvas.width, gradH);

      if (user?.profileImage) {
        const profImg = new Image();
        profImg.crossOrigin = 'anonymous';
        profImg.onload = () => {
          const size = canvas.width * profileCfg.size;
          const cx = canvas.width * profileCfg.x;
          const cy = canvas.height * profileCfg.y;
          ctx.save();
          ctx.beginPath();
          ctx.arc(cx, cy, size / 2, 0, Math.PI * 2);
          ctx.clip();
          ctx.drawImage(profImg, cx - size / 2, cy - size / 2, size, size);
          ctx.restore();
          ctx.beginPath();
          ctx.arc(cx, cy, size / 2 + 2, 0, Math.PI * 2);
          ctx.strokeStyle = 'white';
          ctx.lineWidth = 3;
          ctx.stroke();
          drawName(ctx, canvas, textCfg);
          setLoaded(true);
        };
        profImg.onerror = () => { drawName(ctx, canvas, textCfg); setLoaded(true); };
        profImg.src = user.profileImage;
      } else {
        drawName(ctx, canvas, textCfg);
        setLoaded(true);
      }
    };
    bg.onerror = () => setLoaded(true);
    bg.src = template.imageUrl;
  }, [template, user]);

  function drawName(ctx, canvas, textCfg) {
    const name = user?.name || 'Your Name';
    const fontSize = Math.max(14, canvas.width * (textCfg.fontSize || 0.04));
    ctx.font = `600 ${fontSize}px 'Inter', Arial, sans-serif`;
    ctx.textAlign = 'center';
    ctx.shadowColor = 'rgba(0,0,0,0.5)';
    ctx.shadowBlur = 4;
    ctx.fillStyle = textCfg.color || '#ffffff';
    ctx.fillText(name, canvas.width * textCfg.x, canvas.height * textCfg.y);
    ctx.shadowColor = 'transparent';
  }

  const handleClick = () => {
    if (template.isPremium && user?.subscriptionStatus !== 'premium') {
      onPremiumClick?.(template);
      return;
    }
    navigate(`/template/${template._id}`);
  };

  return (
    <div onClick={handleClick} className="card" style={{ cursor: 'pointer' }}>
      <div style={{ position: 'relative', aspectRatio: '4/5', overflow: 'hidden' }}>
        <canvas
          ref={canvasRef}
          style={{ width: '100%', height: '100%', objectFit: 'cover', display: loaded ? 'block' : 'none' }}
        />
        {!loaded && <div className="skeleton" style={{ width: '100%', height: '100%', position: 'absolute', inset: 0 }} />}

        {/* Category badge overlay */}
        <div style={{
          position: 'absolute', top: 10, left: 10,
          background: 'rgba(0,0,0,0.45)', backdropFilter: 'blur(8px)',
          borderRadius: 100, padding: '4px 10px',
          fontSize: 11, fontWeight: 500, color: '#e2e8f0',
        }}>
          {template.category}
        </div>

        {/* Premium lock */}
        {template.isPremium && user?.subscriptionStatus !== 'premium' && (
          <div className="pulse-glow" style={{
            position: 'absolute', top: 10, right: 10,
            background: 'rgba(0,0,0,0.5)', backdropFilter: 'blur(8px)',
            borderRadius: '50%', padding: 7, display: 'flex',
          }}>
            <HiLockClosed style={{ color: '#fbbf24', fontSize: 14 }} />
          </div>
        )}
      </div>

      <div style={{ padding: '10px 14px', display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
        <div style={{ minWidth: 0 }}>
          <h3 style={{
            fontSize: 13, fontWeight: 600, color: '#f1f5f9',
            overflow: 'hidden', textOverflow: 'ellipsis', whiteSpace: 'nowrap',
            fontFamily: 'Outfit, sans-serif',
          }}>{template.title}</h3>
        </div>
        {template.isPremium
          ? <span className="badge-premium">★ Pro</span>
          : <span className="badge-free">Free</span>
        }
      </div>
    </div>
  );
}
