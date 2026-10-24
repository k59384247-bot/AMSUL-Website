import { test, expect } from "@playwright/test";
import { chooseOption } from "./select-option";

test("Contact Us matches Figma and fits desktop, tablet and phones", async ({ page }) => {
  const errors: string[] = [];
  page.on("pageerror", error => errors.push(error.message));
  page.on("console", message => { if (message.type() === "error") errors.push(message.text()); });
  for (const width of [1440, 1024, 768, 390, 320]) {
    await page.setViewportSize({ width, height: 900 });
    await page.goto("/contact");
    await page.evaluate(() => document.fonts.ready);
    await expect(page.getByRole("heading", { level: 1 })).toHaveText("Let's Start a Conversation.");
    await expect(page.locator(".hero-thumbnails")).toHaveCount(0);
    const geometry = await page.evaluate(() => ({ width: document.documentElement.clientWidth, scroll: document.documentElement.scrollWidth, broken: [...document.images].filter(image => !image.complete || !image.naturalWidth).map(image => image.src) }));
    expect(geometry.scroll, `Horizontal overflow at ${width}px`).toBeLessThanOrEqual(geometry.width);
    expect(geometry.broken).toEqual([]);
    if (width === 1440) expect(await page.locator("main>section,footer").evaluateAll(nodes => nodes.map(node => ({ top: (node as HTMLElement).offsetTop, height: (node as HTMLElement).offsetHeight })))).toEqual([
      { top: 0, height: 440 }, { top: 440, height: 1004 }, { top: 1444, height: 700 }, { top: 2144, height: 440 },
    ]);
    if (width === 1440 || width === 390) await page.screenshot({ path: `test-results/contact-${width}.png`, fullPage: true });
  }
  expect(errors).toEqual([]);
});

test("enquiry validates inputs and reports the missing submission service honestly", async ({ page }) => {
  await page.goto("/contact");
  const form = page.getByRole("form", { name: "Contact enquiry", exact: true });
  const requests: string[] = [];
  page.on("request", request => { if (request.method() === "POST") requests.push(request.url()); });
  await form.getByRole("button", { name: "Send Message", exact: true }).click();
  await expect(form.getByRole("status")).toHaveCount(0);
  await form.getByLabel("Full Name/Company Name", { exact: true }).fill("John Doe");
  await form.getByLabel("Email Address", { exact: true }).fill("john@example.com");
  await chooseOption(page, "Enquiry Category", "Partnerships");
  await form.getByLabel("Subject", { exact: true }).fill("Support an AMSUL initiative");
  await form.getByLabel("Message", { exact: true }).fill("Please share more information about partnerships.");
  const valid = () => form.evaluate((node: HTMLFormElement) => node.checkValidity());
  expect(await valid()).toBe(true);
  await form.getByLabel("Full Name/Company Name", { exact: true }).fill("  ");
  expect(await valid()).toBe(false);
  await form.getByLabel("Full Name/Company Name", { exact: true }).fill("John Doe");
  await form.getByLabel("Email Address", { exact: true }).fill("invalid");
  expect(await valid()).toBe(false);
  await form.getByLabel("Email Address", { exact: true }).fill("john@example.com");
  await form.getByLabel("Phone Number", { exact: true }).fill("abcdefg");
  expect(await valid()).toBe(false);
  await form.getByLabel("Phone Number", { exact: true }).fill("+2348000000000");
  await form.getByLabel("Subject", { exact: true }).fill("  ");
  expect(await valid()).toBe(false);
  await form.getByLabel("Subject", { exact: true }).fill("Support an AMSUL initiative");
  await form.getByLabel("Message", { exact: true }).fill("  ");
  expect(await valid()).toBe(false);
  await form.getByLabel("Message", { exact: true }).fill("Please share more information about partnerships.");
  expect(await valid()).toBe(true);
  await form.getByRole("button", { name: "Send Message", exact: true }).click();
  await expect(form.getByRole("status")).toHaveText("Message submission is not connected yet. Your enquiry has not been sent or saved.");
  await expect(form.getByLabel("Subject", { exact: true })).toHaveValue("Support an AMSUL initiative");
  await form.getByLabel("Subject", { exact: true }).fill("A different subject");
  await expect(form.getByRole("status")).toHaveCount(0);
  expect(requests).toEqual([]);
});

test("FAQs open and close with mouse and keyboard and keep one answer open", async ({ page }) => {
  await page.goto("/contact");
  const faqs = page.locator(".faq-list");
  const buttons = faqs.getByRole("button");
  await expect(buttons).toHaveCount(4);
  await expect(buttons.first()).toHaveAttribute("aria-expanded", "true");
  await expect(faqs.getByRole("region")).toHaveCount(1);
  await buttons.first().click();
  await expect(faqs.getByRole("region")).toHaveCount(0);
  await buttons.nth(1).focus();
  await buttons.nth(1).press("Enter");
  await expect(buttons.nth(1)).toHaveAttribute("aria-expanded", "true");
  await expect(faqs.getByRole("region")).toHaveCount(1);
  await buttons.nth(2).click();
  await expect(buttons.nth(1)).toHaveAttribute("aria-expanded", "false");
  await expect(buttons.nth(2)).toHaveAttribute("aria-expanded", "true");
  await buttons.nth(2).press("Space");
  await expect(faqs.getByRole("region")).toHaveCount(0);
  await buttons.first().click();
  await expect(faqs.getByRole("region")).toContainText("The eco-learn project focuses on integrating climate education");
});

test("contact navigation and the supplied channel destinations work", async ({ page }) => {
  await page.goto("/");
  await page.getByRole("navigation", { name: "Footer navigation", exact: true }).getByRole("link", { name: "Contact Us", exact: true }).click();
  await expect(page).toHaveURL(/\/contact$/);
  await expect(page.getByRole("heading", { level: 1 })).toHaveText("Let's Start a Conversation.");
  const channels = page.locator(".contact-channels");
  await expect(channels.getByRole("link", { name: "contactsupport@amsul.org", exact: true })).toHaveAttribute("href", "mailto:contactsupport@amsul.org");
  await expect(channels.getByRole("link", { name: "+234-810-079-5517", exact: true })).toHaveAttribute("href", "https://wa.me/2348100795517");
  await expect(channels.getByRole("link", { name: "+234-810-011-2345", exact: true })).toHaveAttribute("href", "tel:+2348100112345");
  await expect(channels.getByRole("link").first()).toHaveAttribute("href", /google.com\/maps\/search\/.*College%20of%20Medicine/);
  const social = page.locator(".contact-social-links");
  await expect(social.getByRole("link", { name: "AMSUL on Instagram", exact: true })).toHaveAttribute("href", "https://www.instagram.com/amsul_unilag/");
  await expect(social.getByRole("link", { name: "AMSUL on X", exact: true })).toHaveAttribute("href", "https://x.com/amsul_unilag");
  await social.getByRole("button", { name: "AMSUL on LinkedIn", exact: true }).click();
  await expect(social.getByRole("status")).toHaveText("The AMSUL LinkedIn profile link has not been provided yet.");
  await page.getByRole("link", { name: "AMSUL LinkedIn contact details", exact: true }).click();
  await expect(page).toHaveURL(/\/contact$/);
});
