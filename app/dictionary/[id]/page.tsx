'use client';

import { Suspense, useCallback, useEffect, useMemo, useState } from 'react';
import Link from 'next/link';
import { useParams, useRouter, useSearchParams } from 'next/navigation';
import {
  IconArrowLeft,
  IconBookmarkPlus,
  IconPlus,
  IconX,
} from '@tabler/icons-react';
import LearningShell from '@/src/components/LearningShell';
import KanjiModal from '@/src/components/Dictionary/KanjiModal';
import { useAuth } from '@/src/libs/useAuth';
import CommentSection from '@/src/components/Dictionary/CommentSection';
import { dictionaryService } from '@/src/services/dictionary.service';
import { FlashcardService } from '@/src/services/flashcard.service';
import { POS_MAP } from '@/src/constants/pos_map';
import { WordDetail, WordExample, WordSense } from '@/src/types/dictionary';
import { FlashcardDeck } from '@/src/types/flashcard';

function WordDetailPageContent() {
  const { isAuthenticated, user } = useAuth();
  const router = useRouter();
  const params = useParams<{ id: string | string[] }>();
  const searchParams = useSearchParams();
  const rawWordId = params?.id;
  const wordId = Array.isArray(rawWordId) ? rawWordId[0] : rawWordId;
  const keyword = searchParams.get('keyword')?.trim() ?? '';
  const backHref = keyword ? `/dictionary?keyword=${encodeURIComponent(keyword)}` : '/dictionary';

  const [word, setWord] = useState<WordDetail | null>(null);
  const [isLoading, setIsLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const [selectedKanji, setSelectedKanji] = useState<string | null>(null);
  const [isFlashcardModalOpen, setIsFlashcardModalOpen] = useState(false);

  useEffect(() => {
    let active = true;

    if (!wordId) {
      setWord(null);
      setError('Invalid word id.');
      setIsLoading(false);
      return () => {
        active = false;
      };
    }

    async function load() {
      setIsLoading(true);
      setError(null);

      try {
        const detail = await dictionaryService.getDetail(wordId);
        if (active) {
          setWord(detail);
        }
      } catch (err) {
        if (active) {
          setError(err instanceof Error ? err.message : 'Unable to load word.');
        }
      } finally {
        if (active) {
          setIsLoading(false);
        }
      }
    }

    void load();
    return () => {
      active = false;
    };
  }, [wordId]);

  const kanjiCharacters = useMemo(() => {
    if (!word?.kanji) {
      return [];
    }

    return Array.from(new Set(Array.from(word.kanji).filter(isKanjiCharacter)));
  }, [word?.kanji]);

  const primaryMeaning = word ? getPrimaryMeaning(word.senses) : '';
  const posLabel = word ? getPrimaryPosLabel(word.senses) : null;
  const currentUser = useMemo(() => {
    if (!isAuthenticated || !user) return null;

    return {
      id: user.id,
      fullName: user.username ?? user.email ?? 'User',
      avatarUrl: user.avatarUrl ?? null,
    };
  }, [isAuthenticated, user]);

  return (
    <LearningShell active="vocabulary">
      <div className="px-5 py-8 sm:px-8 lg:px-10 lg:py-12">
        <div className="mx-auto max-w-[1240px]">
          <Link
            href={backHref}
            className="mb-7 inline-flex items-center gap-2 rounded-full border border-[#d7c3ae] bg-white px-4 py-2 text-sm font-bold text-[#3d2a17] no-underline transition-colors hover:bg-[#fff1e4]"
          >
            <IconArrowLeft size={18} /> Back to Dictionary
          </Link>

          {isLoading ? (
            <DetailSkeleton />
          ) : error ? (
            <div className="rounded-xl border border-[#ffdad6] bg-white p-8 text-[#93000a]">
              {error}
            </div>
          ) : word ? (
            <div className="grid gap-8 xl:grid-cols-[360px_minmax(0,1fr)]">
              <aside className="space-y-7 xl:sticky xl:top-8 xl:self-start">
                <section className="rounded-xl border border-[#d7c3ae] bg-white p-9 text-center shadow-[0_12px_32px_rgba(26,20,16,0.05)]">
                  {word.kanji && <p className="torisho-jp text-2xl text-[#3d2a17]">{word.kana}</p>}
                  <h1 className="torisho-jp mt-4 break-words text-6xl font-bold leading-tight text-[#211a12]">
                    {word.kanji ?? word.kana}
                  </h1>
                  <div className="mt-6 flex flex-wrap justify-center gap-3">
                    {word.isCommon && <Badge tone="warm">Common</Badge>}
                    {posLabel && <Badge tone="cool">{posLabel}</Badge>}
                  </div>
                  {primaryMeaning && (
                    <p className="mt-7 text-2xl font-bold text-[#211a12]">{primaryMeaning}</p>
                  )}
                  <button
                    type="button"
                    onClick={() => {
                      if (!isAuthenticated) {
                        router.push('/login');
                        return;
                      }
                      setIsFlashcardModalOpen(true);
                    }}
                    className="mt-9 flex h-14 w-full items-center justify-center gap-3 rounded-full bg-[#f5a623] text-lg font-bold text-[#291800] transition-colors hover:bg-[#ffb955]"
                  >
                    <IconBookmarkPlus size={22} /> Save to Flashcard
                  </button>
                </section>

                <section className="rounded-xl border border-[#d7c3ae] bg-white p-7 shadow-[0_12px_32px_rgba(26,20,16,0.05)]">
                  <h2 className="torisho-display text-3xl font-bold">Kanji breakdown</h2>
                  {kanjiCharacters.length > 0 ? (
                    <div className="mt-5 flex flex-col gap-3">
                      {kanjiCharacters.map((character) => (
                        <button
                          key={character}
                          type="button"
                          onClick={() => setSelectedKanji(character)}
                          className="flex items-center gap-4 rounded-lg border border-[#d7c3ae] bg-white p-3 text-left transition-colors hover:bg-[#fff1e4]"
                        >
                          <span className="torisho-jp flex h-14 w-14 items-center justify-center rounded bg-[#eee0d2] text-4xl">
                            {character}
                          </span>
                          <span>
                            <span className="block font-bold text-[#211a12]">Open kanji details</span>
                            <span className="text-sm text-[#665744]">Meaning, readings, related words, and stroke order</span>
                          </span>
                        </button>
                      ))}
                    </div>
                  ) : (
                    <p className="mt-4 text-[#665744]">This word does not contain kanji.</p>
                  )}
                </section>
              </aside>

              <section className="space-y-7">
                {word.senses.length > 0 ? (
                  word.senses.map((sense, index) => (
                    <SenseCard
                      key={`${sense.partsOfSpeech.join('-')}-${index}`}
                      sense={sense}
                      examples={index === 0 ? word.examples : []}
                      index={index}
                      highlightTerm={word.kanji ?? word.kana}
                    />
                  ))
                ) : (
                  <div className="rounded-xl border border-[#d7c3ae] bg-white p-8 text-[#665744]">
                    No definition data is available for this entry.
                  </div>
                )}

                <div className="rounded-xl border border-[#d7c3ae] bg-white p-8 shadow-[0_12px_32px_rgba(26,20,16,0.05)]">
                  <CommentSection
                    wordId={wordId ?? ''}
                    currentUser={currentUser}
                    fetchComments={dictionaryService.getComments}
                    postComment={dictionaryService.postComment}
                    updateComment={dictionaryService.updateComment}
                    deleteComment={dictionaryService.deleteComment}
                  />
                </div>
              </section>
            </div>
          ) : null}
        </div>
      </div>

      {word && (
        <SaveToFlashcardModal
          isOpen={isFlashcardModalOpen}
          word={word}
          onClose={() => setIsFlashcardModalOpen(false)}
        />
      )}
      <KanjiModal character={selectedKanji} onClose={() => setSelectedKanji(null)} />
    </LearningShell>
  );
}

function SenseCard({
  sense,
  examples,
  index,
  highlightTerm,
}: {
  sense: WordSense;
  examples: WordExample[];
  index: number;
  highlightTerm: string;
}) {
  const posLabel = getPosLabel(sense.partsOfSpeech);

  return (
    <article>
      {posLabel && (
        <div className="mb-5 border-b border-[#d7c3ae] pb-3 text-sm font-extrabold uppercase tracking-[0.16em] text-[#3d2a17]">
          {posLabel}
        </div>
      )}
      <div className="rounded-xl border border-[#d7c3ae] bg-white p-8 shadow-[0_12px_32px_rgba(26,20,16,0.05)]">
        <h2 className="torisho-display text-3xl font-bold leading-snug">
          <span className="mr-4 text-[#665744]">{index + 1}.</span>
          {sense.glosses.join('; ')}
        </h2>
        {examples.length > 0 && (
          <div className="mt-7 space-y-5 border-l-2 border-[#d7c3ae] pl-6">
            {examples.map((example, exampleIndex) => (
              <div key={`${example.japanese}-${exampleIndex}`}>
                <p className="torisho-jp text-2xl leading-10">
                  {renderHighlightedExample(example.japanese, highlightTerm)}
                </p>
                <p className="mt-1 text-lg text-[#3d2a17]">{example.english}</p>
              </div>
            ))}
          </div>
        )}
      </div>
    </article>
  );
}

function SaveToFlashcardModal({
  isOpen,
  word,
  onClose,
}: {
  isOpen: boolean;
  word: WordDetail;
  onClose: () => void;
}) {
  const [decks, setDecks] = useState<FlashcardDeck[]>([]);
  const [selectedDeckId, setSelectedDeckId] = useState('');
  const [isLoadingDecks, setIsLoadingDecks] = useState(false);
  const [isCreatingDeck, setIsCreatingDeck] = useState(false);
  const [isSaving, setIsSaving] = useState(false);
  const [deckName, setDeckName] = useState('');
  const [deckDescription, setDeckDescription] = useState('');
  const [message, setMessage] = useState<string | null>(null);

  const loadDecks = useCallback(async () => {
    setIsLoadingDecks(true);
    setMessage(null);

    try {
      const result = await FlashcardService.getDecks();
      setDecks(result);
      setSelectedDeckId((current) => current || result[0]?.id || '');
    } catch (error) {
      setMessage(error instanceof Error ? error.message : 'Unable to load flashcard decks.');
    } finally {
      setIsLoadingDecks(false);
    }
  }, []);

  useEffect(() => {
    if (isOpen) {
      void loadDecks();
    }
  }, [isOpen, loadDecks]);

  if (!isOpen) {
    return null;
  }

  const handleCreateDeck = async () => {
    if (!deckName.trim()) {
      setMessage('Deck name is required.');
      return;
    }

    setIsCreatingDeck(true);
    setMessage(null);

    try {
      const created = await FlashcardService.createDeck({
        name: deckName.trim(),
        description: deckDescription.trim() || null,
        folderId: null,
      });
      setDeckName('');
      setDeckDescription('');
      await loadDecks();
      setSelectedDeckId(created.deckId);
      setMessage('Deck created. You can save this word now.');
    } catch (error) {
      setMessage(error instanceof Error ? error.message : 'Unable to create deck.');
    } finally {
      setIsCreatingDeck(false);
    }
  };

  const handleSave = async () => {
    if (!selectedDeckId) {
      setMessage('Choose or create a deck first.');
      return;
    }

    setIsSaving(true);
    setMessage(null);

    try {
      await FlashcardService.addFromDictionary(selectedDeckId, {
        dictionaryEntryId: word.id,
        includeTatoebaExamples: true,
        maxTatoebaExamples: 2,
      });
      setMessage('Saved to flashcard deck.');
      window.setTimeout(onClose, 900);
    } catch (error) {
      setMessage(error instanceof Error ? error.message : 'Unable to save flashcard.');
    } finally {
      setIsSaving(false);
    }
  };

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center bg-[#211a12]/45 p-4">
      <div className="w-full max-w-xl rounded-xl border border-[#d7c3ae] bg-white p-6 shadow-[0_24px_60px_rgba(26,20,16,0.18)]">
        <div className="flex items-start justify-between gap-4">
          <div>
            <p className="text-sm font-extrabold uppercase tracking-[0.14em] text-[#835500]">
              Save word
            </p>
            <h2 className="torisho-display mt-1 text-3xl font-bold">Add to Flashcard</h2>
          </div>
          <button type="button" onClick={onClose} className="rounded-full p-2 hover:bg-[#fff1e4]">
            <IconX size={20} />
          </button>
        </div>

        <div className="mt-6 rounded-lg border border-[#d7c3ae] bg-[#fff8f4] p-4">
          <p className="torisho-jp text-3xl font-bold">{word.kanji ?? word.kana}</p>
          <p className="mt-1 text-[#665744]">{word.kana}</p>
        </div>

        <div className="mt-6 space-y-4">
          {isLoadingDecks ? (
            <p className="text-[#665744]">Loading decks...</p>
          ) : decks.length > 0 ? (
            <label className="block">
              <span className="mb-2 block text-sm font-extrabold uppercase tracking-[0.12em] text-[#3d2a17]">
                Choose deck
              </span>
              <select
                value={selectedDeckId}
                onChange={(event) => setSelectedDeckId(event.target.value)}
                className="h-12 w-full rounded-lg border border-[#d7c3ae] bg-white px-4 outline-none focus:border-[#f5a623]"
              >
                {decks.map((deck) => (
                  <option key={deck.id} value={deck.id}>
                    {deck.name} ({deck.totalItems} cards)
                  </option>
                ))}
              </select>
            </label>
          ) : (
            <p className="text-[#665744]">No deck yet. Create one before saving this word.</p>
          )}

          <div className="rounded-lg border border-dashed border-[#d7c3ae] p-4">
            <p className="font-bold">Create new deck</p>
            <input
              value={deckName}
              onChange={(event) => setDeckName(event.target.value)}
              placeholder="Deck name"
              className="mt-3 h-11 w-full rounded-lg border border-[#d7c3ae] bg-[#fff8f4] px-4 outline-none focus:border-[#f5a623]"
            />
            <textarea
              value={deckDescription}
              onChange={(event) => setDeckDescription(event.target.value)}
              placeholder="Description (optional)"
              className="mt-3 min-h-20 w-full rounded-lg border border-[#d7c3ae] bg-[#fff8f4] px-4 py-3 outline-none focus:border-[#f5a623]"
            />
            <button
              type="button"
              onClick={handleCreateDeck}
              disabled={isCreatingDeck}
              className="mt-3 inline-flex h-10 items-center gap-2 rounded-full border border-[#835500] px-5 font-bold text-[#835500] disabled:opacity-60"
            >
              <IconPlus size={18} /> {isCreatingDeck ? 'Creating...' : 'Create Deck'}
            </button>
          </div>
        </div>

        {message && <p className="mt-4 rounded-lg bg-[#fff1e4] px-4 py-3 text-[#3d2a17]">{message}</p>}

        <div className="mt-6 flex justify-end gap-3">
          <button type="button" onClick={onClose} className="rounded-full border border-[#d7c3ae] px-6 py-3 font-bold">
            Cancel
          </button>
          <button
            type="button"
            onClick={handleSave}
            disabled={isSaving || !selectedDeckId}
            className="rounded-full bg-[#f5a623] px-7 py-3 font-bold text-[#291800] disabled:opacity-60"
          >
            {isSaving ? 'Saving...' : 'Save Flashcard'}
          </button>
        </div>
      </div>
    </div>
  );
}

function DetailSkeleton() {
  return (
    <div className="grid animate-pulse gap-8 xl:grid-cols-[360px_minmax(0,1fr)]">
      <div className="space-y-7">
        <div className="h-80 rounded-xl border border-[#d7c3ae] bg-white" />
        <div className="h-56 rounded-xl border border-[#d7c3ae] bg-white" />
      </div>
      <div className="space-y-7">
        <div className="h-64 rounded-xl border border-[#d7c3ae] bg-white" />
        <div className="h-48 rounded-xl border border-[#d7c3ae] bg-white" />
      </div>
    </div>
  );
}

function WordDetailPageFallback() {
  return (
    <LearningShell active="vocabulary">
      <div className="px-5 py-8 sm:px-8 lg:px-10 lg:py-12">
        <div className="mx-auto max-w-[1240px]">
          <DetailSkeleton />
        </div>
      </div>
    </LearningShell>
  );
}

function Badge({ children, tone }: { children: React.ReactNode; tone: 'warm' | 'cool' }) {
  return (
    <span
      className={`rounded-full px-4 py-1.5 text-sm font-bold ${
        tone === 'warm' ? 'bg-[#f5a623] text-[#291800]' : 'bg-[#00796b] text-white'
      }`}
    >
      {children}
    </span>
  );
}

function getPrimaryMeaning(senses: WordSense[]) {
  return senses[0]?.glosses?.[0] ?? '';
}

function getPrimaryPosLabel(senses: WordSense[]) {
  const firstSense = senses.find((sense) => sense.partsOfSpeech.length > 0);
  return firstSense ? getPosLabel(firstSense.partsOfSpeech) : null;
}

function getPosLabel(partsOfSpeech: string[]) {
  if (!partsOfSpeech.length) {
    return null;
  }

  return partsOfSpeech.map((pos) => POS_MAP[pos] ?? pos).join(' / ');
}

function isKanjiCharacter(character: string) {
  return /[\u3400-\u4DBF\u4E00-\u9FFF]/.test(character);
}

function renderHighlightedExample(text: string, term: string) {
  if (!term || !text.includes(term)) {
    return text;
  }

  const parts = text.split(term);

  return (
    <>
      {parts.map((part, index) => (
        <span key={`${part}-${index}`}>
          {index > 0 && <span className="font-bold text-[#835500]">{term}</span>}
          {part}
        </span>
      ))}
    </>
  );
}

export default function WordDetailPage() {
  return (
    <Suspense fallback={<WordDetailPageFallback />}>
      <WordDetailPageContent />
    </Suspense>
  );
}
