'use client';

import { useEffect, useMemo, useRef, useState } from 'react';
import { EditorContent, useEditor } from '@tiptap/react';
import StarterKit from '@tiptap/starter-kit';
import Placeholder from '@tiptap/extension-placeholder';
import Underline from '@tiptap/extension-underline';
import Highlight from '@tiptap/extension-highlight';
import TextAlign from '@tiptap/extension-text-align';
import Link from '@tiptap/extension-link';
import { ResizableImage } from './ResizableImage';
import {
  FaAlignCenter,
  FaAlignJustify,
  FaAlignLeft,
  FaAlignRight,
  FaEraser,
  FaBold,
  FaCode,
  FaLevelDownAlt,
  FaHeading,
  FaHighlighter,
  FaItalic,
  FaLink,
  FaParagraph,
  FaListOl,
  FaListUl,
  FaQuoteRight,
  FaRedo,
  FaStrikethrough,
  FaUnlink,
  FaUnderline,
  FaUndo,
  FaImage,
  FaMinus,
} from 'react-icons/fa';

type TipTapEditorProps = {
  value: string;
  onChange: (html: string) => void;
  placeholder?: string;
};

function ToolbarButton({
  onClick,
  active,
  title,
  children,
}: {
  onClick: () => void;
  active?: boolean;
  title: string;
  children: React.ReactNode;
}) {
  return (
    <button
      type="button"
      onMouseDown={(event) => event.preventDefault()}
      onClick={onClick}
      title={title}
      className={`inline-flex items-center justify-center rounded-xl border px-3 py-2 text-sm transition ${active
        ? 'border-cyan-400 bg-cyan-400 text-slate-950'
        : 'border-white/10 bg-white/5 text-slate-200 hover:border-white/20 hover:bg-white/10 hover:text-white'
        }`}
    >
      {children}
    </button>
  );
}

export default function TipTapEditor({ value, onChange, placeholder = 'Write the blog content here...' }: TipTapEditorProps) {
  const [linkUrl, setLinkUrl] = useState('');
  const [showLinkDialog, setShowLinkDialog] = useState(false);
  const imageInputRef = useRef<HTMLInputElement | null>(null);
  
  const extensions = useMemo(
    () => [
      StarterKit.configure({
        heading: {
          levels: [1, 2, 3],
        },
        link: false,
        underline: false,
      }),
      Underline,
      Highlight,
      Link.configure({
        openOnClick: false,
        autolink: true,
        linkOnPaste: true,
        HTMLAttributes: {
          class: 'text-cyan-300 underline underline-offset-4',
        },
      }),
      ResizableImage.configure({
        inline: false,
        allowBase64: true,
        HTMLAttributes: {
          class: 'rounded-2xl border border-white/10',
        },
      }),
      TextAlign.configure({
        types: ['heading', 'paragraph'],
      }),
      Placeholder.configure({
        placeholder,
      }),
    ],
    [placeholder],
  );

  const editor = useEditor({
    extensions,
    content: value,
    editorProps: {
      attributes: {
        class:
          'tiptap-editor min-h-[28rem] w-full rounded-[1.5rem] bg-slate-950/60 px-4 py-4 text-sm leading-7 text-slate-100 outline-none sm:px-5 sm:py-5',
      },
    },
    onUpdate: ({ editor: currentEditor }) => {
      onChange(currentEditor.getHTML());
    },
  });

  useEffect(() => {
    if (!editor) return;

    const currentHTML = editor.getHTML();
    if (value !== currentHTML) {
      editor.commands.setContent(value, { emitUpdate: false });
    }
  }, [editor, value]);

  const setLink = () => {
    if (!editor) return;
    const previousUrl = editor.getAttributes('link').href as string | undefined;
    setLinkUrl(previousUrl || 'https://');
    setShowLinkDialog(true);
  };

  const confirmLink = () => {
    if (!editor) return;

    const trimmedUrl = linkUrl.trim();

    if (!trimmedUrl) {
      editor.chain().focus().extendMarkRange('link').unsetLink().run();
    } else {
      editor.chain().focus().extendMarkRange('link').setLink({ href: trimmedUrl }).run();
    }

    setShowLinkDialog(false);
    setLinkUrl('');
  };

  const insertImage = () => {
    if (!editor) return;
    imageInputRef.current?.click();
  };

  const handleImageUpload = async (event: React.ChangeEvent<HTMLInputElement>) => {
    if (!editor) return;
    const file = event.target.files?.[0];

    if (!file) {
      event.target.value = '';
      return;
    }

    const reader = new FileReader();

    reader.onload = () => {
      const result = reader.result;

      if (typeof result === 'string') {
        editor.chain().focus().setImage({ src: result }).run();
      }

      event.target.value = '';
    };

    reader.readAsDataURL(file);
  };

  const clearFormatting = () => {
    if (!editor) return;

    editor.chain().focus().unsetAllMarks().clearNodes().run();
  };

  const setParagraph = () => {
    if (!editor) return;

    editor.chain().focus().setParagraph().run();
  };

  const insertHardBreak = () => {
    if (!editor) return;

    editor.chain().focus().setHardBreak().run();
  };

  const removeLink = () => {
    if (!editor) return;

    editor.chain().focus().extendMarkRange('link').unsetLink().run();
  };

  if (!editor) {
    return <div className="min-h-[28rem] rounded-[1.5rem] border border-white/10 bg-slate-950/60 p-4 text-sm text-slate-500">Loading editor...</div>;
  }

  const buttons: Array<{ key: string; title: string; icon: React.ReactNode; onClick: () => void; active?: boolean }> = [
    { key: 'undo', title: 'Undo', icon: <FaUndo />, onClick: () => editor.chain().focus().undo().run() },
    { key: 'redo', title: 'Redo', icon: <FaRedo />, onClick: () => editor.chain().focus().redo().run() },
    { key: 'paragraph', title: 'Paragraph', icon: <FaParagraph />, onClick: setParagraph, active: editor.isActive('paragraph') },
    { key: 'divider1', title: 'Divider', icon: <FaMinus />, onClick: () => editor.chain().focus().setHorizontalRule().run() },
    { key: 'bold', title: 'Bold', icon: <FaBold />, onClick: () => editor.chain().focus().toggleBold().run(), active: editor.isActive('bold') },
    { key: 'italic', title: 'Italic', icon: <FaItalic />, onClick: () => editor.chain().focus().toggleItalic().run(), active: editor.isActive('italic') },
    { key: 'underline', title: 'Underline', icon: <FaUnderline />, onClick: () => editor.chain().focus().toggleUnderline().run(), active: editor.isActive('underline') },
    { key: 'strike', title: 'Strike', icon: <FaStrikethrough />, onClick: () => editor.chain().focus().toggleStrike().run(), active: editor.isActive('strike') },
    { key: 'clear', title: 'Clear formatting', icon: <FaEraser />, onClick: clearFormatting },
    { key: 'highlight', title: 'Highlight', icon: <FaHighlighter />, onClick: () => editor.chain().focus().toggleHighlight().run(), active: editor.isActive('highlight') },
    { key: 'heading1', title: 'Heading 1', icon: <FaHeading className="text-xs" />, onClick: () => editor.chain().focus().toggleHeading({ level: 1 }).run(), active: editor.isActive('heading', { level: 1 }) },
    { key: 'heading2', title: 'Heading 2', icon: <FaHeading className="text-[10px]" />, onClick: () => editor.chain().focus().toggleHeading({ level: 2 }).run(), active: editor.isActive('heading', { level: 2 }) },
    { key: 'heading3', title: 'Heading 3', icon: <FaHeading className="text-[8px]" />, onClick: () => editor.chain().focus().toggleHeading({ level: 3 }).run(), active: editor.isActive('heading', { level: 3 }) },
    { key: 'bullet', title: 'Bullet list', icon: <FaListUl />, onClick: () => editor.chain().focus().toggleBulletList().run(), active: editor.isActive('bulletList') },
    { key: 'ordered', title: 'Ordered list', icon: <FaListOl />, onClick: () => editor.chain().focus().toggleOrderedList().run(), active: editor.isActive('orderedList') },
    { key: 'blockquote', title: 'Blockquote', icon: <FaQuoteRight />, onClick: () => editor.chain().focus().toggleBlockquote().run(), active: editor.isActive('blockquote') },
    { key: 'code', title: 'Code block', icon: <FaCode />, onClick: () => editor.chain().focus().toggleCodeBlock().run(), active: editor.isActive('codeBlock') },
    { key: 'hardbreak', title: 'Line break', icon: <FaLevelDownAlt />, onClick: insertHardBreak },
    { key: 'left', title: 'Align left', icon: <FaAlignLeft />, onClick: () => editor.chain().focus().setTextAlign('left').run(), active: editor.isActive({ textAlign: 'left' }) },
    { key: 'center', title: 'Align center', icon: <FaAlignCenter />, onClick: () => editor.chain().focus().setTextAlign('center').run(), active: editor.isActive({ textAlign: 'center' }) },
    { key: 'right', title: 'Align right', icon: <FaAlignRight />, onClick: () => editor.chain().focus().setTextAlign('right').run(), active: editor.isActive({ textAlign: 'right' }) },
    { key: 'justify', title: 'Justify', icon: <FaAlignJustify />, onClick: () => editor.chain().focus().setTextAlign('justify').run(), active: editor.isActive({ textAlign: 'justify' }) },
    { key: 'link', title: 'Link', icon: <FaLink />, onClick: setLink, active: editor.isActive('link') },
    { key: 'unlink', title: 'Remove link', icon: <FaUnlink />, onClick: removeLink },
    { key: 'image', title: 'Image', icon: <FaImage />, onClick: insertImage },
  ];

  return (
    <div className="space-y-3 rounded-[1.5rem] border border-white/10 bg-slate-950/40 p-3 md:p-4">
      <div className="flex flex-wrap gap-2 rounded-[1.25rem] border border-white/10 bg-white/5 p-2">
        {buttons.map((button) => (
          <ToolbarButton key={button.key} onClick={button.onClick} active={button.active} title={button.title}>
            {button.icon}
          </ToolbarButton>
        ))}

        <div className="ml-auto flex items-center gap-2 text-xs text-slate-400">
          <span className="rounded-full border border-white/10 bg-white/5 px-3 py-1">TipTap</span>
          <span className="rounded-full border border-white/10 bg-white/5 px-3 py-1">Live HTML</span>
        </div>
      </div>

      <div className="rounded-[1.5rem] border border-white/10 bg-slate-950/60 p-1">
        <EditorContent editor={editor} />
      </div>

      <input
        ref={imageInputRef}
        type="file"
        accept="image/*"
        aria-label="Upload image from device"
        title="Upload image from device"
        className="hidden"
        onChange={handleImageUpload}
      />

      {showLinkDialog && (
        <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/50 backdrop-blur-sm">
          <div className="rounded-[1.5rem] border border-white/10 bg-slate-950 p-6 shadow-2xl">
            <h3 className="mb-4 text-lg font-semibold text-slate-100">Add Link</h3>
            <input
              type="text"
              value={linkUrl}
              onChange={(e) => setLinkUrl(e.target.value)}
              placeholder="https://example.com"
              className="admin-input mb-4 w-full"
              autoFocus
              onKeyDown={(e) => e.key === 'Enter' && confirmLink()}
            />
            <div className="flex gap-3">
              <button
                onClick={() => {
                  setShowLinkDialog(false);
                  setLinkUrl('');
                }}
                className="admin-button-secondary flex-1 rounded-xl px-4 py-2"
              >
                Cancel
              </button>
              <button
                onClick={confirmLink}
                className="admin-button-primary flex-1 rounded-xl px-4 py-2"
              >
                Add Link
              </button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
}
