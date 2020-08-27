import CoinList from "./CoinList";

const coinList = new CoinList();

test("get coin names", async () => {
  const result = await coinList.getCoinNames();
  expect(result).toBeTruthy();
});

test("get coin infos", async () => {
  const result = await coinList.getCoinInfos();
  expect(result).toBeTruthy();
});
