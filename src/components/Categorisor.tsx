import React from "react";
import { Alert, Modal, Form, Button, Badge } from "react-bootstrap";
import useTransactionSplits from "../hooks/useTransactionSplits";
import SplitFieldset from "./SplitFieldset";
import useCategories from "../hooks/useCategories";
import useTransactionSuggestions from "../hooks/useTransactionSuggestions";
import { Transaction } from "../data/Transaction";
import { Category } from "src/data/Category";

export interface CategorisorProps {
  transaction: Transaction;
  showModal: boolean;
  setModalShown: (shown: boolean) => void;
  save: (transaction: Transaction, splits: any) => Promise<any>;
}

interface CategorisorSuggestionProps {
  suggestion: Category;
  percentage: number;
}

function Categorisor(props: CategorisorProps): JSX.Element | null {
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
  if (suggestions && suggestions.length > 1) {
    suggestionsList = (
      <div>
        Multiple categories were suggested:
        <ul>
          {[...suggestions].map((suggestion) => {
            return (
              <CategorisorSuggestion
                key={suggestion.name}
                suggestion={suggestion}
                percentage={suggestion.score}
              />
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
            <dd>
              {transaction.when instanceof Date
                ? transaction.when.toLocaleDateString()
                : transaction.when}
            </dd>
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
              {splits &&
                splits.splits &&
                [...splits.splits].map((split, idx) => {
                  return (
                    <SplitFieldset
                      key={idx}
                      index={idx + 1}
                      split={{
                        category: split.category,
                        amount: String(split.amount),
                      }}
                      splitIdx={idx}
                      categories={categories || []}
                      multiple_splits_exist={splits.splits.length > 1}
                      removeSplitCat={removeSplit}
                      setSplitCategory={(event: any) => {
                        const target = event.target;
                        const value = target.value;
                        setSplitValue("category", idx, value);
                      }}
                      setSplitAmount={(event: any) => {
                        const target = event.target;
                        const value = target.value;
                        setSplitValue("amount", idx, value);
                      }}
                      is_valid={splits.is_valid}
                    />
                  );
                })}

              <Button
                onClick={() => pushSplit("")}
                variant="outline-secondary"
                size="sm"
              >
                Add split
              </Button>
              {splits && splits.is_valid && splits.is_valid.message ? (
                <Alert variant="danger">{splits.is_valid.message}</Alert>
              ) : null}
            </div>
          </Form>
        </Modal.Body>

        <Modal.Footer>
          <Button
            variant="outline-secondary"
            size="sm"
            onClick={() => setModalShown(false)}
          >
            Close
          </Button>
          <Button
            variant="dark"
            size="sm"
            onClick={() => {
              save(transaction, splits.splits).then(() => setModalShown(false));
            }}
            disabled={
              splits && splits.is_valid ? splits.is_valid.valid !== true : true
            }
          >
            Save changes
          </Button>
        </Modal.Footer>
      </Modal>
    </div>
  );
}

const CategorisorSuggestion = ({
  suggestion,
  percentage,
}: CategorisorSuggestionProps): JSX.Element => (
  <li key={suggestion.name}>
    {suggestion.name} <span className="badge">{percentage}%</span>
  </li>
);

export default Categorisor;
