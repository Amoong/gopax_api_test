import React from "react";
import Coin from "./Coin";
import "./CoinList.css";

const proxyurl = "https://cors-anywhere.herokuapp.com/";
const baseurl = "https://api.gopax.co.kr";

class CoinList extends React.Component {
  constructor() {
    super();
    this.selectInfo = this.selectInfo.bind(this);
    this.clickKRW = this.clickKRW.bind(this);
    this.clickPRO = this.clickPRO.bind(this);
    this.clickBTC = this.clickBTC.bind(this);
  }
  state = {
    isNamesLoading: true,
    isInfosLoading: true,
    names: [],
    infos: [],
    infosKRW: [],
    infosPRO: [],
    infosBTC: [],
    selectedInfo: [],
    sortDirection: -1
  };
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
  classifyCoinInfosById(infos) {
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
  numberWithCommas(x) {
    return Math.abs(x) > 1
      ? x.toString().replace(/\B(?=(\d{3})+(?!\d))/g, ",")
      : x.toString();
  }
  wrapCoinInfo(info) {
    const id = info.name;
    info.name = this.findKoreanName(this.sliceIdByHyphen(id));
    info.id = id.replace("-", "/");
    if (id === "BCH-BTC") {
      console.log(info.close, info.open);
    }
    // info.contrast = Math.round((info.close - info.open) * 1e12) / 1e12;
    info.contrast = (info.close - info.open).toFixed(0);
    if (id === "BCH-BTC") {
      console.log(info.contrast);
    }
    info.contrastPoint =
      info.close !== 0 ? ((info.contrast / info.close) * 100).toFixed(2) : 0;
    info.tradingValue = (((info.low + info.high) / 2) * info.volume).toFixed(0);
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
  convertTradingValue(tradingValue) {
    const million = 1000000;
    const tenThousand = 10000;
    if (tradingValue > million) {
      return parseInt(tradingValue / million, 10).toString() + "백만";
    } else if (tradingValue > tenThousand) {
      return parseInt(tradingValue / tenThousand, 10).toString() + "만";
    }
    return tradingValue.toString();
  }
  sortByTradingValue(direction) {
    // 고팍스는 정렬시 다른 거래쌍도 같이 정렬함
    const { infosKRW, infosPRO, infosBTC } = this.state;
    infosKRW.sort((a, b) => {
      return (a.tradingValue - b.tradingValue) * direction;
    });

    infosPRO.sort((a, b) => {
      return (a.tradingValue - b.tradingValue) * direction;
    });

    infosBTC.sort((a, b) => {
      return (a.tradingValue - b.tradingValue) * direction;
    });

    this.setState({ infosKRW, infosPRO, infosBTC });
  }
  selectInfo(info) {
    this.setState({ selectedInfo: info });
  }
  clickKRW() {
    const buttons = document.querySelectorAll(".button__select-infos");
    buttons.forEach(button => {
      button.classList.remove("selected");
    });
    document.querySelector(".button__KRW").classList.add("selected");
    this.selectInfo(this.state.infosKRW);
  }
  clickPRO() {
    const buttons = document.querySelectorAll(".button__select-infos");
    buttons.forEach(button => {
      button.classList.remove("selected");
    });
    document.querySelector(".button__PRO").classList.add("selected");
    this.selectInfo(this.state.infosPRO);
  }
  clickBTC() {
    const buttons = document.querySelectorAll(".button__select-infos");
    buttons.forEach(button => {
      button.classList.remove("selected");
    });
    document.querySelector(".button__BTC").classList.add("selected");
    this.selectInfo(this.state.infosBTC);
  }
  async componentDidMount() {
    this.setState(await this.getCoinNames());
    this.setState(await this.getCoinInfos());
    this.setState(this.classifyCoinInfosById(this.state.infos));
    this.sortByTradingValue(this.state.sortDirection);
    this.selectInfo(this.state.infosKRW);
  }
  render() {
    const { selectedInfo, isInfosLoading, isNamesLoading } = this.state;

    return (
      <div className="container">
        {isInfosLoading || isNamesLoading ? (
          <div className="loader">
            <span className="loader__text">Loading...</span>
          </div>
        ) : (
          <div className="coins">
            <div className="buttons">
              <button
                className="button__select-infos button__KRW"
                onClick={this.clickKRW}
              >
                KRW
              </button>
              <button
                className="button__select-infos button__PRO"
                onClick={this.clickPRO}
              >
                PRO
              </button>
              <button
                className="button__select-infos button__BTC"
                onClick={this.clickBTC}
              >
                BTC
              </button>
            </div>
            <table className="coins__table">
              <thead className="coins__thead">
                <tr>
                  <th className="th__interest"></th>
                  <th className="th__name">
                    <button>이름</button>
                  </th>
                  <th className="th__cur">
                    <button>현재가</button>
                  </th>
                  <th className="th__contrast">
                    <button>변동</button>
                  </th>
                  <th className="th__high">
                    <button>최고가</button>
                  </th>
                  <th className="th__low">
                    <button>최저가</button>
                  </th>
                  <th className="th__trading-value">
                    <button>거래대금</button>
                  </th>
                </tr>
              </thead>
              <tbody>
                {selectedInfo.map(info => (
                  <Coin
                    key={info.id}
                    name={info.name}
                    id={info.id}
                    close={this.numberWithCommas(info.close)}
                    contrast={this.numberWithCommas(info.contrast)}
                    contrastPoint={info.contrastPoint}
                    high={this.numberWithCommas(info.high)}
                    low={this.numberWithCommas(info.low)}
                    tradingValue={this.convertTradingValue(info.tradingValue)}
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
