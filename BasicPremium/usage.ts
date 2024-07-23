import { Employee } from './employee.interface';
import { Premium } from './premium.interface';
import { PlanListStrategy } from './plan-list-strategy.service';

import memberData from '../MemberList.json' ; 
import planData from '../planList.json' ;  

const strategy = new PlanListStrategy();
const memberAgeCount = strategy.countEmployeesInAgeRanges(memberData, planData);
const memberSeperateCount = strategy.countMemberInAgeGroup(memberData, planData);
const reverseData = strategy.reversePremiumMatch(memberData, memberSeperateCount as Premium[]);
