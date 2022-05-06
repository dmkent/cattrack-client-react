import { useQuery } from "react-query";

import { fetch_from_api, checkStatus } from "../client/CatTrackAPI";

import Account from "../data/Account";

export default function useAccounts() {
  const fetchAccounts = () =>
    fetch_from_api(null, "/api/accounts/")
      .then(checkStatus)
      .then((rawAccounts) => {
        return rawAccounts.map((rawAccount) => {
          return new Account(rawAccount);
        });
      });

  return useQuery("accounts", fetchAccounts);
}
