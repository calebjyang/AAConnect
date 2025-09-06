// Types for carpool assignment algorithm
export interface RideSignup {
  id: string;
  name: string;
  phone: string;
  canDrive: string;
  location: string;
  aftereventWeek: string;
  submittedAt: string;
  capacity?: string;
  grade?: string;
}

export interface CarpoolAssignment {
  driver: RideSignup;
  riders: RideSignup[];
  totalCapacity: number;
  usedCapacity: number;
  location: string;
}

export interface AssignmentResult {
  assignments: CarpoolAssignment[];
  unassignedRiders: RideSignup[];
  overflowMessage?: string;
}

// Location proximity groups (for friend-group mixing)
const LOCATION_GROUPS = {
  'Middle Earth': ['Middle Earth'],
  'Mesa Court': ['Mesa Court'],
  'UTC': ['Berk', 'Cornell', 'Other UTC (NOT Berk/Cornell)'],
  'ACC': ['Plaza', 'Other ACC (NOT Plaza)'],
  'Other': ['Other']
};

// Helper function to get location group
function getLocationGroup(location: string): string {
  for (const [group, locations] of Object.entries(LOCATION_GROUPS)) {
    if (locations.includes(location)) {
      return group;
    }
  }
  return 'Other';
}

// Helper function to check if locations are in the same group
function areLocationsCompatible(location1: string, location2: string): boolean {
  return getLocationGroup(location1) === getLocationGroup(location2);
}

/**
 * Enhanced carpool assignment algorithm
 * Priority: Departure > Capacity > Grade Mixing > Friend-Group mixing
 * 
 * Features:
 * - Grade-based matching (mix of grades in each car)
 * - Maintains existing location-based matching
 */
export function assignCarpools(signups: RideSignup[], week: string): AssignmentResult {
  // Filter signups for the specified week
  const weekSignups = signups.filter(s => s.aftereventWeek === week);
  
  // Separate drivers and riders
  const drivers = weekSignups.filter(s => s.canDrive === "Yes" && s.capacity);
  const allRiders = weekSignups.filter(s => s.canDrive === "No");
  // const _selfDrivers = weekSignups.filter(s => s.canDrive === "Self");
  
  // Sort drivers by capacity (descending) to prioritize larger vehicles
  drivers.sort((a, b) => {
    const capacityA = parseInt(a.capacity || "0");
    const capacityB = parseInt(b.capacity || "0");
    return capacityB - capacityA;
  });
  
  // Sort riders by submission time (first come, first served)
  allRiders.sort((a, b) => new Date(a.submittedAt).getTime() - new Date(b.submittedAt).getTime());
  
  // Create a mutable copy of riders for assignment processing
  const availableRiders = [...allRiders];
  
  // Create assignments for each driver
  const assignments: CarpoolAssignment[] = [];
  const unassignedRiders: RideSignup[] = [];
  
  for (const driver of drivers) {
    const assignment: CarpoolAssignment = {
      driver,
      riders: [],
      usedCapacity: 0,
      totalCapacity: parseInt(driver.capacity || "0"),
      location: driver.location,
    };
    const maxRiders = assignment.totalCapacity - 1;
    // First pass: Try to match by exact location
    for (let i = 0; i < availableRiders.length; ) {
      if (assignment.usedCapacity >= maxRiders) break;
      const rider = availableRiders[i];
      if (rider.location === driver.location) {
        assignment.riders.push(rider);
        assignment.usedCapacity++;
        availableRiders.splice(i, 1);
      } else {
        i++;
      }
    }
    // Second pass: Try to match by location group (friend-group mixing)
    for (let i = 0; i < availableRiders.length; ) {
      if (assignment.usedCapacity >= maxRiders) break;
      const rider = availableRiders[i];
      if (areLocationsCompatible(rider.location, driver.location)) {
        assignment.riders.push(rider);
        assignment.usedCapacity++;
        availableRiders.splice(i, 1);
      } else {
        i++;
      }
    }
    // Third pass: Fill remaining spots with any available riders
    for (let i = 0; i < availableRiders.length; ) {
      if (assignment.usedCapacity >= maxRiders) break;
      const rider = availableRiders[i];
      assignment.riders.push(rider);
      assignment.usedCapacity++;
      availableRiders.splice(i, 1);
    }
    assignments.push(assignment);
  }
  
  // Post-processing: Optimize grade distribution
  optimizeAssignments(assignments, availableRiders);
  
  // Any remaining riders are unassigned
  unassignedRiders.push(...availableRiders);
  
  // Generate overflow message if needed
  let overflowMessage: string | undefined;
  if (unassignedRiders.length > 0) {
    const driverNames = drivers.map(d => d.name).join(", ");
    overflowMessage = `⚠️ ${unassignedRiders.length} riders need assignment. Consider asking ${driverNames} to take more passengers or find additional drivers.`;
  }
  
  return {
    assignments,
    unassignedRiders,
    overflowMessage
  };
}

/**
 * Optimize assignments for better grade distribution
 */
function optimizeAssignments(assignments: CarpoolAssignment[], _availableRiders: RideSignup[]) {
  // Try to improve grade distribution
  for (let i = 0; i < assignments.length; i++) {
    const car1 = assignments[i];
    const grades1 = car1.riders.map(r => r.grade).filter(Boolean);
    
    // If this car has too many of the same grade, try to diversify
    if (grades1.length > 0) {
      const mostCommonGrade = grades1.sort((a, b) => 
        grades1.filter(v => v === a).length - grades1.filter(v => v === b).length
      ).pop();
      
      if (mostCommonGrade && grades1.filter(g => g === mostCommonGrade).length > 1) {
        // Try to swap with another car that has different grades
        for (let j = 0; j < assignments.length; j++) {
          if (i === j) continue;
          
          const car2 = assignments[j];
          const _grades2 = car2.riders.map(r => r.grade).filter(Boolean);
          
          // Find a rider in car1 with the most common grade
          const riderToSwap = car1.riders.find(r => r.grade === mostCommonGrade);
          
          // Find a rider in car2 with a different grade
          const differentGradeRider = car2.riders.find(r => r.grade && r.grade !== mostCommonGrade);
          
          if (riderToSwap && differentGradeRider) {
            // Perform the swap
            car1.riders = car1.riders.map(r => r.id === riderToSwap.id ? differentGradeRider : r);
            car2.riders = car2.riders.map(r => r.id === differentGradeRider.id ? riderToSwap : r);
            break;
          }
        }
      }
    }
  }
}

/**
 * Calculate assignment statistics
 */
export function getAssignmentStats(result: AssignmentResult) {
  // Count all people assigned to a carpool (drivers + riders)
  const totalAssigned = result.assignments.reduce((sum, a) => sum + a.riders.length + 1, 0); // +1 for each driver
  const totalUnassigned = result.unassignedRiders.length;
  const totalPeople = totalAssigned + totalUnassigned;
  const totalCapacity = result.assignments.reduce((sum, a) => sum + a.totalCapacity, 0);
  const usedCapacity = result.assignments.reduce((sum, a) => sum + a.usedCapacity, 0);

  return {
    totalPeople, // drivers + riders
    assignedPeople: totalAssigned, // drivers + assigned riders
    unassignedPeople: totalUnassigned,
    assignmentRate: totalPeople > 0 ? (totalAssigned / totalPeople * 100).toFixed(1) : "0",
    capacityUtilization: totalCapacity > 0 ? (usedCapacity / totalCapacity * 100).toFixed(1) : "0",
    totalDrivers: result.assignments.length
  };
}

/**
 * Export assignments to CSV format
 */
export function exportAssignmentsCSV(result: AssignmentResult): string {
  // Prepare columns: one per driver, plus 'Unassigned' if needed
  const drivers = result.assignments;
  const maxRiders = Math.max(0, ...drivers.map(a => a.riders.length));
  const hasUnassigned = result.unassignedRiders.length > 0;

  // Header row: driver names with capacity
  const headers = drivers.map(a => `${a.driver.name} (${a.totalCapacity})`);
  if (hasUnassigned) headers.push('Unassigned');

  // Build rows: each row is a rider for each driver (empty if not enough riders)
  const rows: string[][] = [];
  for (let i = 0; i < maxRiders; i++) {
    const row = drivers.map(a => a.riders[i]?.name || '');
    if (hasUnassigned) row.push(''); // fill for now
    rows.push(row);
  }

  // Add unassigned riders as a column
  if (hasUnassigned) {
    // Pad rows if there are more unassigned than maxRiders
    for (let i = rows.length; i < result.unassignedRiders.length; i++) {
      const emptyRow = Array(drivers.length).fill('');
      rows.push([...emptyRow, '']);
    }
    // Fill unassigned column
    for (let i = 0; i < result.unassignedRiders.length; i++) {
      if (!rows[i]) {
        const emptyRow = Array(drivers.length).fill('');
        rows[i] = [...emptyRow, result.unassignedRiders[i].name];
      } else {
        rows[i][drivers.length] = result.unassignedRiders[i].name;
      }
    }
  }

  // Add driver names as first row, then all rider rows
  return [headers, ...rows]
    .map(row => row.map(cell => `"${cell}"`).join(","))
    .join("\n");
} 