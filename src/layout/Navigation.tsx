import { IoHomeOutline } from 'react-icons/io5';
import { Link } from 'react-router';
import { BsExclamationCircle } from 'react-icons/bs';
import { BiCoffeeTogo } from 'react-icons/bi';

export default function Navigation() {
  return (
    <nav className='bg-slight-gray fixed top-1/2 left-2 flex w-fit -translate-y-1/2 flex-col gap-4 rounded-md px-3 py-4'>
      <Link to='/'>
        <IoHomeOutline />
      </Link>
      <Link to='/buy-me-a-coffee'>
        <BiCoffeeTogo />
      </Link>
      <Link to='/how-it-works'>
        <BsExclamationCircle />
      </Link>
    </nav>
  );
}
