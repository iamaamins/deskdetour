import {
  IoFitnessOutline,
  IoHeartOutline,
  IoHomeOutline,
  IoInformationCircleOutline,
} from 'react-icons/io5';
import { NavLink } from 'react-router';

const navItems = [
  { to: '/', label: 'Timer', icon: IoHomeOutline, end: true },
  {
    to: '/exercises',
    label: 'Exercises',
    icon: IoFitnessOutline,
    end: false,
  },
  {
    to: '/how-it-works',
    label: 'How it works',
    icon: IoInformationCircleOutline,
    end: false,
  },
] as const;

export default function Navigation() {
  return (
    <aside className='flex flex-col border-r border-[rgba(218,224,218,0.9)] bg-[rgba(248,249,246,0.78)] px-4 pt-7 pb-5 [backdrop-filter:blur(18px)]'>
      <div className='flex items-center gap-2.5 px-2 text-base font-bold'>
        <span
          className='relative grid size-[27px] place-items-center rounded-[9px] bg-[var(--ink)] shadow-[0_5px_14px_rgba(23,34,29,0.18)]'
          aria-hidden='true'
        >
          <span className='absolute h-[7px] w-[3px] translate-x-[-5px] translate-y-[3px] rounded-full bg-white' />
          <span className='absolute h-[13px] w-[3px] rounded-full bg-white' />
          <span className='absolute h-2.5 w-[3px] translate-x-[5px] translate-y-[-2px] rounded-full bg-white' />
        </span>
        Desk Detour
      </div>

      <nav
        className='mt-[46px] flex flex-col gap-[5px]'
        aria-label='Primary navigation'
      >
        {navItems.map(({ to, label, icon: Icon, end }) => (
          <NavLink
            key={to}
            to={to}
            end={end}
            className={({ isActive }) =>
              isActive
                ? 'flex items-center gap-[11px] rounded-[11px] bg-[var(--primary-soft)] px-[11px] py-2.5 text-[14.5px] font-[650] text-[var(--primary)] transition-transform duration-150 active:scale-[0.98] [&_svg]:size-[19px] [&_svg]:shrink-0 [&_svg]:stroke-[1.7]'
                : 'flex items-center gap-[11px] rounded-[11px] px-[11px] py-2.5 text-[14.5px] font-[550] text-[var(--muted-strong)] transition-[color,background,transform] duration-150 hover:bg-[rgba(228,232,226,0.66)] hover:text-[var(--ink)] active:scale-[0.98] [&_svg]:size-[19px] [&_svg]:shrink-0 [&_svg]:stroke-[1.7]'
            }
          >
            <Icon aria-hidden='true' />
            {label}
          </NavLink>
        ))}
      </nav>

      <a
        target='_blank'
        rel='noreferrer'
        href='https://deskdetour.com/buy-me-a-coffee'
        className='mt-auto flex h-[43px] items-center gap-2.5 border-t border-[var(--line)] px-2.5 pt-[11px] text-[12.5px] font-[650] text-[var(--muted)] transition-[color,transform] duration-150 hover:text-[var(--primary)] active:scale-[0.98] [&_svg]:size-[18px] [&_svg]:shrink-0 [&_svg]:stroke-[1.8]'
      >
        <IoHeartOutline aria-hidden='true' />
        Support the app
      </a>
    </aside>
  );
}
