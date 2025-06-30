import React from "react";
import { FormGroup, FormControl, FormLabel, FormSelect } from "react-bootstrap";

import { Split } from "../data/Transaction";

interface Category {
  id: string | number;
  name: string;
}

interface ValidationState {
  valid: boolean | null;
  message?: string;
}

export interface SplitFieldsetProps {
  index: number;
  splitIdx: number;
  multiple_splits_exist: boolean;
  removeSplitCat: (splitIdx: number) => void;
  setSplitCategory: (e: React.ChangeEvent<HTMLSelectElement>) => void;
  setSplitAmount: (e: React.ChangeEvent<HTMLInputElement>) => void;
  split: Split;
  categories: Category[];
  is_valid: ValidationState;
}

function SplitFieldset(props: SplitFieldsetProps) {
  let vstate: "success" | "error" | null = null;
  if (props.is_valid.valid === true) {
    vstate = "success";
  } else if (props.is_valid.valid === false) {
    // eslint-disable-next-line @typescript-eslint/no-unused-vars
    vstate = "error";
  }
  return (
    <fieldset>
      <legend>
        <span>Category {props.index}</span>
        {props.multiple_splits_exist ? (
          <span
            onClick={() => props.removeSplitCat(props.splitIdx)}
            className="small"
          >
            {" "}
            remove
          </span>
        ) : null}
      </legend>
      <div>
        {/*category*/}
        <FormGroup controlId="category">
          <FormLabel>Category</FormLabel>
          <FormSelect
            value={props.split.category}
            onChange={props.setSplitCategory}
          >
            {[...props.categories].map((cat) => {
              return (
                <option key={cat.id} value={cat.id}>
                  {cat.name}
                </option>
              );
            })}
          </FormSelect>
          {/*display error message if category is not valid
          <small [class.hidden]="catForm.controls.splits.controls[i].controls.category.valid"
                class="offset-sm-2 col-sm-10 text-danger">
              Category is required
          </small>*/}
        </FormGroup>
        {/*amount*/}
        <FormGroup controlId="amount">
          <FormLabel>Amount</FormLabel>
          <FormControl
            type="number"
            onChange={props.setSplitAmount}
            value={props.split.amount}
            data-testid={"splitamount-" + props.splitIdx}
          />
          {/*<!--display error message if street is not valid-->
          <small [class.hidden]="catForm.controls.splits.controls[i].controls.amount.valid"
                class="offset-sm-2 col-sm-10 text-danger">
              Amount is required
          </small>*/}
        </FormGroup>
      </div>
    </fieldset>
  );
}

export default SplitFieldset;
