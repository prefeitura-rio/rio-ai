import React, { useRef, useEffect, useState, useCallback, useMemo } from 'react';
import {
  ArrowUp,
  Copy,
  Check,
  Edit3,
  RefreshCw,
  ChevronLeft,
  ChevronRight,
  Square,
  Trash2,
} from 'lucide-react';
import type { Language } from 'prism-react-renderer';
import { Highlight, themes } from 'prism-react-renderer';
import ReactMarkdown from 'react-markdown';
import remarkMath from 'remark-math';
import remarkGfm from 'remark-gfm';
import remarkBreaks from 'remark-breaks';
import rehypeKatex from 'rehype-katex';
import { AnimateOnScroll } from './AnimateOnScroll';
import { ThinkingAnimation } from './ThinkingAnimation';
import { ChatMessage, useRioChat } from '../hooks/useRioChat';
import { normalizeMathDelimiters } from '../lib/markdown';
import { useLocale } from '../contexts/LocaleContext';
import 'katex/dist/katex.min.css';

const CHAT_MODEL_ID = 'rio-3.0-open';
const CHAT_MODEL_NAME = 'Rio 3.0 Open';

const getNodeText = (node: React.ReactNode): string => {
  if (typeof node === 'string' || typeof node === 'number') {
    return String(node);
  }
  if (Array.isArray(node)) {
    return node.map(getNodeText).join('');
  }
  if (React.isValidElement(node)) {
    return getNodeText((node.props as { children?: React.ReactNode }).children);
  }
  return '';
};

type PrismTheme = (typeof themes)[keyof typeof themes];

interface ChatBubbleProps {
  message: ChatMessage;
  onEdit?: () => void;
  onRegenerate?: () => void;
  onNavigate?: (direction: -1 | 1) => void;
  disableActions?: boolean;
  isEditing?: boolean;
  editContent?: string;
  onEditContentChange?: (content: string) => void;
  onSaveEdit?: () => void;
  onCancelEdit?: () => void;
}

const CodeBlock: React.FC<{
  inline?: boolean;
  className?: string;
  children?: React.ReactNode;
  node?: unknown;
  highlight?: typeof Highlight;
  theme?: PrismTheme;
}> = ({ inline, className, children, node, highlight, theme, ...codeProps }) => {
  const { isEnglish } = useLocale();
  const [codeCopied, setCodeCopied] = useState(false);
  const codeCopyTimeoutRef = useRef<number | null>(null);

  useEffect(
    () => () => {
      if (codeCopyTimeoutRef.current) {
        window.clearTimeout(codeCopyTimeoutRef.current);
      }
    },
    []
  );

  const nodeLang = (node as { lang?: string } | null | undefined)?.lang;
  const rawLanguage =
    typeof nodeLang === 'string' && nodeLang.trim().length > 0
      ? nodeLang.trim()
      : (className?.replace('language-', '') ?? '');
  const displayLanguage = (rawLanguage || 'code').toLowerCase();
  const fallbackLanguage: Language = 'tsx';
  const language = rawLanguage.toLowerCase();
  const prismLanguage = language ? (language as Language) : fallbackLanguage;
  const codeTextRaw = getNodeText(children ?? '');
  const codeText = codeTextRaw.replace(/\s+$/, '');
  const displayLanguageLabel = displayLanguage === 'code' ? 'text' : displayLanguage;
  const blockWrapperClass =
    'group relative mt-3 w-full overflow-hidden rounded-[14px] border border-slate-200 bg-white shadow-[0_1px_2px_rgba(15,23,42,0.04)]';
  const blockHeaderClass =
    'relative flex items-center justify-between px-4 pb-1 pt-3';
  const blockCopyButtonClass =
    'inline-flex h-7 w-7 items-center justify-center rounded-md text-slate-500 transition hover:bg-slate-100 hover:text-slate-700 focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-slate-300 opacity-60 md:opacity-0 md:group-hover:opacity-100 md:group-focus-within:opacity-100';
  const blockPreClass = 'm-0 overflow-auto px-4 pb-4 pt-1 text-[15px] leading-[1.65]';

  const handleCopyCode = useCallback(async () => {
    if (!codeText || typeof navigator === 'undefined' || !navigator.clipboard) return;
    try {
      await navigator.clipboard.writeText(codeText);
      setCodeCopied(true);
      if (codeCopyTimeoutRef.current) {
        window.clearTimeout(codeCopyTimeoutRef.current);
      }
      codeCopyTimeoutRef.current = window.setTimeout(() => setCodeCopied(false), 1500);
    } catch (error) {
      console.error('Failed to copy code block', error);
    }
  }, [codeText]);

  if (inline) {
    return (
      <code
        className={[
          'rounded bg-slate-100 px-1.5 py-0.5 font-mono text-[0.92em] text-slate-700',
          className,
        ]
          .filter(Boolean)
          .join(' ')}
        {...codeProps}
      >
        {children}
      </code>
    );
  }

  const HighlightComponent = highlight;

  if (!HighlightComponent || !theme) {
    return (
      <div className={blockWrapperClass}>
        <div className={blockHeaderClass}>
          <span className="inline-flex items-center font-mono text-[13px] font-medium tracking-normal text-slate-500">
            {displayLanguageLabel}
          </span>
          <button
            type="button"
            onClick={handleCopyCode}
            className={blockCopyButtonClass}
            aria-label={isEnglish ? 'Copy code block' : 'Copiar bloco de código'}
          >
            {codeCopied ? <Check className="h-4 w-4" /> : <Copy className="h-4 w-4" />}
          </button>
        </div>
        <pre className={`${blockPreClass} text-[#1f2937]`} {...codeProps}>{codeText}</pre>
      </div>
    );
  }

  return (
    <div className={blockWrapperClass}>
      <div className={blockHeaderClass}>
          <span className="inline-flex items-center font-mono text-[13px] font-medium tracking-normal text-slate-500">
            {displayLanguageLabel}
          </span>
        <button
          type="button"
          onClick={handleCopyCode}
          className={blockCopyButtonClass}
          aria-label={isEnglish ? 'Copy code block' : 'Copiar bloco de código'}
        >
          {codeCopied ? <Check className="h-4 w-4" /> : <Copy className="h-4 w-4" />}
        </button>
      </div>
      <HighlightComponent theme={theme} code={codeText} language={prismLanguage}>
        {({ className: highlightClassName, style, tokens, getLineProps, getTokenProps }) => (
          <pre
            className={`${blockPreClass} ${highlightClassName}`}
            style={{
              ...style,
              background: 'transparent',
            }}
            {...codeProps}
          >
            {(() => {
              const visibleTokens = tokens.slice();
              while (visibleTokens.length > 0) {
                const lastLine = visibleTokens[visibleTokens.length - 1];
                if (!lastLine) break;
                const lastLineContent = lastLine.map((token) => token.content).join('');
                if (lastLineContent.trim().length === 0) {
                  visibleTokens.pop();
                } else {
                  break;
                }
              }
              return visibleTokens;
            })().map((line, i) => (
              <div key={i} {...getLineProps({ line })}>
                {line.map((token, key) => (
                  <span key={key} {...getTokenProps({ token })} />
                ))}
              </div>
            ))}
          </pre>
        )}
      </HighlightComponent>
    </div>
  );
};

const ChatBubble: React.FC<ChatBubbleProps> = ({
  message,
  onEdit,
  onRegenerate,
  onNavigate,
  disableActions,
  isEditing,
  editContent,
  onEditContentChange,
  onSaveEdit,
  onCancelEdit,
}) => {
  const { isEnglish } = useLocale();
  const isUser = message.role === 'user';
  const [copiedBubble, setCopiedBubble] = useState(false);
  const bubbleCopyTimeoutRef = useRef<number | null>(null);
  const editTextareaRef = useRef<HTMLTextAreaElement>(null);
  const markdownContent = normalizeMathDelimiters(message.content);
  const codeTheme = themes.oneLight;
  const remarkPlugins = [remarkMath, remarkGfm, remarkBreaks];
  const rehypePlugins = [rehypeKatex];

  useEffect(
    () => () => {
      if (bubbleCopyTimeoutRef.current) {
        window.clearTimeout(bubbleCopyTimeoutRef.current);
      }
    },
    []
  );

  // Focus and resize textarea when entering edit mode
  useEffect(() => {
    if (isEditing && editTextareaRef.current) {
      editTextareaRef.current.focus();
      editTextareaRef.current.style.height = 'auto';
      editTextareaRef.current.style.height = `${Math.min(editTextareaRef.current.scrollHeight, 200)}px`;
    }
  }, [isEditing]);

  const handleCopyMessage = useCallback(async () => {
    if (typeof navigator === 'undefined' || !navigator.clipboard) return;
    try {
      await navigator.clipboard.writeText(message.content);
      setCopiedBubble(true);
      if (bubbleCopyTimeoutRef.current) {
        window.clearTimeout(bubbleCopyTimeoutRef.current);
      }
      bubbleCopyTimeoutRef.current = window.setTimeout(() => setCopiedBubble(false), 1500);
    } catch (error) {
      console.error('Failed to copy chat message', error);
    }
  }, [message.content]);

  const actionButtonClass =
    'inline-flex h-8 w-8 items-center justify-center text-slate-400 transition hover:text-rio-primary focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-rio-primary/50 disabled:opacity-50';

  // Inline editing UI for user messages
  if (isEditing && isUser) {
    return (
      <div data-message-id={message.id} className="flex justify-end w-full">
        <div className="w-full max-w-[90%] flex flex-col gap-2">
          <div className="rounded-2xl border-2 border-rio-primary/40 bg-white p-3 shadow-sm">
            <textarea
              ref={editTextareaRef}
              value={editContent}
              onChange={(e) => {
                onEditContentChange?.(e.target.value);
                e.target.style.height = 'auto';
                e.target.style.height = `${Math.min(e.target.scrollHeight, 200)}px`;
              }}
              onKeyDown={(e) => {
                if (e.key === 'Enter' && !e.shiftKey) {
                  e.preventDefault();
                  if (editContent?.trim()) {
                    onSaveEdit?.();
                  }
                }
                if (e.key === 'Escape') {
                  onCancelEdit?.();
                }
              }}
              className="w-full border-none bg-transparent text-sm text-slate-700 placeholder:text-slate-400 focus:outline-none focus:ring-0 resize-none max-h-[200px] overflow-y-auto"
            style={{ minHeight: '40px' }}
            rows={1}
            />
          </div>
          <div className="flex items-center justify-between">
            <p className="text-xs text-slate-500">
              {isEnglish ? 'Editing this message will branch the chat.' : 'Editar a mensagem ramificará o chat.'}
            </p>
            <div className="flex items-center gap-2">
              <button
                type="button"
                onClick={onCancelEdit}
                className="px-4 py-1.5 text-sm font-medium text-slate-600 bg-slate-100 hover:bg-slate-200 rounded-lg transition"
              >
                {isEnglish ? 'Cancel' : 'Cancelar'}
              </button>
              <button
                type="button"
                onClick={onSaveEdit}
                disabled={!editContent?.trim()}
                className="px-4 py-1.5 text-sm font-medium text-white bg-rio-primary hover:bg-rio-primary/90 rounded-lg transition disabled:opacity-50 disabled:pointer-events-none"
              >
                {isEnglish ? 'Save' : 'Salvar'}
              </button>
            </div>
          </div>
        </div>
      </div>
    );
  }

  return (
    <div data-message-id={message.id} className={`flex ${isUser ? 'justify-end' : 'justify-start'}`}>
      <div
        className={`group flex max-w-[80%] min-w-0 flex-col gap-1 ${isUser ? 'items-end text-left' : 'items-start text-left'
          }`}
      >
        <div
          className={`relative min-w-0 max-w-full overflow-hidden text-[14px] leading-relaxed transition ${isUser
            ? 'rounded-2xl bg-rio-primary/10 px-4 py-3 text-rio-primary shadow-sm'
            : 'px-0 py-0 text-prose'
            }`}
        >
          <div className="min-w-0 max-w-full whitespace-normal break-words text-[14px] leading-relaxed text-prose space-y-3">
            <ReactMarkdown
                remarkPlugins={remarkPlugins}
                rehypePlugins={rehypePlugins}
                components={{
                  a: ({ node: _node, ...anchorProps }) => (
                    <a {...anchorProps} rel="noopener noreferrer" target="_blank" />
                  ),
                  code: (props) => (
                    <CodeBlock
                      {...props}
                      highlight={Highlight}
                      theme={codeTheme}
                    />
                  ),
                  blockquote: ({ node: _node, className, children, ...blockquoteProps }) => (
                    <blockquote
                      className={[
                        className,
                        'border-l-4 border-slate-300/70 bg-slate-100/60 px-4 py-2 italic text-prose-light',
                      ]
                        .filter(Boolean)
                        .join(' ')}
                      {...blockquoteProps}
                    >
                      {children}
                    </blockquote>
                  ),
                  ul: ({ node: _node, className, ...listProps }) => (
                    <ul
                      className={['list-disc space-y-2 pl-5', className].filter(Boolean).join(' ')}
                      {...listProps}
                    />
                  ),
                  ol: ({ node: _node, className, ...listProps }) => (
                    <ol
                      className={['list-decimal space-y-2 pl-5', className].filter(Boolean).join(' ')}
                      {...listProps}
                    />
                  ),
                  li: ({ node: _node, className, ...itemProps }) => (
                    <li
                      className={[
                        'leading-relaxed',
                        'marker:text-rio-primary/80',
                        className,
                      ]
                        .filter(Boolean)
                        .join(' ')}
                      {...itemProps}
                    />
                  ),
                  table: ({ node: _node, className, children, ...tableProps }) => (
                    <div className="my-4 overflow-x-auto">
                      <table
                        className={['min-w-full border-collapse text-left text-sm', className]
                          .filter(Boolean)
                          .join(' ')}
                        {...tableProps}
                      >
                        {children}
                      </table>
                    </div>
                  ),
                  thead: ({ node: _node, className, ...theadProps }) => (
                    <thead
                      className={['bg-slate-200/80', className].filter(Boolean).join(' ')}
                      {...theadProps}
                    />
                  ),
                  tbody: ({ node: _node, className, ...tbodyProps }) => (
                    <tbody
                      className={['divide-y divide-slate-200', className].filter(Boolean).join(' ')}
                      {...tbodyProps}
                    />
                  ),
                  tr: ({ node: _node, className, ...trProps }) => (
                    <tr
                      className={[className, 'odd:bg-white even:bg-slate-50']
                        .filter(Boolean)
                        .join(' ')}
                      {...trProps}
                    />
                  ),
                  th: ({ node: _node, className, ...thProps }) => (
                    <th
                      className={[
                        'px-3 py-2 text-xs font-semibold uppercase tracking-wide text-slate-600',
                        className,
                      ]
                        .filter(Boolean)
                        .join(' ')}
                      {...thProps}
                    />
                  ),
                  td: ({ node: _node, className, ...tdProps }) => (
                    <td
                      className={['px-3 py-2 align-top text-sm text-slate-700', className]
                        .filter(Boolean)
                        .join(' ')}
                      {...tdProps}
                    />
                  ),
                  hr: () => <hr className="my-4 border border-slate-300/70" />,
                  p: ({ node: _node, className, ...paragraphProps }) => {
                    const paragraphClasses = [
                      className,
                      'mt-2',
                      'mb-2',
                      'first:mt-0',
                      'last:mb-0',
                      'leading-relaxed',
                    ]
                      .filter(Boolean)
                      .join(' ');
                    return <p className={paragraphClasses} {...paragraphProps} />;
                  },
                }}
              >
                {markdownContent}
            </ReactMarkdown>
          </div>
          {isUser && (
            <span className="pointer-events-none absolute inset-0 rounded-2xl border border-white/0 transition group-hover:border-white/40" />
          )}
        </div>
        <div
          className={`flex w-full items-center gap-1 text-xs font-medium transition-opacity duration-200 ${isUser
            ? 'self-end justify-end text-rio-primary opacity-0 group-hover:opacity-100'
            : 'self-start justify-start text-slate-500 opacity-0 group-hover:opacity-100 -ml-2'
            }`}
        >
          {!isUser && (
            <button
              type="button"
              onClick={handleCopyMessage}
              disabled={disableActions || copiedBubble}
              className={actionButtonClass}
              aria-label={isEnglish ? 'Copy message' : 'Copiar mensagem'}
              title={isEnglish ? 'Copy message' : 'Copiar mensagem'}
            >
              {copiedBubble ? <Check className="h-4 w-4" /> : <Copy className="h-4 w-4" />}
            </button>
          )}

          {!isUser && onRegenerate && (
            <button
              type="button"
              onClick={onRegenerate}
              disabled={disableActions}
              className={actionButtonClass}
              aria-label={isEnglish ? 'Try again' : 'Tentar novamente'}
              title={isEnglish ? 'Try again' : 'Tentar novamente'}
            >
              <RefreshCw className="h-4 w-4" />
            </button>
          )}

          {isUser && onRegenerate ? (
            <button
              type="button"
              onClick={onRegenerate}
              disabled={disableActions}
              className={actionButtonClass}
              aria-label={isEnglish ? 'Try again' : 'Tentar novamente'}
              title={isEnglish ? 'Try again' : 'Tentar novamente'}
            >
              <RefreshCw className="h-4 w-4" />
            </button>
          ) : null}

          {isUser && onEdit ? (
            <button
              type="button"
              onClick={onEdit}
              disabled={disableActions}
              className={actionButtonClass}
              aria-label={isEnglish ? 'Edit message' : 'Editar mensagem'}
              title={isEnglish ? 'Edit message' : 'Editar mensagem'}
            >
              <Edit3 className="h-4 w-4" />
            </button>
          ) : null}

          {isUser && (
            <button
              type="button"
              onClick={handleCopyMessage}
              disabled={disableActions || copiedBubble}
              className={actionButtonClass}
              aria-label={isEnglish ? 'Copy message' : 'Copiar mensagem'}
              title={isEnglish ? 'Copy message' : 'Copiar mensagem'}
            >
              {copiedBubble ? <Check className="h-4 w-4" /> : <Copy className="h-4 w-4" />}
            </button>
          )}

          {message.siblingCount > 1 && onNavigate && (
            <div className="flex items-center gap-1 ml-2 text-slate-400 select-none">
              <button
                type="button"
                onClick={() => onNavigate(-1)}
                disabled={disableActions || message.siblingIndex <= 0}
                className="hover:text-rio-primary disabled:opacity-30 disabled:hover:text-slate-400"
              >
                <ChevronLeft className="h-4 w-4" />
              </button>

              <span className="text-[10px] tabular-nums font-semibold min-w-[20px] text-center">
                {message.siblingIndex + 1}/{message.siblingCount}
              </span>

              <button
                type="button"
                onClick={() => onNavigate(1)}
                disabled={disableActions || message.siblingIndex >= message.siblingCount - 1}
                className="hover:text-rio-primary disabled:opacity-30 disabled:hover:text-slate-400"
              >
                <ChevronRight className="h-4 w-4" />
              </button>
            </div>
          )}
        </div>
      </div>
    </div>
  );
};

const MemoizedChatBubble = React.memo(ChatBubble);

interface ChatMessageRowProps {
  message: ChatMessage;
  index: number;
  previousRole?: ChatMessage['role'];
  isLoading: boolean;
  hasEditingState: boolean;
  editingMessageId?: string;
  editingContent?: string;
  onRegenerateAtIndex: (index: number) => void;
  onEditMessage: (messageId: string, content: string) => void;
  onNavigateMessage: (messageId: string, direction: -1 | 1) => void;
  onEditContentChange: (content: string) => void;
  onSaveEdit: () => void;
  onCancelEdit: () => void;
}

const ChatMessageRow: React.FC<ChatMessageRowProps> = ({
  message,
  index,
  previousRole,
  isLoading,
  hasEditingState,
  editingMessageId,
  editingContent,
  onRegenerateAtIndex,
  onEditMessage,
  onNavigateMessage,
  onEditContentChange,
  onSaveEdit,
  onCancelEdit,
}) => {
  const disableActions = isLoading || hasEditingState;

  const onRegenerate = useMemo(() => {
    if (message.role === 'user') {
      return () => onRegenerateAtIndex(index);
    }
    if (index > 0 && previousRole === 'user') {
      return () => onRegenerateAtIndex(index - 1);
    }
    return undefined;
  }, [index, message.role, onRegenerateAtIndex, previousRole]);

  const onEdit = useMemo(() => {
    if (message.role !== 'user') return undefined;
    return () => onEditMessage(message.id, message.content);
  }, [message.content, message.id, message.role, onEditMessage]);

  const onNavigate = useCallback(
    (direction: -1 | 1) => onNavigateMessage(message.id, direction),
    [message.id, onNavigateMessage]
  );

  return (
    <MemoizedChatBubble
      message={message}
      disableActions={disableActions}
      onRegenerate={onRegenerate}
      onEdit={onEdit}
      onNavigate={onNavigate}
      isEditing={editingMessageId === message.id}
      editContent={editingMessageId === message.id ? editingContent : undefined}
      onEditContentChange={onEditContentChange}
      onSaveEdit={onSaveEdit}
      onCancelEdit={onCancelEdit}
    />
  );
};

const MemoizedChatMessageRow = React.memo(ChatMessageRow);

type EditingState = {
  messageId: string;
  originalContent: string;
};

export const ChatSection = () => {
  const { isEnglish } = useLocale();
  const chatModelSubtitle = isEnglish
    ? 'Our most advanced open-source model.'
    : 'Nosso modelo open source mais avançado.';
  const chatSystemPrompt = isEnglish
    ? 'Be friendly and respectful, always aiming to help in the best way possible. Respond in the same language as the user.'
    : 'Seja amigável e respeitoso, sempre buscando atender da melhor maneira possível. Responda na mesma língua que o usuário estiver usando.';
  const chatErrorMessage = isEnglish
    ? 'Sorry, I ran into an error while communicating with the API. Please try again later.'
    : 'Desculpe, ocorreu um erro ao me comunicar com a API. Por favor, tente novamente mais tarde.';

  const {
    messages,
    input,
    setInput,
    isLoading,
    handleSubmit,
    regenerate,
    navigateMessage,
    editAndResubmit,
    stop,
    clearChat,
  } = useRioChat({
    model: CHAT_MODEL_ID,
    systemPrompt: chatSystemPrompt,
    errorMessage: chatErrorMessage,
  });
  const chatEndRef = useRef<HTMLDivElement>(null);
  const chatContainerRef = useRef<HTMLDivElement>(null);
  const [editingState, setEditingState] = useState<EditingState | null>(null);
  const [isClearing, setIsClearing] = useState(false);
  const [showScrollbar, setShowScrollbar] = useState(false);
  const isAutoScrollingRef = useRef(false);
  const scrollTimeoutRef = useRef<number | null>(null);
  const isEmptyChat = messages.length === 0;

  const handleClearChat = useCallback(() => {
    if (messages.length === 0) return;
    setIsClearing(true);
    setTimeout(() => {
      clearChat();
      // Small delay to allow tree update before showing again
      requestAnimationFrame(() => {
        setIsClearing(false);
      });
    }, 300);
  }, [clearChat, messages.length]);

  const inputTextareaRef = useRef<HTMLTextAreaElement>(null);
  const inputPlaceholder = isEmptyChat
    ? isEnglish
      ? 'How can I help you today?'
      : 'Como posso ajudar você hoje?'
    : isEnglish
      ? `Ask ${CHAT_MODEL_NAME}...`
      : `Perguntar para o ${CHAT_MODEL_NAME}...`;

  // Track previous state to detect transitions
  const prevIsLoadingRef = useRef(isLoading);
  const prevMessageCountRef = useRef(messages.length);

  // Handle user scroll detection
  useEffect(() => {
    const chatContainer = chatContainerRef.current;
    if (!chatContainer) return;

    const handleScroll = () => {
      // Only show scrollbar if this is a user-initiated scroll
      if (!isAutoScrollingRef.current) {
        setShowScrollbar(true);
        // Clear any existing timeout
        if (scrollTimeoutRef.current) {
          window.clearTimeout(scrollTimeoutRef.current);
        }
        // Hide scrollbar after user stops scrolling
        scrollTimeoutRef.current = window.setTimeout(() => {
          setShowScrollbar(false);
        }, 1500);
      }
    };

    chatContainer.addEventListener('scroll', handleScroll, { passive: true });
    return () => {
      chatContainer.removeEventListener('scroll', handleScroll);
      if (scrollTimeoutRef.current) {
        window.clearTimeout(scrollTimeoutRef.current);
      }
    };
  }, []);

  useEffect(() => {
    if (!inputTextareaRef.current) return;
    inputTextareaRef.current.style.height = 'auto';
    inputTextareaRef.current.style.height = `${Math.min(inputTextareaRef.current.scrollHeight, 200)}px`;
  }, [input]);

  const suggestionChips = isEnglish
    ? [
        { label: 'Write', prompt: 'Write a short poem about Rio.' },
        { label: 'Learn', prompt: 'Teach me about the Pythagorean theorem.' },
        { label: 'Code', prompt: 'Code a game of Pong in .html.' },
        { label: 'Plan', prompt: 'Suggest a one-day itinerary in Rio.' },
      ]
    : [
        { label: 'Escrever', prompt: 'Escreva um poema curto sobre o Rio.' },
        { label: 'Aprender', prompt: 'Me ensine sobre o Teorema de Pitágoras' },
        { label: 'Código', prompt: 'Code a game of Pong in .html.' },
        { label: 'Planejar', prompt: 'Sugira um roteiro de um dia no Rio.' },
      ];

  const handleSuggestionClick = (prompt: string) => {
    setInput(prompt);
    requestAnimationFrame(() => {
      inputTextareaRef.current?.focus();
    });
  };

  const renderComposer = (variant: 'intro' | 'inline') => {
    const wrapperClass =
      variant === 'intro'
        ? 'rounded-2xl bg-white p-3'
        : 'bg-white/95 px-4 py-4 sm:px-6';
    const formClass =
      variant === 'intro'
        ? 'group relative flex items-center gap-2 rounded-2xl border border-rio-primary bg-white p-1.5 pl-2 shadow-sm transition-all duration-300 focus-within:border-rio-primary focus-within:ring-4 focus-within:ring-rio-primary/10'
        : 'group relative mx-auto flex w-full max-w-4xl items-center gap-2 rounded-2xl border border-rio-primary bg-white p-1.5 pl-2 shadow-sm transition-all duration-300 focus-within:border-rio-primary focus-within:ring-4 focus-within:ring-rio-primary/10';

    const canSubmit = input.trim().length > 0;

    return (
      <div className={wrapperClass}>
        <form
          onSubmit={handleFormSubmit}
          className={formClass}
        >
          <div className={`transition-all duration-300 ease-in-out ${messages.length > 0 && !isLoading && !isClearing ? 'w-8 opacity-100 mr-1' : 'w-0 opacity-0 mr-0 overflow-hidden'}`}>
            <button
              type="button"
              onClick={handleClearChat}
              disabled={messages.length === 0 || isLoading || isClearing}
              className="flex h-8 w-8 items-center justify-center rounded-lg text-slate-400 hover:bg-red-50 hover:text-red-500 transition-all focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-red-500/50"
              title={isEnglish ? 'Clear conversation' : 'Limpar conversa'}
            >
              <Trash2 className="h-5 w-5" />
            </button>
          </div>

          <textarea
            ref={inputTextareaRef}
            value={input}
            onChange={(e) => {
              setInput(e.target.value);
              // Auto-resize the textarea
              e.target.style.height = 'auto';
              e.target.style.height = `${Math.min(e.target.scrollHeight, 200)}px`;
            }}
            onKeyDown={(e) => {
              // Submit on Enter (without Shift)
              if (e.key === 'Enter' && !e.shiftKey) {
                e.preventDefault();
                if (input.trim() && !isLoading) {
                  const form = e.currentTarget.closest('form');
                  if (form) form.requestSubmit();
                }
              }
            }}
            placeholder={inputPlaceholder}
            spellCheck={false}
            rows={1}
            className="flex-1 border-none bg-transparent px-1 py-0 text-sm leading-9 text-slate-700 placeholder:text-slate-400 focus:outline-none focus:ring-0 resize-none max-h-[200px] overflow-y-auto"
            style={{ minHeight: '40px' }}
          />

          {isLoading ? (
            <button
              type="button"
              onClick={(e) => {
                e.preventDefault();
                e.stopPropagation();
                stop();
              }}
              className="inline-flex h-9 shrink-0 items-center justify-center gap-1.5 rounded-lg border border-slate-300 bg-white px-2.5 text-slate-700 transition-colors duration-200 hover:border-slate-400 hover:bg-slate-50 focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-slate-300"
              aria-label={isEnglish ? 'Stop' : 'Interromper'}
            >
              <Square className="h-3.5 w-3.5 fill-current text-rose-500" />
              <span className="text-xs font-medium sm:text-sm">{isEnglish ? 'Stop' : 'Parar'}</span>
            </button>
          ) : (
            <button
              type="submit"
              disabled={!canSubmit}
              className="inline-flex h-10 w-10 shrink-0 items-center justify-center rounded-xl text-rio-primary transition-all duration-300 hover:bg-rio-primary/10 disabled:pointer-events-none disabled:opacity-50"
              aria-label={isEnglish ? 'Send message' : 'Enviar mensagem'}
            >
              <ArrowUp className="h-5 w-5" />
            </button>
          )}
        </form>
      </div>
    );
  };

  useEffect(() => {
    const chatContainer = chatContainerRef.current;
    if (!chatContainer) return;

    const wasLoading = prevIsLoadingRef.current;
    const prevMessageCount = prevMessageCountRef.current;
    const messageCountChanged = messages.length !== prevMessageCount;

    // Update refs for next render
    prevIsLoadingRef.current = isLoading;
    prevMessageCountRef.current = messages.length;

    // When there are no messages, do nothing
    if (messages.length === 0) {
      return;
    }

    // When a new user message is added (user just sent a message)
    // This is detected by: messageCount increased AND the last user message was just added
    const lastUserMessageIndex = (() => {
      for (let i = messages.length - 1; i >= 0; i -= 1) {
        if (messages[i]?.role === 'user') return i;
      }
      return -1;
    })();
    const userJustSentMessage = messageCountChanged &&
      lastUserMessageIndex === messages.length - 1 &&
      messages[lastUserMessageIndex]?.role === 'user';

    if (userJustSentMessage) {
      // Scroll to position the user's message at the top
      const messageElements = chatContainer.querySelectorAll('[data-message-id]');
      const lastUserMessageEl = messageElements?.[lastUserMessageIndex] as HTMLElement | undefined;

      if (lastUserMessageEl) {
        const messageTop = lastUserMessageEl.offsetTop;
        isAutoScrollingRef.current = true;
        chatContainer.scrollTo({
          top: messageTop - 16, // 16px padding from top
          behavior: 'smooth'
        });
        // Reset auto-scroll flag after scroll completes
        setTimeout(() => {
          isAutoScrollingRef.current = false;
        }, 500);
      }
      return;
    }

    // When loading just started (isLoading became true) and we have messages, ensure the last user message is visible at top
    if (isLoading && !wasLoading && lastUserMessageIndex !== -1) {
      const messageElements = chatContainer.querySelectorAll('[data-message-id]');
      const lastUserMessageEl = messageElements?.[lastUserMessageIndex] as HTMLElement | undefined;

      if (lastUserMessageEl) {
        const messageTop = lastUserMessageEl.offsetTop;
        isAutoScrollingRef.current = true;
        chatContainer.scrollTo({
          top: messageTop - 16,
          behavior: 'smooth'
        });
        setTimeout(() => {
          isAutoScrollingRef.current = false;
        }, 500);
      }
      return;
    }

    // When response finishes (isLoading goes false), do NOT scroll - maintain position
    // This prevents the jarring jump when the spacer would have shrunk in the old implementation
    if (!isLoading && wasLoading) {
      // Intentionally do nothing - keep the scroll position stable
      return;
    }

    // For other cases (like message navigation), scroll to bottom smoothly
    if (messageCountChanged && messages.length > 0) {
      isAutoScrollingRef.current = true;
      chatContainer.scrollTo({
        top: chatContainer.scrollHeight,
        behavior: 'smooth'
      });
      setTimeout(() => {
        isAutoScrollingRef.current = false;
      }, 500);
    }
  }, [messages, isLoading]);

  const handleEditMessage = useCallback(
    (messageId: string, content: string) => {
      if (isLoading) return;
      setEditingState({
        messageId,
        originalContent: content,
      });
    },
    [isLoading]
  );

  const handleCancelEdit = useCallback(() => {
    setEditingState(null);
  }, []);

  const handleSaveEdit = useCallback(() => {
    if (!editingState) return;
    editAndResubmit(editingState.messageId, editingState.originalContent);
    setEditingState(null);
  }, [editingState, editAndResubmit]);

  const handleEditContentChange = useCallback((content: string) => {
    setEditingState(prev => prev ? { ...prev, originalContent: content } : null);
  }, []);

  const handleRegenerateAtIndex = useCallback(
    (index: number) => {
      regenerate(index);
    },
    [regenerate]
  );

  const handleNavigateMessage = useCallback(
    (messageId: string, direction: -1 | 1) => {
      navigateMessage(messageId, direction);
    },
    [navigateMessage]
  );

  const handleFormSubmit = (event: React.FormEvent<HTMLFormElement>) => {
    event.preventDefault();
    if (!input.trim() || isLoading || editingState) return;

    handleSubmit();
  };

  return (
    <section id="chat" className={`bg-white ${isEmptyChat ? 'py-20 sm:py-24' : 'py-0'}`}>
      <div className={isEmptyChat ? 'container mx-auto px-4 sm:px-6 lg:px-8' : 'w-full'}>
        {isEmptyChat ? (
          <AnimateOnScroll className="max-w-3xl mx-auto">
            <div className="mx-auto flex min-h-[60vh] w-full max-w-2xl flex-col items-center justify-center">
              <div className="text-center mb-6 sm:mb-7">
                <h2 className="text-3xl font-bold tracking-tight bg-[linear-gradient(90deg,#3F38AC_0%,#429FEB_100%)] bg-clip-text text-transparent sm:text-4xl">
                  {isEnglish ? 'Chat with' : 'Converse com o'} {CHAT_MODEL_NAME}
                </h2>
                <p className="mt-3 max-w-2xl mx-auto text-lg text-prose-light">
                  {chatModelSubtitle}
                </p>
              </div>
              <div className="w-full mb-2 sm:mb-3">{renderComposer('intro')}</div>
              <div className="flex flex-wrap items-center justify-center gap-2">
                {suggestionChips.map((chip) => (
                  <button
                    key={chip.label}
                    type="button"
                    onClick={() => handleSuggestionClick(chip.prompt)}
                    className="rounded-full border border-slate-200 bg-white px-4 py-1 text-xs font-medium text-slate-600 transition hover:border-slate-300 hover:bg-slate-50"
                  >
                    {chip.label}
                  </button>
                ))}
              </div>
            </div>
          </AnimateOnScroll>
        ) : (
          <div className="mx-auto flex min-h-[calc(100svh-5rem)] w-full flex-col">
            <div
              ref={chatContainerRef}
              className={`flex-1 overflow-y-auto overflow-x-hidden transition-all duration-300 ease-out chat-scroll-container ${showScrollbar ? 'show-scrollbar' : ''} ${isClearing ? 'opacity-0 scale-95 blur-sm' : 'opacity-100 scale-100 blur-0'
                }`}
            >
              <div className="mx-auto flex w-full max-w-4xl flex-col gap-6 px-4 py-6 sm:px-6 lg:px-8">
                {messages.map((msg, index) => (
                  <MemoizedChatMessageRow
                    key={msg.id}
                    message={msg}
                    index={index}
                    previousRole={messages[index - 1]?.role}
                    isLoading={isLoading}
                    hasEditingState={!!editingState}
                    editingMessageId={editingState?.messageId}
                    editingContent={editingState?.originalContent}
                    onRegenerateAtIndex={handleRegenerateAtIndex}
                    onEditMessage={handleEditMessage}
                    onNavigateMessage={handleNavigateMessage}
                    onEditContentChange={handleEditContentChange}
                    onSaveEdit={handleSaveEdit}
                    onCancelEdit={handleCancelEdit}
                  />
                ))}
                {isLoading && <ThinkingAnimation />}
                {/* Espaço extra para permitir posicionar a última pergunta no topo durante a geração */}
                <div ref={chatEndRef} className="min-h-[30vh] shrink-0 sm:min-h-[220px]" />
              </div>
            </div>
            {renderComposer('inline')}
          </div>
        )}
      </div>
    </section>
  );
};
