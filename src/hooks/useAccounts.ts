import { useQuery } from "react-query";
import { checkStatusAxios } from "../client/CatTrackAPI";
import { useAxios } from "./AxiosContext"

import { Account } from "../data/Account";

export default function useAccounts() {
  const axios = useAxios();
  const fetchAccounts = () =>
    axios.get("/api/accounts/")
      .then(checkStatusAxios)
      .then((rawAccounts: any[]) => {
        return rawAccounts.map((rawAccount) => {
          return {
            id: rawAccount.id,
            name: rawAccount.name,
            balance: rawAccount.balance
          } as Account;
        });
      });

  return useQuery("accounts", fetchAccounts);
}
