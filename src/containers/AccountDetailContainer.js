import { connect } from 'react-redux';
import TrackActions from '../actions/TrackActions'
import AccountDetail from '../views/AccountDetail'

const mapStateToProps = state => {
  return {
    accounts: state.accounts,
  }
}

const mapDispatchToProps = dispatch => {
  return {
    uploadToAccount: (account, upload_file) => {
      dispatch(TrackActions.uploadToAccount(account, upload_file))
    }
  }
}

const AccountDetailContainer = connect(
  mapStateToProps,
  mapDispatchToProps
)(AccountDetail)

export default AccountDetailContainer