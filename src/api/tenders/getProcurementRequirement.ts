import { useQuery2 } from "@/ui/hooks/useQuery2";
import { usePaginatedQuery } from "@/ui/hooks/useQuery2/usePaginatedQuery";
import axios from "axios";

export type ProcurementRequirement = {
  id: string;
  projectName: string;
  projectNumber: string;
  selectionCriteria: {
    id: number;
    criteriaId: number;
    value: number;
    weight: number;
    isMandatory: boolean;
  }[];

  selectionFormula: number;
};

export type CriteriaList = {
  criteriaList: CriteriaOptions[];
  offerSelectionOptions: OfferSelectionOptions[];
};

export type CriteriaOptions = {
  id: number;
  name: string;
};
export type OfferSelectionOptions = {
  id: number;
  symbol: string;
  description: string;
};

export type ProcurementRequirementSensor = {
  id: string;
  name: string;
  type: string;
  deviceId: number;
  serialNumber: number;
  createdAt: string;
  createdById: string;
};

export const getProcurementRequirementKey = "procurement_Requirement";

export const getProcurementRequirement = (id: string) =>
  axios({
    method: "GET",
    url: `${process.env.NEXT_PUBLIC_API_URL}/api/tenders/procurement-requirements`,
    withCredentials: true,
  }).then(({ data }) =>
    data?.find((item: ProcurementRequirement) => item?.id === id)
  );

export const useGetProcurementRequirement = (id: string) =>
  useQuery2<ProcurementRequirement>({
    queryKey: [getProcurementRequirementKey, id],
    queryFn: () => getProcurementRequirement(id),
  });
