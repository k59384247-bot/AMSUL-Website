import { test, expect } from "@playwright/test";

test("dropdowns use app-styled menus instead of native selects", async ({ page }) => {
  for (const route of ["/blog", "/programs-events", "/event-highlights", "/impact-reports", "/contact"]) {
    await page.goto(route);
    await expect(page.locator("select")).toHaveCount(0);
    const combo = page.getByRole("combobox").first();
    await combo.click();
    await expect(combo).toHaveAttribute("aria-expanded", "true");
    await expect(page.getByRole("listbox")).toBeVisible();
    await expect(page.getByRole("option").first()).toBeVisible();
    await combo.press("Escape");
    await expect(page.getByRole("listbox")).toHaveCount(0);
    await expect(combo).toBeFocused();
  }
});

test("pagination shows only real pages and hides numbers when no records match", async ({ page }) => {
  for (const [route, count] of [["/impact-reports", 2], ["/blog", 1], ["/programs-events", 1], ["/event-highlights", 1]] as const) {
    await page.goto(route);
    await expect(page.locator(".page-number")).toHaveCount(count);
    await expect(page.locator(".page-number:disabled")).toHaveCount(0);
    await page.getByRole("searchbox").fill("no matching result xyz");
    await page.getByRole("searchbox").press("Enter");
    await expect(page.locator(".page-number")).toHaveCount(0);
    await expect(page.locator(".pagination-direction").first()).toBeDisabled();
    await expect(page.locator(".pagination-direction").last()).toBeDisabled();
  }
});

test("input focus follows rounded field boundaries without an inner rectangle", async ({ page }) => {
  await page.goto("/blog");
  for (const selector of [".listing-search input", ".newsletter-form input"]) {
    const input = page.locator(selector);
    await input.click();
    expect(await input.evaluate(node => getComputedStyle(node).outlineStyle)).toBe("none");
    expect(await input.evaluate(node => getComputedStyle(node).boxShadow)).toBe("none");
    const wrapper = input.locator("..");
    expect(await wrapper.evaluate(node => getComputedStyle(node).boxShadow)).not.toBe("none");
    expect(await wrapper.evaluate(node => getComputedStyle(node).borderRadius)).toBe("100px");
  }
  await page.goto("/contact");
  for (const selector of ["#contact-name", "#contact-message"]) {
    const input = page.locator(selector);
    await input.click();
    expect(await input.evaluate(node => getComputedStyle(node).outlineStyle)).toBe("none");
    expect(await input.evaluate(node => getComputedStyle(node).boxShadow)).not.toBe("none");
  }
});

test("custom dropdown keyboard, dismissal and mobile menu placement work", async ({ page }) => {
  for (const width of [1440, 390, 320]) {
    await page.setViewportSize({ width, height: 900 });
    await page.goto("/blog");
    const combo = page.getByRole("combobox", { name: "Content Type", exact: true });
    await combo.focus();
    await combo.press("ArrowDown");
    await expect(page.getByRole("listbox")).toBeVisible();
    await combo.press("End");
    const active = await combo.getAttribute("aria-activedescendant");
    await expect(page.locator(`[id="${active}"]`)).toHaveAttribute("data-active", "true");
    await combo.press("Home");
    await combo.press("n");
    await combo.press("Enter");
    await expect(combo).toHaveText("News");
    await expect(page.locator(".blog-grid .story-card")).toHaveCount(2);
    await combo.click();
    const bounds = await page.getByRole("listbox").boundingBox();
    expect(bounds).not.toBeNull();
    expect(bounds!.x).toBeGreaterThanOrEqual(0);
    expect(bounds!.x + bounds!.width).toBeLessThanOrEqual(width);
    expect(bounds!.y).toBeGreaterThanOrEqual(0);
    expect(bounds!.y + bounds!.height).toBeLessThanOrEqual(900);
    await combo.press("ArrowDown");
    await combo.press("Escape");
    await expect(combo).toHaveText("News");
    await combo.click();
    await combo.press("Tab");
    await expect(page.getByRole("listbox")).toHaveCount(0);
    await combo.click();
    await page.getByRole("heading", {level:1}).click();
    await expect(page.getByRole("listbox")).toHaveCount(0);
    const size = page.getByRole("combobox", {name:"Results per page",exact:true});
    await size.click();
    const sizeBounds = await page.getByRole("listbox").boundingBox();
    expect(sizeBounds!.x + sizeBounds!.width).toBeLessThanOrEqual(width);
    expect(sizeBounds!.y + sizeBounds!.height).toBeLessThanOrEqual(900);
    await size.press("Escape");
  }
});

test("custom contact category remains required and submits its selected value", async ({ page }) => {
  await page.goto("/contact");
  const form = page.getByRole("form", {name:"Contact enquiry",exact:true});
  await form.getByLabel("Full Name/Company Name", {exact:true}).fill("John Doe");
  await form.getByLabel("Email Address", {exact:true}).fill("john@example.com");
  await form.getByLabel("Subject", {exact:true}).fill("Partnership enquiry");
  await form.getByLabel("Message", {exact:true}).fill("Please share more information.");
  await form.getByRole("button", {name:"Send Message",exact:true}).click();
  const combo = form.getByRole("combobox", {name:"Enquiry Category",exact:true});
  await expect(combo).toBeFocused();
  await expect(combo).toHaveAttribute("aria-invalid", "true");
  await expect(form.getByRole("alert")).toHaveText("Please select an option.");
  await expect(form.getByRole("status")).toHaveCount(0);
  await combo.click();
  await page.getByRole("option", {name:"Partnerships",exact:true}).click();
  await expect(form.getByRole("alert")).toHaveCount(0);
  expect(await form.evaluate((node:HTMLFormElement)=>new FormData(node).get("category"))).toBe("Partnerships");
  expect(await form.evaluate((node:HTMLFormElement)=>node.checkValidity())).toBe(true);
  await form.getByRole("button", {name:"Send Message",exact:true}).click();
  await expect(form.getByRole("status")).toContainText("not connected yet");
});
