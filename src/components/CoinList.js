import React from "react";

const proxyurl = "https://cors-anywhere.herokuapp.com/";
const baseurl = "https://api.gopax.co.kr";

class CoinList extends React.Component {
  state = {
    isLoading: true,
    names: [],
    infosKRW: [],
    infosPRO: [],
    infosBTC: []
  };
  async getCoinNames() {
    const url = `${proxyurl}${baseurl}/assets`; // site that doesn’t send Access-Control-*
    try {
      const res = await fetch(url);
      if (!res.ok) return false;
      this.state = { names: await res.json() };
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
      return await res.json();
    } catch (error) {
      console.log(error);
      return false;
    }
  }
  classifyCoinInfos(infos) {
    if (!infos) return false;

    const infosKRW = [];
    const infosPRO = [];
    const infosBTC = [];
    infos.forEach(info => {
      const name = info.name;
      if (/BULL|BEAR|HG/.test(name)) {
        info.name = this.sliceNameByHyphen(name);
        infosPRO.push(info);
      } else if (/KRW$/.test(name)) {
        info.name = this.sliceNameByHyphen(name);
        infosKRW.push(info);
      } else if (/BTC$/.test(name)) {
        info.name = this.sliceNameByHyphen(name);
        infosBTC.push(info);
      }
    });

    this.setState({ infosKRW, infosPRO, infosBTC });

    return {
      lengthKRW: infosKRW.length,
      lengthPRO: infosPRO.length,
      lengthBTC: infosBTC.length
    };
  }
  sliceNameByHyphen(name) {
    return name.slice(0, name.indexOf("-"));
  }
  async componentDidMount() {
    this.getCoinNames();
    this.classifyCoinInfos(await this.getCoinInfos());
    console.log(this.state.infosPRO);
  }
  render() {
    return <div className="coinlist">this is coinlist</div>;
  }
}

export default CoinList;
