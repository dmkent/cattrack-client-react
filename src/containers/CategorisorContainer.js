import { connect } from 'react-redux';
import TrackActions from '../actions/TrackActions'
import Categorisor from '../views/Categorisor'

const mapStateToProps = state => {
  return {...state.categories};
}

const mapDispatchToProps = dispatch => {
  return {
    hideCategorisor: () => {
      dispatch(TrackActions.categorisorHide());
    },
    saveCategorisor: (transaction, splits, onDone) => {
      dispatch(TrackActions.categorisorSave(transaction, splits, onDone));
    },
    loadCategories: () => {
      dispatch(TrackActions.loadCategories());
    },
    updateTransaction: (transaction) => {
      dispatch(TrackActions.updateTransaction(transaction));
    },
    addPotentialSplit: () => {
      dispatch(TrackActions.categorisorAddSplit());
    },
    removePotentialSplit: (idx) => {
      dispatch(TrackActions.categorisorRemoveSplit(idx));
    },
    setSplit: (name, idx, event) => {
      const target = event.target;
      const value = target.value;
      dispatch(TrackActions.categorisorSetSplit(idx, name, value))
    }
  }
}

const CategorisorContainer = connect(
  mapStateToProps,
  mapDispatchToProps
)(Categorisor)

export default CategorisorContainer;