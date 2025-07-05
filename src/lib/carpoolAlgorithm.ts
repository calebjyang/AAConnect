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
 * Main carpool assignment algorithm
 * Priority: Departure > Capacity > Friend-Group mixing
 */
export function assignCarpools(signups: RideSignup[], week: string): AssignmentResult {
  // Filter signups for the specified week
  const weekSignups = signups.filter(s => s.aftereventWeek === week);
  
  // Separate drivers and riders
  const drivers = weekSignups.filter(s => s.canDrive === "Yes" && s.capacity);
  const riders = weekSignups.filter(s => s.canDrive === "No");
  const _selfDrivers = weekSignups.filter(s => s.canDrive === "Self");
  
  // Sort drivers by capacity (descending) to prioritize larger vehicles
  drivers.sort((a, b) => {
    const capacityA = parseInt(a.capacity || "0");
    const capacityB = parseInt(b.capacity || "0");
    return capacityB - capacityA;
  });
  
  // Sort riders by submission time (first come, first served)
  riders.sort((a, b) => new Date(a.submittedAt).getTime() - new Date(b.submittedAt).getTime());
  
  const assignments: CarpoolAssignment[] = [];
  const unassignedRiders: RideSignup[] = [];
  
  // Create assignments for each driver
  for (const driver of drivers) {
    const capacity = parseInt(driver.capacity || "0");
    if (capacity <= 0) continue;
    
    const assignment: CarpoolAssignment = {
      driver,
      riders: [],
      totalCapacity: capacity,
      usedCapacity: 1, // Driver takes 1 spot
      location: driver.location
    };
    
    // Find riders for this driver
    const availableRiders = riders.filter(r => !assignments.some(a => 
      a.riders.some(rider => rider.id === r.id)
    ));
    
    // First pass: Try to match by exact location
    for (const rider of availableRiders) {
      if (assignment.usedCapacity >= assignment.totalCapacity) break;
      
      if (rider.location === driver.location) {
        assignment.riders.push(rider);
        assignment.usedCapacity++;
        riders.splice(riders.indexOf(rider), 1);
      }
    }
    
    // Second pass: Try to match by location group (friend-group mixing)
    for (const rider of availableRiders) {
      if (assignment.usedCapacity >= assignment.totalCapacity) break;
      
      if (areLocationsCompatible(rider.location, driver.location)) {
        assignment.riders.push(rider);
        assignment.usedCapacity++;
        riders.splice(riders.indexOf(rider), 1);
      }
    }
    
    // Third pass: Fill remaining spots with any available riders
    for (const rider of availableRiders) {
      if (assignment.usedCapacity >= assignment.totalCapacity) break;
      
      assignment.riders.push(rider);
      assignment.usedCapacity++;
      riders.splice(riders.indexOf(rider), 1);
    }
    
    assignments.push(assignment);
  }
  
  // Any remaining riders are unassigned
  unassignedRiders.push(...riders);
  
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