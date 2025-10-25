import React from "react";
import Link from "next/link";

interface BreadcrumbLink {
  label: string;
  href: string;
}

interface PageHeaderProps {
  /**
   * Main title of the page
   */
  title: string;
  /**
   * Optional breadcrumb link to navigate back
   */
  breadcrumb?: BreadcrumbLink;
  /**
   * Optional action buttons/elements to display in the header
   */
  actions?: React.ReactNode;
}

/**
 * PageHeader - Styled header section for single-pane pages
 * Features: gradient background, styled title, breadcrumb navigation, action button area
 */
const PageHeader: React.FC<PageHeaderProps> = ({
  title,
  breadcrumb,
  actions,
}) => {
  return (
    <div className="bg-gradient-to-r from-primary/10 to-secondary/10 border-b border-base-300">
      <div className="flex flex-col md:flex-row md:items-center md:justify-between gap-4 mx-6 px-4 py-6">
        <div className="flex flex-col gap-2">
          <h1 className="text-3xl font-bold bg-gradient-to-r from-primary to-secondary bg-clip-text text-transparent">
            {title}
          </h1>
          {breadcrumb && (
            <Link
              href={breadcrumb.href}
              className="text-sm font-semibold text-base-content/60 hover:text-primary transition-all duration-200 flex items-center gap-2 w-fit"
            >
              <svg
                xmlns="http://www.w3.org/2000/svg"
                className="h-4 w-4"
                fill="none"
                viewBox="0 0 24 24"
                stroke="currentColor"
              >
                <path
                  strokeLinecap="round"
                  strokeLinejoin="round"
                  strokeWidth={2}
                  d="M10 19l-7-7m0 0l7-7m-7 7h18"
                />
              </svg>
              Back to {breadcrumb.label}
            </Link>
          )}
        </div>

        {actions && <div className="flex gap-2">{actions}</div>}
      </div>
    </div>
  );
};

export default PageHeader;

