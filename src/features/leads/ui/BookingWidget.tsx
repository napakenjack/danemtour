import { type FormEvent, type ReactNode, useState } from 'react';
import {
  ArrowLeftRight,
  BedDouble,
  Calendar,
  Car,
  MapPin,
  Search,
  TrainFront,
  Plane,
  Users,
} from 'lucide-react';
import { Button } from '@/shared/ui/Button';
import { whatsappLink } from '@/shared/config/site';
import { cn } from '@/shared/lib/cn';

type BookingTab = 'hotels' | 'flights' | 'trains' | 'cars';

const TABS: { key: BookingTab; label: string; icon: typeof BedDouble }[] = [
  { key: 'hotels', label: 'Отели', icon: BedDouble },
  { key: 'flights', label: 'Авиабилеты', icon: Plane },
  { key: 'trains', label: 'Ж/д билеты', icon: TrainFront },
  { key: 'cars', label: 'Аренда машин', icon: Car },
];

const fieldInputClass =
  'w-full min-w-0 bg-transparent text-sm font-medium text-ink-950 placeholder:text-ink-400 placeholder:font-normal focus:outline-none [color-scheme:light]';

function FieldBox({
  icon,
  label,
  className,
  children,
}: {
  icon?: ReactNode;
  label: string;
  className?: string;
  children: ReactNode;
}) {
  return (
    <div className={cn('flex items-center gap-3 rounded-2xl bg-ink-50 px-4 py-2.5', className)}>
      {icon}
      <div className="min-w-0 flex-1 text-left">
        <span className="block text-[11px] font-semibold uppercase tracking-wide text-ink-400">
          {label}
        </span>
        {children}
      </div>
    </div>
  );
}

function CountField({
  label,
  value,
  onChange,
  min = 0,
}: {
  label: string;
  value: number;
  onChange: (value: number) => void;
  min?: number;
}) {
  return (
    <label className="flex flex-1 flex-col items-center text-center">
      <span className="text-[10px] text-ink-400">{label}</span>
      <input
        type="number"
        min={min}
        value={value}
        onChange={(e) => onChange(Math.max(min, Number(e.target.value) || min))}
        className="w-full bg-transparent text-center text-sm font-medium text-ink-950 focus:outline-none"
      />
    </label>
  );
}

function SwapButton({ onClick }: { onClick: () => void }) {
  return (
    <button
      type="button"
      onClick={onClick}
      aria-label="Поменять местами"
      className="hidden h-10 w-10 shrink-0 items-center justify-center self-center rounded-full border border-ink-200 text-ink-500 transition-colors hover:border-brand-400 hover:text-brand-600 sm:flex"
    >
      <ArrowLeftRight size={16} />
    </button>
  );
}

function SubmitButton() {
  return (
    <Button type="submit" className="w-full" size="lg">
      <Search size={18} />
      Найти
    </Button>
  );
}

function HotelsForm({ onSend }: { onSend: (message: string) => void }) {
  const [destination, setDestination] = useState('');
  const [checkIn, setCheckIn] = useState('');
  const [checkOut, setCheckOut] = useState('');
  const [rooms, setRooms] = useState(1);
  const [adults, setAdults] = useState(2);
  const [children, setChildren] = useState(0);

  const handleSubmit = (e: FormEvent) => {
    e.preventDefault();
    onSend(
      [
        'Здравствуйте! Хочу подобрать отель.',
        destination && `Куда: ${destination}`,
        (checkIn || checkOut) && `Даты: ${checkIn || '—'} – ${checkOut || '—'}`,
        `Гостей: ${rooms} номер, ${adults} взрослых, ${children} детей`,
      ]
        .filter(Boolean)
        .join('\n')
    );
  };

  return (
    <form onSubmit={handleSubmit} className="space-y-2">
      <FieldBox icon={<MapPin size={18} className="shrink-0 text-ink-400" />} label="Куда?">
        <input
          value={destination}
          onChange={(e) => setDestination(e.target.value)}
          placeholder="Город или отель"
          className={fieldInputClass}
        />
      </FieldBox>

      <div className="grid gap-2 sm:grid-cols-3">
        <FieldBox icon={<Calendar size={18} className="shrink-0 text-ink-400" />} label="Заезд">
          <input
            type="date"
            value={checkIn}
            onChange={(e) => setCheckIn(e.target.value)}
            className={fieldInputClass}
          />
        </FieldBox>
        <FieldBox icon={<Calendar size={18} className="shrink-0 text-ink-400" />} label="Выезд">
          <input
            type="date"
            value={checkOut}
            onChange={(e) => setCheckOut(e.target.value)}
            className={fieldInputClass}
          />
        </FieldBox>
        <FieldBox icon={<Users size={18} className="shrink-0 text-ink-400" />} label="Гости">
          <div className="flex items-center gap-1">
            <CountField label="Номер" value={rooms} onChange={setRooms} min={1} />
            <CountField label="Взрослых" value={adults} onChange={setAdults} min={1} />
            <CountField label="Детей" value={children} onChange={setChildren} min={0} />
          </div>
        </FieldBox>
      </div>

      <SubmitButton />
    </form>
  );
}

const TRIP_TYPE_LABEL = {
  roundtrip: 'Туда и обратно',
  oneway: 'В одну сторону',
  multi: 'Сложный маршрут',
} as const;

function FlightsForm({ onSend }: { onSend: (message: string) => void }) {
  const [tripType, setTripType] = useState<keyof typeof TRIP_TYPE_LABEL>('roundtrip');
  const [noStops, setNoStops] = useState(false);
  const [from, setFrom] = useState('');
  const [to, setTo] = useState('');
  const [departDate, setDepartDate] = useState('');
  const [returnDate, setReturnDate] = useState('');
  const [passengers, setPassengers] = useState(1);
  const [cabinClass, setCabinClass] = useState('Эконом');

  const swap = () => {
    setFrom(to);
    setTo(from);
  };

  const handleSubmit = (e: FormEvent) => {
    e.preventDefault();
    onSend(
      [
        'Здравствуйте! Хочу подобрать авиабилеты.',
        `Тип поездки: ${TRIP_TYPE_LABEL[tripType]}${noStops ? ', без пересадок' : ''}`,
        (from || to) && `Маршрут: ${from || '—'} → ${to || '—'}`,
        departDate && `Туда: ${departDate}`,
        tripType === 'roundtrip' && returnDate && `Обратно: ${returnDate}`,
        `Пассажиров: ${passengers}, класс: ${cabinClass}`,
      ]
        .filter(Boolean)
        .join('\n')
    );
  };

  return (
    <form onSubmit={handleSubmit} className="space-y-2">
      <div className="flex flex-wrap items-center gap-x-4 gap-y-2 px-1 text-sm text-ink-600">
        {(Object.keys(TRIP_TYPE_LABEL) as (keyof typeof TRIP_TYPE_LABEL)[]).map((key) => (
          <label key={key} className="flex items-center gap-1.5">
            <input
              type="radio"
              name="tripType"
              checked={tripType === key}
              onChange={() => setTripType(key)}
              className="accent-brand-500"
            />
            {TRIP_TYPE_LABEL[key]}
          </label>
        ))}
        <label className="flex items-center gap-1.5">
          <input
            type="checkbox"
            checked={noStops}
            onChange={(e) => setNoStops(e.target.checked)}
            className="accent-brand-500"
          />
          Без пересадок
        </label>
      </div>

      <div className="grid gap-2 sm:grid-cols-[1fr_auto_1fr]">
        <FieldBox icon={<Plane size={18} className="shrink-0 -rotate-45 text-ink-400" />} label="Откуда">
          <input
            value={from}
            onChange={(e) => setFrom(e.target.value)}
            placeholder="Город вылета"
            className={fieldInputClass}
          />
        </FieldBox>
        <SwapButton onClick={swap} />
        <FieldBox icon={<MapPin size={18} className="shrink-0 text-ink-400" />} label="Куда">
          <input
            value={to}
            onChange={(e) => setTo(e.target.value)}
            placeholder="Город назначения"
            className={fieldInputClass}
          />
        </FieldBox>
      </div>

      <div className="grid gap-2 sm:grid-cols-2">
        <FieldBox icon={<Calendar size={18} className="shrink-0 text-ink-400" />} label="Туда">
          <input
            type="date"
            value={departDate}
            onChange={(e) => setDepartDate(e.target.value)}
            className={fieldInputClass}
          />
        </FieldBox>
        <FieldBox
          icon={<Calendar size={18} className="shrink-0 text-ink-400" />}
          label="Обратно"
          className={cn(tripType !== 'roundtrip' && 'opacity-50')}
        >
          <input
            type="date"
            value={returnDate}
            disabled={tripType !== 'roundtrip'}
            onChange={(e) => setReturnDate(e.target.value)}
            className={fieldInputClass}
          />
        </FieldBox>
      </div>

      <div className="grid gap-2 sm:grid-cols-2">
        <FieldBox icon={<Users size={18} className="shrink-0 text-ink-400" />} label="Пассажиры">
          <input
            type="number"
            min={1}
            value={passengers}
            onChange={(e) => setPassengers(Math.max(1, Number(e.target.value) || 1))}
            className={fieldInputClass}
          />
        </FieldBox>
        <FieldBox label="Класс">
          <select
            value={cabinClass}
            onChange={(e) => setCabinClass(e.target.value)}
            className={cn(fieldInputClass, 'cursor-pointer')}
          >
            <option>Эконом</option>
            <option>Бизнес</option>
          </select>
        </FieldBox>
      </div>

      <SubmitButton />
    </form>
  );
}

function TrainsForm({ onSend }: { onSend: (message: string) => void }) {
  const [from, setFrom] = useState('');
  const [to, setTo] = useState('');
  const [departDate, setDepartDate] = useState('');
  const [hasReturn, setHasReturn] = useState(false);
  const [returnDate, setReturnDate] = useState('');
  const [passengers, setPassengers] = useState(1);
  const [withHotel, setWithHotel] = useState(false);

  const swap = () => {
    setFrom(to);
    setTo(from);
  };

  const handleSubmit = (e: FormEvent) => {
    e.preventDefault();
    onSend(
      [
        'Здравствуйте! Хочу подобрать ж/д билеты.',
        (from || to) && `Маршрут: ${from || '—'} → ${to || '—'}`,
        departDate && `Туда: ${departDate}`,
        hasReturn && returnDate && `Обратно: ${returnDate}`,
        `Пассажиров: ${passengers}`,
        withHotel && 'Также интересует отель в пункте назначения',
      ]
        .filter(Boolean)
        .join('\n')
    );
  };

  return (
    <form onSubmit={handleSubmit} className="space-y-2">
      <div className="grid gap-2 sm:grid-cols-[1fr_auto_1fr]">
        <FieldBox icon={<MapPin size={18} className="shrink-0 text-ink-400" />} label="Из">
          <input
            value={from}
            onChange={(e) => setFrom(e.target.value)}
            placeholder="Станция отправления"
            className={fieldInputClass}
          />
        </FieldBox>
        <SwapButton onClick={swap} />
        <FieldBox icon={<MapPin size={18} className="shrink-0 text-ink-400" />} label="В">
          <input
            value={to}
            onChange={(e) => setTo(e.target.value)}
            placeholder="Станция прибытия"
            className={fieldInputClass}
          />
        </FieldBox>
      </div>

      <div className="grid gap-2 sm:grid-cols-2">
        <FieldBox icon={<Calendar size={18} className="shrink-0 text-ink-400" />} label="Время отправления">
          <input
            type="date"
            value={departDate}
            onChange={(e) => setDepartDate(e.target.value)}
            className={fieldInputClass}
          />
        </FieldBox>
        <FieldBox
          icon={<Calendar size={18} className="shrink-0 text-ink-400" />}
          label="Обратно"
          className={cn(!hasReturn && 'opacity-50')}
        >
          {hasReturn ? (
            <input
              type="date"
              value={returnDate}
              onChange={(e) => setReturnDate(e.target.value)}
              className={fieldInputClass}
            />
          ) : (
            <button
              type="button"
              onClick={() => setHasReturn(true)}
              className="text-sm font-medium text-ink-950"
            >
              Добавить поездку «обратно»
            </button>
          )}
        </FieldBox>
      </div>

      <div className="flex flex-wrap items-center justify-between gap-3 px-1">
        <FieldBox icon={<Users size={18} className="shrink-0 text-ink-400" />} label="Пассажиры" className="flex-1">
          <input
            type="number"
            min={1}
            value={passengers}
            onChange={(e) => setPassengers(Math.max(1, Number(e.target.value) || 1))}
            className={fieldInputClass}
          />
        </FieldBox>
        <label className="flex items-center gap-2 text-sm text-ink-600">
          <input
            type="checkbox"
            checked={withHotel}
            onChange={(e) => setWithHotel(e.target.checked)}
            className="accent-brand-500"
          />
          Найти отели
        </label>
      </div>

      <SubmitButton />
    </form>
  );
}

const CAR_MODE_LABEL = { rent: 'Аренда авто', transfer: 'Трансферы (аэропорт)' } as const;

function CarsForm({ onSend }: { onSend: (message: string) => void }) {
  const [mode, setMode] = useState<keyof typeof CAR_MODE_LABEL>('rent');
  const [differentDropoff, setDifferentDropoff] = useState(false);
  const [pickupLocation, setPickupLocation] = useState('');
  const [pickupDate, setPickupDate] = useState('');
  const [pickupTime, setPickupTime] = useState('10:00');
  const [returnDate, setReturnDate] = useState('');
  const [returnTime, setReturnTime] = useState('10:00');
  const [licenseCountry, setLicenseCountry] = useState('Казахстан');
  const [age, setAge] = useState('30-60');

  const handleSubmit = (e: FormEvent) => {
    e.preventDefault();
    onSend(
      [
        `Здравствуйте! Хочу заказать: ${CAR_MODE_LABEL[mode]}.`,
        pickupLocation && `Место получения: ${pickupLocation}`,
        differentDropoff && 'Возврат в другом месте',
        (pickupDate || pickupTime) && `Получение: ${pickupDate || '—'} ${pickupTime}`,
        (returnDate || returnTime) && `Возврат: ${returnDate || '—'} ${returnTime}`,
        `Права: ${licenseCountry}, возраст водителя: ${age}`,
      ]
        .filter(Boolean)
        .join('\n')
    );
  };

  return (
    <form onSubmit={handleSubmit} className="space-y-2">
      <div className="flex flex-wrap items-center justify-between gap-3 px-1">
        <div className="flex items-center gap-4 text-sm text-ink-600">
          {(Object.keys(CAR_MODE_LABEL) as (keyof typeof CAR_MODE_LABEL)[]).map((key) => (
            <label key={key} className="flex items-center gap-1.5">
              <input
                type="radio"
                name="carMode"
                checked={mode === key}
                onChange={() => setMode(key)}
                className="accent-brand-500"
              />
              {CAR_MODE_LABEL[key]}
            </label>
          ))}
        </div>
        <label className="flex items-center gap-2 text-sm text-ink-600">
          <input
            type="checkbox"
            checked={differentDropoff}
            onChange={(e) => setDifferentDropoff(e.target.checked)}
            className="accent-brand-500"
          />
          Возврат в другом месте
        </label>
      </div>

      <FieldBox icon={<MapPin size={18} className="shrink-0 text-ink-400" />} label="Место получения автомобиля">
        <input
          value={pickupLocation}
          onChange={(e) => setPickupLocation(e.target.value)}
          placeholder="Аэропорт, город, станция, район…"
          className={fieldInputClass}
        />
      </FieldBox>

      <div className="grid gap-2 sm:grid-cols-2">
        <FieldBox icon={<Calendar size={18} className="shrink-0 text-ink-400" />} label="Дата получения">
          <div className="flex items-center gap-2">
            <input
              type="date"
              value={pickupDate}
              onChange={(e) => setPickupDate(e.target.value)}
              className={cn(fieldInputClass, 'flex-1')}
            />
            <input
              type="time"
              value={pickupTime}
              onChange={(e) => setPickupTime(e.target.value)}
              className={cn(fieldInputClass, 'w-20 shrink-0')}
            />
          </div>
        </FieldBox>
        <FieldBox icon={<Calendar size={18} className="shrink-0 text-ink-400" />} label="Дата возврата">
          <div className="flex items-center gap-2">
            <input
              type="date"
              value={returnDate}
              onChange={(e) => setReturnDate(e.target.value)}
              className={cn(fieldInputClass, 'flex-1')}
            />
            <input
              type="time"
              value={returnTime}
              onChange={(e) => setReturnTime(e.target.value)}
              className={cn(fieldInputClass, 'w-20 shrink-0')}
            />
          </div>
        </FieldBox>
      </div>

      <div className="grid gap-2 sm:grid-cols-2">
        <FieldBox label="Страна/регион выдачи прав">
          <select
            value={licenseCountry}
            onChange={(e) => setLicenseCountry(e.target.value)}
            className={cn(fieldInputClass, 'cursor-pointer')}
          >
            <option>Казахстан</option>
            <option>Россия</option>
            <option>Кыргызстан</option>
            <option>Другая страна</option>
          </select>
        </FieldBox>
        <FieldBox label="Возраст водителя">
          <select
            value={age}
            onChange={(e) => setAge(e.target.value)}
            className={cn(fieldInputClass, 'cursor-pointer')}
          >
            <option value="21-29">21–29</option>
            <option value="30-60">30–60</option>
            <option value="60+">60+</option>
          </select>
        </FieldBox>
      </div>

      <SubmitButton />
    </form>
  );
}

export function BookingWidget({ className }: { className?: string }) {
  const [tab, setTab] = useState<BookingTab>('hotels');

  const handleSend = (message: string) => {
    window.open(whatsappLink(message), '_blank', 'noopener,noreferrer');
  };

  return (
    <div className={cn('rounded-3xl bg-white p-4 shadow-float sm:p-6', className)}>
      <div className="mb-4 flex items-center gap-6 overflow-x-auto border-b border-ink-100 no-scrollbar sm:gap-10">
        {TABS.map(({ key, label, icon: Icon }) => {
          const active = tab === key;
          return (
            <button
              key={key}
              type="button"
              onClick={() => setTab(key)}
              className={cn(
                'flex shrink-0 flex-col items-center gap-1.5 border-b-2 pb-3 pt-1 text-sm font-medium transition-colors',
                active ? 'border-brand-500 text-brand-600' : 'border-transparent text-ink-500 hover:text-ink-800'
              )}
            >
              <Icon size={22} strokeWidth={1.75} className={active ? 'text-brand-600' : 'text-ink-400'} />
              {label}
            </button>
          );
        })}
      </div>

      {tab === 'hotels' && <HotelsForm onSend={handleSend} />}
      {tab === 'flights' && <FlightsForm onSend={handleSend} />}
      {tab === 'trains' && <TrainsForm onSend={handleSend} />}
      {tab === 'cars' && <CarsForm onSend={handleSend} />}

      <p className="mt-2 px-1 text-xs text-ink-400">
        Пришлём заявку менеджеру в WhatsApp — на реальный поиск пока переходит команда
      </p>
    </div>
  );
}
