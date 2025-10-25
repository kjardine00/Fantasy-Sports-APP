import React from "react";

interface PageSectionProps {
  /**
   * Section title
   */
  title: string;
  /**
   * Section content
   */
  children: React.ReactNode;
  /**
   * Whether to show a border-top separator (useful for sections after the first one)
   */
  showBorderTop?: boolean;
}

/**
 * PageSection - Reusable section container for organized content
 * Features: title with gradient accent bar, styled content wrapper
 */
const PageSection: React.FC<PageSectionProps> = ({
  title,
  children,
  showBorderTop = false,
}) => {
  return (
    <div
      className={`mx-6 px-4 py-8 ${showBorderTop ? "border-t border-base-300" : ""}`}
    >
      <div className="flex items-center gap-3 mb-6">
        <div className="w-1 h-8 bg-gradient-to-b from-primary to-secondary rounded-full"></div>
        <h2 className="text-2xl font-bold text-base-content">{title}</h2>
      </div>
      <div className="bg-base-200/50 rounded-xl p-4 shadow-inner">
        {children}
      </div>
    </div>
  );
};

export default PageSection;

