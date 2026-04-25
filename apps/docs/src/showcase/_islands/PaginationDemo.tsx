import { useState } from 'react';
import { Pagination } from '@freecodecamp/uikit';

export function PaginationDemo(): JSX.Element {
  const [page, setPage] = useState(3);
  return (
    <Pagination
      count={120}
      pageSize={10}
      page={page}
      onPageChange={setPage}
      aria-label='Curriculum pagination'
    />
  );
}

export default PaginationDemo;
