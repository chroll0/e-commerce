type Props = { name: string };

export default function Avatar({ name }: Props) {
  const initial = (name?.trim()?.[0] || "U").toUpperCase();

  return (
    <div className="w-13 h-13 rounded-full bg-primary text-card flex items-center justify-center text-2xl font-bold">
      {initial}
    </div>
  );
}
