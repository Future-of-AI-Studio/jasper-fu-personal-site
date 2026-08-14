export const MAX_NAVIGATION_ITEMS = 6;

export type NavigationItem = {
  label: string;
  href: `/${string}`;
};

export const primaryNavigation = [
  { label: "Home", href: "/" },
  { label: "Services", href: "/services" },
  { label: "Case Studies", href: "/case-studies" },
  { label: "About", href: "/about" },
  { label: "Contact", href: "/contact" },
] satisfies NavigationItem[];

export function parseNavigationItems(items: NavigationItem[]) {
  if (items.length === 0) {
    throw new Error("Navigation must include at least one item");
  }

  if (items.length > MAX_NAVIGATION_ITEMS) {
    throw new Error(
      `Navigation cannot include more than ${MAX_NAVIGATION_ITEMS} items`,
    );
  }

  return items.map((item, index) => {
    if (item.label.trim().length === 0) {
      throw new Error(`Navigation item ${index + 1} requires a label`);
    }

    if (!item.href.startsWith("/")) {
      throw new Error(`Navigation item ${index + 1} requires an internal href`);
    }

    return { ...item, label: item.label.trim() };
  });
}
