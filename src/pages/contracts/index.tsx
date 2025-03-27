import { useGetProcurementRequirements } from "@/api/tenders/getProcurementRequirements";
import { Pagination } from "@/components/ui/paginationComponent";
import { Breadcrumb } from "@/ui/Breadcrumb";
import Layout from "@/ui/Layout/Layout";
import { NextPageWithLayout } from "@/ui/Layout/NextPageWithLayout";
import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from "@/ui/table";
import { File } from "lucide-react";
import { useRouter } from "next/router";
import { MdDocumentScanner } from "react-icons/md";

const Procurement: NextPageWithLayout = () => {
  const router = useRouter();
  const { data } = useGetProcurementRequirements();
  const breadcrumbItems = [
    {
      href: "dokumenty",
      icon: File,
      label: `Przetargi`,
    },
  ];
  return (
    <div>
      <Breadcrumb items={breadcrumbItems} />
      <div className="bg-background-charts mt-12 animate-fade rounded-lg shadow-md border border-gray-700/60">
        <Table>
          <TableHeader>
            <TableRow>
              <TableHead className=" select-none cursor-pointer items-center gap-2">
                <div className="flex  gap-2 items-center">Nazwa</div>
              </TableHead>
              <TableHead>Numer projektu</TableHead>
            </TableRow>
          </TableHeader>
          <TableBody>
            {data?.map((item) => (
              <TableRow
                onClick={() => router.push(`/contracts/${item?.id}`)}
                key={item?.id}
                className="text-gray-300 cursor-pointer">
                <TableCell className="font-medium">
                  <div className="cursor-pointer" key={item?.id}>
                    {item?.projectName}
                  </div>
                </TableCell>
                <TableCell className="font-medium">
                  {item?.projectNumber}
                </TableCell>
              </TableRow>
            ))}
          </TableBody>
        </Table>
        {data && data?.length > 0 ? (
          <></>
        ) : (
          <div className="flex items-center text-sm p-4 mt-2 justify-center  text-gray-300">
            Brak przetargów
          </div>
        )}
      </div>
      {/* {queryData?.paginationData?.totalPages &&
      queryData?.paginationData?.totalPages > 1 ? (
        <Pagination pagination={queryData?.paginationData} />
      ) : (
        ""
      )} */}
    </div>
  );
};
Procurement.getLayout = (page) => <Layout>{page}</Layout>;
export default Procurement;
