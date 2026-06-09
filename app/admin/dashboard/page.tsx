'use client';

import Link from 'next/link';
import {
  IconActivity,
  IconBook,
  IconBook2,
  IconChartBar,
  IconChevronRight,
  IconCircleCheck,
  IconDatabase,
  IconFileImport,
  IconMessageCircle,
  IconShieldCheck,
  IconUsers,
} from '@tabler/icons-react';
import { AppPermissions, hasPermission } from '@/src/libs/rbac';
import { useAuth } from '@/src/libs/useAuth';

const modules = [
  {
    title: 'User Management',
    description: 'Review accounts, status, and role assignments.',
    href: '/admin/users',
    permission: AppPermissions.UsersRead,
    secondaryPermission: AppPermissions.UsersManage,
    icon: IconUsers,
  },
  {
    title: 'Curriculum Import',
    description: 'Import and maintain JLPT levels, chapters, lessons, vocabulary, grammar, and reading content.',
    href: '/admin/curriculum',
    permission: AppPermissions.CurriculumImport,
    secondaryPermission: undefined,
    icon: IconFileImport,
  },
  {
    title: 'Quiz Management',
    description: 'Preview, generate, and maintain daily and lesson quizzes.',
    href: '/admin/quizzes',
    permission: AppPermissions.QuizManage,
    secondaryPermission: undefined,
    icon: IconBook2,
  },
  {
    title: 'Dictionary Management',
    description: 'Review dictionary entries, kanji data, examples, and metadata.',
    href: '/admin/dictionary',
    permission: AppPermissions.DictionaryManage,
    secondaryPermission: undefined,
    icon: IconBook,
  },
  {
    title: 'Speaking Rooms',
    description: 'Monitor speaking practice rooms and room activity.',
    href: '/admin/speaking-rooms',
    permission: AppPermissions.RoomsMonitor,
    secondaryPermission: undefined,
    icon: IconMessageCircle,
  },
  {
    title: 'Reports',
    description: 'Prepare usage, learning, and operational reports.',
    href: '/admin/reports',
    permission: AppPermissions.AdminAccess,
    secondaryPermission: undefined,
    icon: IconChartBar,
  },
] as const;

export default function AdminDashboardPage() {
  const { user } = useAuth();
  const enabledModules = modules.filter((item) => hasPermission(user, item.permission)).length;
  const permissionCount = user?.permissions?.length ?? 0;

  const summaryCards = [
    {
      label: 'Admin Session',
      value: 'Active',
      caption: user?.username || 'admin',
      icon: IconShieldCheck,
    },
    {
      label: 'Permissions',
      value: String(permissionCount),
      caption: 'Granted by backend JWT',
      icon: IconCircleCheck,
    },
    {
      label: 'Modules Enabled',
      value: `${enabledModules}/${modules.length}`,
      caption: 'Based on RBAC claims',
      icon: IconActivity,
    },
    {
      label: 'Data Source',
      value: 'RBAC',
      caption: 'Admin API metrics pending',
      icon: IconDatabase,
    },
  ];

  return (
    <div className="px-5 py-8 sm:px-8 lg:px-10 lg:py-12">
      <div className="mx-auto max-w-[1240px] space-y-8">
        <header className="border-b border-[#d7c3ae] pb-7">
          <div className="flex flex-col gap-4 md:flex-row md:items-end md:justify-between">
            <div>
              <p className="text-xs font-extrabold uppercase tracking-[0.14em] text-[#835500]">
                Admin workspace
              </p>
              <h1 className="torisho-display mt-2 text-4xl font-bold leading-tight text-[#211a12] md:text-5xl">
                Admin Dashboard
              </h1>
              <p className="mt-3 max-w-2xl text-lg text-[#524534]">
                Manage users, content, quizzes, dictionary data, and speaking practice rooms.
              </p>
            </div>
            <div className="rounded-xl border border-[#d7c3ae] bg-white px-5 py-4 shadow-[0_4px_12px_rgba(26,20,16,0.05)]">
              <p className="text-xs font-bold uppercase tracking-[0.12em] text-[#857462]">
                Signed in
              </p>
              <p className="mt-1 text-lg font-bold text-[#211a12]">
                {user?.fullName || user?.username || 'Torisho Admin'}
              </p>
              <p className="text-sm text-[#524534]">
                {new Intl.DateTimeFormat('en-US', {
                  weekday: 'long',
                  month: 'long',
                  day: 'numeric',
                }).format(new Date())}
              </p>
            </div>
          </div>
        </header>

        <section className="grid grid-cols-1 gap-5 md:grid-cols-2 xl:grid-cols-4">
          {summaryCards.map((card) => {
            const Icon = card.icon;

            return (
              <article
                key={card.label}
                className="rounded-xl border border-[#d7c3ae] bg-white p-6 shadow-[0_10px_28px_rgba(26,20,16,0.04)]"
              >
                <div className="flex items-start justify-between gap-4">
                  <span className="flex h-12 w-12 items-center justify-center rounded-lg bg-[#fff1e4] text-[#835500]">
                    <Icon size={26} />
                  </span>
                  <span className="rounded-full border border-[#62fae3] bg-[#62fae3]/30 px-3 py-1 text-xs font-bold uppercase tracking-[0.08em] text-[#007165]">
                    Online
                  </span>
                </div>
                <p className="mt-5 text-sm font-extrabold uppercase tracking-[0.1em] text-[#524534]">
                  {card.label}
                </p>
                <p className="torisho-display mt-2 text-4xl font-bold text-[#211a12]">
                  {card.value}
                </p>
                <p className="mt-1 text-sm text-[#857462]">{card.caption}</p>
              </article>
            );
          })}
        </section>

        <section>
          <div className="mb-5 flex flex-col gap-2 md:flex-row md:items-end md:justify-between">
            <div>
              <h2 className="torisho-display text-3xl font-bold text-[#211a12]">
                Admin Modules
              </h2>
              <p className="mt-1 text-[#524534]">
                Actions are shown by the permissions currently returned from the backend.
              </p>
            </div>
          </div>
          <div className="grid grid-cols-1 gap-5 md:grid-cols-2 xl:grid-cols-3">
            {modules.map((module) => {
              const Icon = module.icon;
              const allowed = hasPermission(user, module.permission);
              const secondaryAllowed = module.secondaryPermission
                ? hasPermission(user, module.secondaryPermission)
                : false;

              return (
                <article
                  key={module.title}
                  className="flex min-h-[260px] flex-col rounded-xl border border-[#d7c3ae] bg-white p-6 shadow-[0_10px_28px_rgba(26,20,16,0.04)]"
                >
                  <div className="flex items-start justify-between gap-4">
                    <span className="flex h-12 w-12 items-center justify-center rounded-lg bg-[#fff1e4] text-[#835500]">
                      <Icon size={26} />
                    </span>
                    <span
                      className={`rounded-full border px-3 py-1 text-xs font-bold uppercase tracking-[0.08em] ${
                        allowed
                          ? 'border-[#62fae3] bg-[#62fae3]/30 text-[#007165]'
                          : 'border-[#d7c3ae] bg-[#eee0d2] text-[#857462]'
                      }`}
                    >
                      {allowed ? 'Enabled' : 'No permission'}
                    </span>
                  </div>
                  <h3 className="torisho-display mt-5 text-2xl font-semibold leading-tight text-[#211a12]">
                    {module.title}
                  </h3>
                  <p className="mt-2 flex-1 text-[#524534]">{module.description}</p>
                  <div className="mt-5 space-y-2 border-t border-[#d7c3ae] pt-4 text-sm font-semibold text-[#835500]">
                    <p>{module.permission}</p>
                    {module.secondaryPermission && (
                      <p className={secondaryAllowed ? 'text-[#007165]' : 'text-[#857462]'}>
                        {module.secondaryPermission}
                      </p>
                    )}
                  </div>
                  <Link
                    href={module.href}
                    className={`mt-5 inline-flex h-11 items-center justify-center gap-2 rounded-full px-5 font-bold no-underline transition-colors ${
                      allowed
                        ? 'bg-[#f5a623] text-[#291800] hover:bg-[#ffb955]'
                        : 'pointer-events-none border border-[#d7c3ae] bg-[#eee0d2] text-[#857462]'
                    }`}
                  >
                    Open <IconChevronRight size={18} />
                  </Link>
                </article>
              );
            })}
          </div>
        </section>

        <section className="grid grid-cols-1 gap-5 xl:grid-cols-[1fr_360px]">
          <article className="rounded-xl border border-[#d7c3ae] bg-white p-6 shadow-[0_10px_28px_rgba(26,20,16,0.04)]">
            <h2 className="torisho-display text-3xl font-bold text-[#211a12]">
              Recent Activity
            </h2>
            <div className="mt-6 rounded-lg border border-dashed border-[#d7c3ae] bg-[#fff8f4] p-8 text-center">
              <p className="text-lg font-bold text-[#3d2a17]">No admin activity endpoint connected yet.</p>
              <p className="mt-2 text-[#524534]">
                Add an audit-log endpoint later and this table can show imports, quiz generation, user updates, and moderation events.
              </p>
            </div>
          </article>

          <aside className="space-y-5">
            <article className="rounded-xl border border-[#d7c3ae] bg-white p-6 shadow-[0_10px_28px_rgba(26,20,16,0.04)]">
              <h2 className="torisho-display text-2xl font-bold text-[#211a12]">
                System Health
              </h2>
              <div className="mt-5 space-y-3">
                {['JWT role claims', 'Permission policies', 'Admin seed', 'Frontend guard'].map((item) => (
                  <div key={item} className="flex items-center justify-between rounded-lg border border-[#d7c3ae] bg-[#fff8f4] px-4 py-3">
                    <span className="font-semibold text-[#3d2a17]">{item}</span>
                    <span className="rounded-full bg-[#62fae3]/40 px-3 py-1 text-xs font-bold uppercase tracking-[0.08em] text-[#007165]">
                      Ready
                    </span>
                  </div>
                ))}
              </div>
            </article>

            <article className="rounded-xl border border-[#d7c3ae] bg-[#fff1e4] p-6">
              <h2 className="torisho-display text-2xl font-bold text-[#211a12]">
                RBAC Summary
              </h2>
              <p className="mt-3 text-[#524534]">
                Admin UI checks role and permission claims for navigation. Backend policies remain the source of truth for protected operations.
              </p>
            </article>
          </aside>
        </section>
      </div>
    </div>
  );
}
