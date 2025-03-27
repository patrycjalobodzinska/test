import Image from "next/image";
import { Geist, Geist_Mono } from "next/font/google";
import ProcurementTable from "@/components/Procurement/ProcurementTable";
import { Breadcrumb } from "@/ui/Breadcrumb";
import { useMemo } from "react";
import { File, LucideFileText } from "lucide-react";
import { NextPageWithLayout } from "@/ui/Layout/NextPageWithLayout";
import Layout from "@/ui/Layout/Layout";

const Excel: NextPageWithLayout = () => {
  const breadcrumbItems = [
    {
      href: "/dokumenty",
      icon: LucideFileText,
      label: `Dokumenty`,
    },
    {
      href: "/dokument/scenariusz-konkursu",
      label: `Scenariusz konkursu`,
    },
  ];
  return (
    <div className="w-full h-full">
      <Breadcrumb items={breadcrumbItems} />
    </div>
  );
};
Excel.getLayout = (page) => <Layout>{page}</Layout>;
export default Excel;
