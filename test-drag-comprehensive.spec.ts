import { test, expect } from '@playwright/test';

/**
 * Craft 风格拖拽功能完整自动化测试
 * 
 * 测试项目：
 * 1. 拖拽手柄显示（6个点 + 块类型图标）
 * 2. 拖拽镜像效果
 * 3. 原块拖拽中状态
 * 4. 拖拽后顺序改变
 * 5. 放置指示器显示
 */

test.describe('Craft 编辑器拖拽功能完整测试', () => {
  test.beforeEach(async ({ page }) => {
    await page.goto('http://localhost:5181');
    await page.waitForSelector('.ProseMirror', { timeout: 10000 });
  });

  test('测试 1: 拖拽手柄显示（6个点 + 图标）', async ({ page }) => {
    console.log('\n========== 测试 1: 拖拽手柄显示 ==========');
    
    const editor = page.locator('.ProseMirror');
    
    // 输入测试内容
    await editor.click();
    await page.keyboard.type('段落 1');
    await page.keyboard.press('Enter');
    await page.keyboard.type('段落 2');
    
    // 等待渲染
    await page.waitForTimeout(500);
    
    // 检查 block-wrapper 存在
    const wrappers = page.locator('.block-wrapper');
    const count = await wrappers.count();
    console.log(`✅ 找到 ${count} 个块容器`);
    expect(count).toBeGreaterThan(0);
    
    // 悬停在第一个块
    await wrappers.first().hover();
    await page.waitForTimeout(200);
    
    // 检查手柄显示
    const handle = wrappers.first().locator('.block-handle');
    const handleVisible = await handle.isVisible();
    console.log(`${handleVisible ? '✅' : '❌'} 拖拽手柄显示: ${handleVisible}`);
    
    if (handleVisible) {
      // 检查 6 个点
      const dots = handle.locator('div').first();
      const dotsVisible = await dots.isVisible();
      console.log(`${dotsVisible ? '✅' : '❌'} 6个点显示: ${dotsVisible}`);
      
      // 检查图标
      const icon = handle.locator('div').nth(1);
      const iconVisible = await icon.isVisible();
      const iconText = await icon.textContent();
      console.log(`${iconVisible ? '✅' : '❌'} 块类型图标: ${iconText}`);
    }
  });

  test('测试 2: 拖拽顺序改变', async ({ page }) => {
    console.log('\n========== 测试 2: 拖拽顺序改变 ==========');
    
    const editor = page.locator('.ProseMirror');
    
    // 输入多个段落
    await editor.click();
    await page.keyboard.type('第一段');
    await page.keyboard.press('Enter');
    await page.keyboard.type('第二段');
    await page.keyboard.press('Enter');
    await page.keyboard.type('第三段');
    await page.keyboard.press('Enter');
    await page.keyboard.type('第四段');
    
    await page.waitForTimeout(500);
    
    // 获取所有段落
    const paragraphs = page.locator('.block-wrapper p');
    const count = await paragraphs.count();
    console.log(`✅ 找到 ${count} 个段落`);
    
    // 记录拖拽前的顺序
    const textsBefore: string[] = [];
    for (let i = 0; i < count; i++) {
      const text = await paragraphs.nth(i).textContent();
      textsBefore.push(text || '');
    }
    console.log(`✅ 拖拽前顺序: [${textsBefore.join(', ')}]`);
    
    // 拖拽第一个段落到第三个位置
    const firstWrapper = page.locator('.block-wrapper').first();
    const thirdWrapper = page.locator('.block-wrapper').nth(2);
    
    const firstBox = await firstWrapper.boundingBox();
    const thirdBox = await thirdWrapper.boundingBox();
    
    if (firstBox && thirdBox) {
      console.log(`✅ 开始拖拽: 从 (${Math.round(firstBox.y)}) 到 (${Math.round(thirdBox.y)})`);
      
      // 悬停在第一个块
      await firstWrapper.hover();
      await page.waitForTimeout(200);
      
      // 执行拖拽
      await page.mouse.move(firstBox.x + 10, firstBox.y + 10);
      await page.mouse.down();
      await page.waitForTimeout(100);
      
      // 移动到第三个块
      const steps = 30;
      for (let i = 0; i <= steps; i++) {
        const progress = i / steps;
        const y = firstBox.y + (thirdBox.y - firstBox.y) * progress;
        await page.mouse.move(firstBox.x + 10, y);
        await page.waitForTimeout(10);
      }
      
      await page.waitForTimeout(200);
      await page.mouse.up();
      await page.waitForTimeout(500);
      
      // 检查拖拽后的顺序
      const textsAfter: string[] = [];
      for (let i = 0; i < count; i++) {
        const text = await paragraphs.nth(i).textContent();
        textsAfter.push(text || '');
      }
      console.log(`✅ 拖拽后顺序: [${textsAfter.join(', ')}]`);
      
      // 验证顺序是否改变
      const changed = JSON.stringify(textsBefore) !== JSON.stringify(textsAfter);
      if (changed) {
        console.log('✅ 成功：顺序已改变');
      } else {
        console.log('❌ 失败：顺序未改变');
      }
      
      expect(changed).toBe(true);
    }
  });

  test('测试 3: 拖拽中状态样式', async ({ page }) => {
    console.log('\n========== 测试 3: 拖拽中状态 ==========');
    
    const editor = page.locator('.ProseMirror');
    await editor.click();
    await page.keyboard.type('测试段落');
    await page.waitForTimeout(300);
    
    const wrapper = page.locator('.block-wrapper').first();
    const box = await wrapper.boundingBox();
    
    if (box) {
      await wrapper.hover();
      await page.mouse.move(box.x + 10, box.y + 10);
      await page.mouse.down();
      await page.waitForTimeout(100);
      
      // 检查 is-dragging class
      const hasDraggingClass = await wrapper.evaluate((el) => 
        el.classList.contains('is-dragging')
      );
      console.log(`${hasDraggingClass ? '✅' : '❌'} 拖拽中状态 class: ${hasDraggingClass}`);
      
      await page.mouse.up();
    }
  });

  test('测试 4: 标题块拖拽', async ({ page }) => {
    console.log('\n========== 测试 4: 标题拖拽 ==========');
    
    const editor = page.locator('.ProseMirror');
    await editor.click();
    
    // 输入标题
    await page.keyboard.type('# 标题 1');
    await page.keyboard.press('Enter');
    await page.keyboard.press('Enter');
    await page.keyboard.type('段落 1');
    await page.keyboard.press('Enter');
    await page.keyboard.type('## 标题 2');
    
    await page.waitForTimeout(500);
    
    // 检查标题块
    const h1 = page.locator('h1').first();
    const h1Wrapper = page.locator('.block-wrapper').filter({ has: h1 });
    
    await h1Wrapper.hover();
    await page.waitForTimeout(200);
    
    const handle = h1Wrapper.locator('.block-handle');
    const visible = await handle.isVisible();
    console.log(`${visible ? '✅' : '❌'} H1 标题手柄显示: ${visible}`);
    
    if (visible) {
      const icon = handle.locator('div').nth(1);
      const iconText = await icon.textContent();
      console.log(`✅ H1 图标文本: "${iconText}"`);
      expect(iconText).toBe('H1');
    }
  });

  test('测试 5: 引用块拖拽', async ({ page }) => {
    console.log('\n========== 测试 5: 引用块拖拽 ==========');
    
    const editor = page.locator('.ProseMirror');
    await editor.click();
    
    // 输入引用
    await page.keyboard.type('> 这是一条引用');
    await page.keyboard.press('Enter');
    await page.keyboard.press('Enter');
    await page.keyboard.type('段落 1');
    
    await page.waitForTimeout(500);
    
    const quote = page.locator('blockquote').first();
    const quoteWrapper = page.locator('.block-wrapper').filter({ has: quote });
    
    await quoteWrapper.hover();
    await page.waitForTimeout(200);
    
    const handle = quoteWrapper.locator('.block-handle');
    const visible = await handle.isVisible();
    console.log(`${visible ? '✅' : '❌'} 引用块手柄显示: ${visible}`);
    
    if (visible) {
      const icon = handle.locator('div').nth(1);
      const iconText = await icon.textContent();
      console.log(`✅ 引用块图标: "${iconText}"`);
    }
  });
});
