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
    this.prevSortStrategy = () => {};
    this.isDesc = true;
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
    curCoinType: "KRW",
    searchKey: "",
    BTC_KRW: 1
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
        if (id === "BTC-KRW") {
          this.setState({ BTC_KRW: info.close });
        }
        infosKRW.push(this.wrapCoinInfo(info));
      } else if (/BTC$/.test(id)) {
        infosBTC.push(this.wrapCoinInfo(info, true));
      }
    });

    return { infosKRW, infosPRO, infosBTC };
  }
  numberWithCommas(x) {
    if (x === undefined) return;
    return Math.abs(x) > 1
      ? x.toString().replace(/\B(?=(\d{3})+(?!\d))/g, ",")
      : x.toString();
  }
  isFloat(n) {
    return Number(n) === n && n % 1 !== 0;
  }
  wrapFloatNumber(n) {
    return this.isFloat(n * 1e6) ? n.toFixed(8) : n;
  }
  wrapCoinInfo(info, isBTC) {
    const id = info.name;
    info.name = this.findKoreanName(this.sliceIdByHyphen(id));
    info.id = id.replace("-", "/");
    info.contrast = (info.close - info.open).toFixed(0);
    info.contrastPoint =
      info.close !== 0 ? ((info.contrast / info.close) * 100).toFixed(2) : 0;
    info.tradingValue = (((info.low + info.high) / 2) * info.volume).toFixed(0);

    info.close = this.wrapFloatNumber(info.close);
    info.high = this.wrapFloatNumber(info.high);
    info.low = this.wrapFloatNumber(info.low);

    if (isBTC) {
      info.BTC_KRW = Math.floor(info.close * this.state.BTC_KRW);
    }

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
  sortByTradingValue(a, b) {
    return a.tradingValue - b.tradingValue;
  }
  sortByClose(a, b) {
    return a.close - b.close;
  }
  sortByContrast(a, b) {
    return a.contrastPoint - b.contrastPoint;
  }
  sortByHigh(a, b) {
    return a.high - b.high;
  }
  sortByLow(a, b) {
    return a.low - b.low;
  }
  sortByName(a, b) {
    const nameA = a.name.toUpperCase();
    const nameB = b.name.toUpperCase();

    if (nameA < nameB) {
      return -1;
    } else if (nameA > nameB) {
      return 1;
    }

    return 0;
  }
  sortInfos(sortStrategy) {
    this.prevSortStrategy = sortStrategy;

    const { infosKRW, infosPRO, infosBTC } = this.state;

    infosKRW.sort(sortStrategy);
    infosPRO.sort(sortStrategy);
    infosBTC.sort(sortStrategy);

    if (this.isDesc) {
      infosKRW.reverse();
      infosPRO.reverse();
      infosBTC.reverse();
    }

    this.setState({
      infosKRW,
      infosPRO,
      infosBTC
    });
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
    this.setState({ curCoinType: "KRW" });
    this.selectInfo(this.state.infosKRW);
  }
  clickPRO() {
    const buttons = document.querySelectorAll(".button__select-infos");
    buttons.forEach(button => {
      button.classList.remove("selected");
    });
    document.querySelector(".button__PRO").classList.add("selected");
    this.setState({ curCoinType: "PRO" });
    this.selectInfo(this.state.infosPRO);
  }
  clickBTC() {
    const buttons = document.querySelectorAll(".button__select-infos");
    buttons.forEach(button => {
      button.classList.remove("selected");
    });
    document.querySelector(".button__BTC").classList.add("selected");
    this.setState({ curCoinType: "BTC" });
    this.selectInfo(this.state.infosBTC);
  }
  handleChange = e => {
    this.setState({ searchKey: e.target.value });
  };
  async updateCoinData() {
    this.setState(await this.getCoinInfos());
    this.setState(this.classifyCoinInfosById(this.state.infos));
    switch (this.state.curCoinType) {
      case "KRW":
        this.selectInfo(this.state.infosKRW);
        break;
      case "PRO":
        this.selectInfo(this.state.infosPRO);
        break;
      case "BTC":
        this.selectInfo(this.state.infosBTC);
        break;
      default:
        break;
    }

    this.sortInfos(this.prevSortStrategy);
  }
  async componentDidMount() {
    this.setState(await this.getCoinNames());
    this.setState(await this.getCoinInfos());
    this.setState(this.classifyCoinInfosById(this.state.infos));
    this.sortInfos(this.sortByTradingValue);
    this.clickKRW();
    setInterval(() => {
      this.updateCoinData();
    }, 10000);
  }
  render() {
    const {
      selectedInfo,
      isInfosLoading,
      isNamesLoading,
      searchKey
    } = this.state;

    return (
      <div className="container">
        {isInfosLoading || isNamesLoading ? (
          <div className="loader">
            <span className="loader__text">Loading...</span>
          </div>
        ) : (
          <div className="coins">
            <div className="coins__header">
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
              <input
                value={this.state.searchKey}
                onChange={this.handleChange}
                placeholder="이름/심볼 검색"
              ></input>
            </div>

            <table className="coins__table">
              <thead className="coins__thead">
                <tr>
                  <th className="th__interest"></th>
                  <th className="th__name">
                    <button
                      onClick={() => {
                        this.isDesc = !this.isDesc;
                        this.sortInfos(this.sortByName);
                      }}
                    >
                      이름
                    </button>
                  </th>
                  <th className="th__cur">
                    <button
                      onClick={() => {
                        this.isDesc = !this.isDesc;
                        this.sortInfos(this.sortByClose);
                      }}
                    >
                      현재가
                    </button>
                  </th>
                  <th className="th__contrast">
                    <button
                      onClick={() => {
                        this.isDesc = !this.isDesc;
                        this.sortInfos(this.sortByContrast);
                      }}
                    >
                      변동
                    </button>
                  </th>
                  <th className="th__high">
                    <button
                      onClick={() => {
                        this.isDesc = !this.isDesc;
                        this.sortInfos(this.sortByHigh);
                      }}
                    >
                      최고가
                    </button>
                  </th>
                  <th className="th__low">
                    <button
                      onClick={() => {
                        this.isDesc = !this.isDesc;
                        this.sortInfos(this.sortByLow);
                      }}
                    >
                      최저가
                    </button>
                  </th>
                  <th className="th__trading-value">
                    <button
                      onClick={() => {
                        this.isDesc = !this.isDesc;
                        this.sortInfos(this.sortByTradingValue);
                      }}
                    >
                      거래대금
                    </button>
                  </th>
                </tr>
              </thead>
              <tbody>
                {selectedInfo
                  .filter(info => {
                    return (
                      info.name.includes(searchKey) ||
                      info.id.includes(searchKey.toUpperCase())
                    );
                  })
                  .map(info => (
                    <Coin
                      key={info.id}
                      name={info.name}
                      id={info.id}
                      close={this.numberWithCommas(info.close)}
                      BTC_KRW={this.numberWithCommas(info.BTC_KRW)}
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
