import TrackActions from "../TrackActions";
import TrackActionTypes from "../../data/TrackActionTypes";
import Transaction from "../../data/Transaction";
import Category from "../../data/Category";
import AuthService from "../../services/auth.service";

import configureMockStore from "redux-mock-store";
import thunk from "redux-thunk";
import nock from "nock";

const middlewares = [thunk];
const mockStore = configureMockStore(middlewares);

describe("Transaction actions", () => {
  beforeEach(() => {
    AuthService.dummyLogin();
  });
  afterEach(() => {
    nock.cleanAll();
    localStorage.clear();
  });

  it("should create select transactions summary actions", () => {
    nock("http://localhost:8000")
      .get(/\/api\/transactions\/summary\/(\?.+)?/)
      .reply(200, [
        { category: 4, category_name: "c1", total: -34.2 },
        { category: 2, category_name: "c4", total: 34.2 },
      ]);

    const expectedActions = [
      {
        type: TrackActionTypes.TRANSACTION_SUMMARY_LOADED,
        summary: [
          { category: 4, category_name: "c1", total: -34.2 },
          { category: 2, category_name: "c4", total: 34.2 },
        ],
        filters: {
          category: 1,
          account: null,
          from_date: "2011-02-03",
        },
      },
    ];
    const store = mockStore();

    return store
      .dispatch(
        TrackActions.loadTransactionSummary({
          category: 1,
          account: null,
          from_date: "2011-02-03",
        })
      )
      .then(() => {
        // Return of async actions
        expect(store.getActions()).toEqualImmutable(expectedActions);
      });
  });

  it("should create transaction summary load error action", () => {
    nock("http://localhost:8000")
      .get("/api/transactions/summary/")
      .reply(404, { error: "not found" });

    const expectedActions = [
      {
        type: TrackActionTypes.TRANSACTION_SUMMARY_LOAD_ERROR,
        error: new Error(["Error: not found"]),
      },
    ];

    const store = mockStore();

    return store.dispatch(TrackActions.loadTransactionSummary({})).then(() => {
      // Return of async actions
      expect(store.getActions()).toEqual(expectedActions);
    });
  });
});
