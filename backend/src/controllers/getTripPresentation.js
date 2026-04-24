export function getTripPresentation(status, spent, budget) {
  const percent = budget > 0 ? Math.round((spent / budget) * 100) : 0;

  if (status === 'Done' && spent > budget) {
    return {
      type: 'completed',
      color: 'bg-zinc-200',
      bar: 'bg-orange-500',
      text: `Over budget by ₹${(spent - budget).toLocaleString('en-IN')}`,
    };
  }

  if (status === 'Done') {
    return {
      type: 'completed',
      color: 'bg-zinc-200',
      bar: 'bg-zinc-200',
      text: `${percent}% of budget used`,
    };
  }

  if (status === 'Active') {
    return {
      type: 'active',
      color: 'bg-emerald-500',
      bar: 'bg-emerald-500',
      text: `${percent}% of budget used`,
    };
  }

  return {
    type: 'planning',
    color: 'bg-blue-100',
    bar: 'bg-blue-500',
    text: `${percent}% committed`,
  };
}