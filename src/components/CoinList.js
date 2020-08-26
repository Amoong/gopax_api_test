import React from "react";

class CoinList extends React.Component {
  state = {
    isLoading: true,
    movies: []
  };
  getCoinList() {
    const proxyurl = "https://cors-anywhere.herokuapp.com/";
    const url = "https://api.gopax.co.kr/assets"; // site that doesn’t send Access-Control-*
    fetch(proxyurl + url)
      .then(response => response.json())
      .then(contents => console.log(contents))
      .catch(() =>
        console.log("Can’t access " + url + " response. Blocked by browser?")
      );
  }
  componentDidMount() {
    this.getCoinList();
  }
  render() {
    return <div className="coinlist">this is coinlist</div>;
  }
}

export default CoinList;
