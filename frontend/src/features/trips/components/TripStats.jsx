import StatCard from './StatCard';
import { formatMoney } from '../utils/formatMoney';

export default function TripStats({ tripCount, totalSpent, averageSpent }) {
  return (
    <div className='grid md:grid-cols-3 gap-4 sm:gap-5 mt-8 sm:mt-10'>
      <StatCard title='Total trips' value={tripCount} />
      <StatCard title='Total spent' value={formatMoney(totalSpent)} accent />
      <StatCard title='Avg / trip' value={formatMoney(averageSpent)} />
    </div>
  );
}
