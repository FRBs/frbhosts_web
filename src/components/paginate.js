import React from "react";
import "./master.css";
const Paginate = (props) => {
  return (
    <nav aria-label="Page navigation example">
      <ul class="pagination pagination-lg justify-content-center ">
        <li class={`page-item ${props.cactive == 1 ? "disabled " : ""}`}>
          <span
            class={`page-link ${props.cactive == 1 ? "text-secondary bg-muted " : "text-warning"}`}
            onClick={() => props.pagecount(props.cactive - 1)}
            aria-disabled={`${props.cactive == 1 ? "true" : ""}`}
          >
            Prev
          </span>
        </li>
        {[...Array(Math.ceil(props.total / 10))].map((ini, i) => {
          return (
            <li class={`page-item ${props.cactive == i + 1 ? "active" : " "}`}>
              <span class="page-link text-warning" onClick={() => props.pagecount(i + 1)}>
                {i + 1}
              </span>
            </li>
          );
        })}

        <li class={`page-item ${props.cactive == Math.ceil(props.total / 10) ? "disabled" : ""}`}>
          <span
            class={`page-link ${props.cactive == Math.ceil(props.total / 10) ? "text-secondary bg-muted " : "text-warning"}`}
            onClick={() => props.pagecount(props.cactive + 1)}
            aria-disabled={`${props.cactive == Math.ceil(props.total / 10) ? "true" : ""}`}
          >
            Next
          </span>
        </li>
      </ul>
    </nav>
  );
};

export default Paginate;
