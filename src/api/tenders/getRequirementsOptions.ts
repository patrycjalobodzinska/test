import { useQuery2 } from "@/ui/hooks/useQuery2";
import axios from "axios";

export type RequirementsOptions = {
  // Wymagania Zamawiającego
  id: number;
  projectName: string;
  projectNumber: string;
  selectionCriteria: SelectionCriteria[];

  selectionFormula: number;
};
export type SelectionCriteria = {
  id?: string;
  criteriaId: string;
  value: string;
  weight: number | string;
  isMandatory: boolean;
  name?: string;
};
export type CriteriaList = {
  criteriaList: CriteriaOptions[];
  offerSelectionOptions: OfferSelectionOptions[];
};

export type CriteriaOptions = {
  criteriaList: {
    id: number;
    name: string;
  }[];
  offerSelectionOptions: {
    id: number;
    symbol: string;
    description: string;
  }[];
};
export type OfferSelectionOptions = {
  id: number;
  symbol: string;
  description: string;
};

export type RequirementsOptionsSensor = {
  id: string;
  name: string;
  type: string;
  deviceId: number;
  serialNumber: number;
  createdAt: string;
  createdById: string;
};

export const getRequirementsOptionsKey = "requirements_options";

export const getRequirementsOptions = () =>
  axios({
    method: "GET",
    url: `${process.env.NEXT_PUBLIC_API_URL}/api/tenders/requirements-options`,
    withCredentials: true,
  }).then(({ data }) => data);

export const useGetRequirementsOptions = () =>
  useQuery2<CriteriaOptions>({
    queryKey: [getRequirementsOptionsKey],
    queryFn: () => getRequirementsOptions(),
  });
