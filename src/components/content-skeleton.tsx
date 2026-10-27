type SkeletonVariant = 'cards' | 'events' | 'leadership' | 'detail';

/** One shared loading treatment for the site's editorial content slots. */
export function ContentSkeleton({ variant = 'cards', contained = true }: { variant?: SkeletonVariant; contained?: boolean }) {
  return <div className={`content-skeleton skeleton-${variant}${contained ? ' container data-status' : ''}`} role="status" aria-label="Loading content" aria-busy="true">
    <span className="sr-only">Loading content</span>
    <div aria-hidden="true">
      {variant === 'detail' ? <>
        <div className="skeleton-detail-heading"><span className="skeleton-block skeleton-line" /><span className="skeleton-block skeleton-title" /><span className="skeleton-block skeleton-line" /></div>
        <div className="skeleton-block skeleton-cover" />
        <div className="skeleton-detail-body">{[0, 1, 2, 3].map(index => <span key={index} className="skeleton-block skeleton-line" />)}</div>
      </> : <>
        {contained && <span className="skeleton-block skeleton-section-title" />}
        <div className="skeleton-grid">{[0, 1, 2].slice(0, variant === 'events' ? 2 : 3).map(index => <div className="skeleton-card" key={index}>
          <div className="skeleton-block skeleton-image" />
          <div className="skeleton-card-copy"><span className="skeleton-block skeleton-title" /><span className="skeleton-block skeleton-line" /><span className="skeleton-block skeleton-line" /><span className="skeleton-block skeleton-meta" /></div>
        </div>)}</div>
      </>}
    </div>
  </div>;
}
