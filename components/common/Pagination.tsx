export default function Pagination({ pagination, changePage }) {
  const arrayOfNumbers = (num) => {
    let index = 1;
    const allNumbers = [];
    while (index <= num) {
      allNumbers.push(index++);
    }
    return allNumbers;
  };

  if (!pagination) {
    return <></>;
  }

  let startPage = pagination.page - 1;
  if (startPage < 1) {
    startPage = 1;
  }
  if (startPage > pagination.pageCount - 2) {
    startPage = pagination.pageCount - 2;
  }

  return (
    <nav
      className="pagination is-centered is-small is-round"
      role="navigation"
      aria-label="pagination"
    >
      <button
        className="pagination-previous"
        disabled={pagination.page === 1}
        onClick={() => changePage(pagination.page - 1)}
      >
        Previous
      </button>
      <button
        className="pagination-next"
        disabled={pagination.page >= pagination.pageCount}
        onClick={() => changePage(pagination.page + 1)}
      >
        Next page
      </button>
      <ul className="pagination-list">
        {pagination.pageCount <= 3 ? (
          arrayOfNumbers(pagination.pageCount).map((num) => (
            <li key={num}>
              <a
                className={`pagination-link ${
                  pagination.page === num && "is-current"
                }`}
                aria-label={`Goto page ${num}`}
                onClick={() => changePage(num)}
              >
                {num}
              </a>
            </li>
          ))
        ) : (
          <>
            {pagination.page > 2 && (
              <>
                <li>
                  <a
                    className="pagination-link"
                    aria-label="Goto page 1"
                    onClick={() => changePage(1)}
                  >
                    1
                  </a>
                </li>
                <li>
                  <span className="pagination-ellipsis">&hellip;</span>
                </li>
              </>
            )}
            <li>
              <a
                className={`pagination-link ${
                  pagination.page === startPage && "is-current"
                }`}
                aria-label={`Goto page ${startPage}`}
                onClick={() => changePage(startPage)}
              >
                {startPage}
              </a>
            </li>
            <li>
              <a
                className={`pagination-link ${
                  pagination.page === startPage + 1 && "is-current"
                }`}
                aria-label={`Goto page ${startPage + 1}`}
                onClick={() => changePage(startPage + 1)}
              >
                {startPage + 1}
              </a>
            </li>
            <li>
              <a
                className={`pagination-link ${
                  pagination.page === startPage + 2 && "is-current"
                }`}
                aria-label={`Goto page ${startPage + 2}`}
                onClick={() => changePage(startPage + 2)}
              >
                {startPage + 2}
              </a>
            </li>
            {pagination.page < pagination.pageCount - 1 && (
              <>
                <li>
                  <span className="pagination-ellipsis">&hellip;</span>
                </li>
                <li key={pagination.pageCount}>
                  <a
                    className="pagination-link"
                    aria-label={`Goto page ${pagination.pageCount}`}
                    onClick={() => changePage(pagination.pageCount)}
                  >
                    {pagination.pageCount}
                  </a>
                </li>
              </>
            )}
          </>
        )}
      </ul>
    </nav>
  );
}
