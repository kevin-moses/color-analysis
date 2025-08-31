// Common component props for styling consistency
export interface BaseComponentProps {
  className?: string;
}

export interface CardProps extends BaseComponentProps {
  title?: string;
  compact?: boolean;
}
