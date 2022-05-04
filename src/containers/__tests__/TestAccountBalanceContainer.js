import Immutable from "immutable";
import { mapStateToProps } from "../../containers/AccountBalanceContainer";

describe("CategoryPlotContainer", () => {
  it("only have correct state in props", () => {
    const initState = {
      app: {
        title: "test",
      },
      auth: {
        is_logged_in: true,
      },
      transactions: {
        transactions: Immutable.OrderedMap(),
        summary: [2],
        filters: {
          category: null,
        },
      },
      categories: {
        is_valid: {
          valid: null,
          message: "",
        },
        show_categorisor: false,
        categories: Immutable.List(),
      },
      accounts: {
        accounts: [1],
        upload_in_progress: false,
        current_balance_series: Immutable.List(["c"]),
      },
      category: {
        series: Immutable.List(["b"]),
      },
    };
    expect(mapStateToProps(initState)).toEqual({
      series: Immutable.List(["c"]),
      plot_type: "line",
    });
  });
});
