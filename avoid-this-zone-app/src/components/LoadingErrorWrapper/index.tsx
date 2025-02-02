import React from "react";
import { Spin, Alert } from "antd";

interface LoadingErrorWrapperProps {
  loading: boolean;
  error: string | null;
  /** Optional custom loading message */
  loadingMessage?: string;
  /** Optional custom error message */
  errorMessage?: string;
  children: React.ReactNode;
}

/**
 * LoadingErrorWrapper
 *
 * This component checks for loading or error states before rendering its children.
 * It’s designed to be a reusable building block that can be deployed across
 * our application wherever we need to show the state of asynchronous operations.
 *
 * Our approach here is simple and clear—freeing our codebase from the clutter of
 * hidden complexities imposed by an over-complicated system.
 */
const LoadingErrorWrapper: React.FC<LoadingErrorWrapperProps> = ({
  loading,
  error,
  loadingMessage = "Loading...",
  errorMessage = "An error occurred",
  children,
}) => {
  if (loading) {
    return (
      <div className="results-content">
        <Spin tip={loadingMessage} />
      </div>
    );
  }

  if (error) {
    return (
      <div className="results-content">
        <Alert
          message={errorMessage}
          description={error}
          type="error"
          showIcon
          closable
        />
      </div>
    );
  }

  return <>{children}</>;
};

export default LoadingErrorWrapper;
