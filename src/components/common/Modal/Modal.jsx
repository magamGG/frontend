import { X } from 'lucide-react';
import { Card } from '@/app/components/ui/card';
import { Button } from '@/app/components/ui/button';
import {
  ModalOverlay,
  ModalCard,
  ModalHeader,
  ModalTitle,
  ModalBody,
} from './Modal.styled';

/**
 * @param {Object} props
 * @param {boolean} props.isOpen
 * @param {() => void} props.onClose
 * @param {string | import('react').ReactNode} [props.title]
 * @param {import('react').ReactNode} props.children
 * @param {'sm' | 'md' | 'lg' | 'xl' | '2xl' | '3xl' | '4xl' | '5xl' | '6xl'} [props.maxWidth]
 * @param {boolean} [props.showCloseButton]
 */
export function Modal({ 
  isOpen, 
  onClose, 
  title, 
  children, 
  maxWidth = 'md',
  showCloseButton = true 
}) {
  if (!isOpen) return null;

  return (
    <ModalOverlay onClick={onClose}>
      <ModalCard 
        as={Card}
        $maxWidth={maxWidth}
        onClick={(e) => e.stopPropagation()}
      >
        {(title || showCloseButton) && (
          <ModalHeader>
            {title && <ModalTitle>{title}</ModalTitle>}
            {showCloseButton && (
              <Button 
                variant="ghost" 
                size="sm" 
                onClick={onClose}
                style={{ marginLeft: 'auto' }}
              >
                <X style={{ width: '20px', height: '20px' }} />
              </Button>
            )}
          </ModalHeader>
        )}
        <ModalBody>
          {children}
        </ModalBody>
      </ModalCard>
    </ModalOverlay>
  );
}
