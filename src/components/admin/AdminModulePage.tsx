'use client';

import Link from 'next/link';
import { IconArrowRight, IconLock, IconShieldCheck } from '@tabler/icons-react';
import { hasPermission } from '@/src/libs/rbac';
import { useAuth } from '@/src/libs/useAuth';

type AdminModuleAction = {
  label: string;
  description: string;
  href?: string;
};

type AdminModulePageProps = {
  title: string;
  eyebrow: string;
  description: string;
  permission: string;
  secondaryPermissions?: string[];
  actions: AdminModuleAction[];
  notes?: string[];
};

export function AdminModulePage({
  title,
  eyebrow,
  description,
  permission,
  secondaryPermissions = [],
  actions,
  notes = [],
}: AdminModulePageProps) {
  const { user } = useAuth();
  const allowed = hasPermission(user, permission);

  return (
    <div className="px-5 py-8 sm:px-8 lg:px-10 lg:py-12">
      <div className="mx-auto max-w-[1240px] space-y-8">
        <header className="border-b border-[#d7c3ae] pb-7">
          <p className="text-xs font-extrabold uppercase tracking-[0.14em] text-[#835500]">
            {eyebrow}
          </p>
          <div className="mt-2 flex flex-col gap-4 md:flex-row md:items-end md:justify-between">
            <div>
              <h1 className="torisho-display text-4xl font-bold leading-tight text-[#211a12] md:text-5xl">
                {title}
              </h1>
              <p className="mt-3 max-w-2xl text-lg text-[#524534]">{description}</p>
            </div>
            <span
              className={`inline-flex w-fit items-center gap-2 rounded-full border px-5 py-3 font-bold ${
                allowed
                  ? 'border-[#62fae3] bg-[#62fae3]/30 text-[#007165]'
                  : 'border-[#d7c3ae] bg-[#eee0d2] text-[#857462]'
              }`}
            >
              {allowed ? <IconShieldCheck size={20} /> : <IconLock size={20} />}
              {allowed ? 'Permission enabled' : 'No permission'}
            </span>
          </div>
        </header>

        <section className="grid grid-cols-1 gap-5 xl:grid-cols-[1fr_360px]">
          <div className="grid grid-cols-1 gap-5 md:grid-cols-2">
            {actions.map((action) => (
              <article
                key={action.label}
                className="rounded-xl border border-[#d7c3ae] bg-white p-6 shadow-[0_10px_28px_rgba(26,20,16,0.04)]"
              >
                <h2 className="torisho-display text-2xl font-semibold text-[#211a12]">
                  {action.label}
                </h2>
                <p className="mt-2 min-h-[76px] text-[#524534]">{action.description}</p>
                {action.href ? (
                  <Link
                    href={action.href}
                    className={`mt-5 inline-flex h-11 items-center justify-center gap-2 rounded-full px-5 font-bold no-underline transition-colors ${
                      allowed
                        ? 'bg-[#f5a623] text-[#291800] hover:bg-[#ffb955]'
                        : 'pointer-events-none border border-[#d7c3ae] bg-[#eee0d2] text-[#857462]'
                    }`}
                  >
                    Open <IconArrowRight size={18} />
                  </Link>
                ) : (
                  <span className="mt-5 inline-flex h-11 items-center rounded-full border border-[#d7c3ae] bg-[#fff8f4] px-5 font-bold text-[#857462]">
                    API connection pending
                  </span>
                )}
              </article>
            ))}
          </div>

          <aside className="space-y-5">
            <article className="rounded-xl border border-[#d7c3ae] bg-white p-6 shadow-[0_10px_28px_rgba(26,20,16,0.04)]">
              <h2 className="torisho-display text-2xl font-bold text-[#211a12]">
                Required Permissions
              </h2>
              <div className="mt-5 space-y-3">
                {[permission, ...secondaryPermissions].map((item) => {
                  const active = hasPermission(user, item);

                  return (
                    <div
                      key={item}
                      className="flex items-center justify-between gap-3 rounded-lg border border-[#d7c3ae] bg-[#fff8f4] px-4 py-3"
                    >
                      <span className="break-all font-semibold text-[#3d2a17]">{item}</span>
                      <span
                        className={`shrink-0 rounded-full px-3 py-1 text-xs font-bold uppercase tracking-[0.08em] ${
                          active ? 'bg-[#62fae3]/40 text-[#007165]' : 'bg-[#eee0d2] text-[#857462]'
                        }`}
                      >
                        {active ? 'On' : 'Off'}
                      </span>
                    </div>
                  );
                })}
              </div>
            </article>

            <article className="rounded-xl border border-[#d7c3ae] bg-[#fff1e4] p-6">
              <h2 className="torisho-display text-2xl font-bold text-[#211a12]">
                Implementation Notes
              </h2>
              <ul className="mt-4 space-y-3 text-[#524534]">
                {notes.length > 0 ? (
                  notes.map((note) => <li key={note}>{note}</li>)
                ) : (
                  <li>Connect this screen to admin endpoints when those endpoints are available.</li>
                )}
              </ul>
            </article>
          </aside>
        </section>
      </div>
    </div>
  );
}
