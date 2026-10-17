"""Run after desktop:package: python3 electron/offline.test.py."""
import asyncio
from pathlib import Path
from playwright.async_api import async_playwright

async def main():
    async with async_playwright() as playwright:
        browser = await playwright.chromium.launch(headless=True, args=['--allow-file-access-from-files'])
        context = await browser.new_context(viewport={'width': 1280, 'height': 1800}, offline=True)
        page = await context.new_page()
        await page.goto((Path.cwd() / 'dist-desktop/index.html').as_uri())
        selectors = page.locator('select')
        await selectors.nth(0).select_option(label='Université de Kairouan')
        options = await selectors.nth(1).locator('option').all_text_contents()
        await selectors.nth(1).select_option(label=next(x for x in options if 'informatique et de gestion' in x.lower()))
        await selectors.nth(2).select_option(label='Sciences Économiques — L1')
        grades = page.locator('input[type=number]')
        await grades.first.wait_for()
        for index, value in enumerate(['14', '12', '10', '16']):
            await grades.nth(index).fill(value)
        await page.wait_for_timeout(300)
        await page.reload()
        await grades.first.wait_for()
        for index, value in enumerate(['14', '12', '10', '16']):
            assert await grades.nth(index).input_value() == value, 'Offline grades or Control did not persist'
        assert await selectors.nth(2).input_value(), 'Offline profile did not persist'
        assert await page.locator('img').first.evaluate('(img) => img.complete && img.naturalWidth > 0'), 'Background is unavailable offline'
        print('PASS: offline grades, Control, profile, and background')
        await browser.close()

asyncio.run(main())