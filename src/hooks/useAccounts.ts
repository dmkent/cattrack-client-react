import { useQuery } from "@tanstack/react-query";

import { checkStatusAxios } from "../client/CatTrackAPI";
import { Account } from "../data/Account";
import { useAxios } from "./AxiosContext";

export function useAccounts() {
  const axios = useAxios();
  const fetchAccounts = () =>
    axios
      .get("/api/accounts/")
      .then(checkStatusAxios)
      // eslint-disable-next-line @typescript-eslint/no-explicit-any
      .then((rawAccounts: any[]) => {
        return rawAccounts.map((rawAccount) => {
          return {
            id: rawAccount.id,
            name: rawAccount.name,
            balance: rawAccount.balance,
            last_transaction: rawAccount.last_transaction
              ? new Date(rawAccount.last_transaction)
              : null,
          } as Account;
        });
      });

  return useQuery({
    queryKey: ["accounts"],
    queryFn: fetchAccounts,
  });
}
