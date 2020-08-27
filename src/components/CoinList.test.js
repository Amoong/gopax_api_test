import CoinList from "./CoinList";

const coinList = new CoinList();

// getCoinNames
test("get coin names", async () => {
  const result = await coinList.getCoinNames();
  expect(result).toBeTruthy();
});

// getCoinInfos
test("get coin infos", async () => {
  const result = await coinList.getCoinInfos();
  expect(result).not.toBeFalsy();
});

// classifyCoinInfos
test("classify coin info by name", () => {
  const result = coinList.classifyCoinInfos([
    { name: "ETH-KRW" },
    { name: "BTCHG-KRW" },
    { name: "BTCBULL-KRW" },
    { name: "BTCBEAR-KRW" },
    { name: "XLM-BTC" }
  ]);
  expect(result).toStrictEqual({
    lengthKRW: 1,
    lengthPRO: 3,
    lengthBTC: 1
  });
});

// sliceNameByHyphen
test("slice coin id by Hyphen", () => {
  const result = coinList.sliceIdByHyphen("ETH-KRW");
  expect(result).toBe("ETH");
});

// findKoreanName
test("get Korean name from coin name list by coin id", async () => {
  await coinList.getCoinNames();
  const result = coinList.findKoreanName("BCH");
  expect(result).toBe("비트코인 캐시");
});
