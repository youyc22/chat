<!DOCTYPE html>
<html lang="en">
<head>
    <meta charset="UTF-8">
    <meta name="viewport" content="width=device-width, initial-scale=1.0">
    <title>ChatYYC - AI Chat Interface</title>
    <style>
        body {
            font-family: -apple-system, BlinkMacSystemFont, 'Segoe UI', 'Noto Sans', Helvetica, Arial, sans-serif;
            line-height: 1.6;
            max-width: 1000px;
            margin: 0 auto;
            padding: 20px;
            color: #24292f;
            background-color: #ffffff;
        }
        
        .language-switcher {
            position: fixed;
            top: 20px;
            right: 20px;
            z-index: 1000;
            background: #0969da;
            border: none;
            border-radius: 8px;
            padding: 8px 16px;
            color: white;
            cursor: pointer;
            font-weight: 500;
            box-shadow: 0 1px 3px rgba(0,0,0,0.12);
            transition: all 0.2s ease;
        }
        
        .language-switcher:hover {
            background: #0860ca;
            transform: translateY(-1px);
            box-shadow: 0 2px 6px rgba(0,0,0,0.15);
        }
        
        .content {
            display: none;
        }
        
        .content.active {
            display: block;
        }
        
        h1 {
            border-bottom: 1px solid #d1d9e0;
            padding-bottom: 10px;
            color: #24292f;
        }
        
        h2 {
            margin-top: 24px;
            margin-bottom: 16px;
            color: #24292f;
        }
        
        code {
            background-color: #f6f8fa;
            border-radius: 6px;
            padding: 2px 6px;
            font-family: ui-monospace, SFMono-Regular, "SF Mono", Consolas, "Liberation Mono", Menlo, monospace;
        }
        
        pre {
            background-color: #f6f8fa;
            border-radius: 6px;
            padding: 16px;
            overflow-x: auto;
        }
        
        a {
            color: #0969da;
            text-decoration: none;
        }
        
        a:hover {
            text-decoration: underline;
        }
        
        .badge {
            display: inline-block;
            padding: 4px 8px;
            background-color: #0969da;
            color: white;
            border-radius: 4px;
            font-size: 12px;
            font-weight: 500;
            margin-right: 8px;
        }
        
        .demo-link {
            background: linear-gradient(135deg, #667eea 0%, #764ba2 100%);
            color: white;
            padding: 12px 24px;
            border-radius: 8px;
            display: inline-block;
            font-weight: 500;
            margin: 16px 0;
            box-shadow: 0 2px 4px rgba(0,0,0,0.1);
            transition: transform 0.2s ease;
        }
        
        .demo-link:hover {
            transform: translateY(-2px);
            color: white;
            text-decoration: none;
        }
        
        .feature-list {
            background-color: #f6f8fa;
            border-radius: 8px;
            padding: 16px;
            margin: 16px 0;
        }
        
        .todo-list {
            background-color: #fff8dc;
            border-radius: 8px;
            padding: 16px;
            margin: 16px 0;
            border-left: 4px solid #f59e0b;
        }
        
        .preview-image {
            max-width: 100%;
            border-radius: 8px;
            box-shadow: 0 4px 12px rgba(0,0,0,0.1);
            margin: 16px 0;
        }
        
        .deployment-steps {
            background-color: #f0f9ff;
            border-radius: 8px;
            padding: 16px;
            margin: 16px 0;
            border-left: 4px solid #0969da;
        }
    </style>
</head>
<body>
    <button class="language-switcher" onclick="toggleLanguage()" id="langToggle">中文</button>
    
    <!-- English Content -->
    <div id="en-content" class="content active">
        <h1>🚀 ChatYYC - AI Chat Interface</h1>
        <p><span class="badge">Entertainment Only</span> A beautiful web-based AI chat interface</p>
        
        <div class="feature-list">
            <h2>✨ Features</h2>
            <p>Built upon the foundation from <a href="https://b23.tv/rnkbX2V" target="_blank">Bilibili video</a>, with the following enhancements:</p>
            <ul>
                <li><strong>Streaming Output</strong> - Real-time response streaming</li>
                <li><strong>Multi-turn Conversations</strong> - Contextual dialogue support</li>
                <li><strong>Beautiful UI</strong> - Enhanced user interface design</li>
                <li><strong>Qwen Series Integration</strong> - Added Qwen model APIs</li>
                <li><strong>API Key Management</strong> - Secure key management window</li>
                <li><strong>Chat History</strong> - Save and retrieve conversation history</li>
            </ul>
        </div>
        
        <div class="todo-list">
            <h2>📋 TODO</h2>
            <ul>
                <li>Model-to-model conversations</li>
                <li>Context limit warnings & server busy alerts</li>
                <li>Integration with more AI models</li>
                <li>Multiple nodes for different platform API keys</li>
            </ul>
        </div>
        
        <h2>🎯 Live Demo</h2>
        <a href="https://youyc22.github.io/ChatYYC" target="_blank" class="demo-link">
            Try ChatYYC Now →
        </a>
        
        <h2>📅 Update History</h2>
        <p><strong>April 4th:</strong> Added hunyuan-t1 model interface; Enhanced chat box with code rendering and copy functionality; Reorganized repository file structure</p>
        
        <h2>🖼️ Preview</h2>
        <img src="https://github.com/user-attachments/assets/7e0e6b1b-a47d-4276-8148-7c4b9ca580f4" alt="ChatYYC Preview" class="preview-image">
        
        <h2>🔑 About API Keys</h2>
        <p>Get your API keys from these platforms:</p>
        <ul>
            <li><strong>DeepSeek:</strong> <a href="https://platform.deepseek.com/" target="_blank">https://platform.deepseek.com/</a></li>
            <li><strong>Qwen Series:</strong> <a href="https://help.aliyun.com/zh/model-studio/developer-reference/use-qwen-by-calling-api" target="_blank">Alibaba Cloud Model Studio</a></li>
        </ul>
        
        <div class="deployment-steps">
            <h2>🚀 Deployment Guide</h2>
            <p><strong>GitHub Pages Deployment:</strong></p>
            <p>Detailed tutorial: <a href="https://blog.csdn.net/qq_20042935/article/details/133920722" target="_blank">GitHub Pages Setup Guide</a></p>
            <ol>
                <li>Fork this repository</li>
                <li>Go to repository Settings → Pages</li>
                <li>Select source branch (usually <code>main</code> or <code>gh-pages</code>)</li>
                <li>Wait a few seconds for deployment</li>
                <li>Access your site at: <code>https://&lt;your-username&gt;.github.io/dpsk/</code></li>
            </ol>
            <img src="https://github.com/user-attachments/assets/e53b7c84-02ec-4a29-aedb-af1450ed8d9e" alt="GitHub Pages Setup" style="max-width: 100%; margin-top: 16px; border-radius: 6px;">
        </div>
        
        <h2>⭐ Star History</h2>
        <p>If you find this project helpful, please consider giving it a star!</p>
        
        <hr style="margin: 32px 0; border: none; border-top: 1px solid #d1d9e0;">
        <p align="center">
            <strong>Made with ❤️ for the AI community</strong><br>
            <small>For entertainment and educational purposes only</small>
        </p>
    </div>
    
    <!-- Chinese Content -->
    <div id="zh-content" class="content">
        <h1>🚀 仅供娱乐的小网站</h1>
        <p><span class="badge">娱乐专用</span> 一个精美的网页端AI聊天界面</p>
        
        <div class="feature-list">
            <h2>✨ 功能特色</h2>
            <p>在 <a href="https://b23.tv/rnkbX2V" target="_blank">B站视频</a> 的基础上，增加了以下功能：</p>
            <ul>
                <li><strong>流式输出</strong> - 实时响应流</li>
                <li><strong>多轮对话</strong> - 支持上下文对话</li>
                <li><strong>美化UI</strong> - 增强用户界面设计</li>
                <li><strong>Qwen系列接口</strong> - 集成Qwen模型API</li>
                <li><strong>API key管理窗口</strong> - 安全的密钥管理</li>
                <li><strong>聊天记录保存</strong> - 保存和检索对话历史</li>
            </ul>
        </div>
        
        <div class="todo-list">
            <h2>📋 待办事项</h2>
            <ul>
                <li>两个模型之间对话</li>
                <li>超出上下文限制警告、服务器繁忙等警告</li>
                <li>接入更多模型</li>
                <li>增加更多节点以支持不同平台的api key</li>
            </ul>
        </div>
        
        <h2>🎯 在线体验</h2>
        <a href="https://youyc22.github.io/ChatYYC" target="_blank" class="demo-link">
            立即试用 ChatYYC →
        </a>
        
        <h2>📅 更新历史</h2>
        <p><strong>4月4日:</strong> 增加hunyuan-t1模型接口；聊天框增加代码渲染框、代码复制功能；整理仓库文件结构</p>
        
        <h2>🖼️ 预览</h2>
        <img src="https://github.com/user-attachments/assets/7e0e6b1b-a47d-4276-8148-7c4b9ca580f4" alt="ChatYYC 预览" class="preview-image">
        
        <h2>🔑 关于 API Key</h2>
        <p>从以下平台获取您的API密钥：</p>
        <ul>
            <li><strong>DeepSeek API平台:</strong> <a href="https://platform.deepseek.com/" target="_blank">https://platform.deepseek.com/</a></li>
            <li><strong>Qwen系列API平台:</strong> <a href="https://help.aliyun.com/zh/model-studio/developer-reference/use-qwen-by-calling-api" target="_blank">阿里云模型工作室</a></li>
        </ul>
        
        <div class="deployment-steps">
            <h2>🚀 部署方式</h2>
            <p><strong>GitHub网页部署:</strong></p>
            <p>详细方式: <a href="https://blog.csdn.net/qq_20042935/article/details/133920722" target="_blank">GitHub Pages部署教程</a></p>
            <ol>
                <li>Fork本仓库</li>
                <li>进入仓库设置 → Pages</li>
                <li>选择源分支（通常是 <code>main</code> 或 <code>gh-pages</code>）</li>
                <li>等待几秒钟部署完成</li>
                <li>访问您的网站: <code>https://&lt;你的用户名&gt;.github.io/dpsk/</code></li>
            </ol>
            <img src="https://github.com/user-attachments/assets/e53b7c84-02ec-4a29-aedb-af1450ed8d9e" alt="GitHub Pages 设置" style="max-width: 100%; margin-top: 16px; border-radius: 6px;">
        </div>
        
        <h2>⭐ Star 历史</h2>
        <p>如果这个项目对您有帮助，请考虑给它一个 star！</p>
        
        <hr style="margin: 32px 0; border: none; border-top: 1px solid #d1d9e0;">
        <p align="center">
            <strong>用 ❤️ 为AI社区制作</strong><br>
            <small>仅供娱乐和教育目的</small>
        </p>
    </div>
    
    <script>
        let currentLang = 'en';
        
        function toggleLanguage() {
            const enContent = document.getElementById('en-content');
            const zhContent = document.getElementById('zh-content');
            const langToggle = document.getElementById('langToggle');
            
            if (currentLang === 'en') {
                enContent.classList.remove('active');
                zhContent.classList.add('active');
                langToggle.textContent = 'English';
                currentLang = 'zh';
                document.documentElement.lang = 'zh-CN';
            } else {
                zhContent.classList.remove('active');
                enContent.classList.add('active');
                langToggle.textContent = '中文';
                currentLang = 'en';
                document.documentElement.lang = 'en';
            }
            
            // Save language preference
            localStorage.setItem('preferred-language', currentLang);
        }
        
        // Load saved language preference or default to English
        document.addEventListener('DOMContentLoaded', function() {
            const savedLang = localStorage.getItem('preferred-language');
            if (savedLang && savedLang === 'zh') {
                toggleLanguage();
            }
        });
        
        // Smooth scrolling for anchor links
        document.querySelectorAll('a[href^="#"]').forEach(anchor => {
            anchor.addEventListener('click', function (e) {
                e.preventDefault();
                const target = document.querySelector(this.getAttribute('href'));
                if (target) {
                    target.scrollIntoView({
                        behavior: 'smooth',
                        block: 'start'
                    });
                }
            });
        });
    </script>
</body>
</html>
