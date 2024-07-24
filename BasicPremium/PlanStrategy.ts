import { Employee } from "./employee.interface";
import { Premium } from "./premium.interface";
import memberData from '../MemberList.json'; 
import planData from '../planList.json'; 

interface PlanStrategy {
    calculateAge(date: string): number;
    countEmployeesInAgeRanges(employees: Employee[], premiums: Premium[]): object[];
    countMemberInAgeGroup(employees: Employee[], premiums: Premium[]): object[];
    reversePremiumMatch(memberList: Employee[], PremiumGroup: Premium[]): Employee[];
}


class DefaultPlanStrategy implements PlanStrategy {
    calculateAge(date: string): number {
        return new Date().getFullYear() - new Date(date).getFullYear();
    }

    countEmployeesInAgeRanges(employees: Employee[], premiums: Premium[]): object[] {
        const ageRangeCounts: { from_age: number; to_age: number; count: number }[] = [];

        premiums.forEach(premium => {
            const count = employees.filter(employee => {
                const age = this.calculateAge(employee["Date of Birth"]);
                return age >= premium.from_age && age <= premium.to_age;
            }).length;

            ageRangeCounts.push({
                from_age: premium.from_age,
                to_age: premium.to_age,
                count,
            });
        });

        return ageRangeCounts;
    }

    countMemberInAgeGroup(employees: Employee[], premiums: Premium[]) {
        const memberRangeCounts: { 
            from_age: number; 
            to_age: number; 
            count: number;
            gender: string; 
            memberType: string; 
            maternityPremium: number | null;
            minimum_premium: string | null;
            premium: number;
        }[] = [];

        premiums.forEach(premium => {
            const count = employees.filter(employee => {
                const age = this.calculateAge(employee["Date of Birth"]);
                const memberTypeDependent = employee.Relationship !== "Employee" ? "Dependents" : "Employee";
                return age >= premium.from_age &&
                       age <= premium.to_age &&
                       employee.Gender === premium.gender &&
                       premium.member_type === memberTypeDependent;
            }).length;

            memberRangeCounts.push({
                from_age: premium.from_age,
                to_age: premium.to_age,
                count:count,
                gender: premium.gender,
                memberType: premium.member_type,
                maternityPremium: premium.maternity_premium,
                minimum_premium: premium.minimum_premium,
                premium: premium.premium
            });
        });

        const uniqueData = Array.from(new Set(memberRangeCounts.map(item => JSON.stringify(item))))
                                 .map(item => JSON.parse(item));

        return uniqueData;
    }

    reversePremiumMatch(memberList: Employee[], PremiumGroup: Premium[]): Employee[] {
        memberList.forEach(member => {
            const age = this.calculateAge(member["Date of Birth"]); 
            const memberTypeDependent = member.Relationship !== "Employee" ? "Dependents" : "Employee";
            const matchedGroup = PremiumGroup.find(group => 
                group.from_age <= age && 
                age <= group.to_age && 
                memberTypeDependent === group.member_type && 
                member.Gender === group.gender
            );
            if (matchedGroup) {
                member.base_premium = matchedGroup.premium;
                member.minimum_premium = matchedGroup.minimum_premium;
            } 
        });
        return memberList;
    }
}


class PlanListContext {
    private strategy: PlanStrategy;

    constructor(strategy: PlanStrategy) {
        this.strategy = strategy;
    }

    executeCountEmployeesInAgeRanges(employees: Employee[], premiums: Premium[]): object[] {
        return this.strategy.countEmployeesInAgeRanges(employees, premiums);
    }

    executeCountMemberInAgeGroup(employees: Employee[], premiums: Premium[]): object[] {
        return this.strategy.countMemberInAgeGroup(employees, premiums);
    }

    executeReversePremiumMatch(memberList: Employee[], PremiumGroup: Premium[]): Employee[] {
        return this.strategy.reversePremiumMatch(memberList, PremiumGroup);
    }
}

// Usage

const strategy = new DefaultPlanStrategy();
const context = new PlanListContext(strategy);
const memberAgeCount = context.executeCountEmployeesInAgeRanges(memberData as Employee[], planData as Premium[]);
const memberSeperateCount = context.executeCountMemberInAgeGroup(memberData as Employee[], planData as Premium[]);
const reverseData = context.executeReversePremiumMatch(memberData as Employee[], memberSeperateCount as Premium[]);
console.log(reverseData, "reverseData");
