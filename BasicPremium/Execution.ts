import data from '../planList.json'

interface AgeRangeCountStrategy {
    process(data: any[]): { from_age: number, to_age: number, count: number }[];
}

class PlanListStrategy implements AgeRangeCountStrategy {
    process(data: any[]): { from_age: number, to_age: number, count: number }[] {
        const ageRangeMap = new Map<string, number>();
        data.forEach(item => {
            const key = `${item.from_age}-${item.to_age}`;
            ageRangeMap.set(key, (ageRangeMap.get(key) || 0) + 1);
        });
        return Array.from(ageRangeMap.entries()).map(([key, count]) => {
            const [from_age, to_age] = key.split('-').map(Number);
            return {
                from_age,
                to_age,
                count
            };
        });
    }
}


const strategy = new PlanListStrategy();
const result = strategy.process(data);

console.log(result,"result");
