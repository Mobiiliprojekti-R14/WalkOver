export function calculateTop3(users: any[]) {
  if (!users || users.length === 0) return [];

  const areaKeys = Object.keys(users[0]).filter(k => k.startsWith("oulu"));

  const controlCount: Record<
    string,
    { displayName: string; userColor: string; count: number }
  > = {};

  // Alusta laskuri
  users.forEach(u => {
    controlCount[u.username] = {
      displayName: u.displayName,
      userColor: u.userColor,
      count: 0
    };
  });

  areaKeys.forEach(area => {
    // Selvitetään alueen maksimiaskelmäärä
    const maxSteps = Math.max(...users.map(u => Number(u[area]) || 0));

    // Jos maxSteps on 0 → kukaan ei hallitse aluetta → skipataan
    if (maxSteps === 0) return;

    // Etsitään käyttäjä, jolla on maxSteps
    const leader = users.find(u => Number(u[area]) === maxSteps);

    if (leader) {
      controlCount[leader.username].count++;
    }
  });

  return Object.entries(controlCount)
    .map(([username, data]) => ({
      username,
      displayName: data.displayName,
      userColor: data.userColor,
      controlledAreas: data.count
    }))
    .sort((a, b) => b.controlledAreas - a.controlledAreas)
    .slice(0, 3);
}
