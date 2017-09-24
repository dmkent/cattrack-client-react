import Immutable from 'immutable'
import {mapStateToProps} from '../../containers/CategoryPlotContainer'

describe('CategoryPlotContainer', () => {
  it('only have correct state in props', () => {
    const initState = {
      app: {
        title: "test"
      },
      auth: {
        is_logged_in: true
      },
      transactions: {
        transactions: new Immutable.OrderedMap(),
        summary: [2],
        filters: {
          category: null
        }
      },
      categories: {
        is_valid: {
          valid: null,
          message: ""
        },
        show_categorisor: false,
        categories: new Immutable.List(),
      },
      accounts: {
        accounts: [1],
        upload_in_progress: false
      },
      category: {
        series: new Immutable.List(['b'])
      }
    }
    expect(mapStateToProps(initState)).toEqual({
      series: new Immutable.List(['b'])
    })
  })
})