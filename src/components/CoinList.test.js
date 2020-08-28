import CoinList from "./CoinList";
const coinList = new CoinList();

// getCoinNames
test("get coin names", async () => {
  const result = await coinList.getCoinNames();
  expect(result).not.toBeFalsy();
});

// getCoinInfos
test("get coin infos", async () => {
  const result = await coinList.getCoinInfos();
  expect(result).not.toBeFalsy();
});

// classifyCoinInfos
test("classify coin info by name", () => {
  const result = coinList.classifyCoinInfosById([
    { name: "ETH-KRW" },
    { name: "BTCHG-KRW" },
    { name: "BTCBULL-KRW" },
    { name: "BTCBEAR-KRW" },
    { name: "XLM-BTC" }
  ]);

  expect(result).toStrictEqual({
    infosKRW: [{ id: "ETH/KRW", name: "" }],
    infosPRO: [
      { id: "BTCHG/KRW", name: "" },
      { id: "BTCBULL/KRW", name: "" },
      { id: "BTCBEAR/KRW", name: "" }
    ],
    infosBTC: [{ id: "XLM/BTC", name: "" }]
  });
});

// sliceNameByHyphen
test("slice coin id by Hyphen", () => {
  const result = coinList.sliceIdByHyphen("ETH-KRW");
  expect(result).toBe("ETH");
});

// findKoreanName
test("get Korean name from coin name list by coin id", async () => {
  coinList.state = {
    names: [
      {
        id: "KRW",
        name: "대한민국 원"
      },
      {
        id: "ETH",
        name: "이더리움"
      },
      {
        id: "BTC",
        name: "비트코인"
      },
      {
        id: "BCH",
        name: "비트코인 캐시"
      }
    ]
  };
  const result = coinList.findKoreanName("BCH");
  expect(result).toBe("비트코인 캐시");
});
