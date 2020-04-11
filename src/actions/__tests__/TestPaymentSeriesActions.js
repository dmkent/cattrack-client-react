import TrackActions from '../TrackActions'
import TrackActionTypes from '../../data/TrackActionTypes'
import PaymentSeries from '../../data/PaymentSeries'

import configureMockStore from 'redux-mock-store'
import thunk from 'redux-thunk'
import nock from 'nock'

const middlewares = [thunk]
const mockStore = configureMockStore(middlewares)

describe('Payment series actions', () => {
  afterEach(() => {
    nock.cleanAll()
    localStorage.clear()
  })

  it('should create load period actions', () => {
    nock('http://localhost:8000')
      .get('/api/payments/')
      .reply(200, [
        {
            "url": "http://localhost:8000/api/payments/1/",
            "id": 1,
            "name": "Electricity",
            "is_income": false,
            "bills": [
                {
                    "url": "http://localhost:8000/api/bills/14/",
                    "id": 14,
                    "description": "test",
                    "due_date": "2016-08-12",
                    "due_amount": "168.62",
                    "fixed_amount": null,
                    "var_amount": null,
                    "document": "http://localhost:8000/api/payments/Electricity_20160812.pdf",
                    "series": 1,
                    "paying_transactions": [],
                    "is_paid": false
                }
            ],
            "next_due_date": "2016-10-15T08:00:00"
        }
      ])
        
    const expectedActions = [
      { 
        type: TrackActionTypes.PAYMENT_SERIES_RECEIVED, 
        series: [
          {
              "url": "http://localhost:8000/api/payments/1/",
              "id": 1,
              "name": "Electricity",
              "is_income": false,
              "bills": [
                  {
                      "url": "http://localhost:8000/api/bills/14/",
                      "id": 14,
                      "description": "test",
                      "due_date": "2016-08-12",
                      "due_amount": "168.62",
                      "fixed_amount": null,
                      "var_amount": null,
                      "document": "http://localhost:8000/api/payments/Electricity_20160812.pdf",
                      "series": 1,
                      "paying_transactions": [],
                      "is_paid": false
                  }
              ],
              "next_due_date": "2016-10-15T08:00:00"
          }
        ]
      }
    ]
    const store = mockStore({...dummyLoggedInState()})

    return store.dispatch(TrackActions.loadPaymentSeries()).then(() => {
      // Return of async actions
      expect(store.getActions()).toEqualImmutable(expectedActions)
    })
  })

  it('should create load payment series error action', () => {
    nock('http://localhost:8000')
      .get('/api/payments/')
      .reply(404, {error: "not found"})
        
    const expectedActions = [
      { 
        type: TrackActionTypes.PAYMENT_SERIES_ERROR, 
        error: new Error(["Error: not found"])
      }
    ]

    const store = mockStore({...dummyLoggedInState()})

    return store.dispatch(TrackActions.loadPaymentSeries()).then(() => {
      // Return of async actions
      expect(store.getActions()).toEqual(expectedActions)
    })
  })

  it('should create series select actions', () => {
    expect(TrackActions.selectPaymentSeries(1)).toEqual({
      type: TrackActionTypes.PAYMENT_SERIES_SELECT,
      series: 1
    })
  })

  it('should create bill upload actions', () => {
    nock('http://localhost:8000')
      .post('/api/payments/1/loadpdf/')
      .reply(200, {success: "done"})
        
    const expectedActions = [
      {
        type: TrackActionTypes.PAYMENT_SERIES_ADD_BILL_SUCCESS,
        series: 1
      },
    ]

    const store = mockStore({...dummyLoggedInState()})
    return store.dispatch(TrackActions.paymentSeriesAddBillFromFile(1, 'dummy file object')).then(() => {
      // Return of async actions
      expect(store.getActions()).toEqual(expectedActions)
    })
  })

  it('should generate bill upload error actions', () => {
    nock('http://localhost:8000')
      .post('/api/payments/1/loadpdf/')
      .reply(403, {error: "bad format"})
        
    const expectedActions = [
      {
        type: TrackActionTypes.PAYMENT_SERIES_ADD_BILL_ERROR,
        error: new Error(["Error: bad format"]),
        series: 1
      },
    ]

    const store = mockStore({...dummyLoggedInState()})
    return store.dispatch(TrackActions.paymentSeriesAddBillFromFile(1, 'dummy file object')).then(() => {
      // Return of async actions
      expect(store.getActions()).toEqual(expectedActions)
    })
  })

})