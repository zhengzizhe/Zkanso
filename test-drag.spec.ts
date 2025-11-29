import { test, expect } from '@playwright/test';

test('测试编辑器拖拽功能', async ({ page }) => {
  console.log('🚀 开始测试...');
  
  // 1. 访问页面
  await page.goto('http://localhost:5181');
  console.log('✅ 页面已加载');
  
  // 等待页面加载
  await page.waitForTimeout(2000);
  
  // 2. 点击第一个文档
  const firstDoc = page.locator('[class*="doc-card"]').first();
  if (await firstDoc.count() > 0) {
    await firstDoc.click();
    console.log('✅ 已打开第一个文档');
    await page.waitForTimeout(1000);
  }
  
  // 3. 在编辑器中输入多个段落
  const editor = page.locator('.ProseMirror');
  await editor.click();
  console.log('✅ 编辑器已聚焦');
  
  await editor.type('段落1');
  await page.keyboard.press('Enter');
  await editor.type('段落2');
  await page.keyboard.press('Enter');
  await editor.type('段落3');
  await page.keyboard.press('Enter');
  await editor.type('段落4');
  console.log('✅ 已输入4个段落');
  
  await page.waitForTimeout(1000);
  
  // 4. 获取所有段落
  const paragraphs = page.locator('.ProseMirror p');
  const count = await paragraphs.count();
  console.log(`📝 找到 ${count} 个段落`);
  
  // 5. 获取拖拽前的文本内容
  const textsBefore = [];
  for (let i = 0; i < count; i++) {
    const text = await paragraphs.nth(i).textContent();
    textsBefore.push(text);
  }
  console.log('📋 拖拽前顺序:', textsBefore);
  
  // 6. 查找拖拽手柄
  await page.waitForTimeout(500);
  const firstParagraph = paragraphs.nth(0);
  
  // 悬停到第一个段落，让拖拽手柄显示
  await firstParagraph.hover();
  console.log('🖱️  已悬停到第一个段落');
  await page.waitForTimeout(500);
  
  // 查找拖拽手柄
  const dragHandle = page.locator('.drag-handle').first();
  const handleVisible = await dragHandle.isVisible();
  console.log(`🎯 拖拽手柄可见: ${handleVisible}`);
  
  if (!handleVisible) {
    console.log('⚠️  拖拽手柄不可见，尝试查找其他手柄...');
    // 尝试查找飞书风格的手柄
    const feishuHandle = page.locator('[data-block-type]').first();
    if (await feishuHandle.count() > 0) {
      console.log('✅ 找到飞书手柄');
    }
  }
  
  // 7. 执行拖拽：拖动拖拽手柄
  console.log('🎯 开始拖拽...');
  
  // 获取拖拽手柄的位置
  const handleBox = await dragHandle.boundingBox();
  const thirdParagraph = paragraphs.nth(2);
  const thirdBox = await thirdParagraph.boundingBox();
  
  if (handleBox && thirdBox) {
    console.log(`📍 手柄位置: (${handleBox.x}, ${handleBox.y})`);
    console.log(`🎯 目标位置: (${thirdBox.x}, ${thirdBox.y + thirdBox.height})`);
    
    // 拖动手柄
    await dragHandle.hover();
    await page.waitForTimeout(200);
    await page.mouse.down();
    await page.waitForTimeout(300);
    
    // 移动到第三个段落下方
    await page.mouse.move(thirdBox.x + 50, thirdBox.y + thirdBox.height + 10, { steps: 20 });
    await page.waitForTimeout(300);
    
    await page.mouse.up();
    console.log('✅ 拖拽动作已完成');
    
    await page.waitForTimeout(1500);
    
    // 8. 验证拖拽后的顺序
    const textsAfter = [];
    for (let i = 0; i < count; i++) {
      const text = await paragraphs.nth(i).textContent();
      textsAfter.push(text);
    }
    console.log('📋 拖拽后顺序:', textsAfter);
    
    // 9. 比较结果
    if (JSON.stringify(textsBefore) === JSON.stringify(textsAfter)) {
      console.log('❌ 失败：顺序没有改变！');
      console.log('原因分析：');
      console.log('1. 检查 GlobalDragHandle 是否正确配置');
      console.log('2. 检查 data-type 属性是否存在');
      console.log('3. 检查拖拽手柄是否正确渲染');
      
      // 截图保存当前状态
      await page.screenshot({ path: 'drag-failed.png', fullPage: true });
      console.log('📸 已保存截图: drag-failed.png');
    } else {
      console.log('✅ 成功：顺序已改变！');
      await page.screenshot({ path: 'drag-success.png', fullPage: true });
      console.log('📸 已保存截图: drag-success.png');
    }
  } else {
    console.log('❌ 无法获取元素位置');
  }
  
  // 10. 检查 DOM 结构
  console.log('\n🔍 检查 DOM 结构:');
  const firstParagraphHTML = await firstParagraph.evaluate(el => el.outerHTML);
  console.log('第一个段落的 HTML:', firstParagraphHTML.substring(0, 200));
  
  const dataType = await firstParagraph.evaluate(el => {
    let parent = el.parentElement;
    while (parent && !parent.hasAttribute('data-type')) {
      parent = parent.parentElement;
      if (parent?.classList.contains('ProseMirror')) break;
    }
    return parent?.getAttribute('data-type') || '未找到';
  });
  console.log('data-type 属性:', dataType);
  
  await page.waitForTimeout(2000);
});
