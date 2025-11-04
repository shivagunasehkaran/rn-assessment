/**
 * Common UI component prop types
 */

/**
 * Props for components that display a message
 */
export interface MessageProps {
  message: string;
}

/**
 * Props for components that support retry actions
 */
export interface RetryActionProps {
  onRetry?: () => void;
}

/**
 * Props for components that can be conditionally visible
 */
export interface VisibleProps {
  visible: boolean;
}

/**
 * Size options for loader/spinner components
 */
export type LoaderSize = number | "small" | "large";

/**
 * Props for loader/spinner components
 */
export interface LoaderProps {
  size?: LoaderSize;
}

/**
 * Combined props for error state components
 */
export interface ErrorStateProps extends MessageProps, RetryActionProps {}

