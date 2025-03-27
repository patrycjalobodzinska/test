import axios, { AxiosResponse } from "axios";
import { z } from "zod";

export const editProcurementRequirementsSchema = z.object({
  projectName: z
    .string({
      required_error: "Pole wymagane",
    })
    .nonempty({
      message: "Pole wymagane",
    }),
  projectNumber: z
    .string({
      required_error: "Pole wymagane",
    })
    .nonempty({
      message: "Pole wymagane",
    }),
  selectionCriteria: z.array(
    z.object({
      criteriaId: z.string({
        required_error: "Pole wymagane",
      }),
      value: z.string({
        required_error: "Pole wymagane",
      }),
      weight: z.any({
        required_error: "Pole wymagane",
      }),
      isMandatory: z.boolean({}),
    })
  ),
  selectionFormula: z
    .string({
      required_error: "Pole wymagane",
    })
    .transform((val) => Number(val)),
});

export type editProcurementRequirementsFormFields = z.infer<
  typeof editProcurementRequirementsSchema
>;

export type editProcurementRequirementsResponse = { id: string };

export const editProcurementRequirements = (
  data: editProcurementRequirementsFormFields
): Promise<AxiosResponse<editProcurementRequirementsResponse>["data"]> => {
  return axios({
    method: "POST",
    url: `${process.env.NEXT_PUBLIC_API_URL}/api/tenders/procurement-requirements`,
    withCredentials: true,
    data: {
      ...data,
    },
  }).then(({ data }) => data);
};
