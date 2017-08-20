import React from 'react';

class Dashboard extends React.Component {
    constructor(props) {
        super(props);
        this.state = {
            is_filtered: false,
        };
    }
    render() {
        var cnt = 0;
        const period_buttons = ["P1", "P2"].map((period) => {
          cnt++;
          return (<button key={cnt} className="btn btn-default btn-xs">
            {period}
          </button>);
        });
        return (
          <div>
          <h3>Recent transactions</h3>
          <div className="btn-group-vertical" role="group">
            <button /*active={this.state.is_filtered} */
                    className="btn btn-default btn-xs">All</button>
            { period_buttons }
          </div>
          </div>
/*<table *ngIf="summaries !== null && summaries.length > 0" className="table">
  <tr>
    <th>Category</th>
    <th>Total from {{filterFrom | date}} to {{filterTo | date}}</th>
  </tr>
  <tr *ngFor="let summary of summaries">
    <td>{{summary.category_name}}</td>
    <td>{{summary.total | currency:AUD:true }}</td>
  </tr>
</table>
<div className="grid grid-pad">
  <div *ngFor="let trans of transactions" (click)="gotoDetail(trans)" className="col-1-4">
    <div className="module transactions">
      <h4>{{trans.description}}</h4>
    </div>
  </div>
</div>*/
        );
    }
}

export default Dashboard;