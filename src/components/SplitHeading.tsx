/**
 * @license
 * SPDX-License-Identifier: Apache-2.0
 */

import { motion } from 'motion/react';
import { useEffect, useState } from 'react';

interface SplitHeadingProps {
  text: string;
  className?: string;
  as?: 'h1' | 'h2' | 'h3';
  delay?: number;
}

export default function SplitHeading({
  text,
  className = '',
  as: Component = 'h2',
  delay = 0,
}: SplitHeadingProps) {
  const [reducedMotion, setReducedMotion] = useState(false);

  useEffect(() => {
    const media = window.matchMedia('(prefers-reduced-motion: reduce)');
    setReducedMotion(media.matches);
  }, []);

  // Strict word split preserving exact word units - never split letters!
  const words = text.split(/\s+/).filter(Boolean);

  if (reducedMotion) {
    return <Component className={`${className} [text-wrap:balance]`}>{text}</Component>;
  }

  return (
    <Component className={`${className} [text-wrap:balance]`}>
      {words.map((word, i) => (
        <span key={`${word}-${i}`} className="inline-block overflow-hidden mr-[0.28em] last:mr-0 align-top">
          <motion.span
            initial={{ y: '105%', opacity: 0 }}
            whileInView={{ y: 0, opacity: 1 }}
            viewport={{ once: true, margin: '-10%' }}
            transition={{
              duration: 0.7,
              delay: delay + i * 0.05,
              ease: [0.16, 1, 0.3, 1],
            }}
            className="inline-block"
          >
            {word}
          </motion.span>
        </span>
      ))}
    </Component>
  );
}
