import React from "react";
import PropTypes from "prop-types";
import "./Coin.css";
function Coin({
  name,
  id,
  close,
  contrast,
  contrastPoint,
  high,
  low,
  tradingValue
}) {
  return (
    <tr>
      <th>🤍</th>
      <th>
        <div>{name}</div>
        <div>{id}</div>
      </th>
      <th>{close}</th>
      <th>
        <div>{contrastPoint}%</div>
        <div>{contrast}</div>
      </th>
      <th>{high}</th>
      <th>{low}</th>
      <th>{tradingValue}</th>
    </tr>
  );
}

Coin.prototype = {
  name: PropTypes.string.isRequired,
  id: PropTypes.string.isRequired,
  close: PropTypes.string.isRequired,
  contrast: PropTypes.string.isRequired,
  high: PropTypes.string.isRequired,
  low: PropTypes.string.isRequired,
  tradingValue: PropTypes.number.isRequired
};

export default Coin;
