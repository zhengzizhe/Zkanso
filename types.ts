
export type ViewMode = 'dashboard' | 'space' | 'doc' | 'trash';

export type Language = 'en' | 'zh';

export type Theme = 'light' | 'dark' | 'gradient' | 'paper' | 'warm' | 'slate' | 'snow' | 'cream' | 'mint' | 'rose' | 'midnight' | 'ocean' | 'forest' | 'ember' | 'purple' | 'charcoal';

export interface Space {
  id: string;
  name: string;
  icon: string; // Emoji or generic icon name
  color: string; // Tailwind color name like 'blue', 'purple'
}

export interface Collaborator {
  id: string;
  name: string;
  avatar: string;
  role: 'owner' | 'editor' | 'viewer';
}

export interface Doc {
  id: string;
  spaceId: string;
  parentId: string | null; // For nested folders/docs
  type: 'doc' | 'folder';
  title: string;
  content: any;
  lastModified: number;
  isFavorite: boolean;
  isLiked: boolean; // "Like" feature
  isShared: boolean; // "Shared" status
  isDeleted?: boolean; // Soft delete status
  deletedAt?: number; // When it was deleted
  coverImage?: string;
  tags?: string[];
  collaborators?: Collaborator[];
}

export interface Template {
  id: string;
  category: 'work' | 'personal' | 'education' | 'project';
  title: string;
  icon: string;
  content: string;
  color: string; // Tailwind bg class
}

export const TRANSLATIONS = {
  en: {
    recents: 'Recent',
    templates: 'Templates',
    spaces: 'Spaces',
    settings: 'Settings',
    search: 'Search docs...',
    searchPlaceholder: 'Search (Cmd+K)',
    newDoc: 'New Doc',
    noDocs: 'No documents found',
    createFirst: 'Create a new doc to get started',
    lastEdited: 'Last edited',
    aiThinking: 'AI is thinking...',
    addCover: 'Add Cover',
    untitled: 'Untitled Page',
    all: 'All',
    allDocs: 'All Documents',
    shared: 'Shared',
    sharedWithMe: 'Shared with me',
    favorites: 'Favorites',
    dailyReview: 'Review your day',
    manageContent: 'Manage content in',
    aiContinue: 'Continue Writing',
    aiSummarize: 'Summarize',
    aiPolish: 'Polish Text',
    folder: 'Folder',
    items: 'items',
    welcome: 'Good Morning, Creator',
    welcomeSub: 'Ready to shape the future?',
    backToHome: 'Back to Universe',
    calendar: 'Calendar',
    inbox: 'Inbox',
    collections: 'Collections',
    trash: 'Trash',
    emptyTrash: 'Empty Trash',
    restore: 'Restore',
    deleteForever: 'Delete Forever',
    trashEmpty: 'Trash is empty',
    trashEmptySub: 'Items moved to trash will appear here',
    moveToTrash: 'Move to Trash',
    spaceSettings: 'Space Settings',
    tags: 'Tags',
    spaceContent: 'Content',
    folders: 'Folders',
    userProfile: 'User Profile',
    logOut: 'Log Out',
    // Sidebar Tabs
    outline: 'Outline',
    tasks: 'Tasks',
    images: 'Images',
    files: 'Files',
    links: 'Links',
    noTasks: 'No tasks found',
    noImages: 'No images found',
    noFiles: 'No attachments',
    noLinks: 'No backlinks found',
    // Metadata
    metadata: 'Info',
    wordCount: 'Words',
    readTime: 'Read Time',
    created: 'Created',
    updated: 'Updated',
    backlinks: 'Linked By',
    // Share
    shareTitle: 'Share Document',
    inviteCollaborators: 'Invite collaborators',
    invitePlaceholder: 'Name or email',
    linkSharing: 'Link Sharing',
    linkAccess: 'Link Access',
    restricted: 'Restricted (Collaborators only)',
    anyone: 'Anyone with link',
    canView: 'Can view',
    canEdit: 'Can edit',
    copyLink: 'Copy Link',
    owner: 'Owner',
    remove: 'Remove',
    passwordProtection: 'Password Protection',
    setPassword: 'Set password',
    expiration: 'Expiration',
    setExpiration: 'Set expiration date',
    enterPassword: 'Enter access code',
    days: 'days',
    // Settings
    docSettings: 'Page Settings',
    changeIcon: 'Change Icon',
    changeCover: 'Change Cover',
    deleteDoc: 'Delete',
    rename: 'Rename',
    duplicate: 'Duplicate',
    exportMarkdown: 'Export Markdown',
    copyOf: 'Copy of',
    // Global Settings
    globalSettings: 'Global Settings',
    general: 'General',
    appearance: 'Appearance',
    theme: 'Theme',
    language: 'Language',
    light: 'Light',
    dark: 'Dark',
    gradient: 'Gradient',
    paper: 'Paper',
    warm: 'Warm',
    slate: 'Slate',
    selectLanguage: 'Select Language',
    // Editor & Slash Menu
    format: 'Format',
    typography: 'Typography',
    lists: 'Lists',
    insert: 'Insert',
    heading1: 'Heading 1',
    heading2: 'Heading 2',
    heading3: 'Heading 3',
    bulletList: 'Bullet List',
    numberedList: 'Numbered List',
    taskList: 'Task List',
    quote: 'Quote',
    codeBlock: 'Code Block',
    divider: 'Divider',
    image: 'Image',
    aiAssistant: 'AI Assistant',
    words: 'words',
    chars: 'chars',
    // New Features
    dailyNote: 'Daily Note',
    linkToDoc: 'Link to Document',
    pageWidth: 'Page Width',
    standardWidth: 'Standard',
    fullWidth: 'Full Width',
    // Templates
    templatesGallery: 'Template Gallery',
    useTemplate: 'Use Template',
    cat_work: 'Work',
    cat_personal: 'Personal',
    cat_education: 'Education',
    cat_project: 'Project',
    cat_all: 'All Templates',
    // Command Palette
    cmdPalette: 'Command Palette',
    cmdPlaceholder: 'Type a command or search...',
    cmdNoResults: 'No results found.',
    cmdActions: 'Actions',
    cmdNavigation: 'Navigation',
    cmdGoHome: 'Go to Dashboard',
    cmdCreateDoc: 'Create New Doc',
    cmdToggleTheme: 'Toggle Theme',
  },
  zh: {
    recents: '最近编辑',
    templates: '模板库',
    spaces: '我的空间',
    settings: '设置',
    search: '搜索文档...',
    searchPlaceholder: '搜索 (Cmd+K)',
    newDoc: '新建文档',
    noDocs: '暂无文档',
    createFirst: '创建第一个文档以开始',
    lastEdited: '上次编辑',
    aiThinking: 'AI 正在思考...',
    addCover: '添加封面',
    untitled: '无标题页面',
    all: '全部',
    allDocs: '全部文档',
    shared: '已共享',
    sharedWithMe: '与我共享',
    favorites: '收藏',
    dailyReview: '回顾你的一天',
    manageContent: '内容管理：',
    aiContinue: '继续写作',
    aiSummarize: '总结内容',
    aiPolish: '润色文本',
    folder: '文件夹',
    items: '项',
    welcome: '早安，创造者',
    welcomeSub: '准备好改变世界了吗？',
    backToHome: '返回宇宙首页',
    calendar: '日历',
    inbox: '收件箱',
    collections: '收藏集',
    trash: '回收站',
    emptyTrash: '清空回收站',
    restore: '恢复',
    deleteForever: '彻底删除',
    trashEmpty: '回收站是空的',
    trashEmptySub: '删除的项目将显示在这里',
    moveToTrash: '移至回收站',
    spaceSettings: '空间设置',
    tags: '标签',
    spaceContent: '空间内容',
    folders: '文件夹',
    userProfile: '用户资料',
    logOut: '退出登录',
    // Sidebar Tabs
    outline: '大纲',
    tasks: '任务',
    images: '图片',
    files: '附件',
    links: '引用',
    noTasks: '暂无任务',
    noImages: '暂无图片',
    noFiles: '暂无附件',
    noLinks: '暂无引用',
    // Metadata
    metadata: '信息',
    wordCount: '字数',
    readTime: '阅读时长',
    created: '创建时间',
    updated: '更新时间',
    backlinks: '被引用',
    // Share
    shareTitle: '分享文档',
    inviteCollaborators: '邀请协作者',
    invitePlaceholder: '输入姓名或邮箱',
    linkSharing: '链接分享',
    linkAccess: '链接权限',
    restricted: '仅限协作者可见',
    anyone: '获得链接的任何人',
    canView: '可阅读',
    canEdit: '可编辑',
    copyLink: '复制链接',
    owner: '拥有者',
    remove: '移除',
    passwordProtection: '密码保护',
    setPassword: '设置访问密码',
    expiration: '有效期',
    setExpiration: '设置过期时间',
    enterPassword: '输入密码',
    days: '天',
    // Settings
    docSettings: '页面设置',
    changeIcon: '更改图标',
    changeCover: '更改封面',
    deleteDoc: '删除页面',
    rename: '重命名',
    duplicate: '创建副本',
    exportMarkdown: '导出 Markdown',
    copyOf: '副本',
    // Global Settings
    globalSettings: '全局设置',
    general: '通用',
    appearance: '外观',
    theme: '主题',
    language: '语言',
    light: '浅色',
    dark: '深色',
    gradient: '极光',
    paper: '纸张',
    warm: '暖色',
    slate: '石板',
    selectLanguage: '选择语言',
    // Editor & Slash Menu
    format: '格式',
    typography: '排版',
    lists: '列表',
    insert: '插入',
    heading1: '一级标题',
    heading2: '二级标题',
    heading3: '三级标题',
    bulletList: '无序列表',
    numberedList: '有序列表',
    taskList: '任务列表',
    quote: '引用',
    codeBlock: '代码块',
    divider: '分割线',
    image: '图片',
    aiAssistant: 'AI 助手',
    words: '词',
    chars: '字符',
    // New Features
    dailyNote: '每日笔记',
    linkToDoc: '链接到文档',
    pageWidth: '页面宽度',
    standardWidth: '标准',
    fullWidth: '全宽',
    // Templates
    templatesGallery: '模板库',
    useTemplate: '使用模板',
    cat_work: '工作',
    cat_personal: '个人',
    cat_education: '教育',
    cat_project: '项目',
    cat_all: '所有模板',
    // Command Palette
    cmdPalette: '命令面板',
    cmdPlaceholder: '输入命令或搜索文档...',
    cmdNoResults: '未找到结果',
    cmdActions: '操作',
    cmdNavigation: '导航',
    cmdGoHome: '前往仪表盘',
    cmdCreateDoc: '新建文档',
    cmdToggleTheme: '切换主题',
  }
};