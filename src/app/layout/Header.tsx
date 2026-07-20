import { useEffect, useState } from 'react';
import { createPortal } from 'react-dom';
import { Link, NavLink } from 'react-router-dom';
import { AnimatePresence, motion } from 'motion/react';
import { Menu, MessageCircle, X } from 'lucide-react';
import { Logo } from '@/shared/ui/Logo';
import { Button } from '@/shared/ui/Button';
import { NAV_LINKS } from '@/app/layout/navConfig';
import { whatsappLink } from '@/shared/config/site';
import { cn } from '@/shared/lib/cn';

export function Header() {
  const [open, setOpen] = useState(false);

  useEffect(() => {
    document.body.style.overflow = open ? 'hidden' : '';
    return () => {
      document.body.style.overflow = '';
    };
  }, [open]);

  return (
    <>
    <header className="sticky top-0 z-50 border-b border-ink-100/80 bg-white/85 backdrop-blur-md">
      <div className="content-container flex h-18 items-center justify-between py-3">
        <Link to="/" onClick={() => setOpen(false)}>
          <Logo />
        </Link>

        <nav className="hidden items-center gap-7 lg:flex">
          {NAV_LINKS.map((link) => (
            <NavLink
              key={link.to}
              to={link.to}
              className={({ isActive }) =>
                cn(
                  'text-sm font-medium text-ink-600 transition-colors hover:text-brand-600',
                  isActive && 'text-brand-600'
                )
              }
            >
              {link.label}
            </NavLink>
          ))}
        </nav>

        <div className="hidden items-center gap-3 lg:flex">
          <a href={whatsappLink()} target="_blank" rel="noreferrer">
            <Button variant="whatsapp" size="sm">
              <MessageCircle size={16} />
              WhatsApp
            </Button>
          </a>
          <Link to="/tours">
            <Button variant="primary" size="sm">
              Подобрать тур
            </Button>
          </Link>
        </div>

        <button
          type="button"
          aria-label="Открыть меню"
          onClick={() => setOpen(true)}
          className="flex h-11 w-11 items-center justify-center rounded-full border border-ink-200 text-ink-700 lg:hidden"
        >
          <Menu size={20} />
        </button>
      </div>
    </header>

    {createPortal(
      <AnimatePresence>
        {open && (
          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            transition={{ duration: 0.2 }}
            className="fixed inset-0 z-50 flex flex-col bg-ink-950 text-white lg:hidden"
          >
            <div className="content-container flex h-18 items-center justify-between py-3">
              <Logo dark />
              <button
                type="button"
                aria-label="Закрыть меню"
                onClick={() => setOpen(false)}
                className="flex h-11 w-11 items-center justify-center rounded-full border border-white/20"
              >
                <X size={20} />
              </button>
            </div>

            <nav className="flex flex-1 flex-col items-start justify-center gap-2 px-8">
              {NAV_LINKS.map((link, i) => (
                <motion.div
                  key={link.to}
                  initial={{ opacity: 0, y: 16 }}
                  animate={{ opacity: 1, y: 0 }}
                  transition={{ delay: 0.05 * i, duration: 0.35, ease: [0.16, 1, 0.3, 1] }}
                >
                  <NavLink
                    to={link.to}
                    onClick={() => setOpen(false)}
                    className={({ isActive }) =>
                      cn(
                        'py-2 font-display text-4xl tracking-tight text-white/70 transition-colors hover:text-white',
                        isActive && 'text-brand-400'
                      )
                    }
                  >
                    {link.label}
                  </NavLink>
                </motion.div>
              ))}
            </nav>

            <div className="content-container flex flex-col gap-3 pb-10">
              <a href={whatsappLink()} target="_blank" rel="noreferrer">
                <Button variant="whatsapp" className="w-full">
                  <MessageCircle size={18} />
                  Написать в WhatsApp
                </Button>
              </a>
              <Link to="/tours" onClick={() => setOpen(false)}>
                <Button variant="primary" className="w-full">
                  Подобрать тур
                </Button>
              </Link>
            </div>
          </motion.div>
        )}
      </AnimatePresence>,
      document.body
    )}
    </>
  );
}
