import React from 'react';
import { useNavigate } from 'react-router-dom';
import { motion } from 'framer-motion';
import { Music } from 'lucide-react';

const PlaylistCard = ({ playlist, index = 0 }) => {
  const navigate = useNavigate();
  const trackCount = playlist.tracks?.length || 0;
  const coverImages = (playlist.tracks || []).slice(0, 4);

  return (
    <motion.div
      className="track-card"
      onClick={() => navigate(`/playlist/${playlist.id}`)}
      initial={{ opacity: 0, y: 20 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ delay: Math.min(index * 0.05, 0.8), duration: 0.3 }}
      whileHover={{ y: -4 }}
    >
      <div className="track-card-image-wrapper" style={{ background: 'var(--bg-elevated)' }}>
        {coverImages.length >= 4 ? (
          <div style={{
            display: 'grid',
            gridTemplateColumns: '1fr 1fr',
            width: '100%',
            height: '100%',
          }}>
            {coverImages.map((t, i) => (
              <img
                key={i}
                src={t.image || t.album_image}
                alt=""
                style={{ width: '100%', height: '100%', objectFit: 'cover' }}
              />
            ))}
          </div>
        ) : coverImages.length > 0 ? (
          <img
            src={coverImages[0].image || coverImages[0].album_image}
            alt={playlist.name}
            style={{ width: '100%', height: '100%', objectFit: 'cover' }}
          />
        ) : (
          <div style={{
            width: '100%',
            height: '100%',
            display: 'flex',
            alignItems: 'center',
            justifyContent: 'center',
            background: 'linear-gradient(135deg, var(--accent-primary), var(--accent-tertiary))',
          }}>
            <Music size={48} color="white" />
          </div>
        )}
      </div>
      <div className="track-card-body">
        <div className="track-card-title truncate">{playlist.name}</div>
        <div className="track-card-subtitle">{trackCount} tracks</div>
      </div>
    </motion.div>
  );
};

export default React.memo(PlaylistCard);
