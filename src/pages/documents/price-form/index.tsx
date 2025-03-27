import Image from "next/image";
import { Geist, Geist_Mono } from "next/font/google";
import ProcurementTable from "@/components/Procurement/ProcurementTable";
import { Breadcrumb } from "@/ui/Breadcrumb";
import { useMemo } from "react";
import { File } from "lucide-react";
import { NextPageWithLayout } from "@/ui/Layout/NextPageWithLayout";
import Layout from "@/ui/Layout/Layout";

const Excel: NextPageWithLayout = () => {
  const breadcrumbItems = [
    {
      href: "",
      icon: File,
      label: `Formularz cenowy`,
    },
  ];

  return (
    <div className="w-full h-full">
      <Breadcrumb items={breadcrumbItems} />

      <ProcurementTable />
    </div>
  );
};
Excel.getLayout = (page) => <Layout>{page}</Layout>;
export default Excel;
