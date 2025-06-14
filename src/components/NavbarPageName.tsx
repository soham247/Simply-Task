"use client";
import { BreadcrumbPage } from './ui/breadcrumb'
import { usePathname } from 'next/navigation';

function NavbarPageName() {
    const pathname = usePathname();
    let name = "";
    switch (pathname) {
        case "/dashboard":
            name = "Dashboard";
            break;
        case "/sticky-notes":
            name = "Sticky Notes";
            break;
        default:
            name = "";
    }
  return (
    <BreadcrumbPage>{name}</BreadcrumbPage>
  )
}

export default NavbarPageName