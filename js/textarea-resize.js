// textarea-resize.js
// 处理文本框自动调整高度

/**
 * 初始化文本框自动调整高度功能
 */
export function initTextareaResize() {
    const textarea = document.getElementById('chat-input');
    if (!textarea) return;
    
    // 设置初始默认高度
    setDefaultHeight(textarea);
    
    // 添加输入事件监听器
    textarea.addEventListener('input', function() {
        adjustTextareaHeight(this);
    });
    
    // 在窗口大小变化时重新调整
    window.addEventListener('resize', function() {
        adjustTextareaHeight(textarea);
    });
    
    // 添加键盘事件监听器，处理Enter键发送消息
    textarea.addEventListener('keydown', function(event) {
        // 当按下Enter键且未按下Shift键时，发送消息
        if (event.key === 'Enter' && !event.shiftKey) {
            event.preventDefault();
            sendMessage();
        }
        
        // 当按下Enter键且按下Shift键时，插入换行符
        if (event.key === 'Enter' && event.shiftKey) {
            // 正常行为，textarea会自动添加换行符
            adjustTextareaHeight(this);
        }
    });
}

/**
 * 调整文本框高度以适应内容
 * @param {HTMLTextAreaElement} textarea - 要调整的文本框元素
 */
/**
 * 设置文本框的默认高度
 * @param {HTMLTextAreaElement} textarea - 要设置默认高度的文本框元素
 */
function setDefaultHeight(textarea) {
    // 设置默认高度为21px (与CSS中定义的一致)
    const defaultHeight = 21;
    textarea.style.height = defaultHeight + 'px';
}

/**
 * 调整文本框高度以适应内容
 * @param {HTMLTextAreaElement} textarea - 要调整的文本框元素
 */
function adjustTextareaHeight(textarea) {
    // 记住滚动位置
    const scrollPos = window.scrollY;
    
    // 重置高度以准确计算
    textarea.style.height = 'auto';
    
    // 设置新高度
    const newHeight = Math.min(textarea.scrollHeight, 100);
    
    // 不让高度小于默认高度
    const finalHeight = Math.max(newHeight, 21);
    textarea.style.height = finalHeight + 'px';
    
    // 恢复滚动位置
    window.scrollTo(0, scrollPos);
}