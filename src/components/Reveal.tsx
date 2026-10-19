import type { CSSProperties, ElementType, ReactNode } from 'react';
import { useInView } from '../lib/hooks';

interface RevealProps {
  as?: ElementType;
  /** Seconds. Use small steps (0.08) to stagger siblings. */
  delay?: number;
  variant?: 'rise' | 'pop' | 'left' | 'right' | 'fade' | 'quiet' | 'feature';
  className?: string;
  style?: CSSProperties;
  children: ReactNode;
}

/** Fades/slides its children in once, the first time they scroll into view. */
export function Reveal({ as: Tag = 'div', delay = 0, variant = 'rise', className = '', style, children }: RevealProps) {
  const [ref, seen] = useInView<HTMLElement>({ threshold: 0.14, rootMargin: '0px 0px -6% 0px' });
  return (
    <Tag
      ref={ref}
      className={`reveal reveal--${variant} ${seen ? 'is-in' : ''} ${className}`}
      style={{ ...style, '--d': `${delay}s` } as CSSProperties}
    >
      {children}
    </Tag>
  );
}
