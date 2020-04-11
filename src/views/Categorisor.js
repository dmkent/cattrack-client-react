import React from 'react';
import {Alert, Modal, Form, Button, Badge} from 'react-bootstrap';
import SplitFieldset from './SplitFieldset';

class Categorisor extends React.Component {
  constructor(props) {
    super(props);
    this.state = {
      something: "?"
    }
  }

  componentDidMount() {
    this.props.loadCategories();
  }

  render() {
    if (this.props.transaction === undefined || this.props.transaction === null) {
            return null;
    }

    let suggestions = null;
    if (this.props.suggestions.size > 1) {
      suggestions = (
        <div>
          Multiple categories were suggested:
          <ul>
            {[...this.props.suggestions].map((suggestion) => {
              return (
                <li key={suggestion.name}>
                  {suggestion.name} <Badge>{suggestion.score}%</Badge>
                </li>
              );
            })}
          </ul>
        </div>
      );
    }

    return (
      <div className="static-modal">
        <Modal show={this.props.show_categorisor} onHide={this.props.hideCategorisor}>
          {/*            <category-create #newcat (onSave)="getCategories()"></category-create>*/}
          <Modal.Header>
            <Modal.Title>Categorise transaction</Modal.Title>
          </Modal.Header>

          <Modal.Body>
            <h4>{this.props.transaction.description}</h4>
            <dl className="dl-horizontal">
              <dt>Date</dt>
              <dd>{this.props.transaction.when}</dd>
              <dt>Account</dt>
              <dd>{this.props.transaction.account}</dd>
              <dt>Current category:</dt>
              <dd>{this.props.transaction.category_name}</dd>
              <dt>Total amount</dt>
              <dd>{this.props.transaction.amount}</dd>
            </dl>

            {suggestions}
            
            <div>
              <Button onClick={this.showNewCat}>
                New category
              </Button>
            </div>
            <Form onSubmit={this.save}>
              <div>
                {[...this.props.splits].map((split, idx) => {
                  return <SplitFieldset key={idx} split={split} splitIdx={idx}
                                        categories={this.props.categories}
                                        multiple_splits_exist={(this.props.splits.size > 1)}
                                        removeSplitCat={this.props.removePotentialSplit}
                                        setSplitCategory={(event) => this.props.setSplit('category', idx, event)}
                                        setSplitAmount={(event) => this.props.setSplit('amount', idx, event)}
                                        is_valid={this.props.is_valid}/>
                })}
                
                <Button onClick={this.props.addPotentialSplit}>Add split</Button>
                { this.props.is_valid.message ? 
                (<Alert bsStyle="danger">{this.props.is_valid.message}</Alert>) : null
                }
              </div>
            </Form>
          </Modal.Body>

          <Modal.Footer>
            <Button onClick={this.props.hideCategorisor}>Close</Button>
            <Button bsStyle="primary" 
                    onClick={() => {
                      this.props.saveCategorisor(this.props.transaction, this.props.splits, this.props.reloadPage);
                    }} 
                    disabled={this.props.is_valid.valid !== true}>
              Save changes
            </Button>
          </Modal.Footer>
        </Modal>
      </div>
    );
  }
}

export default Categorisor;