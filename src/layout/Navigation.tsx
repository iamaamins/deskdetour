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
    <aside className='sidebar'>
      <div className='brand'>
        <span className='brand-mark' aria-hidden='true'>
          <span />
        </span>
        <span>Desk Detour</span>
      </div>

      <nav className='nav-list' aria-label='Primary navigation'>
        {navItems.map(({ to, label, icon: Icon, end }) => (
          <NavLink
            key={to}
            to={to}
            end={end}
            className={({ isActive }) =>
              ['nav-item', isActive && 'nav-item-active']
                .filter(Boolean)
                .join(' ')
            }
          >
            <Icon aria-hidden='true' />
            <span>{label}</span>
          </NavLink>
        ))}
      </nav>

      <a
        target='_blank'
        rel='noreferrer'
        href='https://deskdetour.com/buy-me-a-coffee'
        className='sidebar-support'
      >
        <IoHeartOutline aria-hidden='true' />
        <span>Support the app</span>
      </a>
    </aside>
  );
}
