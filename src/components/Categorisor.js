import React from "react";
import { Alert, Modal, Form, Button, Badge } from "react-bootstrap";
import useTransactionSplits from "../hooks/useTransactionSplits";
import SplitFieldset from "./SplitFieldset";
import useCategories from "../hooks/useCategories";
import useTransactionSuggestions from "../hooks/useTransactionSuggestions";

function Categorisor(props) {
  const { transaction, showModal, setModalShown, save } = props;
  const { isLoading: isCategoriesLoading, data: categories } = useCategories();

  const {
    isLoading: isSuggestionsLoading,
    isError: isSuggestError,
    data: suggestions,
  } = useTransactionSuggestions(transaction);

  const [splits, setSuggestions, pushSplit, setSplitValue, removeSplit] =
    useTransactionSplits(transaction, suggestions);

  if (isSuggestionsLoading || isCategoriesLoading) {
    return null;
  }

  let suggestionsList = null;
  if (suggestions.length > 1) {
    suggestionsList = (
      <div>
        Multiple categories were suggested:
        <ul>
          {[...suggestions].map((suggestion) => {
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
      <Modal show={showModal} onHide={() => setModalShown(false)}>
        {/*            <category-create #newcat (onSave)="getCategories()"></category-create>*/}
        <Modal.Header>
          <Modal.Title>Categorise transaction</Modal.Title>
        </Modal.Header>

        <Modal.Body>
          <h4>{transaction.description}</h4>
          <dl className="dl-horizontal">
            <dt>Date</dt>
            <dd>{transaction.when}</dd>
            <dt>Account</dt>
            <dd>{transaction.account}</dd>
            <dt>Current category:</dt>
            <dd>{transaction.category_name}</dd>
            <dt>Total amount</dt>
            <dd>{transaction.amount}</dd>
          </dl>

          {suggestionsList}

          <Form>
            <div>
              {[...splits.splits].map((split, idx) => {
                return (
                  <SplitFieldset
                    key={idx}
                    split={split}
                    splitIdx={idx}
                    categories={categories}
                    multiple_splits_exist={splits.splits.size > 1}
                    removeSplitCat={removeSplit}
                    setSplitCategory={(event) => {
                      const target = event.target;
                      const value = target.value;
                      setSplitValue("category", idx, value);
                    }}
                    setSplitAmount={(event) => {
                      const target = event.target;
                      const value = target.value;
                      setSplitValue("amount", idx, value);
                    }}
                    is_valid={splits.is_valid}
                  />
                );
              })}

              <Button onClick={pushSplit}>Add split</Button>
              {splits.is_valid.message ? (
                <Alert bsStyle="danger">{splits.is_valid.message}</Alert>
              ) : null}
            </div>
          </Form>
        </Modal.Body>

        <Modal.Footer>
          <Button onClick={() => setModalShown(false)}>Close</Button>
          <Button
            bsStyle="primary"
            onClick={() => {
              save(transaction, splits.splits).then(setModalShown(false));
            }}
            disabled={splits.is_valid.valid !== true}
          >
            Save changes
          </Button>
        </Modal.Footer>
      </Modal>
    </div>
  );
}

export default Categorisor;
