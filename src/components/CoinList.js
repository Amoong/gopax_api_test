import React from "react";
import Coin from "./Coin";

const proxyurl = "https://cors-anywhere.herokuapp.com/";
const baseurl = "https://api.gopax.co.kr";

class CoinList extends React.Component {
  state = {
    isNamesLoading: true,
    isInfosLoading: true,
    names: [],
    infos: [],
    infosKRW: [],
    infosPRO: [],
    infosBTC: []
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
    return x.toString().replace(/\B(?=(\d{3})+(?!\d))/g, ",");
  }
  wrapCoinInfo(info) {
    const id = info.name;
    info.name = this.findKoreanName(this.sliceIdByHyphen(id));
    info.id = id.replace("-", "/");
    info.contrast = parseInt(info.close - info.open);
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
      return parseInt(tradingValue / million).toString() + "백만";
    } else if (tradingValue > tenThousand) {
      return parseInt(tradingValue / tenThousand).toString() + "만";
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
  async componentDidMount() {
    this.setState(await this.getCoinNames());
    this.setState(await this.getCoinInfos());
    this.setState(this.classifyCoinInfosById(this.state.infos));
    this.sortByTradingValue(-1);
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
                  <th className="th__trading-value">거래대금(추정)</th>
                </tr>
              </thead>
              <tbody>
                {infosKRW.map(info => (
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
