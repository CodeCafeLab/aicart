
export default function FullscreenLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return (
    <div className="fixed inset-0 bg-[#0E1019] text-white w-full h-full overflow-hidden">
      {children}
    </div>
  );
}
