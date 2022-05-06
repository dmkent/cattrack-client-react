import { call, put, select, takeLatest } from "redux-saga/effects";
import Api from "../client";
import authService from "../services/auth.service";

function* fetchBudgetSummary() {
  let props = yield select(getBudgetAction);
  try {
    const summary = yield call(
      Api.fetchBudgetSummary,
      props.token,
      props.from_date,
      props.to_date
    );
    yield put({ type: "BUDGET_SUMMARY_SUCCESS", summary: summary });
  } catch (err) {
    yield put({ type: "BUDGET_SUMMARY_FAILED", message: err.message });
  }
}

function getBudgetAction(state) {
  return {
    token: authService.restoreLogin().token,
    from_date: state.transactions.filters.from_date,
    to_date: state.transactions.filters.to_date,
  };
}

function* rootSaga() {
  yield takeLatest("BUDGET_SUMMARY_FETCH", fetchBudgetSummary);
  yield takeLatest("transaction/summary-loaded", fetchBudgetSummary);
}

export default rootSaga;
