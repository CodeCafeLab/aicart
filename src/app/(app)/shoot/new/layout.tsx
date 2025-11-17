
export default function FullscreenLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return (
    <div className="bg-[#0E1019] text-white w-full h-full min-h-screen">
      {children}
    </div>
  );
}
