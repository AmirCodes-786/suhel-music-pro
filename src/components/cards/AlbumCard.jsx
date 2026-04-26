import React from 'react';
import { useNavigate } from 'react-router-dom';
import { motion } from 'framer-motion';
import { DEFAULT_COVER } from '../../utils/constants';
import './AlbumCard.css';

const AlbumCard = ({ album, index = 0 }) => {
  const navigate = useNavigate();

  return (
    <motion.div
      className="album-card"
      onClick={() => navigate(`/album/${album.id}`)}
      initial={{ opacity: 0, y: 20 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ delay: Math.min(index * 0.05, 0.8), duration: 0.3 }}
      whileHover={{ y: -4 }}
    >
      <img
        className="album-card-image"
        src={album.image || DEFAULT_COVER}
        alt={album.name}
        loading="lazy"
      />
      <div className="album-card-body">
        <div className="album-card-title truncate">{album.name}</div>
        <div className="album-card-artist truncate">{album.artist_name}</div>
      </div>
    </motion.div>
  );
};

export default React.memo(AlbumCard);
