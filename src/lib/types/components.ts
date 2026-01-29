import { InputHTMLAttributes, ReactNode } from 'react';
import { Card } from './card';
import { Rating } from 'ts-fsrs';

// Button Component Types
export type ButtonVariant = 'primary' | 'secondary' | 'danger';

export interface ButtonProps {
  variant?: ButtonVariant;
  children: ReactNode;
  fullWidth?: boolean;
  isLoading?: boolean;
  disabled?: boolean;
  onClick?: () => void;
  type?: 'button' | 'submit' | 'reset';
  className?: string;
}

// Card Component Types
export interface CardProps {
  children: ReactNode;
  className?: string;
  onClick?: () => void;
  hoverable?: boolean;
}

// Input Component Types
export interface InputProps extends Omit<InputHTMLAttributes<HTMLInputElement>, 'className'> {
  label?: string;
  error?: string;
  helperText?: string;
  className?: string;
}

// Container Component Types
export type ContainerSize = 'sm' | 'md' | 'lg' | 'xl';

export interface ContainerProps {
  children: ReactNode;
  className?: string;
  size?: ContainerSize;
}

// Navigation Types
export interface NavLink {
  href: string;
  label: string;
  icon?: ReactNode;
}

export interface NavigationProps {
  links: NavLink[];
  className?: string;
}

export interface MobileMenuProps {
  isOpen: boolean;
  onClose: () => void;
  links: NavLink[];
}

export interface HeaderProps {
  className?: string;
}

// FlashCard Component Types
export interface FlashCardProps {
  card: Card;
  isFlipped: boolean;
  onFlip: () => void;
  disabled?: boolean;
  className?: string;
}

export interface RatingButtonsProps {
  onRate: (rating: Rating) => void;
  disabled?: boolean;
  className?: string;
}

// Review Session Types
export interface ProgressBarProps {
  current: number;
  total: number;
  className?: string;
}

export interface SessionStats {
  total: number;
  reviewed: number;
  again: number;
  hard: number;
  good: number;
  easy: number;
}

export interface ReviewSummaryProps {
  stats: SessionStats;
  onReviewMore: () => void;
  onGoHome: () => void;
}
