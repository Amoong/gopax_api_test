import React from "react";
import PropTypes from "prop-types";

function Movie({ name, id, close, contrast, high, low, volume }) {
  return (
    <tr>
      <th>🤍</th>
      <th>{name}</th>
      <th>{close}</th>
      <th>{contrast}</th>
      <th>{high}</th>
      <th>{low}</th>
      <th>{volume}</th>
    </tr>
  );
}

export default Movie;
