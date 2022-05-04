import Immutable from "immutable";
import { mapStateToProps } from "../../containers/CategoryPlotContainer";

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
      },
      category: {
        series: Immutable.List(["b"]),
      },
    };
    expect(mapStateToProps(initState)).toEqual({
      series: Immutable.List(["b"]),
      plot_invert: true,
      plot_type: "bar",
    });
  });
});
