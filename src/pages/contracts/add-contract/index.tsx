import { Breadcrumb } from "@/ui/Breadcrumb";
import { useMemo, useState } from "react";
import { Gavel } from "lucide-react";
import { NextPageWithLayout } from "@/ui/Layout/NextPageWithLayout";
import Layout from "@/ui/Layout/Layout";
import { useGetProcurementRequirements } from "@/api/tenders/getProcurementRequirements";
import { useFormMutation } from "@/ui/hooks/useFormMutation";
import {
  addProcurementRequirements,
  AddProcurementRequirementsFormFields,
  AddProcurementRequirementsResponse,
  addProcurementRequirementsSchema,
} from "@/api/tenders/postProcurementRequirements";
import { useToastContext } from "@/components/ui/ToastsContext";
import { handleFormError } from "@/components/ui/handleFormError";
import { FormProvider } from "react-hook-form";
import { Input } from "@/ui/input";
import { InputText } from "@/components/ui/TextInput";
import { InputSelect, SelectInput } from "@/components/ui/SelectInput";
import {
  SelectionCriteria,
  useGetRequirementsOptions,
} from "@/api/tenders/getRequirementsOptions";
import { Button } from "@/ui/button";

import { Switch } from "@/components/ui/switch";

const Excel: NextPageWithLayout = () => {
  const [criteriaList, setCriteriaList] = useState<SelectionCriteria[]>([]);
  const [newCriteria, setNewCriteria] = useState<SelectionCriteria | null>(
    null
  );
  console.log(newCriteria);
  const handleAddCriteria = () => {
    setNewCriteria({
      criteriaId: "",
      value: "",
      weight: 0,
      isMandatory: false,
    });
  };

  const handleSaveCriteria = () => {
    if (newCriteria) {
      methods.setValue("selectionCriteria", [...criteriaList, newCriteria]);
      setCriteriaList([...criteriaList, newCriteria]);
      setNewCriteria(null);
    }
  };
  const breadcrumbItems = [
    {
      href: "documents",
      icon: Gavel,
      label: `Przetargi`,
    },
    {
      href: "",
      label: `Dodaj przetarg`,
    },
  ];
  const toast = useToastContext();
  const { data: criteria, isSuccess } = useGetRequirementsOptions();
  const { refetch } = useGetProcurementRequirements();
  const { methods, handleSubmit, isLoading } = useFormMutation<
    AddProcurementRequirementsFormFields,
    AddProcurementRequirementsResponse
  >(addProcurementRequirementsSchema, addProcurementRequirements, {
    onSuccess() {
      toast.success({ heading: "Zapisano", message: "" });
      refetch && refetch();
      methods.reset({});
      setCriteriaList([]);
      setNewCriteria(null);
    },

    onError(data) {
      handleFormError(data, toast, methods);
    },
  });
  const mapToOptions = (item: any) => {
    return {
      id: item?.id,
      name: `${item?.symbol}`,
      description: item?.description,
    };
  };
  const offerSelectionOptions = useMemo(
    () => (isSuccess ? criteria?.offerSelectionOptions?.map(mapToOptions) : []),
    [criteria, isSuccess]
  );
  const handleRemoveCriteria = (indexToRemove: number) => {
    const updatedList = criteriaList.filter(
      (_, index) => index !== indexToRemove
    );
    setCriteriaList(updatedList);
    methods.setValue("selectionCriteria", updatedList);
  };
  return (
    <div className="w-full h-full">
      <Breadcrumb items={breadcrumbItems} />
      <div className="bg-white p-8.5 mt-6 rounded-md">
        <FormProvider {...methods}>
          <form
            onSubmit={handleSubmit}
            className=" w-full text-dark flex-col  gap-4 flex z-10 ">
            <div className="grid grid-cols-2 gap-4 w-full">
              <InputText name="projectName" label="Nazwa przetargu" />
              <InputText name="projectNumber" label="Numer przetargu" />
              <InputSelect
                placeholder="Wybierz formułę"
                data={offerSelectionOptions}
                name="selectionFormula"
                label="Wybrana formuła"
              />
            </div>
            <div className="border-t-border border-t w-full mt-3 pt-3 text-dark ">
              Kryteria
            </div>
            {/* <InputSelect label="Kryteria" name="selectionCriteria" data={[]} />{" "} */}
            <div className="flex felx-wrap gap-4">
              {criteriaList && criteriaList?.length > 0 ? (
                criteriaList.map((criteria, index) => (
                  <div
                    key={index}
                    className="  border border-border p-4 rounded-lg flex flex-col">
                    <div className="font-semibold text-base pb-1">
                      {criteria.name}
                    </div>
                    <div>
                      Wartość:{" "}
                      <span className="font-semibold text-primary">
                        {criteria.value}
                      </span>
                    </div>{" "}
                    <div>
                      Waga:{" "}
                      <span className="font-semibold text-primary">
                        {criteria.weight}
                      </span>
                    </div>{" "}
                    <div>
                      Obowiązkowe:{" "}
                      <span className="font-semibold text-primary">
                        {criteria.isMandatory ? "Tak" : "Nie"}
                      </span>
                    </div>
                    <div className="flex items-end justify-end">
                      <button
                        type="button"
                        className="  text-sm text-primary mt-2 cursor-pointer hover:underline"
                        onClick={() => handleRemoveCriteria(index)}>
                        Usuń
                      </button>
                    </div>
                  </div>
                ))
              ) : (
                <div className="text-border w-full flex items-center justify-center text-cenetr">
                  Brak kryteriów
                </div>
              )}
            </div>
            {newCriteria && (
              <div className="grid grid-cols-3 gap-4 w-full mt-2">
                <SelectInput
                  label="Kryterium"
                  placeholder="Wybierz kryterium"
                  data={criteria?.criteriaList}
                  value={newCriteria?.criteriaId?.toString()}
                  onChange={(e) =>
                    setNewCriteria({
                      ...newCriteria,
                      criteriaId: e,
                      name: criteria?.criteriaList?.find(
                        (item) => item?.id?.toString() === e
                      )?.name,
                    })
                  }
                />

                <Input
                  name="value"
                  label="Wartość"
                  type="number"
                  onChange={(e) =>
                    setNewCriteria({ ...newCriteria, value: e.target.value })
                  }
                />
                <Input
                  type="number"
                  name="weight"
                  min={0}
                  max={1}
                  label="Waga"
                  step={0.1}
                  value={newCriteria?.weight ?? ""}
                  onChange={(e) => {
                    if (e.target.value?.length > 0) {
                      let value = parseFloat(e.target.value);

                      if (
                        (0 !== undefined && value < 0) ||
                        (e.target.value?.length === 0 && 0)
                      ) {
                        value = 0;
                      } else if (
                        (0.9 !== undefined && value > 0.9) ||
                        (e.target.value?.length === 0 && 0.9)
                      ) {
                        value = 0.9;
                      }
                      setNewCriteria({ ...newCriteria, weight: value });
                    } else {
                      setNewCriteria({ ...newCriteria, weight: "" });
                    }
                  }}
                />
                <div className="flex gap-2 items-center">
                  <Switch
                    checked={newCriteria?.isMandatory}
                    onCheckedChange={(e) => {
                      setNewCriteria({ ...newCriteria, isMandatory: e });
                    }}
                  />{" "}
                  <div>
                    {" "}
                    {newCriteria?.isMandatory
                      ? "Obowiązkowe"
                      : "Nieobowiązkowe"}
                  </div>{" "}
                </div>
              </div>
            )}
            <div className="flex items-end justify-end border-b pb-4">
              {newCriteria ? (
                <Button type="button" onClick={handleSaveCriteria}>
                  Dodaj
                </Button>
              ) : (
                <Button type="button" onClick={handleAddCriteria}>
                  Dodaj kryterium
                </Button>
              )}
            </div>
            <div className="flex items-end justify-end">
              <Button disabled={!(criteriaList?.length > 0)} type="submit">
                Zapisz przetarg
              </Button>
            </div>{" "}
          </form>
        </FormProvider>
      </div>
    </div>
  );
};
Excel.getLayout = (page) => <Layout>{page}</Layout>;
export default Excel;
