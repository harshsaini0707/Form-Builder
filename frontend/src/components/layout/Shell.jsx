import { Outlet, NavLink } from 'react-router-dom';
import clsx from 'clsx';

export default function Shell() {
  return (
    <div className="flex h-screen">
      <aside className="w-56 bg-white border-r">
        <div className="p-4 font-bold text-primary-600">Form Builder</div>
        <nav className="space-y-1 px-3">
          <Item to="/" label="Dashboard" />
          <Item to="/builder" label="New form" />
        </nav>
      </aside>
      <main className="flex-1 overflow-y-auto bg-gray-50">
        <Outlet />
      </main>
    </div>
  );
}

function Item({ to, label }) {
  return (
    <NavLink
      to={to}
      end
      className={({ isActive }) =>
        clsx(
          'block rounded-md px-3 py-2 text-sm font-medium',
          isActive ? 'bg-primary-100 text-primary-700' : 'text-gray-700 hover:bg-gray-100'
        )
      }
    >
      {label}
    </NavLink>
  );
}
