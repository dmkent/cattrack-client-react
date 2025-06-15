import { useQuery } from "react-query";
import { useAuth } from "./AuthContext";
import { fetch_from_api, checkStatus } from "../client/CatTrackAPI";

import Account from "../data/Account";

export default function useAccounts() {
  const auth = useAuth();
  const fetchAccounts = () =>
    fetch_from_api("/api/accounts/", {}, auth.user?.token)
      .then(checkStatus)
      .then((rawAccounts) => {
        return rawAccounts.map((rawAccount) => {
          return new Account(rawAccount);
        });
      });

  return useQuery("accounts", fetchAccounts);
}
