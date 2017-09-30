import {connect} from 'react-redux';
import TrackActions from '../actions/TrackActions'
import AccountDetail from '../views/AccountDetail'

export function mapStateToProps(state) {
  return {
    accounts: state.accounts,
  }
}

export function mapDispatchToProps(dispatch) {
  return {
    uploadToAccount: (account, upload_file) => {
      dispatch(TrackActions.uploadToAccount(account, upload_file))
    },
    loadAccountBalanceSeries: (account) => {
      dispatch(TrackActions.loadAccountBalanceSeries(account))
    }
  }
}

const AccountDetailContainer = connect(
  mapStateToProps,
  mapDispatchToProps
)(AccountDetail)

export default AccountDetailContainer