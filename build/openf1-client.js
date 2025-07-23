/**
 * OpenF1 API Client
 * Interfaces with the OpenF1 API to fetch Formula 1 data
 */
const OPENF1_BASE_URL = 'https://api.openf1.org/v1';
export class OpenF1Client {
    async fetchData(endpoint, params = {}) {
        const url = new URL(`${OPENF1_BASE_URL}/${endpoint}`);
        // Add query parameters
        for (const [key, value] of Object.entries(params)) {
            if (value !== undefined && value !== null) {
                url.searchParams.append(key, value.toString());
            }
        }
        try {
            const response = await fetch(url.toString());
            if (!response.ok) {
                throw new Error(`OpenF1 API error: ${response.status} ${response.statusText}`);
            }
            const data = await response.json();
            return Array.isArray(data) ? data : [data];
        }
        catch (error) {
            throw new Error(`Failed to fetch from OpenF1: ${error}`);
        }
    }
    /**
     * Get meetings (race weekends) by year and optionally filter by location
     */
    async getMeetings(year, location) {
        const params = { year };
        if (location) {
            // Try to match location case-insensitively
            params.location = location;
        }
        const meetings = await this.fetchData('meetings', params);
        // If location was provided but no exact match, try fuzzy matching
        if (location && meetings.length === 0) {
            const allMeetings = await this.fetchData('meetings', { year });
            return allMeetings.filter(meeting => meeting.location.toLowerCase().includes(location.toLowerCase()) ||
                meeting.meeting_name.toLowerCase().includes(location.toLowerCase()) ||
                meeting.circuit_short_name.toLowerCase().includes(location.toLowerCase()));
        }
        return meetings;
    }
    /**
     * Get sessions for a specific meeting
     */
    async getSessions(meetingKey) {
        return this.fetchData('sessions', { meeting_key: meetingKey });
    }
    /**
     * Get the race session for a meeting (session_type = 'Race')
     */
    async getRaceSession(meetingKey) {
        const sessions = await this.getSessions(meetingKey);
        return sessions.find(session => session.session_type === 'Race') || null;
    }
    /**
     * Get final positions for a session
     */
    async getPositions(sessionKey) {
        return this.fetchData('position', { session_key: sessionKey });
    }
    /**
     * Get drivers for a session
     */
    async getDrivers(sessionKey) {
        return this.fetchData('drivers', { session_key: sessionKey });
    }
    /**
     * Get race results with driver information
     */
    async getRaceResults(sessionKey) {
        const [positions, drivers] = await Promise.all([
            this.getPositions(sessionKey),
            this.getDrivers(sessionKey)
        ]);
        // Get the final positions (latest timestamp for each driver)
        const finalPositions = new Map();
        positions.forEach(pos => {
            const existing = finalPositions.get(pos.driver_number);
            if (!existing || new Date(pos.date) > new Date(existing.date)) {
                finalPositions.set(pos.driver_number, pos);
            }
        });
        // Combine positions with driver data
        const results = [];
        finalPositions.forEach(position => {
            const driver = drivers.find(d => d.driver_number === position.driver_number);
            if (driver) {
                results.push({ ...position, driver });
            }
        });
        // Sort by position
        return results.sort((a, b) => a.position - b.position);
    }
    /**
     * Get podium winners (top 3) for a race
     */
    async getPodiumWinners(year, location) {
        try {
            // Find the meeting
            const meetings = await this.getMeetings(year, location);
            if (meetings.length === 0) {
                return null;
            }
            const meeting = meetings[0]; // Take the first match
            // Find the race session
            const raceSession = await this.getRaceSession(meeting.meeting_key);
            if (!raceSession) {
                return null;
            }
            // Get race results
            const results = await this.getRaceResults(raceSession.session_key);
            // Return top 3
            return results.slice(0, 3);
        }
        catch (error) {
            console.error('Error getting podium winners:', error);
            return null;
        }
    }
}
//# sourceMappingURL=openf1-client.js.map