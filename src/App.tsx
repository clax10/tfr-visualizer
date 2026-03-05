/**
 * @license
 * SPDX-License-Identifier: Apache-2.0
 */

import React, { useState, useMemo, useRef, useEffect } from 'react';
import { User, Users, Info, TrendingDown, TrendingUp, ChevronDown, Search } from 'lucide-react';
import { motion, AnimatePresence } from 'motion/react';

const PRESETS = [
  { name: 'Taiwan', tfr: 0.65 },
  { name: 'Macau', tfr: 0.66 },
  { name: 'Hong Kong', tfr: 0.7 },
  { name: 'S. Korea', tfr: 0.72 },
  { name: 'Singapore', tfr: 0.97 },
  { name: 'China', tfr: 1.0 },
  { name: 'Italy', tfr: 1.2 },
  { name: 'Spain', tfr: 1.2 },
  { name: 'Japan', tfr: 1.2 },
  { name: 'Poland', tfr: 1.3 },
  { name: 'Canada', tfr: 1.33 },
  { name: 'Russia', tfr: 1.4 },
  { name: 'UK', tfr: 1.44 },
  { name: 'Germany', tfr: 1.46 },
  { name: 'EU', tfr: 1.46 },
  { name: 'Australia', tfr: 1.58 },
  { name: 'Brazil', tfr: 1.6 },
  { name: 'USA', tfr: 1.62 },
  { name: 'France', tfr: 1.8 },
  { name: 'Mexico', tfr: 1.8 },
  { name: 'India', tfr: 2.0 },
  { name: 'Replacement', tfr: 2.1, highlight: true },
  { name: 'Indonesia', tfr: 2.1 },
  { name: 'South Africa', tfr: 2.3 },
  { name: 'Egypt', tfr: 2.8 },
  { name: 'Pakistan', tfr: 3.3 },
  { name: 'Kenya', tfr: 3.3 },
  { name: 'Afghanistan', tfr: 4.5 },
  { name: 'Nigeria', tfr: 5.2 },
  { name: 'Somalia', tfr: 6.0 },
  { name: 'Niger', tfr: 6.7 },
].sort((a, b) => a.tfr - b.tfr);

export default function App() {
  const [tfr, setTfr] = useState(0.65);
  const [baseAdults, setBaseAdults] = useState(100);
  const [isDropdownOpen, setIsDropdownOpen] = useState(false);
  const [searchQuery, setSearchQuery] = useState('');

  const dropdownRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    const handleClickOutside = (event: MouseEvent) => {
      if (dropdownRef.current && !dropdownRef.current.contains(event.target as Node)) {
        setIsDropdownOpen(false);
      }
    };
    document.addEventListener('mousedown', handleClickOutside);
    return () => document.removeEventListener('mousedown', handleClickOutside);
  }, []);

  const filteredPresets = useMemo(() => {
    return PRESETS.filter((p) => p.name.toLowerCase().includes(searchQuery.toLowerCase()));
  }, [searchQuery]);

  const stats = useMemo(() => {
    const children = Math.round((baseAdults / 2) * tfr);
    const grandchildren = Math.round((children / 2) * tfr);
    const totalChange = ((grandchildren - baseAdults) / baseAdults) * 100;

    return {
      children,
      grandchildren,
      totalChange: Math.round(totalChange),
    };
  }, [tfr, baseAdults]);

  const iconSizeClass = useMemo(() => {
    const maxCount = Math.max(baseAdults, stats.children, stats.grandchildren);
    if (maxCount > 1200) return 'w-1.5 h-2.5 rounded-[1px]';
    if (maxCount > 500) return 'w-2 h-3 rounded-[1px]';
    if (maxCount > 250) return 'w-3 h-4 rounded-[1px]';
    if (maxCount > 100) return 'w-4 h-6 rounded-[2px]';
    if (maxCount > 40) return 'w-5 h-7 rounded-[2px]';
    return 'w-6 h-8 rounded-sm';
  }, [baseAdults, stats]);

  const renderPeople = (count: number, label: string, colorClass: string) => {
    return (
      <div className="flex flex-col shrink-0">
        <div className="flex items-center justify-between border-b border-[var(--border-soft)] pb-1 mb-2">
          <span className="text-[10px] md:text-xs font-bold uppercase tracking-widest text-[var(--text-muted)]">{label}</span>
          <span className="font-mono text-xs md:text-sm font-bold text-[var(--text-primary)]">{count}</span>
        </div>
        <div className="flex flex-wrap gap-1 md:gap-1.5 content-start">
          <AnimatePresence mode="popLayout">
            {Array.from({ length: count }).map((_, i) => (
              <motion.div
                key={`${label}-${i}`}
                initial={{ scale: 0, opacity: 0 }}
                animate={{ scale: 1, opacity: 1 }}
                exit={{ scale: 0, opacity: 0 }}
                transition={{
                  type: 'spring',
                  stiffness: 500,
                  damping: 30,
                  delay: Math.min(i * 0.001, 0.3),
                }}
                className={`${iconSizeClass} shrink-0 flex items-center justify-center ${colorClass} shadow-[0_1px_2px_rgba(0,0,0,0.45)]`}
              >
                {iconSizeClass.includes('w-6') && <User size={16} className="text-white" strokeWidth={3} />}
                {iconSizeClass.includes('w-5') && <User size={12} className="text-white" strokeWidth={3} />}
                {iconSizeClass.includes('w-4') && <User size={10} className="text-white" strokeWidth={3} />}
              </motion.div>
            ))}
          </AnimatePresence>
          {count === 0 && (
            <div className="flex items-center justify-center w-full h-4 text-[var(--text-muted)] italic text-xs">
              Extinct
            </div>
          )}
        </div>
      </div>
    );
  };

  return (
    <div className="min-h-screen md:h-screen text-[var(--text-primary)] font-sans flex flex-col selection:bg-cyan-300 selection:text-black">
      <header className="px-4 py-3 border-b border-[var(--border-soft)] flex flex-col sm:flex-row sm:items-center justify-between bg-[var(--bg-panel)]/95 backdrop-blur shrink-0 gap-3">
        <div className="flex items-center gap-2">
          <div className="w-8 h-8 bg-cyan-400/20 border border-cyan-300/40 rounded-lg flex items-center justify-center text-cyan-200 shrink-0">
            <Users size={14} />
          </div>
          <h1 className="text-lg md:text-xl font-semibold tracking-tight leading-none text-cyan-50">The Disappearing Generation</h1>
        </div>

        <div className="relative" ref={dropdownRef}>
          <button
            onClick={() => setIsDropdownOpen(!isDropdownOpen)}
            className="flex items-center gap-2 px-4 py-2 border border-[var(--border-soft)] rounded-full hover:bg-cyan-400/10 transition-colors bg-[var(--bg-elevated)] text-cyan-100"
          >
            <span className="text-[10px] font-bold uppercase tracking-widest">Select Country Preset</span>
            <ChevronDown size={14} />
          </button>

          <AnimatePresence>
            {isDropdownOpen && (
              <motion.div
                initial={{ opacity: 0, y: -10 }}
                animate={{ opacity: 1, y: 0 }}
                exit={{ opacity: 0, y: -10 }}
                transition={{ duration: 0.15 }}
                className="absolute right-0 top-full mt-2 w-64 bg-[var(--bg-elevated)] border border-[var(--border-soft)] rounded-2xl shadow-2xl shadow-cyan-950/40 z-50 overflow-hidden flex flex-col"
              >
                <div className="p-3 border-b border-[var(--border-soft)] flex items-center gap-2">
                  <Search size={14} className="text-[var(--text-muted)]" />
                  <input
                    type="text"
                    placeholder="Search countries..."
                    value={searchQuery}
                    onChange={(e) => setSearchQuery(e.target.value)}
                    className="w-full text-xs outline-none bg-transparent text-[var(--text-primary)] placeholder:text-[var(--text-muted)]"
                    autoFocus
                  />
                </div>
                <div className="max-h-64 overflow-y-auto p-2">
                  {filteredPresets.length === 0 ? (
                    <div className="p-3 text-center text-xs text-[var(--text-muted)]">No presets found</div>
                  ) : (
                    filteredPresets.map((preset) => (
                      <button
                        key={preset.name}
                        onClick={() => {
                          setTfr(preset.tfr);
                          setIsDropdownOpen(false);
                          setSearchQuery('');
                        }}
                        className={`w-full flex items-center justify-between p-2 rounded-xl text-left transition-colors ${
                          tfr === preset.tfr ? 'bg-cyan-500/20 text-cyan-100 border border-cyan-300/35' : 'hover:bg-cyan-500/10 text-[var(--text-primary)] border border-transparent'
                        }`}
                      >
                        <span className="text-xs font-bold">{preset.name}</span>
                        <span className={`text-[10px] font-mono ${tfr === preset.tfr ? 'text-cyan-200' : 'text-[var(--text-muted)]'}`}>
                          {preset.tfr.toFixed(2)}
                        </span>
                      </button>
                    ))
                  )}
                </div>
              </motion.div>
            )}
          </AnimatePresence>
        </div>
      </header>

      <main className="flex-1 flex flex-col md:flex-row min-h-0">
        <aside className="w-full md:w-80 border-b md:border-b-0 md:border-r border-[var(--border-soft)] bg-[var(--bg-panel)] p-4 md:p-6 flex flex-col gap-5 md:gap-8 shrink-0 overflow-y-auto">
          <div className="space-y-4">
            <div className="flex items-end justify-between">
              <label className="text-xs font-bold uppercase tracking-widest text-[var(--text-muted)]">Fertility Rate</label>
              <span className="text-4xl md:text-5xl font-semibold leading-none text-cyan-100">{tfr.toFixed(2)}</span>
            </div>
            <input
              type="range"
              min="0.1"
              max="10.0"
              step="0.05"
              value={tfr}
              onChange={(e) => setTfr(parseFloat(e.target.value))}
              className="w-full h-2 bg-white/10 rounded-lg appearance-none cursor-pointer accent-cyan-400"
            />
          </div>

          <div className="space-y-4">
            <div className="flex items-end justify-between">
              <label className="text-xs font-bold uppercase tracking-widest text-[var(--text-muted)]">Base Generation</label>
              <span className="text-3xl md:text-4xl font-semibold leading-none text-cyan-100">{baseAdults}</span>
            </div>
            <div className="flex items-center gap-2">
              <input
                type="number"
                min="10"
                max="1000"
                step="10"
                value={baseAdults}
                onChange={(e) => {
                  const next = Number(e.target.value);
                  if (!Number.isFinite(next)) return;
                  setBaseAdults(Math.max(10, Math.min(1000, Math.round(next))));
                }}
                className="w-24 px-2 py-1.5 rounded-md border border-[var(--border-soft)] bg-[var(--bg-elevated)] text-[var(--text-primary)] text-sm outline-none focus:border-cyan-300"
                aria-label="Base generation value"
              />
              <span className="text-xs text-[var(--text-muted)]">Type a value (10-1000)</span>
            </div>
            <input
              type="range"
              min="10"
              max="1000"
              step="10"
              value={baseAdults}
              onChange={(e) => setBaseAdults(parseInt(e.target.value, 10))}
              className="w-full h-2 bg-white/10 rounded-lg appearance-none cursor-pointer accent-cyan-400"
            />
          </div>

          <div className="flex flex-row md:flex-col gap-2 md:gap-3">
            <div className="flex-1 p-3 rounded-xl bg-[var(--bg-soft)] border border-[var(--border-soft)] flex flex-col justify-center">
              <span className="text-[9px] font-bold uppercase text-[var(--text-muted)] mb-1">2-Gen Change</span>
              <div className="flex items-center justify-between">
                <span className={`text-base md:text-xl font-bold ${stats.totalChange < 0 ? 'text-[var(--danger)]' : 'text-[var(--success)]'}`}>
                  {stats.totalChange > 0 ? '+' : ''}
                  {stats.totalChange}%
                </span>
                {stats.totalChange < 0 ? <TrendingDown className="text-[var(--danger)]" size={18} /> : <TrendingUp className="text-[var(--success)]" size={18} />}
              </div>
            </div>

            <div className="flex-1 flex gap-2 md:gap-3">
              <div className="flex-1 p-2 md:p-3 rounded-xl bg-[var(--bg-soft)] border border-[var(--border-soft)] flex flex-col justify-center">
                <span className="text-[9px] font-bold uppercase text-[var(--text-muted)] mb-1">Children</span>
                <span className="text-base font-bold text-[var(--text-primary)]">{stats.children}</span>
              </div>
              <div className="flex-1 p-2 md:p-3 rounded-xl bg-[var(--bg-soft)] border border-[var(--border-soft)] flex flex-col justify-center">
                <span className="text-[9px] font-bold uppercase text-[var(--text-muted)] mb-1">Grandkids</span>
                <span className="text-base font-bold text-[var(--text-primary)]">{stats.grandchildren}</span>
              </div>
            </div>
          </div>

          <div className="hidden md:flex mt-auto pt-4 border-t border-[var(--border-soft)] items-start gap-3 text-[var(--text-muted)]">
            <Info size={16} className="shrink-0 mt-0.5" />
            <p className="text-xs leading-relaxed">
              A TFR of 10.0 implies an average of 10 children per woman. 2.1 is the threshold for a stable population.
            </p>
          </div>
        </aside>

        <section className="flex-1 bg-[var(--bg-main)]/70 p-4 md:p-8 flex flex-col gap-4 md:gap-6 overflow-y-auto">
          {renderPeople(baseAdults, 'Gen 0 (Adults)', 'bg-slate-600')}
          {renderPeople(stats.children, 'Gen 1 (Children)', 'bg-cyan-600')}
          {renderPeople(stats.grandchildren, 'Gen 2 (Grandchildren)', 'bg-violet-500')}
        </section>
      </main>
    </div>
  );
}
