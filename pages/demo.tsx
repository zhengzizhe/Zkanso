import React from 'react';
import { TiptapEditor } from '../components/TiptapEditor';

const DemoPage: React.FC = () => {
  return (
    <div className="min-h-screen bg-gray-50 dark:bg-gray-900">
      <TiptapEditor
        docId="demo-document"
        onBack={() => window.history.back()}
        pageTitle="完整功能演示文档"
        spaceName="演示空间"
        collaborationUrl="ws://localhost:1234"
        onShare={() => alert('分享功能演示')}
      />
    </div>
  );
};

export default DemoPage;
