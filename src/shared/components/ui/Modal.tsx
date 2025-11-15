/**
 * @fileoverview Modal dialog component
 *
 * An accessible modal dialog with focus trap, backdrop blur,
 * and keyboard navigation (ESC to close).
 *
 * @module components/ui/Modal
 */

import { ReactElement, useEffect } from 'react';
import FocusLock from 'react-focus-lock';
import { cn } from '@/shared/utils';

/**
 * Props for the Modal component
 */
export interface ModalProps {
  /** Controls modal visibility */
  isOpen: boolean;
  /** Callback when modal should close */
  onClose: () => void;
  /** Modal title */
  title?: string;
  /** Modal content */
  children: React.ReactNode;
  /** Show close button in header */
  showCloseButton?: boolean;
  /** Additional CSS classes for modal content */
  className?: string;
  /** Additional CSS classes for modal overlay */
  overlayClassName?: string;
}

/**
 * Modal component with Neo-Afro Modern design
 *
 * Features:
 * - Focus trap using react-focus-lock
 * - ESC key closes modal
 * - Backdrop blur effect
 * - Smooth entrance/exit animations
 * - Accessible with proper ARIA attributes
 * - Prevents body scroll when open
 *
 * @param props - Modal component props
 * @returns Modal element or null if not open
 *
 * @example
 * ```tsx
 * function MyComponent() {
 *   const [isOpen, setIsOpen] = useState(false);
 *
 *   return (
 *     <>
 *       <Button onClick={() => setIsOpen(true)}>Open Modal</Button>
 *       <Modal
 *         isOpen={isOpen}
 *         onClose={() => setIsOpen(false)}
 *         title="Confirm Action"
 *       >
 *         <p>Are you sure you want to continue?</p>
 *         <Button onClick={() => setIsOpen(false)}>Confirm</Button>
 *       </Modal>
 *     </>
 *   );
 * }
 * ```
 */
export function Modal({
  isOpen,
  onClose,
  title,
  children,
  showCloseButton = true,
  className,
  overlayClassName,
}: ModalProps): ReactElement | null {
  // Handle ESC key
  useEffect(() => {
    if (!isOpen) return;

    const handleEscape = (event: KeyboardEvent): void => {
      if (event.key === 'Escape') {
        onClose();
      }
    };

    document.addEventListener('keydown', handleEscape);
    return () => document.removeEventListener('keydown', handleEscape);
  }, [isOpen, onClose]);

  // Prevent body scroll when modal is open
  useEffect(() => {
    if (isOpen) {
      document.body.style.overflow = 'hidden';
    } else {
      document.body.style.overflow = '';
    }

    return () => {
      document.body.style.overflow = '';
    };
  }, [isOpen]);

  if (!isOpen) return null;

  return (
    <div
      className={cn(
        'fixed inset-0 z-50',
        'flex items-center justify-center',
        'p-4',
        'animate-in fade-in duration-200'
      )}
      role="dialog"
      aria-modal="true"
      aria-labelledby={title ? 'modal-title' : undefined}
    >
      {/* Backdrop */}
      <div
        className={cn(
          'absolute inset-0',
          'bg-black/60 backdrop-blur-sm',
          overlayClassName
        )}
        onClick={onClose}
        aria-hidden="true"
      />

      {/* Modal content */}
      <FocusLock>
        <div
          className={cn(
            'relative',
            'bg-surface border border-border/20',
            'rounded-lg shadow-xl',
            'text-textColor',
            'max-w-md w-full',
            'max-h-[90vh] overflow-y-auto',
            'animate-in zoom-in-95 duration-normal',
            className
          )}
          onClick={(e) => e.stopPropagation()}
        >
          {/* Header */}
          {(title || showCloseButton) && (
            <div className="flex items-center justify-between p-4 md:p-6 border-b border-border/20">
              {title && (
                <h2
                  id="modal-title"
                  className="text-xl md:text-2xl font-bold text-textColor"
                >
                  {title}
                </h2>
              )}
              {showCloseButton && (
                <button
                  onClick={onClose}
                  className={cn(
                    'p-2 rounded-lg',
                    'text-textColor/60 hover:text-textColor hover:bg-primary/10',
                    'transition-colors duration-fast',
                    'focus:outline-none focus:ring-2 focus:ring-primary',
                    !title && 'ml-auto'
                  )}
                  aria-label="Close modal"
                  type="button"
                >
                  <svg
                    className="w-5 h-5"
                    fill="none"
                    viewBox="0 0 24 24"
                    stroke="currentColor"
                  >
                    <path
                      strokeLinecap="round"
                      strokeLinejoin="round"
                      strokeWidth={2}
                      d="M6 18L18 6M6 6l12 12"
                    />
                  </svg>
                </button>
              )}
            </div>
          )}

          {/* Body */}
          <div className="p-4 md:p-6">{children}</div>
        </div>
      </FocusLock>
    </div>
  );
}
