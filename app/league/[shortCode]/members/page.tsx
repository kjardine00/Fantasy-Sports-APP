"use client";

import React from "react";
import Link from "next/link";
import MembersTable from "./MembersTable";
import InviteLinkCard from "../../components/invite/InviteLinkCard";
import { useLeague } from "../LeagueContext";
import {
  PageContainer,
  PageHeader,
  PageSection,
} from "@/app/components/Layout";

const MembersPage = () => {
  const { league, isCommissioner } = useLeague();

  return (
    <PageContainer>
      <PageHeader
        title="League Members"
        breadcrumb={{
          label: `${league.name} page`,
          href: `/league/${league.short_code}`,
        }}
        actions={
          isCommissioner ? (
            <Link
              href={`/league/${league.short_code}/settings`}
              className="btn btn-primary rounded-full shadow-lg hover:shadow-xl transition-all duration-200 gap-2"
            >
              <svg
                xmlns="http://www.w3.org/2000/svg"
                className="h-5 w-5"
                fill="none"
                viewBox="0 0 24 24"
                stroke="currentColor"
              >
                <path
                  strokeLinecap="round"
                  strokeLinejoin="round"
                  strokeWidth={2}
                  d="M10.325 4.317c.426-1.756 2.924-1.756 3.35 0a1.724 1.724 0 002.573 1.066c1.543-.94 3.31.826 2.37 2.37a1.724 1.724 0 001.065 2.572c1.756.426 1.756 2.924 0 3.35a1.724 1.724 0 00-1.066 2.573c.94 1.543-.826 3.31-2.37 2.37a1.724 1.724 0 00-2.572 1.065c-.426 1.756-2.924 1.756-3.35 0a1.724 1.724 0 00-2.573-1.066c-1.543.94-3.31-.826-2.37-2.37a1.724 1.724 0 00-1.065-2.572c-1.756-.426-1.756-2.924 0-3.35a1.724 1.724 0 001.066-2.573c-.94-1.543.826-3.31 2.37-2.37.996.608 2.296.07 2.572-1.065z"
                />
                <path
                  strokeLinecap="round"
                  strokeLinejoin="round"
                  strokeWidth={2}
                  d="M15 12a3 3 0 11-6 0 3 3 0 016 0z"
                />
              </svg>
              League Settings
            </Link>
          ) : null
        }
      />

      <div className="mx-6 px-4 py-6">
        <InviteLinkCard leagueId={league.id!} />
      </div>

      <PageSection title="Members List" showBorderTop>
        <div className="overflow-x-auto">
          <MembersTable />
        </div>
      </PageSection>
    </PageContainer>
  );
};

export default MembersPage;
