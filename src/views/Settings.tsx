import { useEffect, useState } from 'react';
import { IoCheckmarkOutline, IoSettingsOutline } from 'react-icons/io5';
import { LaunchAtLoginSettings } from '../types';

export default function Settings() {
  const [settings, setSettings] = useState<LaunchAtLoginSettings | null>(null);
  const [isSaving, setIsSaving] = useState(false);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    let isMounted = true;

    window.settings
      .getLaunchAtLogin()
      .then((nextSettings) => {
        if (isMounted) setSettings(nextSettings);
      })
      .catch(() => {
        if (isMounted) setError('Settings are unavailable right now.');
      });

    return () => {
      isMounted = false;
    };
  }, []);

  const updateLaunchAtLogin = async (openAtLogin: boolean) => {
    setIsSaving(true);
    setError(null);

    try {
      const nextSettings = await window.settings.setLaunchAtLogin(openAtLogin);
      setSettings(nextSettings);
    } catch {
      setError('Could not update launch setting.');
    } finally {
      setIsSaving(false);
    }
  };

  const isEnabled = settings?.openAtLogin ?? false;
  const isSupported = settings?.isSupported ?? true;

  return (
    <main className='h-full w-full px-9 pt-[34px] pb-7'>
      <header className='flex min-h-[67px] max-w-[510px] items-start justify-between'>
        <div>
          <p className='mb-1 text-[11px] font-[750] tracking-[0.13em] text-[var(--primary)] uppercase'>
            Preferences
          </p>
          <h1 className='text-[27px] leading-[1.15] font-[650] tracking-[-0.035em]'>
            Settings
          </h1>
        </div>
      </header>

      <section className='mt-[25px] max-w-[560px] rounded-[17px] border border-[rgba(223,228,223,0.92)] bg-[rgba(255,255,255,0.88)] p-[18px] shadow-[0_18px_50px_rgba(36,52,43,0.08)]'>
        <div className='flex items-center justify-between gap-5'>
          <div className='flex min-w-0 items-center gap-3'>
            <span className='grid size-[39px] shrink-0 place-items-center rounded-[11px] bg-[var(--primary-soft)] text-[var(--primary)] [&_svg]:size-[18px]'>
              <IoSettingsOutline aria-hidden='true' />
            </span>
            <div className='min-w-0'>
              <h2 className='text-sm font-[650]'>Launch at login</h2>
              <p className='mt-1 text-[11.5px] leading-[1.45] text-[var(--muted)]'>
                Start Desk Detour when you sign in.
              </p>
            </div>
          </div>

          <button
            aria-pressed={isEnabled}
            disabled={!settings || isSaving || !isSupported}
            onClick={() => updateLaunchAtLogin(!isEnabled)}
            className={
              isEnabled
                ? 'relative h-[30px] w-[54px] shrink-0 cursor-pointer rounded-full border-0 bg-[var(--primary)] p-0 transition-[background,opacity] duration-150 disabled:cursor-not-allowed disabled:opacity-[0.55]'
                : 'relative h-[30px] w-[54px] shrink-0 cursor-pointer rounded-full border-0 bg-[#d9dfd8] p-0 transition-[background,opacity] duration-150 disabled:cursor-not-allowed disabled:opacity-[0.55]'
            }
          >
            <span
              className={
                isEnabled
                  ? 'absolute top-[3px] left-[27px] grid size-6 place-items-center rounded-full bg-white text-[var(--primary)] shadow-[0_3px_8px_rgba(23,34,29,0.18)] transition-[left] duration-150 [&_svg]:size-3.5'
                  : 'absolute top-[3px] left-[3px] grid size-6 place-items-center rounded-full bg-white text-transparent shadow-[0_3px_8px_rgba(23,34,29,0.14)] transition-[left] duration-150 [&_svg]:size-3.5'
              }
            >
              <IoCheckmarkOutline aria-hidden='true' />
            </span>
          </button>
        </div>

        <div className='mt-4 min-h-[18px] text-[11.5px] font-[600] text-[var(--muted)]'>
          {error
            ? error
            : !settings
              ? 'Loading...'
              : !isSupported
                ? 'Not supported on this platform.'
                : isSaving
                  ? 'Saving...'
                  : settings.status === 'requires-approval'
                    ? 'Waiting for system approval.'
                    : isEnabled
                      ? 'Enabled'
                      : 'Disabled'}
        </div>
      </section>
    </main>
  );
}
