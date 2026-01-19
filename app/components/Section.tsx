export default function Section({
  title,
  subtitle,
  children,
}: {
  title: string;
  subtitle?: string;
  children?: React.ReactNode;
}) {
  return (
    <section className="w-full border-b border-white/5">
      <div className="max-w-6xl mx-auto px-6 py-14 space-y-4">

        <div className="space-y-2">
          <h2 className="text-3xl font-semibold tracking-tight">
            {title}
          </h2>

          {subtitle && (
            <p className="text-gray-400 text-[15px] max-w-2xl leading-relaxed">
              {subtitle}
            </p>
          )}
        </div>

        {children}
      </div>
    </section>
  );
}
