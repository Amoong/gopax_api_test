import CoinList from "./CoinList";

const coinList = new CoinList();

test("get coin names", async () => {
  const result = await coinList.getCoinNames();
  expect(result).toBeTruthy();
});

test("get coin infos", async () => {
  const result = await coinList.getCoinInfos();
  expect(result).not.toBeFalsy();
});

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

test("slice coin name by Hyphen", () => {
  const result = coinList.sliceNameByHyphen("ETH-KRW");
  expect(result).toBe("ETH");
});
