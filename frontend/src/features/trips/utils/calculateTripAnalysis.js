function roundCurrency(value) {
  return Math.round((value + Number.EPSILON) * 100) / 100;
}

function getMemberId(member) {
  return member?._id || member?.id || member;
}

function getExpenseCreatorId(expense) {
  return expense?.createdBy?._id || expense?.createdBy?.id || expense?.createdBy;
}

export function calculateTripAnalysis(trip, expenses) {
  const members = trip?.members || [];
  const memberCount = members.length;

  const contributionsMap = new Map(
    members.map((member) => [getMemberId(member), 0]),
  );

  for (const expense of expenses || []) {
    const creatorId = getExpenseCreatorId(expense);
    if (!creatorId) continue;
    const current = contributionsMap.get(creatorId) || 0;
    contributionsMap.set(creatorId, roundCurrency(current + (Number(expense.amount) || 0)));
  }

  const totalSpent = roundCurrency(
    (expenses || []).reduce((sum, expense) => sum + (Number(expense.amount) || 0), 0),
  );
  const equalShare = memberCount ? roundCurrency(totalSpent / memberCount) : 0;

  const memberSummaries = members.map((member) => {
    const memberId = getMemberId(member);
    const contribution = roundCurrency(contributionsMap.get(memberId) || 0);
    const balance = roundCurrency(contribution - equalShare);

    return {
      member,
      memberId,
      contribution,
      share: equalShare,
      balance,
    };
  });

  const creditors = memberSummaries
    .filter((entry) => entry.balance > 0.009)
    .map((entry) => ({ ...entry, remaining: entry.balance }))
    .sort((left, right) => right.remaining - left.remaining);

  const debtors = memberSummaries
    .filter((entry) => entry.balance < -0.009)
    .map((entry) => ({ ...entry, remaining: Math.abs(entry.balance) }))
    .sort((left, right) => right.remaining - left.remaining);

  const settlements = [];
  let creditorIndex = 0;
  let debtorIndex = 0;

  while (creditorIndex < creditors.length && debtorIndex < debtors.length) {
    const creditor = creditors[creditorIndex];
    const debtor = debtors[debtorIndex];
    const amount = roundCurrency(Math.min(creditor.remaining, debtor.remaining));

    if (amount > 0) {
      settlements.push({
        from: debtor.member,
        fromId: debtor.memberId,
        to: creditor.member,
        toId: creditor.memberId,
        amount,
      });
    }

    creditor.remaining = roundCurrency(creditor.remaining - amount);
    debtor.remaining = roundCurrency(debtor.remaining - amount);

    if (creditor.remaining <= 0.009) creditorIndex += 1;
    if (debtor.remaining <= 0.009) debtorIndex += 1;
  }

  return {
    totalSpent,
    equalShare,
    memberSummaries,
    settlements,
  };
}
