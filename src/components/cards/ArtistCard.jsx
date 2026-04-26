import React from 'react';
import { useNavigate } from 'react-router-dom';
import { motion } from 'framer-motion';
import { DEFAULT_ARTIST_IMAGE } from '../../utils/constants';
import './ArtistCard.css';

const ArtistCard = ({ artist, index = 0 }) => {
  const navigate = useNavigate();

  return (
    <motion.div
      className="artist-card"
      onClick={() => navigate(`/artist/${artist.id}`)}
      initial={{ opacity: 0, y: 20 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ delay: Math.min(index * 0.05, 0.8), duration: 0.3 }}
      whileHover={{ y: -4 }}
    >
      <img
        className="artist-card-image"
        src={artist.image || DEFAULT_ARTIST_IMAGE}
        alt={artist.name}
        loading="lazy"
      />
      <div className="artist-card-name truncate">{artist.name}</div>
      <div className="artist-card-genre truncate">Artist</div>
    </motion.div>
  );
};

export default React.memo(ArtistCard);
