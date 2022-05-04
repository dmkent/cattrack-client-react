import Immutable from "immutable";
import reducer from "../bills";
import TrackActionTypes from "../../data/TrackActionTypes";
import PaymentSeries, { Bill } from "../../data/PaymentSeries";

describe("bills reducer", () => {
  it("should return the initial state", () => {
    expect(reducer(undefined, {})).toEqualImmutable({
      payment_series: Immutable.Map(),
      current_series: 0,
    });
  });

  it("should handle PAYMENT_SERIES_RECEIVED", () => {
    const initState = { payment_series: Immutable.Map() };

    const expectedState = {
      payment_series: Immutable.Map([
        [
          0,
          PaymentSeries({
            id: 0,
            name: "Elec",
            is_income: false,
            bills: Immutable.List([
              Bill({
                id: 4,
                due_date: "2013-01-02",
                due_amount: 342.4,
                is_paid: false,
              }),
              Bill({
                id: 5,
                due_date: "2013-03-02",
                due_amount: 342.5,
                is_paid: false,
              }),
            ]),
          }),
        ],
        [
          1,
          PaymentSeries({
            id: 1,
            name: "Salary",
            is_income: true,
            bills: Immutable.List(),
          }),
        ],
      ]),
    };

    expect(
      reducer(initState, {
        type: TrackActionTypes.PAYMENT_SERIES_RECEIVED,
        series: [
          {
            id: 0,
            name: "Elec",
            is_income: false,
            bills: [
              {
                id: 4,
                due_date: "2013-01-02",
                due_amount: 342.4,
              },
              {
                id: 5,
                due_date: "2013-03-02",
                due_amount: 342.5,
              },
            ],
          },
          { id: 1, name: "Salary", is_income: true, bills: [] },
        ],
      })
    ).toEqual(expectedState);
  });

  it("should set current selected via PAYMENT_SERIES_RECEIVED", () => {
    const series = Immutable.Map([
      [
        0,
        PaymentSeries({
          id: 0,
          name: "Elec",
          is_income: false,
          bills: Immutable.List([]),
        }),
      ],
      [
        1,
        PaymentSeries({
          id: 1,
          name: "Salary",
          is_income: true,
          bills: Immutable.List(),
        }),
      ],
    ]);
    const initState = { payment_series: series, current_series: 0 };
    const expectedState = {
      payment_series: series,
      current_series: 1,
    };
    expect(
      reducer(initState, {
        type: TrackActionTypes.PAYMENT_SERIES_SELECT,
        series: 1,
      })
    ).toEqual(expectedState);
  });
});
