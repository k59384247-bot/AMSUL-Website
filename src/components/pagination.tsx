"use client";

import { SelectControl } from "./select-control";
import { Icon } from "./ui";

export function Pagination({ page, pageCount, pageSize, onPageChange, onPageSizeChange, previousIcon, nextIcon, sortIcon, pageSizeOptions = [6, 12, 24], label = "Report results pagination" }: {
  page: number; pageCount: number; pageSize: number; onPageChange: (page: number) => void; onPageSizeChange: (size: number) => void;
  previousIcon: string; nextIcon: string; sortIcon: string; pageSizeOptions?: number[]; label?: string;
}) {
  return <nav className="pagination" aria-label={label}>
    <button className="button pagination-direction" disabled={page <= 1} onClick={() => onPageChange(page - 1)}><Icon src={previousIcon} className="arrow-back" />Previous</button>
    <div className="pagination-middle"><div className="page-size-label"><span>Results per page</span><SelectControl label="Results per page" className="page-size-select" value={String(pageSize)} onChange={value => onPageSizeChange(Number(value))} options={pageSizeOptions.map(size => ({ value: String(size), label: String(size) }))} icon={sortIcon} /></div>
      <div className="pagination-numbers">{Array.from({ length: pageCount }, (_, index) => index + 1).map(number => <button key={number} className="page-number" aria-label={`Page ${number}`} aria-current={number === page ? "page" : undefined} onClick={() => onPageChange(number)}>{number}</button>)}</div>
    </div>
    <button className="button pagination-direction" disabled={page >= pageCount} onClick={() => onPageChange(page + 1)}>Next<Icon src={nextIcon} /></button>
  </nav>;
}
