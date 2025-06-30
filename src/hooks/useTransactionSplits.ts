import { useState } from "react";

import { Split, Transaction } from "../data/Transaction";

interface SplitsState {
  splits: Split[];
  is_valid: {
    valid: boolean | null;
    message?: string;
  };
}

interface Suggestion {
  id: string;
  name?: string;
}

function initialSplits(
  transaction: Transaction,
  suggestions?: Suggestion[],
): SplitsState {
  let category = transaction.category;
  if (category === null) {
    if (suggestions && suggestions.length > 0) {
      category = suggestions[0].id;
    } else {
      category = "";
    }
  }

  const splits: Split[] = [
    {
      category: String(category),
      amount: transaction.amount,
    },
  ];

  return {
    splits,
    is_valid: {
      valid: true,
    },
  };
}

function splitsAreValid(transaction: Transaction, splits: Split[]) {
  let total = 0;
  const cats: string[] = [];
  let ncats = 0;
  splits.forEach(function (split) {
    // Ignore empty splits
    if (split.amount == "") {
      return;
    }

    // Add amounts to total
    total += parseFloat(String(split.amount));

    // Get category to check is unique
    if (!cats.includes(String(split.category))) {
      cats.push(String(split.category));
    }

    ncats += 1;
  });

  const delta = Math.abs(total - parseFloat(String(transaction.amount)));
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

export function useTransactionSplits(
  transaction: Transaction,
  suggestions?: Suggestion[],
) {
  const [hasReceivedSuggestions, setHasReceivedSuggestions] = useState(false);
  const [currentTransactionId, setCurrentTransactionId] = useState(
    transaction.id,
  );
  const [splits, setSplits] = useState<SplitsState>(
    initialSplits(transaction, suggestions),
  );

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

  function pushSplit(categoryId: string | number) {
    setSplits((prevSplits) => ({
      splits: [
        ...prevSplits.splits,
        { category: String(categoryId), amount: "0" },
      ],
      is_valid: {
        valid: null,
      },
    }));
  }

  function setSplitValue(
    name: keyof Split,
    idx: number,
    value: string | number,
  ) {
    const newSplits = splits.splits.map((split, index) =>
      index === idx ? { ...split, [name]: value } : split,
    );
    const new_state: SplitsState = {
      splits: newSplits,
      is_valid: splitsAreValid(transaction, newSplits),
    };
    setSplits(new_state);
  }

  function removeSplit(idx: number) {
    const newSplits = splits.splits.filter((_, index) => index !== idx);
    const new_state: SplitsState = {
      splits: newSplits,
      is_valid: splitsAreValid(transaction, newSplits),
    };
    setSplits(new_state);
  }

  function setSuggestions(suggestions: Suggestion[]) {
    setSplits(initialSplits(transaction, suggestions));
  }

  return [
    splits,
    setSuggestions,
    pushSplit,
    setSplitValue,
    removeSplit,
  ] as const;
}
