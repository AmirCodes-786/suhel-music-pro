import React from 'react';
import { motion } from 'framer-motion';

const CardGrid = ({ children, title, subtitle, action }) => {
  return (
    <section className="card-grid-section">
      {(title || action) && (
        <div className="section-header">
          <div>
            {title && <h2 className="heading-sm">{title}</h2>}
            {subtitle && <p className="section-subtitle">{subtitle}</p>}
          </div>
          {action && <div className="section-action">{action}</div>}
        </div>
      )}
      <motion.div
        className="card-grid"
        initial={{ opacity: 0 }}
        animate={{ opacity: 1 }}
        transition={{ duration: 0.3 }}
      >
        {children}
      </motion.div>
    </section>
  );
};

export default React.memo(CardGrid);
