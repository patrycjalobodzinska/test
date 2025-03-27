import Image from "next/image";
import { Geist, Geist_Mono } from "next/font/google";
import ProcurementTable, {
  CategoryRow,
  ProcurementItem,
} from "@/components/Procurement/ProcurementTable";
import { Breadcrumb } from "@/ui/Breadcrumb";
import { useMemo } from "react";
import { File, LucideFileText } from "lucide-react";
import { NextPageWithLayout } from "@/ui/Layout/NextPageWithLayout";
import Layout from "@/ui/Layout/Layout";
import { saveAs } from "file-saver";
import ExcelJS from "exceljs";
import { useGetProcurementRequirements } from "@/api/tenders/getProcurementRequirements";
import { useGetProcurementRequirement } from "@/api/tenders/getProcurementRequirement";
import { useRouter } from "next/router";
import { useGetRequirementsOptions } from "@/api/tenders/getRequirementsOptions";
import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from "@/ui/table";
import { Button } from "@/ui/button";

const dataForExcel = [
  {
    id: "1",
    description: "Przygotowanie terenu",
    unit: "",
    subItems: [
      { id: "1.1", description: "Karczowanie drzew", unit: "m3" },
      { id: "1.2", description: "Rozbiórka istniejących budynków", unit: "m3" },
      { id: "1.3", description: "Niwelacja terenu", unit: "m3" },
    ],
  },
  {
    id: "2",
    description: "Roboty ziemne",
    unit: "",
    subItems: [
      { id: "2.1", description: "Roboty ziemne", unit: "m3" },
      { id: "2.2", description: "Wymiana gruntu", unit: "m3" },
      { id: "2.3", description: "Wykop wąskoprzestrzenny", unit: "m3" },
    ],
  },
];
const Excel: NextPageWithLayout = () => {
  const router = useRouter();
  const { id } = router.query;
  const { data } = useGetProcurementRequirement(id as string);
  const { data: criteria } = useGetRequirementsOptions();
  const breadcrumbItems = useMemo(
    () => [
      {
        href: "dokumenty",
        icon: LucideFileText,
        label: `Formularz cenowy`,
      },
      {
        href: "",
        label: data?.projectName,
      },
    ],
    [data]
  );

  const exportToExcel = async () => {
    const workbook = new ExcelJS.Workbook();
    const worksheet = workbook.addWorksheet("Oferty");

    const headers = [
      "L. p.",
      "Opis",
      "",
      "Jednostka",
      "Ilość wg Oferenta",
      "c. jedn. Oferenta",
      "Wartość wg Oferenta",
    ];
    // ------------------- DANE FIRMY I PROJEKTU -------------------
    worksheet.getCell(`B2`).value = "Data:";
    worksheet.getCell(`B2`).font = { bold: true, size: 12 };
    (worksheet.getCell("C2").numFmt = "dd.mm.yyyy"),
      [
        "Nazwa firmy:",
        "NIP:",
        "Kod:",
        "Miasto:",
        "Ulica:",
        "Nr budynku:",
        "Nr lokalu:",
      ].map(
        (itm, idx) => (
          (worksheet.getCell(`B${idx + 3}`).value = itm),
          (worksheet.getCell(`B${idx + 3}`).font = { bold: true, size: 12 })
        )
      );
    (worksheet.getCell(`B12`).value = "Nazwa projektu:"),
      (worksheet.getCell(`B12`).font = { bold: true, size: 12 }),
      (worksheet.getCell(`B12`).value = data?.projectName),
      (worksheet.getCell(`B12`).font = { bold: true, size: 12 }),
      (worksheet.getCell(`B13`).value = "Numer projektu:");
    (worksheet.getCell(`B13`).font = { bold: true, size: 12 }),
      (worksheet.getCell(`C13`).value = data?.projectNumber);
    (worksheet.getCell(`C13`).font = { bold: false, size: 12 }),
      // ------------------- KRYTERIA -------------------

      (worksheet.getCell("B15").value = "Kryterium wyboru");
    data?.selectionCriteria?.map(
      (itm, idx) => (
        (worksheet.getCell(`B${idx + 17}`).value = `K${idx + 1}`),
        (worksheet.getCell(`C${idx + 17}`).value = criteria?.criteriaList?.find(
          (item) => item?.id === itm?.criteriaId
        )?.name),
        (worksheet.getCell(`D${idx + 17}`).value = "")
      )
    ),
      // ------------------- FORMULARZ OFERTY -------------------

      worksheet.mergeCells("A21:F21");
    worksheet.getCell("A21").value = "Formularz oferty";
    worksheet.getCell("A21").font = { bold: true, size: 12 };
    worksheet.getCell("A21").alignment = { horizontal: "center" };

    // ------------------- PRZESUNIĘCIE TABELI -------------------

    // Zmieniamy index początkowy na 20, żeby zacząć dane tabeli niżej
    let startRow = 20 + (data?.selectionCriteria?.length ?? 0);

    worksheet.getRow(startRow).values = headers;
    worksheet.mergeCells(`B${startRow}:C${startRow}`);
    const addItem = (item: ProcurementItem, isSub = false) => {
      const currentRowNumber = worksheet.lastRow!.number + 1;

      const row = worksheet.addRow([
        item.id,
        item.description,
        "",
        item.unit ?? "",
        "",
        "",
      ]);
      worksheet.mergeCells(
        `${row.getCell(2).address}:${row.getCell(3).address}`
      );

      row.getCell(7).value = isSub
        ? {
            formula: `IF(AND(ISNUMBER(E${currentRowNumber}), ISNUMBER(F${currentRowNumber})),E${currentRowNumber}*F${currentRowNumber},0)`,
            result: 0,
          }
        : "";
      row.getCell(6).numFmt = "#,##0.00 zł";
      row.getCell(7).numFmt = "#,##0.00 zł";

      row.eachCell((cell, colNumber) => {
        if (colNumber === 4) {
          cell.protection = { locked: true };
        }

        if (!isSub) {
          cell.protection = { locked: true };

          cell.fill = {
            type: "pattern",
            pattern: "solid",
            fgColor: { argb: "a8f7ad" },
          };
        } else {
          if (colNumber !== 4) {
            cell.protection = { locked: false };
          }

          if (colNumber === 3) {
            const value = cell.value?.toString() || "";
            cell.value = value;
          }
        }
        cell.border = {
          top: { style: "thin" },
          bottom: { style: "thin" },
          left: { style: "thin" },
          right: { style: "thin" },
        };
      });

      item.subItems?.forEach((sub) => addItem(sub, true));
    };

    dataForExcel?.forEach((item) => addItem(item));
    worksheet.getColumn(1).eachCell((cell) => {
      cell.protection = { locked: true };
    });
    worksheet.getColumn(2).eachCell((cell) => {
      cell.protection = { locked: true };
    });
    worksheet.getColumn(4).eachCell((cell) => {
      cell.protection = { locked: true };
    });

    const headerRow = worksheet.getRow(startRow);
    headerRow.eachCell((cell, colNumber) => {
      cell.protection = { locked: true };
      cell.font = { bold: true };
      cell.fill = {
        type: "pattern",
        pattern: "solid",
        fgColor: { argb: "c4c4c4" },
      };
      cell.border = {
        top: { style: "thin" },
        bottom: { style: "thin" },
        right: { style: "thin" },
        left: { style: "thin" },
      };
    });

    const lastRowIndex = worksheet.lastRow!.number;
    const sumRowIndex = lastRowIndex + 1;

    // Wiersz sumy
    worksheet.mergeCells(`B${sumRowIndex}:F${sumRowIndex}`);
    worksheet.getCell(`A${sumRowIndex}`).value = "";
    worksheet.getCell(`B${sumRowIndex}`).value = "Suma";
    worksheet.getCell(`E${sumRowIndex}`).font = {
      bold: true,
      size: 12,
      color: { argb: "fa0213" },
    };

    worksheet.getCell(`G${sumRowIndex}`).value = {
      formula: `SUM(G${startRow + 1}:G${lastRowIndex})`,
      result: 0,
    };
    worksheet.getCell(`G${sumRowIndex}`).numFmt = "#,##0.00 zł";
    worksheet.getCell(`G${sumRowIndex}`).font = { bold: true };

    // Obramowania (opcjonalnie)
    worksheet.getRow(sumRowIndex).eachCell((cell) => {
      cell.fill = {
        type: "pattern",
        pattern: "solid",
        fgColor: { argb: "a8f7ad" },
      };
      cell.font = {
        bold: true,
        size: 12,
      };
      cell.border = {
        top: { style: "thin" },
        bottom: { style: "thin" },
        left: { style: "thin" },
        right: { style: "thin" },
      };
    });
    for (let row = 2; row <= 9; row++) {
      worksheet.getCell(`C${row}`).protection = { locked: false };
      worksheet.getCell(`C${row}`).font = {
        bold: true,
        size: 12,
        color: { argb: "fa0213" },
      };
    }
    for (
      let row = 17;
      row < (data ? 17 + data?.selectionCriteria?.length : 17);
      row++
    ) {
      worksheet.getCell(`C${row}`).value === "Cena"
        ? ((worksheet.getCell(`D${row}`).value = worksheet.getCell(
            `G${sumRowIndex}`
          ).value),
          (worksheet.getCell(`D${row}`).numFmt = "#,##0.00 zł"))
        : (worksheet.getCell(`D${row}`).protection = { locked: false });
      worksheet.getCell(`D${row}`).font = {
        bold: true,
        size: 12,
        color: { argb: "fa0213" },
      };
    }

    for (let row = 3; row <= 13; row++) {
      let currentRow = row + sumRowIndex;
      worksheet.mergeCells(`B${currentRow}:G${currentRow}`);

      if (row === 3) {
        worksheet.getCell(`A${currentRow}`).value = "Uwagi";
        worksheet.getCell(`A${currentRow}`).font = { bold: true };
        worksheet.getRow(currentRow).eachCell(
          (cell) =>
            (cell.fill = {
              type: "pattern",
              pattern: "solid",
              fgColor: { argb: "c4c4c4" },
            })
        );
      } else {
        worksheet.getCell(`A${currentRow}`).value = row - 3;
        worksheet.getCell(`B${currentRow}`).value = "";
        worksheet.getCell(`B${currentRow}`).protection = { locked: false };
      }
      worksheet.getRow(currentRow).eachCell(
        (cell) => (
          (cell.font = { size: 12 }),
          (cell.border = {
            top: { style: "thin" },
            bottom: { style: "thin" },
            left: { style: "thin" },
            right: { style: "thin" },
          })
        )
      );
    }
    const podpis = worksheet.lastRow!.number;
    worksheet.mergeCells(`E${podpis + 2}:G${podpis + 2}`);
    worksheet.mergeCells(`E${podpis + 3}:G${podpis + 4}`);
    worksheet.getCell(`E${podpis + 2}`).value = "PODPIS";
    worksheet.getCell(`E${podpis + 2}`).font = {
      bold: true,
    };
    worksheet.getCell(`E${podpis + 2}`).border = {
      top: { style: "thin" },
      bottom: { style: "thin" },
      left: { style: "thin" },
      right: { style: "thin" },
    };
    worksheet.getCell(`E${podpis + 3}`).border = {
      top: { style: "thin" },
      bottom: { style: "thin" },
      left: { style: "thin" },
      right: { style: "thin" },
    };

    worksheet?.columns.forEach((column, idx) => {
      let maxLength = 15;

      column?.eachCell &&
        column?.eachCell({ includeEmpty: true }, (cell) => {
          cell.font = {
            ...cell.font,
            size: 12,
          };
          const value = cell.value as string;
          const length = value ? value.toString().length : 0;
          if (length > 30) {
            maxLength = length;
          }
        });
      column.width =
        idx === 0
          ? 7
          : idx === 1
          ? maxLength > 15
            ? maxLength - 10
            : 15
          : idx === 3
          ? 10
          : 20;
    });
    worksheet.pageSetup = {
      paperSize: 9, // A4 (ISO)
      orientation: "portrait", // lub 'portrait'
      fitToPage: true,
      fitToWidth: 1, // zmieść szerokość tabeli na jednej stronie
      fitToHeight: 0, // dowolna liczba stron w pionie
      margins: {
        left: 0.5,
        right: 0.5,
        top: 0.75,
        bottom: 0.75,
        header: 0.3,
        footer: 0.3,
      },
      horizontalCentered: true,
      verticalCentered: false,
    };

    await worksheet.protect("haslo123", {
      selectLockedCells: true,
      selectUnlockedCells: true,
    });
    const buffer = await workbook.xlsx.writeBuffer();
    const blob = new Blob([buffer], {
      type: "application/vnd.openxmlformats-officedocument.spreadsheetml.sheet",
    });
    saveAs(blob, `${data?.projectNumber}.xlsx`);
  };
  return (
    <div className="w-full h-full">
      <Breadcrumb items={breadcrumbItems} />
      <div className="mt-12 p-6 bg-white border-primary border-t-4 border rounded-lg flex flex-col">
        <div className="flex items-center justify-between">
          <div className="text-lg">
            {data?.projectName}/
            <span className="text-dark/70">{data?.projectNumber}</span>
          </div>
          <div>
            <Button onClick={() => router.push(`/contracts/${id}/edit`)}>
              Edytuj
            </Button>{" "}
            <Button onClick={exportToExcel}>Pobierz</Button>
          </div>
        </div>
        <div className="pb-2 mt-6 font-semibold">Kryteria</div>
        <div className="flex flex-wrap gap-4">
          {data?.selectionCriteria?.map((item, idx) => (
            <div
              key={idx}
              className="  border border-border p-4 rounded-lg flex flex-col">
              <div className="font-semibold text-base pb-1">
                {
                  criteria?.criteriaList?.find(
                    (itm) => itm?.id === item?.criteriaId
                  )?.name
                }
              </div>
              <div>
                Wartość:{" "}
                <span className="font-semibold text-primary">
                  {item?.value}
                </span>
              </div>{" "}
              <div>
                Waga:{" "}
                <span className="font-semibold text-primary">
                  {item.weight}
                </span>
              </div>{" "}
              <div>
                Obowiązkowe:{" "}
                <span className="font-semibold text-primary">
                  {item.isMandatory ? "Tak" : "Nie"}
                </span>
              </div>
            </div>
          ))}
        </div>
        <div className="pb-2 mt-6 font-semibold">Formuła</div>
        {
          criteria?.offerSelectionOptions?.find(
            (itm) => itm?.id === data?.selectionFormula
          )?.symbol
        }
        /
        {
          criteria?.offerSelectionOptions?.find(
            (itm) => itm?.id === data?.selectionFormula
          )?.description
        }
        <div className="pb-2 mt-6 font-semibold">Formularz cenowy</div>
        <div className="border border-primary rounded-lg">
          <Table className="border-b border-border">
            <TableHeader>
              <TableRow>
                <TableHead></TableHead>
                <TableHead>Opis</TableHead>
                <TableHead>Jednostka</TableHead>
              </TableRow>
            </TableHeader>
            <TableBody>
              {dataForExcel.map((item) => (
                <>
                  <TableRow className="bg-primary-light/60">
                    <TableCell className="font-semibold w-6 ">
                      {item?.id}
                    </TableCell>
                    <TableCell className=""> {item?.description}</TableCell>
                    <TableCell className=""> {item?.unit}</TableCell>
                  </TableRow>
                  {item?.subItems?.map((itm, idx) => (
                    <TableRow key={idx}>
                      <TableCell className="font-semibold w-6 ">
                        {itm?.id}
                      </TableCell>
                      <TableCell className=""> {itm?.description}</TableCell>
                      <TableCell className=""> {itm?.unit}</TableCell>
                    </TableRow>
                  ))}
                </>
              ))}
            </TableBody>
          </Table>
        </div>{" "}
      </div>
    </div>
  );
};
Excel.getLayout = (page) => <Layout>{page}</Layout>;
export default Excel;
