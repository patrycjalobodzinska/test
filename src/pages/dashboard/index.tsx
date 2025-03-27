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
import { File, Home } from "lucide-react";
import { useRouter } from "next/router";
import { MdDocumentScanner } from "react-icons/md";

const Procurement: NextPageWithLayout = () => {
  const router = useRouter();
  const { data } = useGetProcurementRequirements();
  const breadcrumbItems = [
    {
      href: "dashboard",
      icon: Home,
      label: `Dashboard`,
    },
  ];
  return (
    <div>
      <Breadcrumb items={breadcrumbItems} />
    </div>
  );
};
Procurement.getLayout = (page) => <Layout>{page}</Layout>;
export default Procurement;
