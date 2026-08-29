"use client";

import Link from "next/link";
import { usePathname } from "next/navigation";

import { isActiveNavHref, type NavigationItem } from "../../lib/navigation";

/**
 * usePathname is the only reason this is a client leaf. A missing or
 * relative value marks nothing current rather than throwing, so a router
 * edge case cannot take the whole shell down with it.
 */
export function currentNavPath(pathname: unknown) {
  if (typeof pathname !== "string") {
    return null;
  }

  const trimmed = pathname.trim();

  if (!trimmed.startsWith("/")) {
    return null;
  }

  return trimmed;
}

export function NavigationList({ items }: { items: NavigationItem[] }) {
  const current = currentNavPath(usePathname());

  return (
    <ul>
      {items.map((item) => {
        const active = current ? isActiveNavHref(item.href, current) : false;

        return (
          <li key={item.href}>
            <Link aria-current={active ? "page" : undefined} href={item.href}>
              {item.label}
            </Link>
          </li>
        );
      })}
    </ul>
  );
}
