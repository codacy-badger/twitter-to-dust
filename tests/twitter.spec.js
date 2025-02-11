jest.mock(
  "twitter",
  () =>
    class Twitter {
      // eslint-disable-next-line class-methods-use-this
      get() {
        return Promise.resolve([
          { id_str: "abc", created_at: new Date() },
          { id_str: "abc", created_at: new Date("2019-02-02") }
        ]);
      }

      // eslint-disable-next-line class-methods-use-this
      post() {
        return Promise.resolve();
      }
    }
);

const utils = require("../src/utils");
const twitter = require("../src/twitter");

describe("Twitter", () => {
  test("Exports a 'deleteOldTweets' method", () => {
    expect(
      Object.prototype.hasOwnProperty.call(twitter, "deleteOldTweets")
    ).toBeTruthy();
    expect(typeof twitter.deleteOldTweets).toBe("function");
  });

  test("Gets user timeline and request Twitter API to delete for each one which is older than DAYS_TO_DUST", async () => {
    const spy = jest.spyOn(utils, "log");

    await twitter.deleteOldTweets();

    expect(spy).toHaveBeenCalledTimes(3);
    expect(spy).toHaveBeenNthCalledWith(
      1,
      `retrieved 2 tweets from user timeline`
    );
    expect(spy).toHaveBeenNthCalledWith(2, `1 tweets to delete`);
    expect(spy).toHaveBeenNthCalledWith(3, `end`);
  });
});
