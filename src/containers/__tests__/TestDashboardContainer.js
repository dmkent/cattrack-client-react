import Immutable from "immutable";
import TrackActions from "../../actions/TrackActions";
import {
  mapStateToProps,
  mapDispatchToProps,
} from "../../containers/DashboardContainer";

jest.mock("../../actions/TrackActions", () => ({
  default: {
    loadTransactionSummary: jest.fn(),
  },
  __esModule: true,
}));

describe("DashboardContainer", () => {
  it("only have correct state in props", () => {
    const initState = {
      app: {
        title: "test",
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
    };
    expect(mapStateToProps(initState)).toEqual({
      filters: {
        category: null,
      },
      summary: [2],
    });
  });

  it("maps dispatch to props", () => {
    const dispatch = jest.fn();
    const props = mapDispatchToProps(dispatch);
    props.loadSummary();
    expect(dispatch.mock.calls.length).toBe(1);
    expect(TrackActions.loadTransactionSummary.mock.calls.length).toBe(1);
  });
});
