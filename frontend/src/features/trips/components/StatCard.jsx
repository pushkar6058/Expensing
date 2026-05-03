export default function StatCard({ title, value, accent }) {
  return (
    <div className='dark:bg-zinc-800 bg-white dark:border-zinc-700 border-gray-300 rounded-3xl p-5 sm:p-8 overflow-hidden'>
      <p className='text-base sm:text-2xl dark:text-zinc-300 text-gray-600'>{title}</p>
      <p className={`text-2xl sm:text-4xl font-bold mt-4 sm:mt-5 break-words ${accent ? 'text-emerald-500' : 'dark:text-white text-black'}`}>{value}</p>
    </div>
  );
}
