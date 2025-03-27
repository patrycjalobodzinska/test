import { ChevronRight, LucideIcon } from "lucide-react";
import Link from "next/link";

interface IBreadcrumb {
  items: IBreadcrumbItem[];
}

export const Breadcrumb = ({ items }: IBreadcrumb) => {
  return (
    <div className="hidde md:flex gap-2 items-center h-8">
      {items?.map(({ label, icon: Icon, href }, index) => (
        <BreadcrumbItem
          key={index}
          href={href}
          hasChevron={index != items?.length - 1}>
          {Icon && <Icon />}
          <span className="mr-2 flex items-center">{label}</span>
        </BreadcrumbItem>
      ))}
    </div>
  );
};

export interface IBreadcrumbItem {
  label?: string;
  href?: string;
  icon?: LucideIcon;
  hasChevron?: boolean;
  children?: React.ReactNode;
}

const BreadcrumbItem = ({ href, hasChevron, children }: IBreadcrumbItem) => {
  return (
    <div className="flex items-center text-base font-medium text-gray-700">
      {href && hasChevron && (
        <Link href={href} className="flex items-center gap-2">
          {children}
        </Link>
      )}
      {href && !hasChevron && (
        <span className="flex  items-center gap-2">{children}</span>
      )}
      {!href && (
        <span className="flex text-primary font-semibold items-center gap-2">
          {children}
        </span>
      )}
      {hasChevron && <div>{">"}</div>}
    </div>
  );
};
