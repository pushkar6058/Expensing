export default function StatCard({ title, value, accent }) {
  return (
    <div className='bg-zinc-800 rounded-3xl p-8 border border-zinc-700'>
      <p className='text-3xl text-zinc-300'>{title}</p>
      <p className={`text-6xl font-bold mt-5 ${accent ? 'text-emerald-400' : 'text-white'}`}>{value}</p>
    </div>
  );
}
