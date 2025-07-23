/**
 * OpenF1 API Client
 * Interfaces with the OpenF1 API to fetch Formula 1 data
 */
export interface Meeting {
    circuit_key: number;
    circuit_short_name: string;
    country_code: string;
    country_key: number;
    country_name: string;
    date_start: string;
    gmt_offset: string;
    location: string;
    meeting_key: number;
    meeting_name: string;
    meeting_official_name: string;
    year: number;
}
export interface Session {
    date_end: string;
    date_start: string;
    gmt_offset: string;
    location: string;
    meeting_key: number;
    session_key: number;
    session_name: string;
    session_type: string;
    year: number;
}
export interface Position {
    date: string;
    driver_number: number;
    meeting_key: number;
    position: number;
    session_key: number;
}
export interface Driver {
    broadcast_name: string;
    country_code: string;
    driver_number: number;
    first_name: string;
    full_name: string;
    headshot_url: string;
    last_name: string;
    meeting_key: number;
    name_acronym: string;
    session_key: number;
    team_colour: string;
    team_name: string;
}
export declare class OpenF1Client {
    private fetchData;
    /**
     * Get meetings (race weekends) by year and optionally filter by location
     */
    getMeetings(year: number, location?: string): Promise<Meeting[]>;
    /**
     * Get sessions for a specific meeting
     */
    getSessions(meetingKey: number): Promise<Session[]>;
    /**
     * Get the race session for a meeting (session_type = 'Race')
     */
    getRaceSession(meetingKey: number): Promise<Session | null>;
    /**
     * Get final positions for a session
     */
    getPositions(sessionKey: number): Promise<Position[]>;
    /**
     * Get drivers for a session
     */
    getDrivers(sessionKey: number): Promise<Driver[]>;
    /**
     * Get race results with driver information
     */
    getRaceResults(sessionKey: number): Promise<Array<Position & {
        driver: Driver;
    }>>;
    /**
     * Get podium winners (top 3) for a race
     */
    getPodiumWinners(year: number, location: string): Promise<Array<Position & {
        driver: Driver;
    }> | null>;
}
