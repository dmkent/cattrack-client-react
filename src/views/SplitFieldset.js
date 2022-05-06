import React from "react";
import { FormGroup, FormControl, Button, ControlLabel } from "react-bootstrap";

function SplitFieldset(props) {
  let vstate = null;
  if (props.is_valid.valid === true) {
    vstate = "success";
  } else if (props.is_valid.valid === false) {
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
        <FormGroup controlId="category" validationState={vstate}>
          <ControlLabel>Category</ControlLabel>
          <FormControl
            componentClass="select"
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
          </FormControl>
          {/*display error message if category is not valid
          <small [class.hidden]="catForm.controls.splits.controls[i].controls.category.valid"
                class="col-sm-10 col-sm-offset-2 help-block">
              Category is required
          </small>*/}
        </FormGroup>
        {/*amount*/}
        <FormGroup controlId="amount" validationState={vstate}>
          <ControlLabel>Amount</ControlLabel>
          <FormControl
            type="number"
            onChange={props.setSplitAmount}
            value={props.split.amount}
            data-testid={"splitamount-" + props.splitIdx}
          />
          {/*<!--display error message if street is not valid-->
          <small [class.hidden]="catForm.controls.splits.controls[i].controls.amount.valid"
                class="col-sm-10 col-sm-offset-2 help-block">
              Amount is required
          </small>*/}
        </FormGroup>
      </div>
    </fieldset>
  );
}

export default SplitFieldset;
