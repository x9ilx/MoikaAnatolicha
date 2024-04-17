import React from "react";
import PropTypes from "prop-types";

const Paginator = (props) => {
  if (props.total_page <= 1) {
    return <></>;
  }


  const PreviousPage = () => {
    if (props.current_page > 1) {
        props.OnChangePage(props.current_page - 1)
    }
  }

  const NextPage = () => {
    if (props.current_page < props.total_page) {
        props.OnChangePage(props.current_page + 1)
    }
  }

  let page_list = [];

  for (let i = 1; i < props.total_page + 1 ; i++) {
    page_list.push(
      <li key={i} className="page-item"  onClick={() => {props.OnChangePage(i)}}>
        <a
          className={`page-link  fs-7 fw-medium paginator-hover ${props.current_page == i ? "active": ""}`}
          style={{cursor: "pointer"}}
        >
          {i}
        </a>
      </li>
    );
  }

  return (
    <>
      <div className="row justify-content-center ,s-4">
        <nav aria-label="Page navigation justify-content-center">
          <ul className="pagination justify-content-center px-5">
            <li className="page-item" onClick={PreviousPage}>
              <a
                className={`page-link fs-7 fw-medium paginator-hover ${props.current_page == 1 ? "disabled" : ""}`}
                style={{cursor: "pointer"}}
                aria-label="Previous"
              >
                <span aria-hidden="true">&laquo;</span>
              </a>
            </li>
            {page_list}
            <li className="page-item"  onClick={NextPage}>
              <a
                className={`page-link fs-7 fw-medium paginator-hover ${props.current_page == props.total_page ? "disabled" : ""}`}
                style={{cursor: "pointer"}}
                aria-label="Next"
              >
                <span aria-hidden="true">&raquo;</span>
              </a>
            </li>
          </ul>
        </nav>
      </div>
    </>
  );
};

Paginator.propTypes = {
  total_page: PropTypes.number.isRequired,
  current_page: PropTypes.number.isRequired,
  OnChangePage: PropTypes.func.isRequired,
};

export default Paginator;
