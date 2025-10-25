import React from "react";

interface PageContainerProps {
  children?: React.ReactNode;
  /**
   * Whether to show a loading spinner instead of content
   */
  isLoading?: boolean;
}

/**
 * PageContainer - Wraps a single-pane focused page with consistent styling
 * Features: gradient background, centered card with shadow and border
 */
const PageContainer: React.FC<PageContainerProps> = ({
  children,
  isLoading = false,
}) => {
  return (
    <div className="min-h-screen bg-gradient-to-br from-base-200 to-base-300">
      <div className="container mx-auto px-4 py-8">
        <div className="card w-full bg-base-100 shadow-2xl border border-base-300">
          {isLoading ? (
            <div className="flex items-center justify-center p-8">
              <span className="loading loading-spinner loading-lg"></span>
            </div>
          ) : (
            children
          )}
        </div>
      </div>
    </div>
  );
};

export default PageContainer;

