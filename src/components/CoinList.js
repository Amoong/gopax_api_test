import React from "react";
import Coin from "./Coin";

const proxyurl = "https://cors-anywhere.herokuapp.com/";
const baseurl = "https://api.gopax.co.kr";

class CoinList extends React.Component {
  state = {};

  constructor() {
    super();
    this.state = {
      isNamesLoading: true,
      isInfosLoading: true,
      names: [],
      infos: [],
      infosKRW: [],
      infosPRO: [],
      infosBTC: [],
      some: ""
    };
  }
  async getCoinNames() {
    const url = `${proxyurl}${baseurl}/assets`; // site that doesn’t send Access-Control-*
    try {
      const res = await fetch(url);
      if (!res.ok) return false;
      return { names: await res.json(), isNamesLoading: false };
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
      return { infos: await res.json(), isInfosLoading: false };
    } catch (error) {
      console.log(error);
      return false;
    }
  }
  getCoinNameById() {}
  classifyCoinInfos(infos) {
    if (!infos) return false;

    const infosKRW = [];
    const infosPRO = [];
    const infosBTC = [];
    infos.forEach(info => {
      const id = info.name;
      if (/BULL|BEAR|HG/.test(id)) {
        infosPRO.push(this.wrapCoinInfo(info));
      } else if (/KRW$/.test(id)) {
        infosKRW.push(this.wrapCoinInfo(info));
      } else if (/BTC$/.test(id)) {
        infosBTC.push(this.wrapCoinInfo(info));
      }
    });

    return { infosKRW, infosPRO, infosBTC };
  }
  wrapCoinInfo(info) {
    const id = info.name;
    info.id = id.replace("-", "/");
    info.name = this.findKoreanName(this.sliceIdByHyphen(id));
    return info;
  }
  findKoreanName(id) {
    const { names } = this.state;
    for (let i = 0; i < names.length; i++) {
      if (names[i].id === id) {
        return names[i].name;
      }
    }
    return "";
  }
  sliceIdByHyphen(id) {
    return id.slice(0, id.indexOf("-"));
  }
  async componentDidMount() {
    this.setState(await this.getCoinNames());
    this.setState(await this.getCoinInfos());
    this.setState(this.classifyCoinInfos(this.state.infos));
  }
  render() {
    const { infosKRW, isInfosLoading, isNamesLoading } = this.state;

    return (
      <div className="container">
        {isInfosLoading || isNamesLoading ? (
          <div className="loader">
            <span className="loader__text">Loading...</span>
          </div>
        ) : (
          <div className="coins">
            <table className="coins__table">
              <thead className="coins__thead">
                <tr>
                  <th className="th__interest"></th>
                  <th className="th__name">이름</th>
                  <th className="th__cur">현재가</th>
                  <th className="th__contrast">변동</th>
                  <th className="th__high">최고가</th>
                  <th className="th__low">최저가</th>
                  <th className="th__trading-value">거래대금</th>
                </tr>
              </thead>
              <tbody>
                {infosKRW.map(info => (
                  <Coin
                    key={info.id}
                    name={info.name}
                    id={info.id}
                    close={info.close}
                    contrast={info.close}
                    high={info.high}
                    low={info.low}
                    volume={info.volume}
                  />
                ))}
              </tbody>
            </table>
          </div>
        )}
      </div>
    );
  }
}

export default CoinList;
