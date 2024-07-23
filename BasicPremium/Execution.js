
const memberData = require('../MemberList.json');
const planData = require('../planList.json')


class PlanListStrategy {

    calculateAge(date){
        return new Date().getFullYear() - new Date(date).getFullYear(); 
    }

     countEmployeesInAgeRanges(employees, premiums) {
        const ageRangeCounts = [];
        premiums.forEach(premium => {
            const count = employees.filter(employee => {
                // -------------- Calculating the Age ------------------------//
                const age = this.calculateAge(employee["Date of Birth"]); 
                // -------------- seperate with thier Age Group ---------------//
                return age >= premium.from_age && age <= premium.to_age;
            }).length;

            ageRangeCounts.push({
                from_age: premium.from_age,
                to_age: premium.to_age,
                count: count
            });
        });
        const uniqueData = Array.from(new Set(ageRangeCounts.map(item => JSON.stringify(item)))).map(item => JSON.parse(item));
        return uniqueData;
      }

      countMemberInAgeGroup(groupData,employees, premiums){
        const ageRangeCounts = [];
        premiums.forEach(premium => {
            const count = employees.filter(employee => {
                const age = this.calculateAge(employee["Date of Birth"]); 
                let memberTypeDependent =employee.Relationship !== "Employee" ?"Dependents":"Employee"
                return age >= premium.from_age && age <= premium.to_age && employee.Gender==premium.gender && premium.member_type == memberTypeDependent
            }).length;

            ageRangeCounts.push({
                from_age: premium.from_age,
                to_age: premium.to_age,
                count: count,
                gender:premium.gender,
                memberType:premium.member_type,
                memberPremium:premium.premium,
                maternityPremium:premium.maternity_premium,
                minimum_premium:premium.minimum_premium
            });

          
        });
        const uniqueData = Array.from(new Set(ageRangeCounts.map(item => JSON.stringify(item)))).map(item => JSON.parse(item));
        return uniqueData
      }

      countReversePremium(memberList,PremiumGroup){
        memberList.forEach(member => {
            const age = this.calculateAge(member["Date of Birth"]); 
            let memberTypeDependent =member.Relationship !== "Employee" ?"Dependents":"Employee"
            let matchedGroup = PremiumGroup.find(group =>  group.from_age <= age && age <= group.to_age &&memberTypeDependent == group.memberType && member.Gender == group.gender
            );
            if (matchedGroup) {
                member.from_age=matchedGroup.from_age,
                member.to_age=matchedGroup.to_age,
                member.base_premium = matchedGroup.memberPremium;
                member.minimum_premium = matchedGroup.minimum_premium;
            } 
        });
        return memberList
      }
    

}


const strategy = new PlanListStrategy();
const ageSeperateCount = strategy.countEmployeesInAgeRanges(memberData,planData);
const memberSeperateCount=strategy.countMemberInAgeGroup(ageSeperateCount,memberData,planData)
const reversePremium=strategy.countReversePremium(memberData,memberSeperateCount)

console.log(memberAgeCount, "memberAgeCount");
console.log(memberSeperateCount, "memberSeperateCount");
console.log(reversePremium, "reverseData");

