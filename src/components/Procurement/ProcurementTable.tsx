import { Button } from "@/ui/button";
import { Input } from "@/ui/input";
import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from "@/ui/table";
import clsx from "clsx";
import { Trash2 } from "lucide-react";
import Link from "next/link";
import { useRouter } from "next/router";
import { useState } from "react";

export interface ProcurementItem {
  id: string;
  description: string;
  unit?: string;
  subItems?: ProcurementItem[];
}

const ProcurementTable = () => {
  const [startIndex, setStartIndex] = useState<string | number>(1);
  const [name, setName] = useState("");
  const [password, setPassword] = useState("");

  const [data, setData] = useState<ProcurementItem[]>([
    {
      description: "",
      id: "1",
      subItems: [],
    },
  ]);
  const [val, setVal] = useState("");
  const router = useRouter();
  const { page } = router.query;
  const addRow = (parentId?: string) => {
    if (parentId && parentId.includes(".")) return;

    setData((prev) => {
      const newEntry: ProcurementItem = {
        id: parentId
          ? `${parentId}.${
              (findItemById(prev, parentId)?.subItems?.length || 0) + 1
            }`
          : `${prev.length + 1}`,

        description: "",
        unit: "",
        subItems: [],
      };

      return parentId
        ? updateNestedItem(prev, parentId, newEntry)
        : [...prev, newEntry];
    });
  };

  const removeRow = (id: string) => {
    setData((prev) => filterData(prev, id));
  };

  const filterData = (
    items: ProcurementItem[],
    id: string
  ): ProcurementItem[] =>
    items
      .filter((item) => item.id !== id)
      .map((item) => ({
        ...item,
        subItems: item.subItems ? filterData(item.subItems, id) : [],
      }));

  const handleChange = (
    id: string,
    field: keyof ProcurementItem,
    value: string
  ) => {
    setData((prev) => editNestedItem(prev, id, { [field]: value }));
  };

  const findItemById = (
    items: ProcurementItem[],
    id: string
  ): ProcurementItem | undefined => {
    for (let item of items) {
      if (item.id === id) return item;
      if (item.subItems) {
        const found = findItemById(item.subItems, id);
        if (found) return found;
      }
    }
    return undefined;
  };
  console.log(data);
  const editNestedItem = (
    items: ProcurementItem[],
    id: string,
    updatedItem: Partial<ProcurementItem>
  ): ProcurementItem[] =>
    items.map((item) =>
      item.id === id
        ? { ...item, ...updatedItem }
        : {
            ...item,
            subItems: item.subItems
              ? editNestedItem(item.subItems, id, updatedItem)
              : item.subItems,
          }
    );

  const updateNestedItem = (
    items: ProcurementItem[],
    parentId: string,
    newItem: ProcurementItem
  ): ProcurementItem[] =>
    items.map((item) =>
      item.id === parentId
        ? { ...item, subItems: [...(item.subItems || []), newItem] }
        : {
            ...item,
            subItems: item.subItems
              ? updateNestedItem(item.subItems, parentId, newItem)
              : item.subItems,
          }
    );

  return (
    <div className="p-5 text-black">
      <div className="grid md:grid-cols-3 gap-3">
        <Input
          label="Nazwa formularza"
          placeholder="Wpisz tutaj"
          value={name ?? ""}
          onChange={(e) => {
            setName(e?.currentTarget?.value ?? "xD");
          }}
          className="w-full"
        />

        <Input
          label="Początkowy numer ID"
          value={startIndex}
          type="number"
          onChange={(e) =>
            setStartIndex(
              e?.currentTarget?.value ? Number(e?.currentTarget?.value) : ""
            )
          }
        />

        {/* <Input
          label="Hasło do zabezpieczenia pliku"
          value={password}
          onChange={(e) => {
            setPassword(e?.currentTarget?.value);
          }}
        /> */}
      </div>

      <div className="flex mt-6 gap-4 px-2">
        {[
          { label: "Przedmiar zamawiającego", url: "przedmiar-zamawiajacego" },
          { label: "Kosztorys zamawiającego", url: "kosztorys-zamawiajacego" },
          {
            label: "Ceny jednostkowe zamawiającego",
            url: "ceny-jednostkowe-zamawiajacego",
          },
        ].map((item, idx) => (
          <Link
            className={clsx(
              page == item?.url
                ? "bg-primary transition-all text-white font-semibold"
                : "bg-transparent",
              "p-4 rounded-t-lg relative"
            )}
            key={idx}
            href={`?page=${item?.url}`}>
            <div className="font-semibold text-transparent">{item?.label}</div>
            <div className="absolute top-0 h-full flex items-center justify-center">
              {" "}
              {item?.label}
            </div>
          </Link>
        ))}
      </div>
      <div className=" border-t-6 border-t-primary rounded-t-lg px-8.5 py-10 bg-white">
        <div className="border border-primary rounded-lg">
          <Table className="border-b border-border">
            <TableHeader>
              <TableRow>
                <TableHead></TableHead>
                <TableHead>Opis</TableHead>
                <TableHead>Jednostka</TableHead>
                <TableHead></TableHead>
              </TableRow>
            </TableHeader>
            <TableBody>
              {data.map((item) => (
                <CategoryRow
                  key={item.id}
                  startIndex={startIndex}
                  isMain={true}
                  item={item}
                  addRow={addRow}
                  removeRow={removeRow}
                  handleChange={handleChange}
                />
              ))}
            </TableBody>
          </Table>
          <div className="flex items-center justify-center  w-full">
            <Button
              variant="secondary"
              className="text-primary px-4 py-2 text-lg rounded"
              onClick={() => addRow()}>
              Dodaj grupę
            </Button>
          </div>
        </div>
      </div>
    </div>
  );
};

export const CategoryRow = ({
  item,
  isMain,
  addRow,
  removeRow,
  handleChange,
  startIndex,
}: any) => (
  <>
    <TableRow>
      {isMain && (
        <TableCell
          rowSpan={isMain ? item?.subItems?.length + 2 : 1}
          className="font-semibold w-6 ">
          {Number(item.id) + (startIndex ? startIndex - 1 : 0)}
        </TableCell>
      )}

      <TableCell className="">
        <div className="flex  w-full  gap-2">
          {!isMain && (
            <span className="font-semibold">
              {Number(item.id.split(".")[0]) +
                (startIndex ? startIndex - 1 : 0)}
              .{item.id.split(".")[1]}
            </span>
          )}
          <Input
            placeholder="Opis"
            value={item.description}
            onChange={(e) =>
              handleChange(item.id, "description", e.target.value)
            }
            className="w-full"
          />
        </div>
      </TableCell>

      {isMain ? (
        <TableCell className="bg-gray"></TableCell>
      ) : (
        <TableCell>
          <Input
            value={item.unit || ""}
            onChange={(e) => handleChange(item.id, "unit", e.target.value)}
            className="w-full px-2 py-1 border rounded"
          />
        </TableCell>
      )}
      <TableCell className="w-4 p-0">
        <button
          className={`${isMain ? "text-red" : "text-primary"} `}
          onClick={() => removeRow(item.id)}>
          <Trash2 size={20} />
        </button>
      </TableCell>
    </TableRow>
    {item.subItems?.map((sub: any) => (
      <CategoryRow
        key={sub.id}
        item={sub}
        startIndex={startIndex}
        addRow={addRow}
        removeRow={removeRow}
        handleChange={handleChange}
      />
    ))}
    {isMain && (
      <TableRow>
        <TableCell className="">
          <div className=" flex items-center justify-center">
            {!item.id.includes(".") && (
              <button
                className=" text-primary px-2 hover:text-primary/70 font-semibold cursor-pointer"
                onClick={() => addRow(item.id)}>
                Dodaj sekcje
              </button>
            )}
          </div>
        </TableCell>
      </TableRow>
    )}
  </>
);

export default ProcurementTable;
