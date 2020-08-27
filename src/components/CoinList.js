import React from "react";

const proxyurl = "https://cors-anywhere.herokuapp.com/";
const baseurl = "https://api.gopax.co.kr";

class CoinList extends React.Component {
  state = {
    isLoading: true,
    names: [],
    infos: []
  };
  async getCoinNames() {
    const url = `${proxyurl}${baseurl}/assets`; // site that doesn’t send Access-Control-*
    try {
      const res = await fetch(url);
      if (!res.ok) return false;
      this.setState({ names: await res.json() });
      return true;
    } catch (error) {
      console.log(error);
      return false;
    }
  }
  async getCoinInfos() {
    const url = `${proxyurl}${baseurl}/trading-pairs/stats`; // site that doesn’t send Access-Control-*
    try {
      const res = await fetch(url);
      if (!res.ok) return false;
      this.setState({ infos: await res.json() });
      return true;
    } catch (error) {
      console.log(error);
      return false;
    }
  }
  async componentDidMount() {
    this.getCoinNames();
    this.getCoinInfos();
  }
  render() {
    return <div className="coinlist">this is coinlist</div>;
  }
}

export default CoinList;
