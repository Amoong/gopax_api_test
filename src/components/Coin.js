import React from "react";
import PropTypes from "prop-types";

function Coin({ name, id, close, contrast, high, low, volume }) {
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

Coin.prototype = {
  name: PropTypes.string.isRequired,
  id: PropTypes.string.isRequired,
  close: PropTypes.number.isRequired,
  contrast: PropTypes.number.isRequired,
  high: PropTypes.number.isRequired,
  low: PropTypes.number.isRequired,
  volume: PropTypes.number.isRequired
};

export default Coin;
