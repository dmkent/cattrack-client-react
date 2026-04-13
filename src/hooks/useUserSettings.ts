import { useQuery, useQueryClient } from "@tanstack/react-query";

import { checkStatusAxios } from "../client/CatTrackAPI";
import { UserSettings } from "../data/UserSettings";
import { useAxios } from "./AxiosContext";

export function useUserSettings() {
  const axios = useAxios();
  const queryClient = useQueryClient();

  const query = useQuery<UserSettings>({
    queryKey: ["userSettings"],
    queryFn: () =>
      axios.get("/api/user-settings/me/").then(checkStatusAxios),
  });

  const updateDefaultModel = async (
    categorisorId: number | null,
  ): Promise<UserSettings> => {
    const response = await axios.patch("/api/user-settings/me/", {
      selected_categorisor: categorisorId,
    });
    const result: UserSettings = checkStatusAxios(response);
    await queryClient.invalidateQueries({ queryKey: ["userSettings"] });
    return result;
  };

  return { ...query, updateDefaultModel };
}
