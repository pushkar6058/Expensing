export default function StatCard({ title, value, accent }) {
  return (
    <div className='bg-zinc-800 rounded-3xl p-5 sm:p-8 border border-zinc-700 overflow-hidden'>
      <p className='text-lg sm:text-3xl text-zinc-300'>{title}</p>
      <p className={`text-3xl sm:text-6xl font-bold mt-4 sm:mt-5 break-words ${accent ? 'text-emerald-400' : 'text-white'}`}>{value}</p>
    </div>
  );
}
