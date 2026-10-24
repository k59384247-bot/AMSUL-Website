import type { Page } from "@playwright/test";

export async function chooseOption(page: Page, label: string, value: string) {
  const names: Record<string, string> = { all: "All Types", oldest: "Oldest", latest: "Latest" };
  await page.getByRole("combobox", { name: label, exact: true }).click();
  await page.getByRole("option", { name: names[value] || value, exact: true }).click();
}
