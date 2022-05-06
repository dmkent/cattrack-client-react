import { useState } from "react";
import Immutable from "immutable";

function initialSplits(transaction, suggestions) {
  let category = transaction.category;
  if (category === null) {
    if (suggestions && suggestions.length > 0) {
      category = suggestions[0].id;
    } else {
      category = "";
    }
  }

  let splits = Immutable.List([
    {
      category: String(category),
      amount: transaction.amount,
    },
  ]);

  return {
    splits,
    is_valid: {
      valid: true,
    },
  };
}

function splitsAreValid(transaction, splits) {
  let total = 0;
  let cats = [];
  let ncats = 0;
  splits.forEach(function (split) {
    // Ignore empty splits
    if (split.amount == "") {
      return;
    }

    // Add amounts to total
    total += parseFloat(split.amount);

    // Get category to check is unique
    if (cats.indexOf(split.category) < 0) {
      cats.push(split.category);
    }

    ncats += 1;
  });

  const delta = Math.abs(total - parseFloat(transaction.amount));
  if (delta > 0.005) {
    return {
      message: "Split amount must sum to transaction amount.",
      valid: false,
    };
  }

  if (cats.length < ncats) {
    return {
      message: "All selected categories must be different.",
      valid: false,
    };
  }

  return {
    message: "",
    valid: true,
  };
}

function useTransactionSplits(transaction, suggestions) {
  const [hasReceivedSuggestions, setHasReceivedSuggestions] = useState(false);
  const [currentTransactionId, setCurrentTransactionId] = useState(
    transaction.id
  );
  const [splits, setSplits] = useState(initialSplits(transaction, suggestions));

  // We may still be waiting for suggestions when we first load. This reinitialises the
  // state if we receive the suggestions later.
  if (!hasReceivedSuggestions && suggestions) {
    setSplits(initialSplits(transaction, suggestions));
    setHasReceivedSuggestions(true);
  }

  // Check transaction has not changed
  if (transaction.id !== currentTransactionId) {
    setSplits(initialSplits(transaction, suggestions));
    setCurrentTransactionId(transaction.id);
    setHasReceivedSuggestions(!!suggestions);
  }

  function pushSplit(categoryId) {
    setSplits({
      splits: splits.splits.push({
        category: categoryId,
        amount: "0",
      }),
      is_valid: {
        valid: null,
      },
    });
  }

  function setSplitValue(name, idx, value) {
    const new_state = Object.assign({}, splits, {
      splits: splits.splits.set(
        idx,
        Object.assign({}, splits.splits.get(idx), {
          [name]: value,
        })
      ),
    });
    new_state.is_valid = splitsAreValid(transaction, new_state.splits);
    setSplits(new_state);
  }

  function removeSplit(idx) {
    const new_state = Object.assign({}, splits, {
      splits: splits.splits.delete(idx),
    });
    new_state.is_valid = splitsAreValid(transaction, new_state.splits);
    setSplits(new_state);
  }

  function setSuggestions(suggestions) {
    setSplits(initialSplits(transaction, suggestions));
  }

  return [splits, setSuggestions, pushSplit, setSplitValue, removeSplit];
}

export default useTransactionSplits;
