import { connect } from "react-redux";
import PlotlyTimeSeries from "../components/PlotlyTimeSeries";

export function mapStateToProps(state) {
  return {
    series: state.accounts.current_balance_series,
    plot_type: "line",
  };
}

const AccountBalanceContainer = connect(mapStateToProps, {})(PlotlyTimeSeries);

export default AccountBalanceContainer;
