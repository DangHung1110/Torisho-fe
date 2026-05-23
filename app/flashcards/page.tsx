'use client';

import { FormEvent, useCallback, useEffect, useMemo, useState } from 'react';
import Link from 'next/link';
import { useRouter } from 'next/navigation';
import {
  IconBook,
  IconCalendar,
  IconCards,
  IconDotsVertical,
  IconFolder,
  IconPlus,
  IconSearch,
  IconX,
} from '@tabler/icons-react';
import LearningShell from '@/src/components/LearningShell';
import { useAuth } from '@/src/libs/useAuth';
import { FlashcardService } from '@/src/services/flashcard.service';
import { FlashcardDeck, FlashcardFolder } from '@/src/types/flashcard';

export default function FlashcardsPage() {
  const router = useRouter();
  const { isAuthenticated, loading } = useAuth();
  const [decks, setDecks] = useState<FlashcardDeck[]>([]);
  const [folders, setFolders] = useState<FlashcardFolder[]>([]);
  const [activeFolderId, setActiveFolderId] = useState<string | null>(null);
  const [query, setQuery] = useState('');
  const [isLoading, setIsLoading] = useState(true);
  const [errorMessage, setErrorMessage] = useState<string | null>(null);
  const [isCreateOpen, setIsCreateOpen] = useState(false);

  const loadLibrary = useCallback(async () => {
    setIsLoading(true);
    setErrorMessage(null);

    try {
      const [deckResult, folderResult] = await Promise.all([
        FlashcardService.getDecks(activeFolderId),
        FlashcardService.getFolders(),
      ]);
      setDecks(deckResult);
      setFolders(folderResult);
    } catch (error) {
      setDecks([]);
      setFolders([]);
      setErrorMessage(error instanceof Error ? error.message : 'Unable to load flashcards.');
    } finally {
      setIsLoading(false);
    }
  }, [activeFolderId]);

  useEffect(() => {
    if (!loading && !isAuthenticated) {
      router.replace('/login');
    }
  }, [isAuthenticated, loading, router]);

  useEffect(() => {
    if (isAuthenticated) {
      void loadLibrary();
    }
  }, [isAuthenticated, loadLibrary]);

  const visibleDecks = useMemo(() => {
    const keyword = query.trim().toLowerCase();
    if (!keyword) return decks;

    return decks.filter((deck) => {
      const haystack = `${deck.name} ${deck.description ?? ''} ${deck.folderName ?? ''}`.toLowerCase();
      return haystack.includes(keyword);
    });
  }, [decks, query]);

  const totalCards = useMemo(
    () => decks.reduce((sum, deck) => sum + deck.totalItems, 0),
    [decks],
  );

  const hasLibraryContent = folders.length > 0 || decks.length > 0;

  return (
    <LearningShell active="flashcards">
      <div className="px-5 py-8 sm:px-8 lg:px-10 lg:py-12">
        <div className="mx-auto flex max-w-[1240px] gap-8">
          {hasLibraryContent && (
            <aside className="hidden w-72 shrink-0 border-r border-[#d7c3ae] pr-7 xl:block">
              <div className="sticky top-8">
                <p className="mb-4 text-sm font-extrabold uppercase tracking-[0.16em] text-[#835500]">
                  Flashcard
                </p>
                <button
                  type="button"
                  onClick={() => setActiveFolderId(null)}
                  className={`flex h-12 w-full items-center justify-between rounded-lg px-4 text-left transition-colors ${
                    activeFolderId === null
                      ? 'bg-[#fff1e4] font-bold text-[#211a12] ring-1 ring-[#d7c3ae]'
                      : 'text-[#3d2a17] hover:bg-[#fff1e4]'
                  }`}
                >
                  <span className="flex items-center gap-3">
                    <IconCards size={21} /> All Decks
                  </span>
                  <span className="rounded-full bg-[#eee0d2] px-2 py-0.5 text-xs">{decks.length}</span>
                </button>

                {folders.length > 0 && (
                  <div className="mt-7 space-y-2">
                    <p className="mb-3 text-xs font-extrabold uppercase tracking-[0.16em] text-[#665744]">
                      Folders
                    </p>
                    {folders.map((folder) => (
                      <button
                        key={folder.id}
                        type="button"
                        onClick={() => setActiveFolderId(folder.id)}
                        className={`flex min-h-11 w-full items-center justify-between gap-3 rounded-lg px-4 text-left transition-colors ${
                          activeFolderId === folder.id
                            ? 'bg-[#f5a623] font-bold text-[#291800]'
                            : 'text-[#3d2a17] hover:bg-[#fff1e4]'
                        }`}
                      >
                        <span className="flex min-w-0 items-center gap-3">
                          <IconFolder size={20} className="shrink-0" />
                          <span className="truncate">{folder.name}</span>
                        </span>
                        <span className="rounded-full bg-[#eee0d2] px-2 py-0.5 text-xs text-[#3d2a17]">
                          {folder.totalDecks}
                        </span>
                      </button>
                    ))}
                  </div>
                )}
              </div>
            </aside>
          )}

          <main className="min-w-0 flex-1">
            <div className="flex flex-col gap-5 md:flex-row md:items-center md:justify-between">
              <div>
                <p className="mb-3 text-sm font-extrabold uppercase tracking-[0.16em] text-[#835500]">
                  {totalCards} saved cards
                </p>
                <h1 className="torisho-display text-5xl font-bold leading-tight text-[#211a12] md:text-6xl">
                  Flashcard Decks
                </h1>
              </div>
              <div className="flex flex-col gap-3 sm:flex-row sm:items-center">
                <div className="relative">
                  <IconSearch
                    size={22}
                    className="pointer-events-none absolute left-4 top-1/2 -translate-y-1/2 text-[#857462]"
                  />
                  <input
                    value={query}
                    onChange={(event) => setQuery(event.target.value)}
                    className="h-14 w-full rounded-lg border border-[#d7c3ae] bg-white pl-12 pr-4 text-lg outline-none transition focus:border-[#f5a623] focus:ring-4 focus:ring-[#f5a623]/20 sm:w-80"
                    placeholder="Search decks..."
                  />
                </div>
                <button
                  type="button"
                  onClick={() => setIsCreateOpen(true)}
                  className="h-14 rounded-full bg-[#f5a623] px-8 text-lg font-bold text-[#291800] transition-colors hover:bg-[#ffb955]"
                >
                  Create Deck
                </button>
              </div>
            </div>

            {errorMessage && (
              <div className="mt-7 rounded-xl border border-[#ffdad6] bg-white px-5 py-4 text-[#93000a]">
                {errorMessage}
              </div>
            )}

            {isLoading ? (
              <DeckGridSkeleton />
            ) : visibleDecks.length > 0 ? (
              <div className="mt-9 grid grid-cols-1 gap-6 md:grid-cols-2 2xl:grid-cols-3">
                {visibleDecks.map((deck) => (
                  <DeckCard key={deck.id} deck={deck} />
                ))}
                <CreateDeckCard onClick={() => setIsCreateOpen(true)} />
              </div>
            ) : (
              <div className="mt-10 max-w-md">
                <CreateDeckCard onClick={() => setIsCreateOpen(true)} large />
              </div>
            )}
          </main>
        </div>
      </div>

      <CreateDeckModal
        isOpen={isCreateOpen}
        folders={folders}
        onClose={() => setIsCreateOpen(false)}
        onCreated={() => {
          setIsCreateOpen(false);
          void loadLibrary();
        }}
      />
    </LearningShell>
  );
}

function DeckCard({ deck }: { deck: FlashcardDeck }) {
  return (
    <article className="group flex min-h-[250px] flex-col rounded-xl border border-[#d7c3ae] bg-white p-7 shadow-[0_10px_28px_rgba(26,20,16,0.04)] transition hover:-translate-y-1 hover:shadow-[0_18px_34px_rgba(26,20,16,0.08)]">
      <div className="mb-5 flex items-start justify-between gap-4">
        <span className="rounded bg-[#62fae3] px-2 py-1 text-xs font-extrabold text-[#00201c]">
          {deck.folderName || 'Custom'}
        </span>
        <button type="button" className="rounded-full p-1 text-[#665744] hover:bg-[#fff1e4]">
          <IconDotsVertical size={20} />
        </button>
      </div>
      <h2 className="torisho-display text-3xl font-bold leading-tight text-[#211a12]">
        {deck.name}
      </h2>
      <p className="mt-3 line-clamp-3 min-h-[4.8rem] text-lg leading-relaxed text-[#3d2a17]">
        {deck.description || 'Custom Japanese vocabulary and kanji collection.'}
      </p>
      <div className="mt-5 flex flex-wrap gap-4 text-[#3d2a17]">
        <span className="flex items-center gap-2">
          <IconBook size={18} /> {deck.totalItems} cards
        </span>
        <span className="flex items-center gap-2">
          <IconCalendar size={18} /> {formatDate(deck.createdAt)}
        </span>
      </div>
      <div className="mt-auto border-t border-[#d7c3ae] pt-5">
        <Link
          href={`/flashcards/${deck.id}`}
          className="inline-flex items-center gap-2 font-bold text-[#835500] no-underline transition-all group-hover:gap-3"
        >
          Study Now <span aria-hidden>→</span>
        </Link>
      </div>
    </article>
  );
}

function CreateDeckCard({ onClick, large = false }: { onClick: () => void; large?: boolean }) {
  return (
    <button
      type="button"
      onClick={onClick}
      className={`flex flex-col items-center justify-center rounded-xl border-2 border-dashed border-[#d7c3ae] bg-[#fff1e4] p-8 text-center transition hover:border-[#835500] hover:bg-[#faebdd] ${
        large ? 'min-h-[300px]' : 'min-h-[250px]'
      }`}
    >
      <span className="flex h-20 w-20 items-center justify-center rounded-full bg-[#eee0d2] text-[#665744]">
        <IconPlus size={34} />
      </span>
      <span className="torisho-display mt-6 text-3xl font-bold text-[#211a12]">Create New Deck</span>
      <span className="mt-3 max-w-56 text-[#665744]">
        Start building a custom collection of vocabulary or kanji.
      </span>
    </button>
  );
}

function CreateDeckModal({
  isOpen,
  folders,
  onClose,
  onCreated,
}: {
  isOpen: boolean;
  folders: FlashcardFolder[];
  onClose: () => void;
  onCreated: () => void;
}) {
  const [name, setName] = useState('');
  const [description, setDescription] = useState('');
  const [folderId, setFolderId] = useState('');
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [message, setMessage] = useState<string | null>(null);

  if (!isOpen) {
    return null;
  }

  const handleSubmit = async (event: FormEvent<HTMLFormElement>) => {
    event.preventDefault();

    if (!name.trim()) {
      setMessage('Deck name is required.');
      return;
    }

    setIsSubmitting(true);
    setMessage(null);

    try {
      await FlashcardService.createDeck({
        name: name.trim(),
        description: description.trim() || null,
        folderId: folderId || null,
      });
      setName('');
      setDescription('');
      setFolderId('');
      onCreated();
    } catch (error) {
      setMessage(error instanceof Error ? error.message : 'Unable to create deck.');
    } finally {
      setIsSubmitting(false);
    }
  };

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center bg-[#211a12]/45 p-4">
      <form
        onSubmit={handleSubmit}
        className="w-full max-w-lg rounded-xl border border-[#d7c3ae] bg-white p-6 shadow-[0_24px_60px_rgba(26,20,16,0.18)]"
      >
        <div className="flex items-start justify-between gap-4">
          <div>
            <p className="text-sm font-extrabold uppercase tracking-[0.14em] text-[#835500]">
              New flashcard deck
            </p>
            <h2 className="torisho-display mt-1 text-3xl font-bold">Create Deck</h2>
          </div>
          <button type="button" onClick={onClose} className="rounded-full p-2 hover:bg-[#fff1e4]">
            <IconX size={20} />
          </button>
        </div>

        <label className="mt-6 block">
          <span className="mb-2 block text-sm font-extrabold uppercase tracking-[0.12em] text-[#3d2a17]">
            Name
          </span>
          <input
            value={name}
            onChange={(event) => setName(event.target.value)}
            className="h-12 w-full rounded-lg border border-[#d7c3ae] bg-[#fff8f4] px-4 outline-none focus:border-[#f5a623]"
            placeholder="JLPT N5 vocabulary"
          />
        </label>

        <label className="mt-4 block">
          <span className="mb-2 block text-sm font-extrabold uppercase tracking-[0.12em] text-[#3d2a17]">
            Description
          </span>
          <textarea
            value={description}
            onChange={(event) => setDescription(event.target.value)}
            className="min-h-24 w-full rounded-lg border border-[#d7c3ae] bg-[#fff8f4] px-4 py-3 outline-none focus:border-[#f5a623]"
            placeholder="Optional"
          />
        </label>

        {folders.length > 0 && (
          <label className="mt-4 block">
            <span className="mb-2 block text-sm font-extrabold uppercase tracking-[0.12em] text-[#3d2a17]">
              Folder
            </span>
            <select
              value={folderId}
              onChange={(event) => setFolderId(event.target.value)}
              className="h-12 w-full rounded-lg border border-[#d7c3ae] bg-[#fff8f4] px-4 outline-none focus:border-[#f5a623]"
            >
              <option value="">No folder</option>
              {folders.map((folder) => (
                <option key={folder.id} value={folder.id}>
                  {folder.name}
                </option>
              ))}
            </select>
          </label>
        )}

        {message && <p className="mt-4 rounded-lg bg-[#fff1e4] px-4 py-3 text-[#93000a]">{message}</p>}

        <div className="mt-6 flex justify-end gap-3">
          <button type="button" onClick={onClose} className="rounded-full border border-[#d7c3ae] px-6 py-3 font-bold">
            Cancel
          </button>
          <button
            type="submit"
            disabled={isSubmitting}
            className="rounded-full bg-[#f5a623] px-7 py-3 font-bold text-[#291800] disabled:opacity-60"
          >
            {isSubmitting ? 'Creating...' : 'Create Deck'}
          </button>
        </div>
      </form>
    </div>
  );
}

function DeckGridSkeleton() {
  return (
    <div className="mt-9 grid animate-pulse grid-cols-1 gap-6 md:grid-cols-2 2xl:grid-cols-3">
      {Array.from({ length: 3 }).map((_, index) => (
        <div key={index} className="h-64 rounded-xl border border-[#d7c3ae] bg-white" />
      ))}
    </div>
  );
}

function formatDate(value: string) {
  const date = new Date(value);
  if (Number.isNaN(date.getTime())) {
    return '-';
  }

  return new Intl.DateTimeFormat('en', {
    month: 'short',
    day: '2-digit',
  }).format(date);
}
