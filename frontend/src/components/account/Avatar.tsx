type Props = { name: string };

export default function Avatar({ name }: Props) {
  const initial = (name?.trim()?.[0] || "U").toUpperCase();

  return (
    <div className="w-14 h-14 rounded-full bg-primary text-white flex items-center justify-center text-xl font-semibold">
      {initial}
    </div>
  );
}
