export default function Toast({ message }) {
  return (
    <div
      className={`fixed bottom-32 left-1/2 -translate-x-1/2 bg-[#49454f] text-white px-6 py-3 rounded-full text-sm shadow-2xl transition-opacity pointer-events-none z-[100] ${
        message ? 'opacity-100' : 'opacity-0'
      }`}
    >
      {message || 'Ação concluída'}
    </div>
  );
}

