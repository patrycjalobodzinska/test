import clsx from "clsx";
import {
  Antenna,
  Building2,
  ChartLine,
  ChevronDown,
  CircleAlert,
  Cross,
  FileChartColumn,
  FileText,
  Gavel,
  LayoutTemplate,
  Link2,
  LogOut,
  Plus,
  Server,
  SettingsIcon,
  TriangleRight,
  User,
} from "lucide-react";
import Image from "next/image";
import Link from "next/link";
import { useRouter } from "next/router";
import { PropsWithChildren, useEffect, useMemo, useState } from "react";
import { MdOutlineGavel } from "react-icons/md";
import logo from "@/public/sc4c_logo.png";
import { VscTriangleRight } from "react-icons/vsc";
import { Accordion, AccordionItem as Item } from "@szhsin/react-accordion";
import { useGetProcurementRequirements } from "@/api/tenders/getProcurementRequirements";

const AccordionItem = ({ header, isSelected, icon: Icon, ...rest }: any) => (
  <Item
    {...rest}
    header={({ state: { isEnter } }) => (
      <div className="flex font-semibold  w-full cursor-pointer items-center justify-between gap-2">
        <div className="flex items-center justify-center gap-2">
          {Icon && <Icon />}
          {header}
        </div>
        <ChevronDown size={14} className={isEnter ? " rotate-180" : ""} />
      </div>
    )}
    className=""
    buttonProps={{
      className: ({ isEnter }) =>
        `flex w-full p-3 text-left hover:text-primary/80 transition-all ${
          isSelected && "text-primary"
        }`,
    }}
    contentProps={{
      className: "transition-height duration-200 ease-out",
    }}
    panelProps={{ className: "p-2  " }}
  />
);

export const menuList = [
  {
    url: "sensors",
    icon: Antenna,
    label: "Czujniki",
  },
  {
    url: "sensor-groups",
    icon: Server,
    label: "Grupy",
  },
  {
    url: "alerts?isHandled=false",
    icon: CircleAlert,
    label: "Alerty",
  },
  {
    url: "alert-templates",
    icon: LayoutTemplate,
    label: "Szablony alertów",
  },
  {
    url: "reports",
    icon: FileChartColumn,
    label: "Raporty",
  },
  {
    url: "report-templates",
    icon: FileText,
    label: "Szablony raportów",
  },
  {
    url: "users",
    icon: User,
    label: "Użytkownicy",
  },
];

const Layout = ({ children }: PropsWithChildren) => {
  const router = useRouter();
  const [activeElement, setActiveElement] = useState("");
  const { data, isSuccess } = useGetProcurementRequirements();
  const handleClick = (value: string) => {
    if (value === activeElement) {
      setActiveElement("");
    } else {
      setActiveElement(value);
    }
  };
  const mapToOptions = (item: any) => {
    return {
      url: item?.id,
      label: `${item?.projectName}`,
      type: "normal",
    };
  };
  const procurement = useMemo(
    () => (isSuccess ? data?.map(mapToOptions) : []),
    [data, isSuccess]
  );
  return (
    <div className="flex text-dark w-full  h-full min-h-screen flex-col text-sm bg-background">
      <div className="flex w-full">
        <div className="flex max-w-[260px] w-full px-3 min-h-screen h-full top-0 pt-14 md:pt-0 flex-col shadow-2xl bg-white ">
          <Link href="/dashboard" className="p-2">
            <div className="w-36 ">
              <Image
                className=" h-full w-full object-contain"
                alt=""
                src={logo}
              />
            </div>
          </Link>
          <div className="pb-2 ">
            {[
              {
                label: "Przetargi",
                url: "contracts",
                subCategories: [
                  {
                    label: "Dodaj przetarg",
                    url: "add-contract",
                    type: "add",
                  },
                ].concat(procurement ?? []),
              },
              {
                label: "Dokumenty",
                url: "documents",
                subCategories: [
                  {
                    label: "Formularz cenowy",
                    url: "/price-form",
                    type: "normal",
                  },
                  {
                    label: "Scenariusz konkursu",
                    url: "/competition-scenario",
                    type: "normal",
                  },
                ],
              },
            ]?.map((item, idx) => (
              <div key={idx}>
                {}
                <Accordion transition transitionTimeout={200}>
                  <AccordionItem
                    isSelected={router.asPath?.includes(item?.url)}
                    header={item?.label}
                    icon={MdOutlineGavel}
                    initialEntered>
                    {item?.subCategories?.map(({ label, url, type }, idx) => (
                      <Link href={`/${item?.url}/${url}`} key={idx}>
                        <div
                          className={clsx(
                            router.asPath === `/${item?.url}/${url}`
                              ? "text-primary font-semibold transition-all"
                              : "flex items-center ",
                            "pl-4 line-clamp-1 hover:text-primary/80 gap-4 px-3 md:px-4 py-1"
                          )}>
                          <div className="gap-1 flex items-center justify-start">
                            {type && type === "add" ? (
                              <div>
                                <Plus
                                  size={15}
                                  className="text-primary opacity-100"
                                />
                              </div>
                            ) : (
                              <div
                                className={clsx(
                                  router.asPath === `/${item?.url}/${url}`
                                    ? "opacity-100"
                                    : "opacity-20  "
                                )}>
                                <VscTriangleRight />{" "}
                              </div>
                            )}

                            <div className="line-clamp-1">{label}</div>
                          </div>
                        </div>
                      </Link>
                    ))}
                  </AccordionItem>
                </Accordion>
              </div>
            ))}
            <div className=""></div>
          </div>
        </div>
        <div className="flex items-center justify-center w-full ">
          <div className="md:px-4 w-full p-2 pt-6 h-full pb-12 max-w-[2000px]">
            {children}
          </div>
        </div>
      </div>
    </div>
  );
};

export default Layout;
