import { useQuery } from "react-query";
import { checkStatusAxios } from "../client/CatTrackAPI";

import Account from "../data/Account";
import { useAxios } from "./AxiosContext";

export default function useAccounts() {
  const axios = useAxios();
  const fetchAccounts = () =>
    axios.get("/api/accounts/")
      .then(checkStatusAxios)
      .then((rawAccounts) => {
        return rawAccounts.map((rawAccount) => {
          return new Account(rawAccount);
        });
      });

  return useQuery("accounts", fetchAccounts);
}
