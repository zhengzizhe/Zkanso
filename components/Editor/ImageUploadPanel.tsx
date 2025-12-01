import React, { useState, useRef, useCallback } from 'react';
import { Editor } from '@tiptap/react';
import { X, Upload, Link as LinkIcon, Image as ImageIcon, Crop, RotateCw } from 'lucide-react';
import Cropper from 'react-easy-crop';
import { motion, AnimatePresence } from 'framer-motion';
import { animations, shadows, borderRadius, zIndex } from '../../utils/designSystem';

type Point = { x: number; y: number };
type Area = { x: number; y: number; width: number; height: number };

interface ImageUploadPanelProps {
  editor: Editor;
  onClose: () => void;
}

export const ImageUploadPanel: React.FC<ImageUploadPanelProps> = ({ editor, onClose }) => {
  const [imageUrl, setImageUrl] = useState('');
  const [imageAlt, setImageAlt] = useState('');
  const [imageTitle, setImageTitle] = useState('');
  const [activeTab, setActiveTab] = useState<'url' | 'upload'>('url');
  const [showCropper, setShowCropper] = useState(false);
  const [crop, setCrop] = useState<Point>({ x: 0, y: 0 });
  const [zoom, setZoom] = useState(1);
  const [rotation, setRotation] = useState(0);
  const [croppedAreaPixels, setCroppedAreaPixels] = useState<Area | null>(null);
  const [originalImage, setOriginalImage] = useState('');
  const fileInputRef = useRef<HTMLInputElement>(null);

  const onCropComplete = useCallback((croppedArea: Area, croppedAreaPixels: Area) => {
    setCroppedAreaPixels(croppedAreaPixels);
  }, []);

  const createImage = (url: string): Promise<HTMLImageElement> =>
    new Promise((resolve, reject) => {
      const image = new Image();
      image.addEventListener('load', () => resolve(image));
      image.addEventListener('error', (error) => reject(error));
      image.setAttribute('crossOrigin', 'anonymous');
      image.src = url;
    });

  const getCroppedImg = async (
    imageSrc: string,
    pixelCrop: Area,
    rotation = 0
  ): Promise<string> => {
    const image = await createImage(imageSrc);
    const canvas = document.createElement('canvas');
    const ctx = canvas.getContext('2d');

    if (!ctx) {
      throw new Error('No 2d context');
    }

    const maxSize = Math.max(image.width, image.height);
    const safeArea = 2 * ((maxSize / 2) * Math.sqrt(2));

    canvas.width = safeArea;
    canvas.height = safeArea;

    ctx.translate(safeArea / 2, safeArea / 2);
    ctx.rotate((rotation * Math.PI) / 180);
    ctx.translate(-safeArea / 2, -safeArea / 2);

    ctx.drawImage(
      image,
      safeArea / 2 - image.width * 0.5,
      safeArea / 2 - image.height * 0.5
    );

    const data = ctx.getImageData(0, 0, safeArea, safeArea);

    canvas.width = pixelCrop.width;
    canvas.height = pixelCrop.height;

    ctx.putImageData(
      data,
      Math.round(0 - safeArea / 2 + image.width * 0.5 - pixelCrop.x),
      Math.round(0 - safeArea / 2 + image.height * 0.5 - pixelCrop.y)
    );

    return canvas.toDataURL('image/jpeg');
  };

  const handleCropConfirm = async () => {
    if (!croppedAreaPixels || !originalImage) return;
    
    try {
      const croppedImage = await getCroppedImg(originalImage, croppedAreaPixels, rotation);
      setImageUrl(croppedImage);
      setShowCropper(false);
    } catch (e) {
      console.error('裁剪失败:', e);
    }
  };

  const handleInsert = () => {
    if (!imageUrl.trim()) return;

    const content = editor.schema.nodes.customImage 
      ? {
          type: 'customImage',
          attrs: { 
            src: imageUrl, 
            alt: imageAlt || '图片', 
            title: imageTitle,
            align: 'center' 
          },
        }
      : {
          type: 'paragraph',
          content: [
            {
              type: 'image',
              attrs: { src: imageUrl, alt: imageAlt, title: imageTitle },
            },
          ],
        };

    editor.chain().focus().insertContent(content).run();
    onClose();
  };

  const handleFileChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (file) {
      const reader = new FileReader();
      reader.onload = (event) => {
        const result = event.target?.result as string;
        setOriginalImage(result);
        setImageUrl(result);
        setImageAlt(file.name);
        setShowCropper(true);
      };
      reader.readAsDataURL(file);
    }
  };

  const handleUrlLoad = () => {
    if (imageUrl && activeTab === 'url') {
      setOriginalImage(imageUrl);
      setShowCropper(true);
    }
  };

  return (
    <AnimatePresence>
      <motion.div
        {...animations.variants.overlay}
        transition={animations.transition.fast}
        className="fixed inset-0 bg-black/50 flex items-center justify-center"
        style={{ zIndex: zIndex.modal }}
        onClick={onClose}
      >
        <motion.div
          {...animations.variants.modal}
          transition={animations.transition.normal}
          className="bg-white dark:bg-gray-800 rounded-xl w-[500px] max-w-[90vw]"
          style={{
            boxShadow: shadows['2xl'],
            borderRadius: borderRadius.xl,
          }}
          onClick={(e) => e.stopPropagation()}
        >
        {/* 头部 */}
        <div className="flex items-center justify-between px-6 py-4 border-b border-gray-200 dark:border-gray-700">
          <h3 className="text-lg font-semibold text-gray-900 dark:text-gray-100">插入图片</h3>
          <button
            onClick={onClose}
            className="p-1 hover:bg-gray-100 dark:hover:bg-gray-700 rounded transition-colors"
          >
            <X className="w-5 h-5 text-gray-500" />
          </button>
        </div>

        {/* 标签页 */}
        <div className="flex border-b border-gray-200 dark:border-gray-700">
          <button
            onClick={() => setActiveTab('url')}
            className={`flex-1 px-6 py-3 text-sm font-medium transition-colors ${
              activeTab === 'url'
                ? 'text-indigo-600 border-b-2 border-indigo-600'
                : 'text-gray-500 hover:text-gray-700'
            }`}
          >
            <LinkIcon className="w-4 h-4 inline mr-2" />
            URL 链接
          </button>
          <button
            onClick={() => setActiveTab('upload')}
            className={`flex-1 px-6 py-3 text-sm font-medium transition-colors ${
              activeTab === 'upload'
                ? 'text-indigo-600 border-b-2 border-indigo-600'
                : 'text-gray-500 hover:text-gray-700'
            }`}
          >
            <Upload className="w-4 h-4 inline mr-2" />
            上传文件
          </button>
        </div>

        {/* 内容区 */}
        <div className="p-6 space-y-4">
          {showCropper && originalImage ? (
            /* 裁剪界面 */
            <div>
              <div className="relative h-[400px] bg-black rounded-lg overflow-hidden">
                <Cropper
                  image={originalImage}
                  crop={crop}
                  zoom={zoom}
                  rotation={rotation}
                  aspect={4 / 3}
                  onCropChange={setCrop}
                  onZoomChange={setZoom}
                  onRotationChange={setRotation}
                  onCropComplete={onCropComplete}
                />
              </div>
              
              {/* 裁剪控制 */}
              <div className="mt-4 space-y-3">
                <div>
                  <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-2">
                    缩放
                  </label>
                  <input
                    type="range"
                    min={1}
                    max={3}
                    step={0.1}
                    value={zoom}
                    onChange={(e) => setZoom(Number(e.target.value))}
                    className="w-full"
                  />
                </div>
                <div>
                  <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-2">
                    旋转
                  </label>
                  <div className="flex items-center gap-2">
                    <input
                      type="range"
                      min={0}
                      max={360}
                      step={1}
                      value={rotation}
                      onChange={(e) => setRotation(Number(e.target.value))}
                      className="flex-1"
                    />
                    <button
                      onClick={() => setRotation((rotation + 90) % 360)}
                      className="p-2 hover:bg-gray-100 dark:hover:bg-gray-700 rounded transition-colors"
                    >
                      <RotateCw className="w-4 h-4" />
                    </button>
                  </div>
                </div>
              </div>
              
              {/* 裁剪按钮 */}
              <div className="flex gap-2 mt-4">
                <button
                  onClick={() => {
                    setShowCropper(false);
                    setImageUrl('');
                    setOriginalImage('');
                  }}
                  className="flex-1 px-4 py-2 text-sm font-medium text-gray-700 dark:text-gray-300 bg-gray-100 dark:bg-gray-700 hover:bg-gray-200 dark:hover:bg-gray-600 rounded-lg transition-colors"
                >
                  取消裁剪
                </button>
                <button
                  onClick={handleCropConfirm}
                  className="flex-1 px-4 py-2 text-sm font-medium text-white bg-indigo-600 hover:bg-indigo-700 rounded-lg transition-colors"
                >
                  确认裁剪
                </button>
              </div>
            </div>
          ) : activeTab === 'url' ? (
            <>
              <div>
                <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-2">
                  图片地址 *
                </label>
                <input
                  type="text"
                  value={imageUrl}
                  onChange={(e) => setImageUrl(e.target.value)}
                  placeholder="https://example.com/image.jpg"
                  className="w-full px-3 py-2 border border-gray-300 dark:border-gray-600 rounded-lg focus:ring-2 focus:ring-indigo-500 focus:border-transparent dark:bg-gray-700 dark:text-white"
                  autoFocus
                />
              </div>
              <div>
                <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-2">
                  图片描述
                </label>
                <input
                  type="text"
                  value={imageAlt}
                  onChange={(e) => setImageAlt(e.target.value)}
                  placeholder="图片的描述文字"
                  className="w-full px-3 py-2 border border-gray-300 dark:border-gray-600 rounded-lg focus:ring-2 focus:ring-indigo-500 focus:border-transparent dark:bg-gray-700 dark:text-white"
                />
              </div>
              <div>
                <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-2">
                  图片标题
                </label>
                <input
                  type="text"
                  value={imageTitle}
                  onChange={(e) => setImageTitle(e.target.value)}
                  placeholder="显示在图片下方的标题"
                  className="w-full px-3 py-2 border border-gray-300 dark:border-gray-600 rounded-lg focus:ring-2 focus:ring-indigo-500 focus:border-transparent dark:bg-gray-700 dark:text-white"
                />
              </div>
              <div>
                <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-2">
                  图片标题
                </label>
                <input
                  type="text"
                  value={imageTitle}
                  onChange={(e) => setImageTitle(e.target.value)}
                  placeholder="显示在图片下方的标题"
                  className="w-full px-3 py-2 border border-gray-300 dark:border-gray-600 rounded-lg focus:ring-2 focus:ring-indigo-500 focus:border-transparent dark:bg-gray-700 dark:text-white"
                />
              </div>
              
              {/* 裁剪按钮 */}
              {imageUrl && (
                <button
                  onClick={handleUrlLoad}
                  className="w-full flex items-center justify-center gap-2 px-4 py-2 text-sm font-medium text-indigo-600 dark:text-indigo-400 bg-indigo-50 dark:bg-indigo-900/30 hover:bg-indigo-100 dark:hover:bg-indigo-900/50 rounded-lg transition-colors"
                >
                  <Crop className="w-4 h-4" />
                  裁剪图片
                </button>
              )}
            </>
          ) : (
            <div>
              <input
                ref={fileInputRef}
                type="file"
                accept="image/*"
                onChange={handleFileChange}
                className="hidden"
              />
              <div
                onClick={() => fileInputRef.current?.click()}
                className="border-2 border-dashed border-gray-300 dark:border-gray-600 rounded-lg p-8 text-center cursor-pointer hover:border-indigo-500 transition-colors"
              >
                <ImageIcon className="w-12 h-12 mx-auto mb-4 text-gray-400" />
                <p className="text-sm text-gray-600 dark:text-gray-400 mb-2">
                  点击选择图片文件
                </p>
                <p className="text-xs text-gray-400">支持 JPG、PNG、GIF 等格式</p>
              </div>
              {imageUrl && !showCropper && (
                <div className="mt-4">
                  <img src={imageUrl} alt="预览" className="max-h-48 mx-auto rounded-lg" />
                  <button
                    onClick={() => setShowCropper(true)}
                    className="w-full mt-2 flex items-center justify-center gap-2 px-4 py-2 text-sm font-medium text-indigo-600 dark:text-indigo-400 bg-indigo-50 dark:bg-indigo-900/30 hover:bg-indigo-100 dark:hover:bg-indigo-900/50 rounded-lg transition-colors"
                  >
                    <Crop className="w-4 h-4" />
                    重新裁剪
                  </button>
                </div>
              )}
            </div>
          )}

          {/* URL 预览 */}
          {imageUrl && !showCropper && activeTab === 'url' && (
            <div className="border border-gray-200 dark:border-gray-700 rounded-lg p-4">
              <p className="text-xs text-gray-500 mb-2">预览</p>
              <img 
                src={imageUrl} 
                alt={imageAlt} 
                className="max-h-32 mx-auto rounded" 
                onError={(e) => {
                  (e.target as HTMLImageElement).style.display = 'none';
                }}
              />
            </div>
          )}
        </div>

        {/* 底部按钮 */}
        <div className="flex items-center justify-end gap-3 px-6 py-4 border-t border-gray-200 dark:border-gray-700 bg-gray-50 dark:bg-gray-900/50">
          <button
            onClick={onClose}
            className="px-4 py-2 text-sm font-medium text-gray-700 dark:text-gray-300 hover:bg-gray-100 dark:hover:bg-gray-700 rounded-lg transition-colors"
          >
            取消
          </button>
          <button
            onClick={handleInsert}
            disabled={!imageUrl.trim()}
            className="px-4 py-2 text-sm font-medium text-white bg-indigo-600 hover:bg-indigo-700 disabled:bg-gray-300 disabled:cursor-not-allowed rounded-lg transition-colors"
          >
            插入图片
          </button>
        </div>
        </motion.div>
      </motion.div>
    </AnimatePresence>
  );
};
